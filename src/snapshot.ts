import type { FileSystemTree, WebContainer } from '@webcontainer/api'
import { gunzipSync, gzipSync } from 'fflate'
import * as idb from 'idb-keyval'

import { SNAPSHOT_PREFIX, SNAPSHOT_STORE } from './constant'

// 快照版本，用于向后兼容
const SNAPSHOT_VERSION = 2

// 简单的 tar 格式实现
interface TarEntry {
	name: string
	type: 'file' | 'directory'
	data: Uint8Array
}

// 将 tar 条目序列化为二进制格式
function tarEntries(entries: TarEntry[]): Uint8Array {
	const chunks: Uint8Array[] = []

	for (const entry of entries) {
		// 数据格式：name_length(4) + type_length(4) + data_length(4) + name + type + data
		const nameBytes = new TextEncoder().encode(entry.name)
		const typeBytes = new TextEncoder().encode(entry.type)

		const header = new ArrayBuffer(12) // 简化为12字节头部
		const view = new DataView(header)
		view.setUint32(0, nameBytes.length, false)
		view.setUint32(4, typeBytes.length, false)
		view.setUint32(8, entry.data.length, false)

		chunks.push(new Uint8Array(header))
		chunks.push(nameBytes)
		chunks.push(typeBytes)
		chunks.push(entry.data)
	}

	// 计算总长度
	const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0)
	const result = new Uint8Array(totalLength)

	let offset = 0
	for (const chunk of chunks) {
		result.set(chunk, offset)
		offset += chunk.length
	}

	return result
}

// 反序列化 tar 数据
function untarEntries(data: Uint8Array): TarEntry[] {
	const entries: TarEntry[] = []
	let offset = 0

	while (offset < data.length) {
		const headerSize = 12
		if (offset + headerSize > data.length) break

		const view = new DataView(data.buffer, data.byteOffset + offset)
		const nameLength = view.getUint32(0, false)
		const typeLength = view.getUint32(4, false)
		const dataLength = view.getUint32(8, false)

		offset += headerSize

		if (offset + nameLength + typeLength + dataLength > data.length) break

		const name = new TextDecoder().decode(data.slice(offset, offset + nameLength))
		offset += nameLength

		const type = new TextDecoder().decode(data.slice(offset, offset + typeLength)) as
			| 'file'
			| 'directory'
		offset += typeLength

		const entryData = data.slice(offset, offset + dataLength)
		offset += dataLength

		entries.push({
			name,
			type,
			data: entryData,
		})
	}

	return entries
}

// 计算 lock 文件简单 hash（crc32 够用）
async function hashLock(lockText: string) {
	const buf = new TextEncoder().encode(lockText)
	const crc = await crypto.subtle.digest('SHA-256', buf)
	return Array.from(new Uint8Array(crc))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('')
}

// 把 FileSystemTree 序列化并压缩
export async function packTree(tree: FileSystemTree): Promise<Uint8Array> {
	const entries: TarEntry[] = []

	// 递归收集 tar 条目
	function walk(prefix: string, node: any) {
		if (node.directory) {
			// 1. 先push目录本身
			entries.push({
				name: prefix,
				type: 'directory',
				data: new Uint8Array(0),
			})
			// 2. 再递归子项
			for (const [name, child] of Object.entries(node.directory)) {
				walk(`${prefix}/${name}`, child)
			}
		} else if (node.file) {
			const data =
				node.file.contents instanceof Uint8Array
					? node.file.contents
					: new TextEncoder().encode(node.file.contents)
			entries.push({
				name: prefix,
				type: 'file',
				data,
			})
		}
	}

	// 从根开始
	for (const [name, node] of Object.entries(tree)) {
		walk(name, node)
	}

	const tarBin = tarEntries(entries)
	return gzipSync(tarBin)
}

