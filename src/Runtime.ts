import { type FileSystemTree, WebContainer, type WebContainerProcess } from '@webcontainer/api'
import { injectScreenshotTool } from './screenshot'
import { injectStaticServer } from './server'
import { buildTreeFromFs, getSnapshot, mountTree, saveSnapshot } from './snapshot'
import {
	convertFileSystemToFileList,
	hasDependencies,
	initPkgJsonForStaticProject,
	initSimpleLogger,
} from './utils'

export interface RuntimeProps {
	userFiles: FileSystemTree
	onBoot?: (instance: WebContainer) => Promise<void> | void
	onFileSystemMount?: (fileSystem: FileSystemTree) => void
	onTask?: (msg: string) => void
	onReady?: (params: { port: number; url: string }) => void
	onProcess?: (process: WebContainerProcess) => void
	onError?: (error: Error) => void
}

const logger = initSimpleLogger('OpenWebBox Runtime')

export default class Runtime {
	public fileSystem: FileSystemTree | null = null
	public webContainerInstance: WebContainer | null = null
	public url: string | null = null
	public port: number | null = null
	public dispose: () => void = () => undefined

	private onBoot?: RuntimeProps['onBoot']
	private onFileSystemMount?: RuntimeProps['onFileSystemMount']
	private onTask?: RuntimeProps['onTask']
	private onReady?: RuntimeProps['onReady']
	private onProcess?: RuntimeProps['onProcess']
	private onError?: RuntimeProps['onError']
	private lastProcess: WebContainerProcess | null = null
	private isDisposed = false

	constructor({
		userFiles,
		onBoot,
		onFileSystemMount,
		onTask,
		onReady,
		onProcess,
		onError,
	}: RuntimeProps) {
		this.fileSystem = this.prepareFiles(userFiles)
		this.onBoot = onBoot
		this.onFileSystemMount = onFileSystemMount
		this.onTask = onTask
		this.onReady = onReady
		this.onProcess = onProcess
		this.onError = onError
		this.initWebContainer()
	}

	private async initWebContainer() {
		if (!this.fileSystem) {
			logger.error('No file system provided.')
			return
		}

		try {
			if (this.isDisposed) return

			this.onTask?.('📀 Booting WebContainer...')

			// 检查 SharedArrayBuffer 是否可用
			if (typeof SharedArrayBuffer === 'undefined') {
				throw new Error('SharedArrayBuffer is not available. Please check COEP/COOP headers.')
			}

			logger.log('SharedArrayBuffer is available, booting WebContainer...')

			// 添加超时机制
			const bootTimeout = new Promise((_, reject) => {
				setTimeout(() => reject(new Error('WebContainer boot timeout (30s)')), 30000)
			})

			const instance = (await Promise.race([WebContainer.boot(), bootTimeout])) as WebContainer

			logger.log('WebContainer booted successfully')

			if (this.isDisposed) {
				// 如果在启动过程中组件已卸载，立即清理
				try {
					await instance.teardown()
				} catch (error) {
					logger.error('Error during early teardown:', error)
				}
				return
			}

			this.webContainerInstance = instance

			await this.onBoot?.(instance)

			this.dispose = () => {
				if (this.isDisposed) return
				this.isDisposed = true

				this.onTask?.('🗑️ Cleaning up resources...')

				if (this.lastProcess) {
					this.lastProcess.kill()
					this.lastProcess = null
				}

				if (this.webContainerInstance) {
					try {
						this.webContainerInstance.teardown()
						this.webContainerInstance = null
					} catch (error) {
						logger.error('Error during WebContainer teardown:', error)
						this.onError?.(error as Error)
					}
				}
			}

			if (this.isDisposed) return

			this.onTask?.('📝 Mounting files...')

			logger.log('Mounting files to WebContainer...')

			await instance.mount(this.fileSystem)

			logger.log('Files mounted successfully')

			if (this.isDisposed) return

			this.onFileSystemMount?.(this.fileSystem)

			instance.on('server-ready', (port: number, url: string) => {
				if (this.isDisposed) return
				logger.log(`Server ready on port ${port}, url: ${url}`)
				this.url = url
				this.port = port
				this.onReady?.({ port, url })
			})
		} catch (error) {
			if (this.isDisposed) return
			logger.error('WebContainer initialization error:', error)
			this.onError?.(error as Error)
		}

		if (hasDependencies(this.fileSystem)) {
			try {
				if (this.isDisposed) return

				this.onTask?.('📦 Installing dependencies...')

				logger.log('Starting dependency installation...')

				await this.installDependencies()

				logger.log('Dependencies installed successfully')
			} catch (error) {
				if (this.isDisposed) return
				logger.error('Dependency installation error:', error)
				this.onError?.(error as Error)
			}
		}

		try {
			if (this.isDisposed) return

			this.onTask?.('🚀 Starting application...')

			logger.log('Starting application with npm run dev...')

			await this.execCommand('npm', ['run', 'dev'])

			logger.log('Application started successfully')
		} catch (error) {
			if (this.isDisposed) return
			logger.error('Application start error:', error)
			this.onError?.(error as Error)
		}
	}

