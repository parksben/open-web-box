import type { WebContainer, WebContainerProcess } from '@webcontainer/api'
import { FitAddon } from '@xterm/addon-fit'
import { WebLinksAddon } from '@xterm/addon-web-links'
import { Terminal } from '@xterm/xterm'
import '@xterm/xterm/css/xterm.css'
import clsx from 'clsx'
import {
	type CSSProperties,
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
} from 'react'
import './style.scss'
import { initSimpleLogger } from '../../utils'

interface TerminalProps {
	process?: WebContainerProcess | null
	className?: string
	maxLines?: number
	style?: CSSProperties
}

export interface TerminalHandle {
	clear: () => void
	getContent: () => string
}

const logger = initSimpleLogger('OpenWebBox Terminal')

const XTerminal = forwardRef<TerminalHandle, TerminalProps>(
	({ process, className = '', maxLines = 200, style }, ref) => {
		const containerRef = useRef<HTMLDivElement>(null)
		const termRef = useRef<Terminal | null>(null)
		const fitAddonRef = useRef(new FitAddon())
		const contentBuffer = useRef<string[]>([])
		const isMounted = useRef(true)

		// 初始化终端实例
		const initTerminal = useCallback(() => {
			const term = new Terminal({
				convertEol: true,
				scrollback: maxLines,
			})

			term.loadAddon(fitAddonRef.current)
			term.loadAddon(new WebLinksAddon())
			term.open(containerRef.current!)
			requestAnimationFrame(() => {
				fitAddonRef.current.fit()
			})

			// 初始化内容缓冲区
			term.onData((data) => contentBuffer.current.push(data))

			return term
		}, [maxLines])

		const shellProcessRef = useRef<WebContainerProcess | null>(null)

		// 暴露组件方法
		useImperativeHandle(ref, () => ({
			clear: () => {
				termRef.current?.clear()
				contentBuffer.current = []
			},
			getContent: () => contentBuffer.current.join(''),
			linkShell: async (instance: WebContainer) => {
				if (!termRef.current || !instance) return

				shellProcessRef.current = await instance.spawn('jsh', {
					terminal: {
						cols: termRef.current.cols,
						rows: termRef.current.rows,
					},
				})
				shellProcessRef.current.output.pipeTo(
					new WritableStream({
						write(data) {
							if (termRef.current) {
								termRef.current.write(data)
							}
						},
					}),
				)

				const input = shellProcessRef.current.input.getWriter()
				termRef.current.onData((data) => {
					input.write(data)
				})
			},
		}))

		// 处理数据流
		useEffect(() => {
			if (!process || !termRef.current) return

			const reader = process.output.getReader()

			const readChunk = async () => {
				try {
					while (true) {
						const { done, value } = await reader.read()
						if (done) break

						termRef.current?.write(value)

						// 自动滚动处理
						if (termRef.current) {
							termRef.current.scrollToBottom()
						}

						// 内存优化：保留最近 N 行
						if (contentBuffer.current.length > maxLines * 2) {
							contentBuffer.current = contentBuffer.current.slice(-maxLines)
						}
					}
				} catch (err) {
					logger.error('Stream reading error:', err)
				}
			}

			readChunk()

			return () => {
				reader.cancel()
			}
		}, [process, maxLines])

		// 生命周期管理
		useEffect(() => {
			termRef.current = initTerminal()
			isMounted.current = true

			// 窗口尺寸变化适配
			const resizeObserver = new ResizeObserver(() => {
				fitAddonRef.current.fit()
				if (shellProcessRef.current && termRef.current) {
					shellProcessRef.current.resize({
						cols: termRef.current.cols,
						rows: termRef.current.rows,
					})
				}
			})

			if (containerRef.current) {
				resizeObserver.observe(containerRef.current)
			}

			return () => {
				isMounted.current = false
				termRef.current?.dispose()
				resizeObserver.disconnect()
			}
		}, [initTerminal])

		return (
			<div ref={containerRef} className={clsx('open-web-box-terminal', className)} style={style} />
		)
	},
)

export default XTerminal
