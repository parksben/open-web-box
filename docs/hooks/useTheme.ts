import { useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

const THEME_STORAGE_KEY = 'open-web-box-theme'

export function useTheme() {
	const [theme, setTheme] = useState<Theme>(() => {
		// 从 localStorage 读取主题，如果没有则使用系统偏好
		const stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null
		if (stored) {
			return stored
		}

		// 检测系统主题偏好
		if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			return 'dark'
		}

		return 'light'
	})

	useEffect(() => {
		// 应用主题到 HTML 元素
		document.documentElement.setAttribute('data-theme', theme)

		// 保存到 localStorage
		localStorage.setItem(THEME_STORAGE_KEY, theme)
	}, [theme])

	const toggleTheme = () => {
		setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
	}

	return { theme, toggleTheme }
}
