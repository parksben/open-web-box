# open-web-box

A React 19 component library with npm and CDN support, powered by Vite and Biome.

## ✨ Features

- 🚀 **React 19** - Latest React version with improved performance
- 📦 **Multiple Distribution Formats** - npm (ESM), CDN (UMD + ESM)
- ⚡ **Vite** - Lightning fast build tool
- 🎯 **TypeScript** - Full type definitions
- 🔧 **Biome** - Fast linter and formatter (25x faster than ESLint)
- 📝 **Auto CHANGELOG** - Automatically generated from git commits
- 🌐 **GitHub Pages** - Auto-deployed demo site

## Installation

### NPM

```bash
npm install open-web-box
```

```jsx
import { HelloWorld } from 'open-web-box';

function App() {
  return <HelloWorld name="World" />;
}
```

### CDN (UMD)

```html
<script crossorigin src="https://unpkg.com/react@19/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@19/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/open-web-box/dist/unpkg/index.umd.js"></script>

<div id="root"></div>

<script>
  const { HelloWorld } = window.OpenWebBox;
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(React.createElement(HelloWorld, { name: 'World' }));
</script>
```

### CDN (ESM)

```html
<script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@19",
    "react-dom": "https://esm.sh/react-dom@19"
  }
}
</script>

<script type="module">
  import { HelloWorld } from 'https://unpkg.com/open-web-box/dist/unpkg/index.esm.js';
  import { createRoot } from 'react-dom';
  
  const root = createRoot(document.getElementById('root'));
  root.render(React.createElement(HelloWorld, { name: 'World' }));
</script>
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Code quality
npm run lint        # Check code
npm run lint:fix    # Fix code issues
npm run format      # Format code
npm run check       # Lint + Format + Build

# Build
npm run build           # Build all
npm run build:npm       # Build npm package
npm run build:unpkg     # Build CDN resources
npm run build:demo      # Build demo site

# Deploy (supports alpha/beta/rc/stable releases)
npm run deploy
```

## 📦 Release Types

This project supports multiple release types for different stages:

- **🚀 Stable**: Production-ready releases (`npm install open-web-box`)
- **🧪 Alpha**: Early testing versions (`npm install open-web-box@alpha`)
- **🔬 Beta**: Feature-complete testing (`npm install open-web-box@beta`)
- **✨ RC**: Release candidates (`npm install open-web-box@rc`)

See [RELEASE.md](./RELEASE.md) for detailed release workflow.

## 📚 Documentation

- [QUICKSTART.md](./QUICKSTART.md) - Quick start guide
- [GUIDE.md](./GUIDE.md) - User guide
- [DEVELOPMENT.md](./DEVELOPMENT.md) - Development guide
- [IMPROVEMENTS.md](./IMPROVEMENTS.md) - Project improvements
- [RELEASE.md](./RELEASE.md) - Release workflow
- [CHANGELOG.md](./CHANGELOG.md) - Version history

## License

MIT
