import React from 'react'
import { useNavigate } from 'react-router-dom'
import { GithubIcon } from '../../icons/GithubIcon'
import './style.scss'

const Home: React.FC = () => {
	const navigate = useNavigate()

	return (
		<div className="home-page">
			<div className="hero">
				<h1 className="hero-title">OpenWebBox</h1>
				<p className="hero-subtitle">在浏览器中运行完整的 Web 项目</p>
				<p className="hero-description">
					一个基于 WebContainer API 的 React 组件，让你可以在浏览器中直接运行
					HTML、React、Vue、Svelte 等框架项目，无需服务器。
				</p>
				<div className="hero-actions">
					<button type="button" className="primary-button" onClick={() => navigate('/quickstart')}>
						快速开始
					</button>
					<button type="button" className="secondary-button" onClick={() => navigate('/examples')}>
						查看示例
					</button>
				</div>
			</div>

			<div className="features">
				<div className="feature-card">
					<h3>🚀 零配置</h3>
					<p>开箱即用，无需复杂配置</p>
				</div>
				<div className="feature-card">
					<h3>🔥 热更新</h3>
					<p>实时预览代码修改效果</p>
				</div>
				<div className="feature-card">
					<h3>📦 多框架支持</h3>
					<p>支持 HTML、React、Vue、Svelte 等</p>
				</div>
				<div className="feature-card">
					<h3>🎨 完全可定制</h3>
					<p>灵活的配置选项和样式定制</p>
				</div>
			</div>

			<div className="github-section">
				<a
					href="https://github.com/parksben/open-web-box"
					target="_blank"
					rel="noopener noreferrer"
					className="github-link"
				>
					<GithubIcon size={24} />
					<span>在 GitHub 上查看源码</span>
				</a>
			</div>
		</div>
	)
}

export default Home