	private async installDependencies() {
		if (!this.webContainerInstance || this.isDisposed) return

		logger.log('Checking for package.json and node_modules...')

		const lockPath = '/package.json'
		const nodeModulesPath = '/node_modules'

		const lockExists = await this.webContainerInstance.fs.readFile(lockPath).catch(() => null)
		const lockText = lockExists ? new TextDecoder().decode(lockExists) : ''

		logger.log('Package.json exists:', !!lockExists)

		if (this.isDisposed) return

		if (lockExists && lockText) {
			logger.log('Attempting to restore node_modules from snapshot...')
			const nmTree = await getSnapshot(lockText)

			if (this.isDisposed) return

			if (nmTree) {
				try {
					logger.log('Mounting node_modules from snapshot...')
					await mountTree(this.webContainerInstance, nmTree, nodeModulesPath)

					if (this.isDisposed) return

					logger.log('Running npm rebuild...')
					await this.execCommand('npm', ['rebuild'], false)

					logger.log('Snapshot restore successful')
					return
				} catch (error) {
					if (this.isDisposed) return
					logger.error('Restoring node_modules from snapshot failed:', error)
					this.onError?.(error as Error)
					logger.log('Removing node_modules...')
					await this.execCommand('rm', ['-rf', '/node_modules'], false)
				}
			} else {
				logger.log('No snapshot found')
			}
		}

		if (this.isDisposed) return

		logger.log('Running npm install...')
		await this.execCommand('npm', ['install'], false)

		if (this.isDisposed) return

		logger.log('Building snapshot tree...')
		const tree = {}
		await buildTreeFromFs(this.webContainerInstance, nodeModulesPath, tree)

		if (this.isDisposed) return

		logger.log('Saving snapshot...')
		await saveSnapshot(lockText, tree)
		logger.log('Snapshot saved')
	}

	private execCommand(command: string, args: string[], triggerProcess = true): Promise<number> {
		if (!this.webContainerInstance || this.isDisposed) {
			return Promise.reject(new Error('WebContainer instance is not initialized or disposed'))
		}

		return this.webContainerInstance.spawn(command, args).then((process: WebContainerProcess) => {
			if (this.isDisposed) {
				process.kill()
				return Promise.reject(new Error('Runtime disposed during command execution'))
			}

			this.lastProcess = process
			if (triggerProcess) {
				this.onProcess?.(process)
			}

			return process.exit.then((exitCode: number) => {
				this.lastProcess = null
				return exitCode
			})
		})
	}

	public async updateFiles(userFiles: FileSystemTree) {
		if (!this.webContainerInstance || this.isDisposed) return

		if (isEqual(this.fileSystem, userFiles) === false) {
			this.onTask?.('📂 Updating user files...')

			const fileList = convertFileSystemToFileList(userFiles ?? {})
			for (const { file, contents } of fileList) {
				if (this.isDisposed) return
				this.webContainerInstance?.fs.writeFile(file, contents)
			}

			this.fileSystem = this.prepareFiles(userFiles)
			this.onFileSystemMount?.(this.fileSystem)
		}
	}

	private prepareFiles(files: FileSystemTree) {
		return initPkgJsonForStaticProject(injectStaticServer(injectScreenshotTool(files)))
	}
}

function isEqual(a: any, b: any): boolean {
	if (a === b) return true
	if (typeof a !== 'object' || typeof b !== 'object' || a == null || b == null) return false

	const keysA = Object.keys(a)
	const keysB = Object.keys(b)

	if (keysA.length !== keysB.length) return false

	for (const key of keysA) {
		if (!keysB.includes(key) || !isEqual(a[key], b[key])) return false
	}

	return true
}
