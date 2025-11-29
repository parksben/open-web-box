import { lazy } from 'react'

const Home = lazy(() => import('./pages/Home'))
const Quickstart = lazy(() => import('./pages/Quickstart'))
const Examples = lazy(() => import('./pages/Examples'))
const API = lazy(() => import('./pages/API'))

export const routes = [
	{
		path: '/',
		element: <Home />,
	},
	{
		path: '/quickstart',
		element: <Quickstart />,
	},
	{
		path: '/examples',
		element: <Examples />,
	},
	{
		path: '/api',
		element: <API />,
	},
] as const

export const navLinks = [
	{ path: '/', label: 'Home', end: true },
	{ path: '/quickstart', label: 'Quickstart', end: false },
	{ path: '/examples', label: 'Examples', end: false },
	{ path: '/api', label: 'API', end: false },
] as const
