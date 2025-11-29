# OpenWebBox

Web 前端工程运行时沙箱

## 组件介绍

OpenWebBox 是一个基于 [@webcontainer/api](https://webcontainers.io/) 实现的 React 组件，能够在浏览器中运行完整的 Node.js 环境，无需后端服务器支持。它提供了一个隔离的沙箱环境，可以运行 HTML、React、Vue 等各类前端项目，并实时预览运行效果。

> 注：由于 [@webcontainer/api](https://webcontainers.io/) 并未提供免费商业化使用的许可，请勿直接用于外部商业化项目

## 核心特性

- 🚀 **浏览器内运行**：完全在浏览器中运行 Node.js 环境，无需服务器
- 📦 **npm 包支持**：支持安装和使用 npm 包，自动处理依赖管理
- ⚡ **快照优化**：使用 IndexedDB 缓存 node_modules，显著提升二次加载速度
- 🔄 **实时预览**：代码变更后自动刷新预览，支持热重载
- 💻 **内置终端**：提供完整的终端功能，可以执行命令
- 🌁 **页面截图**：通过组件 Ref 暴露的 API 可实现页面截图

## 使用场景

1. **教学演示**：在文档或教程中嵌入可交互的代码示例
2. **代码分享**：快速分享和演示前端项目，无需部署服务端环境
3. **原型开发**：快速验证想法和创建原型

## 运行效果

![运行效果](screenshot.png)

## 快速开始

```tsx
import OpenWebBox from './components/OpenWebBox'
import type { FileSystemTree } from '@webcontainer/api'

const files: FileSystemTree = {
  'index.html': {
    file: {
      contents: `<!DOCTYPE html>
<html>
  <head><title>Hello World</title></head>
  <body><h1>Hello World!</h1></body>
</html>`
    }
  }
}

function App() {
  return (
    <OpenWebBox 
      userFiles={files}
      onReady={({ port, url }) => {
        console.log('App is ready on:', url)
      }}
    />
  )
}
```

## API 参考

### OpenWebBoxProps

| 属性                    | 类型                                              | 默认值  | 必填 | 描述                                        |
| ----------------------- | ------------------------------------------------- | ------- | ---- | ------------------------------------------- |
| `userFiles`             | `FileSystemTree`                                  | `{}`    | 否   | 要在沙箱中运行的文件系统树结构              |
| `onReady`               | `(params: { port: number; url: string }) => void` | -       | 否   | 当 devServer 启动并准备就绪时触发的回调函数 |
| `onError`               | `(error: Error) => void`                          | -       | 否   | 当发生错误时触发的回调函数                  |
| `hideNavbar`            | `boolean`                                         | `false` | 否   | 是否隐藏预览区域的导航栏                    |
| `hideTerminal`          | `boolean`                                         | `false` | 否   | 是否隐藏底部终端面板                        |
| `terminalDefaultHeight` | `number`                                          | `0`     | 否   | 终端面板的默认高度（像素）                  |
| `className`             | `string`                                          | -       | 否   | 自定义 CSS 类名                             |
| `style`                 | `CSSProperties`                                   | -       | 否   | 自定义内联样式                              |

### OpenWebBoxRef

通过 `ref` 可以访问以下方法：

| 方法              | 类型                                             | 描述                                                                            |
| ----------------- | ------------------------------------------------ | ------------------------------------------------------------------------------- |
| `getWebContainer` | `() => WebContainer \| null`                     | 获取底层 WebContainer 实例                                                      |
| `getIframe`       | `() => HTMLIFrameElement \| null`                | 获取预览区域的 iframe 元素                                                      |
| `fetchScreenshot` | `(selector?: string) => Promise<string \| null>` | 截取预览页面的屏幕截图，返回 base64 格式图片。可选传入 CSS 选择器以截取特定元素 |

### FileSystemTree

文件系统树结构遵循 WebContainer API 的定义：

```typescript
interface FileSystemTree {
  [name: string]: FileNode | DirectoryNode
}

interface FileNode {
  file: {
    contents: string | Uint8Array
  }
}

interface DirectoryNode {
  directory: FileSystemTree
}
```

## 使用示例

### 基础示例 - HTML 静态页面

```tsx
import OpenWebBox from './components/OpenWebBox'

const htmlFiles = {
  'index.html': {
    file: {
      contents: `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>Hello World</title>
</head>
<body>
  <h1>Hello from OpenWebBox!</h1>
</body>
</html>`
    }
  }
}

<OpenWebBox userFiles={htmlFiles} />
```

### React 项目示例

```tsx
const reactFiles = {
  'package.json': {
    file: {
      contents: JSON.stringify({
        name: 'react-app',
        dependencies: {
          'react': '^18.2.0',
          'react-dom': '^18.2.0',
          'vite': '^5.0.0',
          '@vitejs/plugin-react': '^4.2.0'
        },
        scripts: {
          dev: 'vite'
        }
      }, null, 2)
    }
  },
  'index.html': {
    file: {
      contents: `<!DOCTYPE html>
<html>
  <head><title>React App</title></head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`
    }
  },
  src: {
    directory: {
      'main.jsx': {
        file: {
          contents: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)`
        }
      },
      'App.jsx': {
        file: {
          contents: `export default function App() {
  return <h1>Hello React!</h1>
}`
        }
      }
    }
  },
  'vite.config.js': {
    file: {
      contents: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()]
})`
    }
  }
}

<OpenWebBox userFiles={reactFiles} />
```