// 解压并反序列化 → FileSystemTree
export async function unpackTree(blob: Blob): Promise<FileSystemTree> {
	const buffer = await blob.arrayBuffer()
	const gz = gunzipSync(new Uint8Array(buffer))
	const untarList = untarEntries(gz)

	const tree: any = {} // 根

	for (const entry of untarList) {
		const parts = entry.name.split('/').filter(Boolean)
		let cur = tree

		// 逐层定位父目录
		for (let i = 0; i < parts.length - 1; i++) {
			const p = parts[i]
			if (!cur[p]) cur[p] = { directory: {} }
			cur = cur[p].directory
		}

		const name = parts[parts.length - 1]
		if (entry.type === 'directory') {
			cur[name] = { directory: {} }
		} else if (entry.type === 'file') {
			// 保存文件内容和权限信息
			cur[name] = {
				file: {
					contents: entry.data,
				},
			}
		}
	}

	return tree
}

// 读快照
export async function getSnapshot(lockText: string) {
	const h = await hashLock(lockText)
	const blob = await idb.get(`${SNAPSHOT_PREFIX}${h}`, idb.createStore(SNAPSHOT_STORE, 'keyval'))
	if (!blob) return null

	// 检查是否有版本头
	const buffer = await blob.arrayBuffer()
	const data = new Uint8Array(buffer)

	if (data.length >= 4) {
		const version = new DataView(data.buffer).getUint32(0, false)
		if (version === SNAPSHOT_VERSION) {
			// 新版本快照，跳过版本头
			const actualData = data.slice(4)
			const newBlob = new Blob([actualData])
			return await unpackTree(newBlob)
		}
	}

	// 旧版本快照或无版本信息，直接解包
	return await unpackTree(blob)
}

// 写快照
export async function saveSnapshot(pkgJsonText: string, tree: FileSystemTree) {
	try {
		const json = JSON.parse(pkgJsonText)
		// 若不包含 dependencies 或 devDependencies，则不保存快照
		if (
			(!json.dependencies || Object.keys(json.dependencies).length === 0) &&
			(!json.devDependencies || Object.keys(json.devDependencies).length === 0)
		) {
			return
		}
	} catch {
		// package.json 无效，不保存快照
		return
	}

	const h = await hashLock(pkgJsonText)
	const packedData = await packTree(tree)

	// 在快照数据前加上版本信息
	const versionHeader = new Uint8Array(4)
	new DataView(versionHeader.buffer).setUint32(0, SNAPSHOT_VERSION, false)

	const finalData = new Uint8Array(versionHeader.length + packedData.length)
	finalData.set(versionHeader, 0)
	finalData.set(packedData, versionHeader.length)

	const blob = new Blob([finalData])
	await idb.set(`${SNAPSHOT_PREFIX}${h}`, blob, idb.createStore(SNAPSHOT_STORE, 'keyval'))
}

// 清空旧快照（可选）
export async function clearOldSnapshots() {
	await idb.clear(idb.createStore(SNAPSHOT_STORE, 'keyval'))
}

// 递归把 FileSystemTree 写进 WebContainer
export async function mountTree(container: WebContainer, tree: FileSystemTree, basePath = '') {
	for (const [name, node] of Object.entries(tree)) {
		const path = `${basePath}/${name}`
		if ((node as any).directory) {
			await container.fs.mkdir(path, { recursive: true })
			await mountTree(container, (node as any).directory, path)
		} else if ((node as any).file) {
			const fileNode = (node as any).file
			const contents = fileNode.contents
			await container.fs.writeFile(path, contents)
		}
	}
}

// 把真实 fs 读成 FileSystemTree
export async function buildTreeFromFs(container: WebContainer, base = '', tree: FileSystemTree) {
	const ents = await container.fs.readdir(base, { withFileTypes: true })
	for (const ent of ents) {
		const full = `${base}/${ent.name}`
		if (ent.isDirectory()) {
			const sub = {}
			tree[ent.name] = { directory: sub }
			await buildTreeFromFs(container, full, sub)
		} else {
			const buf = await container.fs.readFile(full)
			tree[ent.name] = {
				file: {
					contents: buf,
				},
			}
		}
	}
}
