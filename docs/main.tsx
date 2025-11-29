import { StrictMode, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { GithubIcon, MoonIcon, SunIcon } from './icons'
import { useRepoStar, useTheme } from './hooks'
import { routes, navLinks } from './routes'
import './main.scss'

const App = () => {
	const star = useRepoStar()
	const { theme, toggleTheme } = useTheme()

	return (
		<BrowserRouter>
			<div className="app-container">
				{/* Header */}
				<div className="app-header">
					<div className="header-content">
						<NavLink to="/" className="app-title-link">
							<h1 className="app-title">OpenWebBox</h1>
						</NavLink>
						<nav className="header-nav">
							{navLinks.map((link) => (
								<NavLink
									key={link.path}
									to={link.path}
									end={link.end}
									className={({ isActive }) =>
										clsx('nav-link', {
											active: isActive,
										})
									}
								>
									{link.label}
								</NavLink>
							))}
						</nav>
						<div className="header-actions">
							<button
								type="button"
								className="theme-toggle-btn"
								onClick={toggleTheme}
								aria-label="Toggle theme"
							>
								{theme === 'light' ? <MoonIcon size={16} /> : <SunIcon size={16} />}
							</button>
							<a
								href="https://github.com/parksben/open-web-box"
								target="_blank"
								rel="noopener noreferrer"
								className="github-badge"
							>
								<GithubIcon size={16} />
								<span>Star</span>
								{star}
							</a>
						</div>
					</div>
				</div>

				{/* Routes */}
				<div className="page-content">
					<Suspense
						fallback={
							<div className="loading-fallback">
								<div className="spinner" />
								<p>Loading...</p>
							</div>
						}
					>
						<Routes>
							{routes.map((route) => (
								<Route key={route.path} {...route} />
							))}
						</Routes>
					</Suspense>
				</div>
			</div>
		</BrowserRouter>
	)
}

const rootElement = document.getElementById('root')
if (rootElement) {
	ReactDOM.createRoot(rootElement).render(
		<StrictMode>
			<App />
		</StrictMode>,
	)
}
