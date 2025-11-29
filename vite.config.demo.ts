import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Build configuration for demo website
export default defineConfig({
	plugins: [react()],
	root: './',
	base: '/open-web-box/', // GitHub Pages base path
	build: {
		outDir: 'website',
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
			},
		},
	},
})
