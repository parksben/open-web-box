import { useState } from 'react'
import clsx from 'clsx'
import OpenWebBox from '../../../src'
import { CodeIcon } from '../../icons'
import DEMO_LIST from '../../demo'
import './style.scss'

export default function Examples() {
	const [activeTab, setActiveTab] = useState('static')
	const currentDemo = DEMO_LIST.find((demo) => demo.id === activeTab)

	return (
		<div className="examples-page">
			{/* Tabs */}
			<div className="tabs-container">
				{DEMO_LIST.map((demo) => (
					<button
						key={demo.id}
						type="button"
						onClick={() => setActiveTab(demo.id)}
						className={clsx('tab-button', {
							active: activeTab === demo.id,
						})}
					>
						<demo.icon size={18} className="tab-icon" />
						<span>{demo.name}</span>
					</button>
				))}
			</div>

			{/* Demo Info Bar */}
			{currentDemo && (
				<div className="demo-info-bar">
					<div className="demo-info-left">
						<currentDemo.icon size={24} className="demo-info-icon" />
						<div className="demo-info-text">
							<h2 className="demo-info-title">{currentDemo.name} Demo</h2>
							<p className="demo-info-desc">{currentDemo.desc}</p>
						</div>
					</div>
					<a
						href={currentDemo.sourceUrl}
						target="_blank"
						rel="noopener noreferrer"
						className="view-source-btn"
					>
						<CodeIcon size={16} />
						View Demo Codes
					</a>
				</div>
			)}

			{/* Content */}
			<div className="content-container">
				{currentDemo && (
					<OpenWebBox
						key={activeTab}
						userFiles={currentDemo.files}
						onReady={({ port, url }) => {
							console.log(`${currentDemo.name} demo ready on port ${port}: ${url}`)
						}}
						onError={(error) => {
							console.error(`${currentDemo.name} error:`, error)
						}}
						style={{ height: '100%' }}
						hideNavbar
						hideTerminal
					/>
				)}
			</div>
		</div>
	)
}