### 使用 Ref 控制

```tsx
import { useRef } from 'react'
import OpenWebBox, { OpenWebBoxRef } from './components/OpenWebBox'

function App() {
  const sandboxRef = useRef<OpenWebBoxRef>(null)

  const handleScreenshot = async () => {
    const screenshot = await sandboxRef.current?.fetchScreenshot()
    if (screenshot) {
      console.log('Screenshot captured:', screenshot)
      // screenshot 是 base64 格式的图片数据
    }
  }

  const handleGetContainer = () => {
    const container = sandboxRef.current?.getWebContainer()
    if (container) {
      // 可以直接操作 WebContainer API
      container.fs.readdir('/').then(files => {
        console.log('Root files:', files)
      })
    }
  }

  return (
    <div>
      <button onClick={handleScreenshot}>截图</button>
      <button onClick={handleGetContainer}>获取容器</button>
      <OpenWebBox ref={sandboxRef} userFiles={files} />
    </div>
  )
}
```

### 监听状态

```tsx
<OpenWebBox
  userFiles={files}
  onReady={({ port, url }) => {
    console.log(`服务器已启动在端口 ${port}`)
    console.log(`访问地址：${url}`)
  }}
  onError={(error) => {
    console.error('沙箱运行出错:', error)
    // 处理错误，如显示错误提示
  }}
/>
```

## 技术实现

### 核心技术栈

- **WebContainer API**：提供浏览器内的 Node.js 运行环境
- **IndexedDB**：用于缓存 node_modules 快照，提升加载速度
- **xterm.js**：提供终端界面
- **fflate**：用于压缩/解压快照数据

### 工作流程

1. **初始化 WebContainer**：在浏览器中启动一个完整的 Node.js 环境
2. **挂载文件系统**：将用户提供的文件写入虚拟文件系统
3. **依赖安装**：
   - 优先尝试从 IndexedDB 快照恢复 node_modules
   - 如果没有快照或恢复失败，执行 `npm install`
   - 安装完成后保存快照以供下次使用
4. **启动开发服务器**：执行 `npm run dev` 启动项目
5. **预览渲染**：在 iframe 中显示运行结果

### 快照机制

为了优化二次加载速度，OpenWebBox 实现了智能快照系统：

- 基于 `package.json` 内容的 SHA-256 哈希作为快照键
- 使用 tar + gzip 压缩 node_modules 目录
- 存储在 IndexedDB 中，避免重复安装
- 自动处理快照版本兼容性

## 注意事项

1. **浏览器兼容性**：需要浏览器支持 SharedArrayBuffer，需要设置正确的 COEP/COOP 响应头：

   ```http
   Cross-Origin-Embedder-Policy: require-corp
   Cross-Origin-Opener-Policy: same-origin
   ```

2. **性能考虑**：首次安装依赖较慢，建议显示加载提示

3. **文件大小**：避免在 `userFiles` 中包含过大的文件或 node_modules

4. **安全性**：运行在沙箱环境中，无法访问用户本地文件系统

## 更多示例

详细用法请参考项目中的示例文件：

- `src/App.tsx` - 完整的应用示例
- `src/examples/simpleHtmlDemo.ts` - HTML 静态页面示例
- `src/examples/simpleReactDemo.ts` - React 项目示例
- `src/examples/simpleVueDemo.ts` - Vue 项目示例
