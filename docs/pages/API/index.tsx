import './style.scss'

export default function API() {
	return (
		<div className="api-page">
			<div className="api-header">
				<h1>API 文档</h1>
				<p>OpenWebBox 组件的完整 API 参考</p>
			</div>

			<div className="api-content">
				<section className="api-section">
					<h2>OpenWebBox Component</h2>
					<p className="api-description">主要的 React 组件，用于在浏览器中渲染和运行 Web 项目。</p>

					<h3>Props</h3>
					<table className="props-table">
						<thead>
							<tr>
								<th>属性名</th>
								<th>类型</th>
								<th>必填</th>
								<th>默认值</th>
								<th>描述</th>
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
								<td>
									<span className="required">是</span>
								</td>
								<td>-</td>
								<td>项目文件树结构，符合 WebContainer API 规范</td>
							</tr>
							<tr>
								<td>
									<code>onReady</code>
								</td>
								<td>
									<code>{'(info: ReadyInfo) => void'}</code>
								</td>
								<td>
									<span className="optional">否</span>
								</td>
								<td>-</td>
								<td>容器就绪时的回调函数，返回端口号和 URL</td>
							</tr>
							<tr>
								<td>
									<code>onError</code>
								</td>
								<td>
									<code>{'(error: Error) => void'}</code>
								</td>
								<td>
									<span className="optional">否</span>
								</td>
								<td>-</td>
								<td>发生错误时的回调函数</td>
							</tr>
							<tr>
								<td>
									<code>hideNavbar</code>
								</td>
								<td>
									<code>boolean</code>
								</td>
								<td>
									<span className="optional">否</span>
								</td>
								<td>
									<code>false</code>
								</td>
								<td>是否隐藏顶部导航栏</td>
							</tr>
							<tr>
								<td>
									<code>hideTerminal</code>
								</td>
								<td>
									<code>boolean</code>
								</td>
								<td>
									<span className="optional">否</span>
								</td>
								<td>
									<code>false</code>
								</td>
								<td>是否隐藏终端面板</td>
							</tr>
							<tr>
								<td>
									<code>style</code>
								</td>
								<td>
									<code>CSSProperties</code>
								</td>
								<td>
									<span className="optional">否</span>
								</td>
								<td>-</td>
								<td>自定义容器样式</td>
							</tr>
							<tr>
								<td>
									<code>className</code>
								</td>
								<td>
									<code>string</code>
								</td>
								<td>
									<span className="optional">否</span>
								</td>
								<td>-</td>
								<td>自定义 CSS 类名</td>
							</tr>
						</tbody>
					</table>
				</section>

				<section className="api-section">
					<h2>TypeScript 类型定义</h2>

					<h3>FileSystemTree</h3>
					<pre className="code-block">
						<code className="language-typescript">
							<span className="token-keyword">interface</span>{' '}
							<span className="token-class">FileSystemTree</span> {'{\n'}
							{'  '}[name<span className="token-operator">:</span>{' '}
							<span className="token-keyword">string</span>]
							<span className="token-operator">:</span>{' '}
							<span className="token-class">FileNode</span> |{' '}
							<span className="token-class">DirectoryNode</span>
							{'\n'}
							{'}'}
							{'\n'}
							{'\n'}
							<span className="token-keyword">interface</span>{' '}
							<span className="token-class">FileNode</span> {'{\n'}
							{'  '}file<span className="token-operator">:</span> {'{\n'}
							{'    '}contents<span className="token-operator">:</span>{' '}
							<span className="token-keyword">string</span> |{' '}
							<span className="token-class">Uint8Array</span>
							{'\n'}
							{'  }'}
							{'\n'}
							{'}'}
							{'\n'}
							{'\n'}
							<span className="token-keyword">interface</span>{' '}
							<span className="token-class">DirectoryNode</span> {'{\n'}
							{'  '}directory<span className="token-operator">:</span>{' '}
							<span className="token-class">FileSystemTree</span>
							{'\n'}
							{'}'}
						</code>
					</pre>

					<h3>ReadyInfo</h3>
					<pre className="code-block">
						<code className="language-typescript">
							<span className="token-keyword">interface</span>{' '}
							<span className="token-class">ReadyInfo</span> {'{\n'}
							{'  '}port<span className="token-operator">:</span>{' '}
							<span className="token-keyword">number</span>
							{'\n'}
							{'  '}url<span className="token-operator">:</span>{' '}
							<span className="token-keyword">string</span>
							{'\n'}
							{'}'}
						</code>
					</pre>
				</section>

				<section className="api-section">
					<h2>使用示例</h2>

					<h3>基础用法</h3>
					<pre className="code-block">
						<code className="language-tsx">
							<span className="token-keyword">import</span> OpenWebBox{' '}
							<span className="token-keyword">from</span>{' '}
							<span className="token-string">'open-web-box'</span>
							{'\n'}
							{'\n'}
							<span className="token-keyword">const</span> files{' '}
							<span className="token-operator">=</span> {'{\n'}
							{'  '}
							<span className="token-string">'index.html'</span>
							<span className="token-operator">:</span> {'{\n'}
							{'    '}file<span className="token-operator">:</span> {'{\n'}
							{'      '}contents<span className="token-operator">:</span>{' '}
							<span className="token-string">
								'{'<'}h1{'>'}Hello{'<'}/h1{'>'}'
							</span>
							{'\n'}
							{'    }'}
							{'\n'}
							{'  }'}
							{'\n'}
							{'}'}
							{'\n'}
							{'\n'}
							<span className="token-tag">{'<'}OpenWebBox</span> userFiles
							<span className="token-operator">=</span>
							<span className="token-punctuation">{'{'}</span>files
							<span className="token-punctuation">{'}'}</span>{' '}
							<span className="token-tag">{'/>'}</span>
						</code>
					</pre>

					<h3>完整配置</h3>
					<pre className="code-block">
						<code className="language-tsx">
							<span className="token-tag">{'<'}OpenWebBox</span>
							{'\n'}
							{'  '}userFiles<span className="token-operator">=</span>
							<span className="token-punctuation">{'{'}</span>files
							<span className="token-punctuation">{'}'}</span>
							{'\n'}
							{'  '}onReady<span className="token-operator">=</span>
							<span className="token-punctuation">{'{'}</span>
							{'({ '}port, url {' }) => {\n'}
							{'    '}
							<span className="token-console">console</span>.
							<span className="token-function">log</span>(
							<span className="token-string">{`\`App is ready on port \${port}\``}</span>){'\n'}
							{'  }'}
							<span className="token-punctuation">{'}'}</span>
							{'\n'}
							{'  '}onError<span className="token-operator">=</span>
							<span className="token-punctuation">{'{'}</span>
							{'(error) => {\n'}
							{'    '}
							<span className="token-console">console</span>.
							<span className="token-function">error</span>(
							<span className="token-string">'Error:'</span>, error){'\n'}
							{'  }'}
							<span className="token-punctuation">{'}'}</span>
							{'\n'}
							{'  '}hideNavbar<span className="token-operator">=</span>
							<span className="token-punctuation">{'{'}</span>
							<span className="token-keyword">false</span>
							<span className="token-punctuation">{'}'}</span>
							{'\n'}
							{'  '}hideTerminal<span className="token-operator">=</span>
							<span className="token-punctuation">{'{'}</span>
							<span className="token-keyword">false</span>
							<span className="token-punctuation">{'}'}</span>
							{'\n'}
							{'  '}style<span className="token-operator">=</span>
							<span className="token-punctuation">{'{{'}</span> height
							<span className="token-operator">:</span>{' '}
							<span className="token-string">'600px'</span>{' '}
							<span className="token-punctuation">{'}}'}</span>
							{'\n'}
							{'  '}className<span className="token-operator">=</span>
							<span className="token-string">"my-webbox"</span>
							{'\n'}
							<span className="token-tag">{'/>'}</span>
						</code>
					</pre>
				</section>

				<section className="api-section">
					<h2>注意事项</h2>
					<ul className="notes-list">
						<li>
							<strong>浏览器兼容性</strong>：需要支持 WebContainer API 的现代浏览器 (Chrome/Edge
							102+, Safari 16.4+)
						</li>
						<li>
							<strong>跨域头</strong>：页面需要设置正确的 COOP 和 COEP 响应头
						</li>
						<li>
							<strong>文件结构</strong>：必须包含入口文件（如 index.html 或 package.json）
						</li>
						<li>
							<strong>性能考虑</strong>：首次启动容器时可能需要几秒钟加载时间
						</li>
					</ul>
				</section>
			</div>
		</div>
	)
}
