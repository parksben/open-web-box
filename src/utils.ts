import type { FileNode, FileSystemTree } from '@webcontainer/api'

// 简单的日志工具
export const initSimpleLogger = (prefix: string) => {
	return {
		log: (...args: any[]) => console.log(`[${prefix}]`, ...args),
		error: (...args: any[]) => console.error(`[${prefix}]`, ...args),
		warn: (...args: any[]) => console.warn(`[${prefix}]`, ...args),
	}
}

// 将文件系统转换为文件列表
export function convertFileSystemToFileList(fileSystem: FileSystemTree) {
	const fileList: { contents: string; file: string }[] = []

	const traverse = (files: FileSystemTree, path = '') => {
		for (const [name, file] of Object.entries(files)) {
			const currentPath = path ? `${path}/${name}` : `/${name}`
			if ('file' in file && (file.file as any).contents) {
				fileList.push({
					contents: (file.file as any).contents,
					file: currentPath,
				})
			} else if ('directory' in file) {
				traverse(file.directory, currentPath)
			}
		}
	}

	traverse(fileSystem)

	return fileList
}

// 为静态项目初始化 package.json，确保包含必要的 dev 脚本
export function initPkgJsonForStaticProject(files: FileSystemTree): FileSystemTree {
	const pkgJsonNode = files['package.json'] as FileNode | undefined

	if (!pkgJsonNode?.file?.contents) {
		files['package.json'] = {
			file: {
				contents: JSON.stringify(
					{
						name: 'simple-html-demo',
						version: '1.0.0',
						description: 'A simple HTML static page demo',
						scripts: {
							dev: 'node sandbox-simple-static-server.js ./ 12306',
						},
					},
					null,
					2,
				),
			},
		}
	}

	try {
		if (typeof pkgJsonNode?.file?.contents === 'string') {
			const json = JSON.parse(pkgJsonNode.file.contents) || {}
			if (!json.scripts?.dev) {
				json.scripts = json.scripts || {}
				json.scripts.dev = 'npx -y serve ./ -p 12306'
				pkgJsonNode.file.contents = JSON.stringify(json, null, 2)
			}
		}
	} catch {}

	return files
}

// 判断项目是否有依赖需要安装
export function hasDependencies(files: FileSystemTree): boolean {
	const pkgJsonNode = files['package.json'] as FileNode | undefined

	if (typeof pkgJsonNode?.file?.contents === 'string') {
		try {
			const json = JSON.parse(pkgJsonNode.file.contents)
			return (
				(json.dependencies && Object.keys(json.dependencies).length > 0) ||
				(json.devDependencies && Object.keys(json.devDependencies).length > 0)
			)
		} catch {}
	}

	return false
}
