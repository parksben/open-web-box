import type { FileSystemTree } from '@webcontainer/api'

export const SCRIPT_CONTENT = `function response({ selector, taskId, screenshot }) {
  window.top.postMessage(
    {
      type: "REACT_APP_BOX_PREVIEW_SCREENSHOT:RESPONSE",
      selector,
      taskId,
      screenshot: screenshot || null,
    },
    "*"
  );
}

function handleMessage(event) {
  const { type, selector, taskId } = event.data || {};
  if (type !== "REACT_APP_BOX_PREVIEW_SCREENSHOT") return;

  const element = selector ? document.querySelector(selector) : document.body;
  if (!element) {
    response({
      selector,
      taskId,
      screenshot: null,
    });
    return;
  }

  window.snapdom.toCanvas(element, {
    quality: 0.9,
    dpr: window.devicePixelRatio || 1,
  })
    .then(function (canvas) {
      const screenshotData = canvas.toDataURL("image/png", 0.9);
      response({
        selector,
        taskId,
        screenshot: screenshotData,
      });
    })
    .catch(function () {
      response({
        selector,
        taskId,
        screenshot: null,
      });
    });
}

window.addEventListener("message", handleMessage);`

const SCRIPT_TAGS = `<script type="module">import { snapdom } from '//unpkg.com/@zumer/snapdom/dist/snapdom.mjs'; window.snapdom = snapdom;</script>\n<script>${SCRIPT_CONTENT}</script>`

// 向所有 html 文件内容注入 <script> 标签
export const injectScreenshotTool = (files: FileSystemTree): FileSystemTree => {
	const traverse = (node: FileSystemTree): FileSystemTree => {
		const result: FileSystemTree = {}

		for (const [name, value] of Object.entries(node)) {
			if ('file' in value && 'contents' in value.file) {
				// 处理文件节点
				const contents = value.file.contents

				// 检查是否为 HTML 文件
				if ((name.endsWith('.html') || name.endsWith('.htm')) && typeof contents === 'string') {
					// 在 </head> 之前注入
					let modifiedContents = contents
					if (contents.includes('</head>')) {
						modifiedContents = contents.replace('</head>', `${SCRIPT_TAGS}\n</head>`)
					}

					result[name] = {
						file: {
							contents: modifiedContents,
						},
					}
				} else {
					// 非 HTML 文件，保持原样
					result[name] = value
				}
			} else if ('directory' in value) {
				// 递归处理目录节点
				result[name] = {
					directory: traverse(value.directory),
				}
			} else {
				// 其他类型节点，保持原样
				result[name] = value
			}
		}

		return result
	}

	return traverse(files)
}
