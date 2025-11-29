import htmlProject from './html-project'
import reactProject from './react-project'
import svelteProject from './svelte-project'
import vueProject from './vue-project'
import { HtmlIcon, ReactIcon, SvelteIcon, VueIcon } from '../icons'

const DEMO_CODES_BASE_URL = 'https://github.com/parksben/open-web-box/blob/main/examples/demo'

const DEMO_LIST = [
	{
		id: 'static',
		name: 'HTML',
		icon: HtmlIcon,
		files: htmlProject,
		desc: 'Pure HTML/CSS/JS',
		sourceUrl: `${DEMO_CODES_BASE_URL}/html-project.ts`,
	},
	{
		id: 'react',
		name: 'React',
		icon: ReactIcon,
		files: reactProject,
		desc: 'React 18 + Vite',
		sourceUrl: `${DEMO_CODES_BASE_URL}/react-project.ts`,
	},
	{
		id: 'vue',
		name: 'Vue',
		icon: VueIcon,
		files: vueProject,
		desc: 'Vue 3 + Vite',
		sourceUrl: `${DEMO_CODES_BASE_URL}/vue-project.ts`,
	},
	{
		id: 'svelte',
		name: 'Svelte',
		icon: SvelteIcon,
		files: svelteProject,
		desc: 'Svelte 4 + Vite',
		sourceUrl: `${DEMO_CODES_BASE_URL}/svelte-project.ts`,
	},
]

export default DEMO_LIST
