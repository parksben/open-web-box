import clsx from 'clsx'
import type { CSSProperties } from 'react'
import './style.scss'

export interface SpinProps {
	className?: string
	style?: CSSProperties
	message?: string
}

export default function Spin({ className, style, message }: SpinProps) {
	return (
		<div className={clsx('open-web-box-spin', className)} style={style}>
			<div className="spinner" />
			{message ? <div className="message">{message}</div> : null}
		</div>
	)
}
