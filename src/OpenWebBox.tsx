import type { FileSystemTree, WebContainer, WebContainerProcess } from '@webcontainer/api'
import clsx from 'clsx'
import { Resizable } from 're-resizable'
import {
	type CSSProperties,
	forwardRef,
	type MouseEvent,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react'
import Preview from './components/Preview'
import Terminal from './components/Terminal'
import Runtime from './Runtime'
import './style.scss'
import useDynamicCallback from './hooks/useDynamicCallback'
import { initSimpleLogger } from './utils'

export interface OpenWebBoxRef {
	getWebContainer: () => WebContainer | null
	getIframe: () => HTMLIFrameElement | null
	fetchScreenshot: (selector?: string) => Promise<string | null>
}

export interface OpenWebBoxProps {
	userFiles?: FileSystemTree

	onReady?: (params: { port: number; url: string }) => void
	onError?: (error: Error) => void

	hideNavbar?: boolean
	hideTerminal?: boolean
	terminalDefaultHeight?: number
	className?: string
	style?: CSSProperties
}

const TerminalType = {
	Output: 'DevServer',
	Terminal: 'Terminal',
} as const

const logger = initSimpleLogger('OpenWebBox UI')

const OpenWebBox = forwardRef<OpenWebBoxRef, OpenWebBoxProps>(
	(
		{
			userFiles = {},

			onReady,
			onError,

			hideNavbar = false,
			hideTerminal = false,
			terminalDefaultHeight = 0,
			className,
			style,
		},
		ref,
	) => {
		const runtime = useRef<Runtime | null>(null)

		useImperativeHandle(
			ref,
			() => ({
				getWebContainer: (): WebContainer | null => runtime.current?.webContainerInstance || null,
				getIframe: (): HTMLIFrameElement | null => {
					return containerRef.current?.querySelector('.open-web-box-preview-iframe') || null
				},
				fetchScreenshot: (selector?: string): Promise<string | null> => {
					const iframe = containerRef.current?.querySelector('.open-web-box-preview-iframe')
					if (iframe instanceof HTMLIFrameElement === false) {
						return Promise.resolve(null)
					}

					const taskId = Math.random().toString(36).substring(2)
					iframe.contentWindow?.postMessage(
						{
							type: 'REACT_APP_BOX_PREVIEW_SCREENSHOT',
							selector,
							taskId,
						},
						'*',
					)

					return new Promise<string | null>((resolve) => {
						setTimeout(() => {
							resolve(null)
						}, 5000)

						const handleMessage = (event: MessageEvent) => {
							const {
								type,
								selector: respSelector,
								taskId: respTaskId,
								screenshot,
							} = event.data || {}
							if (
								type === 'REACT_APP_BOX_PREVIEW_SCREENSHOT:RESPONSE' &&
								respTaskId === taskId &&
								respSelector === selector
							) {
								window.removeEventListener('message', handleMessage)
								resolve(screenshot || null)
							}
						}

						window.addEventListener('message', handleMessage)
					})
				},
			}),
			[],
		)

		const [process, setProcess] = useState<WebContainerProcess | null>(null)
		const [taskMsg, setTaskMsg] = useState<string>('')
		const [pageUrl, setPageUrl] = useState<string>('')

		const containerRef = useRef<HTMLDivElement | null>(null)

		const terminalApiRef = useRef<any>(null)

		const handleReady = useDynamicCallback(onReady || (() => {}))
		const handleError = useDynamicCallback(
			onError ||
				((error) => {
					logger.error('OpenWebBox Error:', error)
				}),
		)

		// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
		useEffect(() => {
			if (runtime.current instanceof Runtime === false) {
				runtime.current = new Runtime({
					userFiles,
					onBoot: (instance: WebContainer) => {
						terminalApiRef.current?.linkShell?.(instance)
					},
					onFileSystemMount: (_files: FileSystemTree) => {
						// logger.log('File system mounted:', files)
					},
					onTask: (msg) => {
						setTaskMsg(msg)
					},
					onReady: ({ url, port }) => {
						setPageUrl(url)
						handleReady({ port, url })
					},
					onProcess: (process) => {
						setProcess(process)
					},
					onError: (error) => {
						handleError(error)
					},
				})
			}

			return () => {
				if (runtime.current?.webContainerInstance) {
					runtime.current.dispose()
					runtime.current = null
				}
			}
		}, [])

		useEffect(() => {
			if (runtime.current instanceof Runtime === false) {
				logger.warn('Server is not ready, cannot update props.')
				return
			}
			runtime.current.updateFiles(userFiles)
		}, [userFiles])

		const [activeTab, setActiveTab] = useState<string>(TerminalType.Output)

		const handleTabClick = useCallback((e: MouseEvent<HTMLButtonElement>, type: string) => {
			setActiveTab(type)
			const panelElement = e.currentTarget.closest('.terminal-panel')
			if (panelElement instanceof HTMLDivElement && panelElement.clientHeight < 166) {
				panelElement.style.height = '166px'
			}
		}, [])

		return (
			<div ref={containerRef} className={clsx('open-web-box', className)} style={style}>
				{/* Preview Panel */}
				<Preview className="preview" taskMsg={taskMsg} pageUrl={pageUrl} hideNavbar={hideNavbar} />

				{/* Terminal Panel */}
				{!hideTerminal ? (
					<Resizable
						className="terminal-panel"
						defaultSize={{ height: Math.max(0, terminalDefaultHeight) + 26 }}
						minHeight={26}
						enable={{ top: true }}
					>
						<div className="tabs">
							<button
								type="button"
								className={clsx('tab-item', { active: activeTab === TerminalType.Output })}
								onClick={(e) => handleTabClick(e, TerminalType.Output)}
							>
								{TerminalType.Output}
							</button>
							<button
								type="button"
								className={clsx('tab-item', { active: activeTab === TerminalType.Terminal })}
								onClick={(e) => handleTabClick(e, TerminalType.Terminal)}
							>
								{TerminalType.Terminal}
							</button>
						</div>

						<div className="content">
							<div className={clsx('terminal-item', { active: activeTab === TerminalType.Output })}>
								<Terminal process={process} />
							</div>
							<div
								className={clsx('terminal-item', {
									active: activeTab === TerminalType.Terminal,
								})}
							>
								<Terminal ref={terminalApiRef} />
							</div>
						</div>
					</Resizable>
				) : null}
			</div>
		)
	},
)

OpenWebBox.displayName = 'OpenWebBox'

export default OpenWebBox
