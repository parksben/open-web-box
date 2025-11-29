import { useState } from 'react'
import { CloseIcon } from '../../icons'
import './style.css'

interface UsageModalProps {
	onClose: () => void
}

type InstallMethod = 'npm' | 'esm' | 'umd'

export default function UsageModal({ onClose }: UsageModalProps) {
	const [method, setMethod] = useState<InstallMethod>('npm')

	return (
		<div className="modal-overlay" onClick={onClose}>
			<div className="modal-content" onClick={(e) => e.stopPropagation()}>
				<div className="modal-header">
					<h2>How to Use OpenWebBox</h2>
					<button className="modal-close" onClick={onClose}>
						<CloseIcon size={20} />
					</button>
				</div>
				<div className="method-tabs">
					<button
						className={`method-tab ${method === 'npm' ? 'active' : ''}`}
						onClick={() => setMethod('npm')}
					>
						NPM
					</button>
					<button
						className={`method-tab ${method === 'esm' ? 'active' : ''}`}
						onClick={() => setMethod('esm')}
					>
						ESM CDN
					</button>
					<button
						className={`method-tab ${method === 'umd' ? 'active' : ''}`}
						onClick={() => setMethod('umd')}
					>
						UMD CDN
					</button>
				</div>
				<div className="modal-body">
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
									<span className="token-string">{`\`Ready on port \${port}: \${url}\``}</span>)
									{'\n'}
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
									<span className="token-keyword">return</span> React.
									<span className="token-function">createElement</span>( OpenWebBox, {'{\n'}
									{'      '}userFiles<span className="token-operator">:</span> files
									{',\n'}
									{'      '}onReady<span className="token-operator">:</span> {'({ '}port, url{' '}
									{' }) => {\n'}
									{'        '}
									<span className="token-console">console</span>.
									<span className="token-function">log</span>(
									<span className="token-string">{`\`Ready on port \${port}: \${url}\``}</span>)
									{'\n'}
									{'      }'}
									{',\n'}
									{'      '}onError<span className="token-operator">:</span> {'(error) => {\n'}
									{'        '}
									<span className="token-console">console</span>.
									<span className="token-function">error</span>(
									<span className="token-string">'Error:'</span>, error){'\n'}
									{'      }'}
									{',\n'}
									{'      '}style<span className="token-operator">:</span> {'{ '}
									height<span className="token-operator">:</span>{' '}
									<span className="token-string">'600px'</span> {' }\n'}
									{'    }'}){'\n'}
									{'  }'}
									{'\n'}
									{'\n'}
									{'  '}
									<span className="token-keyword">const</span> root{' '}
									<span className="token-operator">=</span> ReactDOM.
									<span className="token-function">createRoot</span>(
									<span className="token-console">document</span>.
									<span className="token-function">getElementById</span>(
									<span className="token-string">'root'</span>)){'\n'}
									{'  '}
									root.<span className="token-function">render</span>( React.
									<span className="token-function">createElement</span>( App))
									{'\n'}
									<span className="token-tag">{'</script>'}</span>
								</code>
							</pre>
						</>
					)}

					{method === 'umd' && (
						<>
							<h3>Installation</h3>
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
								</code>
							</pre>

							<h3>Basic Usage</h3>
							<pre className="code-block">
								<code className="language-tsx">
									<span className="token-keyword">const</span> {'{ '}
									createElement {' }'} <span className="token-operator">=</span> React
									{'\n'}
									<span className="token-keyword">const</span> OpenWebBox{' '}
									<span className="token-operator">=</span> window.OpenWebBox.default
									{'\n'}
									{'\n'}
									<span className="token-keyword">const</span> files{' '}
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
									<span className="token-keyword">return</span>{' '}
									<span className="token-function">createElement</span>( OpenWebBox, {'{\n'}
									{'    '}userFiles<span className="token-operator">:</span> files
									{',\n'}
									{'    '}onReady<span className="token-operator">:</span> {'({ '}port, url{' '}
									{' }) => {\n'}
									{'      '}
									<span className="token-console">console</span>.
									<span className="token-function">log</span>(
									<span className="token-string">{`\`Ready on port \${port}: \${url}\``}</span>)
									{'\n'}
									{'    }'}
									{',\n'}
									{'    '}onError<span className="token-operator">:</span> {'(error) => {\n'}
									{'      '}
									<span className="token-console">console</span>.
									<span className="token-function">error</span>(
									<span className="token-string">'Error:'</span>, error){'\n'}
									{'    }'}
									{',\n'}
									{'    '}style<span className="token-operator">:</span> {'{ '}
									height<span className="token-operator">:</span>{' '}
									<span className="token-string">'600px'</span> {' }\n'}
									{'  }'}){'\n'}
									{'}'}
									{'\n'}
									{'\n'}
									<span className="token-keyword">const</span> root{' '}
									<span className="token-operator">=</span> ReactDOM.
									<span className="token-function">createRoot</span>(
									<span className="token-console">document</span>.
									<span className="token-function">getElementById</span>(
									<span className="token-string">'root'</span>)){'\n'}
									root.<span className="token-function">render</span>(
									<span className="token-function">createElement</span>(App))
								</code>
							</pre>
						</>
					)}

					<div className="modal-footer">
						<a
							href="https://github.com/parksben/open-web-box"
							target="_blank"
							rel="noopener noreferrer"
							className="docs-link"
						>
							View Full Documentation →
						</a>
					</div>
				</div>
			</div>
		</div>
	)
}
