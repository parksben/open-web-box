import clsx from 'clsx'
import { type CSSProperties, useEffect, useRef, useState } from 'react'

import Spin from '../Spin'
import './style.scss'

export interface PreviewProps {
	taskMsg: string
	pageUrl: string
	hideNavbar?: boolean
	className?: string
	style?: CSSProperties
}

export default function Preview({
	taskMsg,
	pageUrl,
	hideNavbar = false,
	className,
	style,
}: PreviewProps) {
	const addressInputRef = useRef<HTMLInputElement | null>(null)
	const iframeRef = useRef<HTMLIFrameElement | null>(null)

	const [loading, setLoading] = useState(true)

	useEffect(() => {
		if (pageUrl && iframeRef.current) {
			iframeRef.current.onload = () => {
				setLoading(false)
			}
			iframeRef.current.src = pageUrl
		}

		if (pageUrl && addressInputRef.current) {
			addressInputRef.current.value = pageUrl
		}
	}, [pageUrl])

	return (
		<div className={clsx('open-web-box-preview', className)} style={style}>
			{pageUrl && hideNavbar !== true ? (
				<div className="navigatior">
					<div className="operation">
						<button
							type="button"
							className="back"
							title="Back"
							onClick={() => {
								if (iframeRef.current?.contentWindow) {
									iframeRef.current.contentWindow.history.back()
								}
							}}
						/>
						<button
							type="button"
							className="forward"
							title="Forward"
							onClick={() => {
								if (iframeRef.current?.contentWindow) {
									iframeRef.current.contentWindow.history.forward()
								}
							}}
						/>
						<button
							type="button"
							className="refresh"
							title="Refresh"
							onClick={() => {
								if (iframeRef.current?.contentWindow) {
									iframeRef.current.src = pageUrl
								}
								if (addressInputRef.current) {
									addressInputRef.current.value = pageUrl
								}
							}}
						/>
					</div>
					<div className="address">
						<input
							ref={addressInputRef}
							type="text"
							onFocus={(e) => {
								e.stopPropagation()
								e.currentTarget.select()
							}}
							onKeyDown={(e) => {
								if (e.key === 'Enter') {
									e.stopPropagation()
									if (iframeRef.current) {
										iframeRef.current.src = e.currentTarget.value
									}
								}
							}}
						/>
					</div>
				</div>
			) : null}

			{/** biome-ignore lint/a11y/useIframeTitle: no-need */}
			<iframe className="open-web-box-preview-iframe" ref={iframeRef} />

			{loading ? <Spin className="loading" message={taskMsg} /> : null}
		</div>
	)
}
