import http from 'http';
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

const root = path.resolve('exampleSite/public');
const useCache = process.argv.includes('--cache');
const types = {
	'.html': 'text/html; charset=utf-8',
	'.css': 'text/css',
	'.js': 'text/javascript',
	'.mjs': 'text/javascript',
	'.json': 'application/json',
	'.svg': 'image/svg+xml',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.woff2': 'font/woff2',
	'.wasm': 'application/wasm',
};

http
	.createServer((req, res) => {
		const url = decodeURIComponent(req.url.split('?')[0]);
		if (url.includes('livereload')) return res.writeHead(204).end();

		let file = path.join(root, url);
		if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
		if (!fs.existsSync(file)) return res.writeHead(404).end('Not Found');

		const type = types[path.extname(file)] || 'application/octet-stream';
		let body = fs.readFileSync(file);

		const gzip =
			/gzip/.test(req.headers['accept-encoding'] || '') &&
			/^(text|application\/(json|wasm)|image\/svg)/.test(type);
		if (gzip) body = zlib.gzipSync(body);

		res.writeHead(200, {
			'Content-Type': type,
			'Content-Length': body.length,
			'Cache-Control': useCache ? 'public, max-age=3600' : 'no-cache',
			...(gzip && { 'Content-Encoding': 'gzip' }),
		});
		res.end(body);
	})
	.listen(8080, () => console.log(`http://localhost:8080 (cache: ${useCache ? 'on' : 'off'})`));
