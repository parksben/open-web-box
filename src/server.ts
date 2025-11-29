import type { FileSystemTree } from '@webcontainer/api'

const SIMPLE_STATIC_SERVER = `#!/usr/bin/env node
/**
 * 零依赖静态文件服务器 —— 支持 WebAssembly 等全 MIME
 * 用法：node server.js  [root=.]  [port=8080]
 */
const http = require('http');
const fs   = require('fs');
const path = require('path');

const ROOT = path.resolve(process.argv[2] || '.');
const PORT = parseInt(process.argv[3], 10) || 8080;

/* =============== 全 MIME 映射表 =============== */
const MIME = {
  // 文本 & 标记
  '.html' : 'text/html',
  '.htm'  : 'text/html',
  '.css'  : 'text/css',
  '.js'   : 'text/javascript',
  '.mjs'  : 'text/javascript',
  '.json' : 'application/json',
  '.xml'  : 'application/xml',
  '.txt'  : 'text/plain',
  '.webmanifest': 'application/manifest+json',
  '.rss'  : 'application/rss+xml',
  '.atom' : 'application/atom+xml',
  '.ldjson': 'application/ld+json',

  // 图片
  '.png'  : 'image/png',
  '.apng' : 'image/apng',
  '.jpg'  : 'image/jpeg',
  '.jpeg' : 'image/jpeg',
  '.gif'  : 'image/gif',
  '.svg'  : 'image/svg+xml',
  '.svgz' : 'image/svg+xml',
  '.webp' : 'image/webp',
  '.ico'  : 'image/x-icon',
  '.bmp'  : 'image/bmp',
  '.tif'  : 'image/tiff',
  '.tiff' : 'image/tiff',

  // 字体
  '.woff' : 'application/font-woff',
  '.woff2': 'application/font-woff2',
  '.ttf'  : 'application/x-font-ttf',
  '.otf'  : 'application/x-font-opentype',
  '.eot'  : 'application/vnd.ms-fontobject',

  // 音视频
  '.mp3'  : 'audio/mpeg',
  '.ogg'  : 'audio/ogg',
  '.oga'  : 'audio/ogg',
  '.wav'  : 'audio/wav',
  '.weba' : 'audio/webm',
  '.mp4'  : 'video/mp4',
  '.webm' : 'video/webm',
  '.ogv'  : 'video/ogg',

  // Wasm（重点）
  '.wasm' : 'application/wasm',

  // 压缩 & 其它
  '.zip'  : 'application/zip',
  '.gz'   : 'application/gzip',
  '.7z'   : 'application/x-7z-compressed',
  '.pdf'  : 'application/pdf',
  '.bin'  : 'application/octet-stream',
  '.exe'  : 'application/octet-stream',
  '.dll'  : 'application/octet-stream'
};

/* =============== 工具函数 =============== */
const gzipExt = new Set(['.wasm', '.js', '.mjs', '.css', '.svg', '.json', '.xml', '.webmanifest']);

function findFile(p) {
  // 优先返回 gzip 预压缩版本（同目录下同名的 *.gz）
  const gz = p + '.gz';
  if (gzipExt.has(path.extname(p)) && fs.existsSync(gz)) return { path: gz, gzip: true };
  if (fs.existsSync(p)) return { path: p, gzip: false };
  return null;
}

/* =============== 创建服务 =============== */
http.createServer((req, res) => {
  const url = new URL(req.url, \`http://\${req.headers.host}\`).pathname;
  let filePath = path.normalize(path.join(ROOT, url === '/' ? '/index.html' : url));

  const found = findFile(filePath);
  if (!found) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('404 Not Found');
  }
  const { path: realPath, gzip: isGz } = found;

  const ext = path.extname(realPath).toLowerCase();
  const contentType = MIME[ext] || 'application/octet-stream';

  const head = { 'Content-Type': contentType };
  if (isGz) head['Content-Encoding'] = 'gzip';   // 告诉浏览器已压缩

  fs.createReadStream(realPath)
    .on('error', () => (res.writeHead(403), res.end('403 Forbidden')))
    .pipe(res);
}).listen(PORT, () => {
  console.log(\`Static server running at http://localhost:\${PORT}/\`);
  console.log(\`Serving: \${ROOT}\`);
});`

// 想文件中添加一个 simpleStaticServer.js 文件，内容为 SIMPLE_STATIC_SERVER
export const injectStaticServer = (files: FileSystemTree): FileSystemTree => {
	return {
		...files,
		'sandbox-simple-static-server.js': {
			file: {
				contents: SIMPLE_STATIC_SERVER,
			},
		},
	}
}
