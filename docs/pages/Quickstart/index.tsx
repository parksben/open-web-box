import { useState } from 'react'
import clsx from 'clsx'
import './style.scss'

type InstallMethod = 'npm' | 'esm' | 'umd'

export default function Quickstart() {
	const [method, setMethod] = useState<InstallMethod>('npm')

	return (
		<div className="quickstart-page">
			<div className="quickstart-header">
				<h1>快速开始</h1>
				<p>选择适合你的安装和使用方式</p>
			</div>

			<div className="method-tabs">
				<button
					type="button"
					className={clsx('method-tab', { active: method === 'npm' })}
					onClick={() => setMethod('npm')}
				>
					NPM
				</button>
				<button
					type="button"
					className={clsx('method-tab', { active: method === 'esm' })}
					onClick={() => setMethod('esm')}
				>
					ESM CDN
				</button>
				<button
					type="button"
					className={clsx('method-tab', { active: method === 'umd' })}
					onClick={() => setMethod('umd')}
				>
					UMD CDN
				</button>
			</div>

			<div className="quickstart-content">
				{method === 'npm' && (
					<>
						<h3>Installation</h3>
						<pre className="code-block">
							<code className="language-bash">
								<span className="token-command">npm</span> i open-web-box
							</code>
						</pre>

						<h3>Basic Usage</h3>
						<pre className="code-block">
							<code className="language-tsx">
								<span className="token-keyword">import</span> OpenWebBox{' '}
								<span className="token-keyword">from</span>{' '}
								<span className="token-string">'open-web-box'</span>
								{'\n'}
								<span className="token-keyword">import</span>{' '}
								<span className="token-keyword">type</span> {'{ '}
								FileSystemTree{' }'} <span className="token-keyword">from</span>{' '}
								<span className="token-string">'@webcontainer/api'</span>
								{'\n'}
								{'\n'}
								<span className="token-keyword">const</span> files
								<span className="token-operator">:</span> FileSystemTree{' '}
								<span className="token-operator">=</span> {'{\n'}
								{'  '}
								<span className="token-string">'index.html'</span>
								<span className="token-operator">:</span> {'{\n'}
								{'    '}file<span className="token-operator">:</span> {'{\n'}
								{'      '}contents<span className="token-operator">:</span>{' '}
								<span className="token-string">{`\`<!DOCTYPE html>
<html>
  <head>
    <title>Hello World</title>
  </head>
  <body>
    <h1>Hello from OpenWebBox!</h1>
  </body>
</html>\``}</span>
								{'\n'}
								{'    }'}
								{'}\n'}
								{'  }'}
								{'}\n'}
								{'}'}
								{'\n'}
								{'\n'}
								<span className="token-keyword">function</span>{' '}
								<span className="token-function">App</span>() {'{\n'}
								{'  '}
								<span className="token-keyword">return</span> {'(\n'}
								{'    '}
								<span className="token-tag">{'<'}OpenWebBox</span>
								{'\n'}
								{'      '}userFiles<span className="token-operator">=</span>
								<span className="token-punctuation">{'{'}</span>files
								<span className="token-punctuation">{'}'}</span>
								{'\n'}
								{'      '}onReady<span className="token-operator">=</span>
								<span className="token-punctuation">{'{'}</span>
								{'({ '}port, url {' }) => {\n'}
								{'        '}
								<span className="token-console">console</span>.
								<span className="token-function">log</span>(
								<span className="token-string">{`\`Ready on port \${port}: \${url}\``}</span>){'\n'}
								{'      }'}
								<span className="token-punctuation">{'}'}</span>
								{'\n'}
								{'      '}onError<span className="token-operator">=</span>
								<span className="token-punctuation">{'{'}</span>
								{'(error) => {\n'}
								{'        '}
								<span className="token-console">console</span>.
								<span className="token-function">error</span>(
								<span className="token-string">'Error:'</span>, error){'\n'}
								{'      }'}
								<span className="token-punctuation">{'}'}</span>
								{'\n'}
								{'      '}style<span className="token-operator">=</span>
								<span className="token-punctuation">{'{{'}</span> height
								<span className="token-operator">:</span>{' '}
								<span className="token-string">'600px'</span>{' '}
								<span className="token-punctuation">{'}}'}</span>
								{'\n'}
								{'    '}
								<span className="token-tag">{'/>'}</span>
								{'\n'}
								{'  )'}
								{'\n'}
								{'}'}
							</code>
						</pre>
					</>
				)}

				{method === 'esm' && (
					<>
						<h3>Installation & Usage</h3>
						<pre className="code-block">
							<code className="language-html">
								<span className="token-tag">{'<script'}</span>{' '}
								<span className="token-attr">type</span>
								<span className="token-operator">=</span>
								<span className="token-string">"module"</span>
								<span className="token-tag">{'>'}</span>
								{'\n'}
								{'  '}
								<span className="token-keyword">import</span> React{' '}
								<span className="token-keyword">from</span>{' '}
								<span className="token-string">'https://cdn.jsdelivr.net/npm/react@18/+esm'</span>
								{'\n'}
								{'  '}
								<span className="token-keyword">import</span> ReactDOM{' '}
								<span className="token-keyword">from</span>{' '}
								<span className="token-string">
									'https://cdn.jsdelivr.net/npm/react-dom@18/+esm'
								</span>
								{'\n'}
								{'  '}
								<span className="token-keyword">import</span> OpenWebBox{' '}
								<span className="token-keyword">from</span>{' '}
								<span className="token-string">
									'https://cdn.jsdelivr.net/npm/open-web-box@latest/dist/index.es.js'
								</span>
								{'\n'}
								{'\n'}
								{'  '}
								<span className="token-keyword">const</span> files{' '}
								<span className="token-operator">=</span> {'{\n'}
								{'    '}
								<span className="token-string">'index.html'</span>
								<span className="token-operator">:</span> {'{\n'}
								{'      '}file<span className="token-operator">:</span> {'{\n'}
								{'        '}contents<span className="token-operator">:</span>{' '}
								<span className="token-string">{`\`<!DOCTYPE html>
<html>
  <head>
    <title>Hello World</title>
  </head>
  <body>
    <h1>Hello from OpenWebBox!</h1>
  </body>
</html>\``}</span>
								{'\n'}
								{'      }'}
								{'\n'}
								{'    }'}
								{'\n'}
								{'  }'}
								{'\n'}
								{'  }'}
								{'\n'}
								{'\n'}
								{'  '}
								<span className="token-keyword">function</span>{' '}
								<span className="token-function">App</span>() {'{\n'}
								{'    '}
								<span className="token-keyword">return</span>{' '}
								<span className="token-tag">{'<'}OpenWebBox</span> userFiles
								<span className="token-operator">=</span>
								<span className="token-punctuation">{'{'}</span>files
								<span className="token-punctuation">{'}'}</span>{' '}
								<span className="token-tag">{'/>'}</span>
								{'\n'}
								{'  }'}
								{'\n'}
								{'\n'}
								{'  '}ReactDOM.<span className="token-function">render</span>(
								<span className="token-tag">{'<'}App</span>{' '}
								<span className="token-tag">{'/>'}</span>, document.
								<span className="token-function">getElementById</span>(
								<span className="token-string">'root'</span>)){'\n'}
								<span className="token-tag">{'</script>'}</span>
							</code>
						</pre>
					</>
				)}

				{method === 'umd' && (
					<>
						<h3>Installation & Usage</h3>
						<pre className="code-block">
							<code className="language-html">
								<span className="token-tag">{'<script'}</span>{' '}
								<span className="token-attr">src</span>
								<span className="token-operator">=</span>
								<span className="token-string">
									"https://cdn.jsdelivr.net/npm/react@18/umd/react.production.min.js"
								</span>
								<span className="token-tag">{'></script>'}</span>
								{'\n'}
								<span className="token-tag">{'<script'}</span>{' '}
								<span className="token-attr">src</span>
								<span className="token-operator">=</span>
								<span className="token-string">
									"https://cdn.jsdelivr.net/npm/react-dom@18/umd/react-dom.production.min.js"
								</span>
								<span className="token-tag">{'></script>'}</span>
								{'\n'}
								<span className="token-tag">{'<script'}</span>{' '}
								<span className="token-attr">src</span>
								<span className="token-operator">=</span>
								<span className="token-string">
									"https://cdn.jsdelivr.net/npm/open-web-box@latest/dist/index.umd.js"
								</span>
								<span className="token-tag">{'></script>'}</span>
								{'\n'}
								{'\n'}
								<span className="token-tag">{'<script>'}</span>
								{'\n'}
								{'  '}
								<span className="token-keyword">const</span> files{' '}
								<span className="token-operator">=</span> {'{\n'}
								{'    '}
								<span className="token-string">'index.html'</span>
								<span className="token-operator">:</span> {'{\n'}
								{'      '}file<span className="token-operator">:</span> {'{\n'}
								{'        '}contents<span className="token-operator">:</span>{' '}
								<span className="token-string">{`\`<!DOCTYPE html>
<html>
  <head>
    <title>Hello World</title>
  </head>
  <body>
    <h1>Hello from OpenWebBox!</h1>
  </body>
</html>\``}</span>
								{'\n'}
								{'      }'}
								{'\n'}
								{'    }'}
								{'\n'}
								{'  }'}
								{'\n'}
								{'  }'}
								{'\n'}
								{'\n'}
								{'  '}
								<span className="token-keyword">function</span>{' '}
								<span className="token-function">App</span>() {'{\n'}
								{'    '}
								<span className="token-keyword">return</span> React.
								<span className="token-function">createElement</span>
								(OpenWebBox.
								<span className="token-property">default</span>, {'{ '}userFiles
								<span className="token-operator">:</span> files{' }'}){'\n'}
								{'  }'}
								{'\n'}
								{'\n'}
								{'  '}ReactDOM.<span className="token-function">render</span>
								(React.
								<span className="token-function">createElement</span>(App), document.
								<span className="token-function">getElementById</span>(
								<span className="token-string">'root'</span>)){'\n'}
								<span className="token-tag">{'</script>'}</span>
							</code>
						</pre>
					</>
				)}

				<div className="props-section">
					<h3>Props</h3>
					<table className="props-table">
						<thead>
							<tr>
								<th>Name</th>
								<th>Type</th>
								<th>Required</th>
								<th>Description</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>
									<code>userFiles</code>
								</td>
								<td>
									<code>FileSystemTree</code>
								</td>
								<td>Yes</td>
								<td>Project file structure</td>
							</tr>
							<tr>
								<td>
									<code>onReady</code>
								</td>
								<td>
									<code>{'(info: ReadyInfo) => void'}</code>
								</td>
								<td>No</td>
								<td>Callback when the container is ready</td>
							</tr>
							<tr>
								<td>
									<code>onError</code>
								</td>
								<td>
									<code>{'(error: Error) => void'}</code>
								</td>
								<td>No</td>
								<td>Callback when an error occurs</td>
							</tr>
							<tr>
								<td>
									<code>style</code>
								</td>
								<td>
									<code>CSSProperties</code>
								</td>
								<td>No</td>
								<td>Custom styles for the container</td>
							</tr>
							<tr>
								<td>
									<code>className</code>
								</td>
								<td>
									<code>string</code>
								</td>
								<td>No</td>
								<td>Custom CSS class name</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}
