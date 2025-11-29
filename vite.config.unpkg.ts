import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// Build configuration for CDN resources (ESM + UMD)
export default defineConfig({
	plugins: [react()],
	build: {
		outDir: 'dist/unpkg',
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'OpenWebBox',
			formats: ['es', 'umd'],
			fileName: (format) => `index.${format === 'es' ? 'esm' : 'umd'}.js`,
		},
		rollupOptions: {
			external: ['react', 'react-dom', 'react/jsx-runtime'],
			output: {
				globals: {
					react: 'React',
					'react-dom': 'ReactDOM',
					'react/jsx-runtime': 'jsxRuntime',
				},
			},
		},
	},
})
