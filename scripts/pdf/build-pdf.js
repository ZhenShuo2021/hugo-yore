// Usage: node scripts/build-pdf.js --site <site dir> --start <docs start path> --out <output file> [--base <live site URL>]
import { createReadStream, existsSync, statSync } from 'node:fs';
import { writeFile } from 'node:fs/promises';
import http from 'node:http';
import { availableParallelism } from 'node:os';
import path from 'node:path';
import { parseArgs } from 'node:util';
import {
	PDFArray,
	PDFDict,
	PDFDocument,
	PDFHexString,
	PDFName,
	PDFNumber,
	PDFString,
	StandardFonts,
} from 'pdf-lib';
import { chromium } from 'playwright';

const { values } = parseArgs({
	options: {
		site: { type: 'string' },
		start: { type: 'string' },
		out: { type: 'string' },
		base: { type: 'string' },
	},
});
const { site, start, out, base } = values;
if (!site || !start || !out) {
	console.error(
		'Missing arguments. Usage: node scripts/build-pdf.js --site <site dir> --start <docs start path> --out <output file> [--base <live site URL>]',
	);
	process.exit(1);
}
const root = path.resolve(site);

// ES modules and CSS require a correct Content-Type or the browser refuses to load them (this is how MathJax broke)
const mime = {
	'.html': 'text/html',
	'.js': 'text/javascript',
	'.mjs': 'text/javascript',
	'.css': 'text/css',
	'.json': 'application/json',
	'.svg': 'image/svg+xml',
	'.woff2': 'font/woff2',
};

// file:// cannot resolve root-relative assets, so serve the site with a static server
const server = http.createServer((req, res) => {
	let file = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
	if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, 'index.html');
	if (!existsSync(file)) return res.writeHead(404).end();
	res.writeHead(200, { 'content-type': mime[path.extname(file)] ?? 'application/octet-stream' });
	createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const origin = `http://localhost:${server.address().port}`;

const browser = await chromium.launch();
const page = await browser.newPage();

// Sidebar DOM order is the document order, so no need to recompute the sort
await page.goto(origin + start);
const hrefs = await page.$$eval('#docs-nav-body a[href]', (as) => as.map((a) => a.pathname));
const lang = await page.evaluate(() => document.documentElement.lang);
const urls = [...new Set([start, ...hrefs])].filter((u) => u.startsWith(start));

const parts = new Array(urls.length);
let next = 0;
const workers = Array.from(
	{ length: Math.min(urls.length, Math.min(8, Math.max(4, availableParallelism()))) },
	async () => {
		const tab = await browser.newPage({ viewport: { width: 643, height: 900 }, reducedMotion: 'reduce' });
		await tab.emulateMedia({ media: 'print' });
		while (next < urls.length) {
			const i = next++;
			const url = urls[i];
			await tab.goto(origin + url, { waitUntil: 'networkidle' });
			// MathJax typesets asynchronously in a router hook, so networkidle does not mean it has finished
			if (await tab.$('#yore-math-style')) {
				await tab.waitForFunction(() => window.MathJax?.typesetPromise);
				await tab.evaluate(() => window.MathJax.typesetPromise());
			}
			// Charts initialize only when scrolled into view, so visit each one and wait for it to draw
			for (const chart of await tab.locator('[data-module="chart"]').all()) {
				await chart.scrollIntoViewIfNeeded();
				await chart.locator('canvas, svg').first().waitFor();
			}
			const title = await tab.locator('h1').first().innerText();
			const pdf = await PDFDocument.load(await tab.pdf({ preferCSSPageSize: true, printBackground: true }));
			parts[i] = {
				url,
				title,
				pdf,
				names: readDests(pdf),
				depth: url.split('/').length - start.split('/').length,
			};
			console.log(url);
		}
		await tab.close();
	},
);
await Promise.all(workers);

// Chromium emits in-page anchors (footnotes etc.) as named destinations and the name table is lost on merge, so convert them to page numbers and coordinates first
function readDests(doc) {
	const names = new Map();
	const dests = doc.catalog.lookupMaybe(PDFName.of('Dests'), PDFDict);
	const num = (x) => (x instanceof PDFNumber ? x.asNumber() : null);
	for (const [key] of dests?.entries() ?? []) {
		const arr = dests.lookup(key);
		if (!(arr instanceof PDFArray)) continue;
		const page = doc.getPages().findIndex((p) => p.ref === arr.get(0));
		if (page >= 0) names.set(key.decodeText(), { page, left: num(arr.lookup(2)), top: num(arr.lookup(3)) });
	}
	return names;
}

const escape = (s) => s.replace(/[&<>]/g, (c) => `&#${c.charCodeAt(0)};`);
async function renderToc(firstPage) {
	let n = firstPage;
	const rows = parts.map((p) => {
		const row = `<li class="${p.depth <= 1 ? 'chapter' : ''}" style="margin-left:${p.depth * 1.5}em"><a href="${origin + p.url}"><span>${escape(p.title)}</span><span class="dots"></span><span>${n}</span></a></li>`;
		n += p.pdf.getPageCount();
		return row;
	});
	await page.setContent(`<style>
		@page { size: A4; margin: 26mm 20mm 22mm; }
		body { margin: 0; font: 11pt/1.45 'Times New Roman', Times, serif; color: #000; }
		h1 { margin: 0.67in 0 0.4in; font-size: 24.75pt; font-weight: 500; }
		ul { margin: 0; padding: 0; }
		li { list-style: none; break-inside: avoid; padding: 1.5pt 0; }
		li.chapter { margin-top: 10pt; font-weight: bold; }
		a { display: flex; align-items: baseline; color: inherit; text-decoration: none; }
		.dots { flex: 1; margin: 0 0.4em; border-bottom: 1px dotted #000; }
	</style><h1>${lang.startsWith('zh') ? '目錄' : 'Contents'}</h1><ul>${rows.join('')}</ul>`);
	return PDFDocument.load(await page.pdf({ preferCSSPageSize: true }));
}

const toc = await renderToc(1);
const tocPages = toc.getPageCount();

const merged = await PDFDocument.create();
for (const doc of [toc, ...parts.map((p) => p.pdf)]) {
	for (const p of await merged.copyPages(doc, doc.getPageIndices())) merged.addPage(p);
}

const font = await merged.embedFont(StandardFonts.TimesRoman);
merged
	.getPages()
	.slice(tocPages)
	.forEach((p, i) => {
		const text = String(i + 1);
		p.drawText(text, {
			x: (p.getWidth() - font.widthOfTextAtSize(text, 10)) / 2,
			y: p.getHeight() - 47,
			size: 10,
			font,
		});
	});
// pdf-lib has no bookmark API, so /Outlines is written by hand. Titles use hex strings to store CJK text
const { context } = merged;
const pages = merged.getPages();
let pageIdx = tocPages;
const items = parts.map((part) => {
	const ref = context.nextRef();
	const dest = [pages[pageIdx].ref, PDFName.of('Fit')];
	pageIdx += part.pdf.getPageCount();
	return { ref, title: part.title, dest };
});
const outlinesRef = context.nextRef();
items.forEach(({ ref, title, dest }, i) => {
	context.assign(
		ref,
		context.obj({
			Title: PDFHexString.fromText(title),
			Parent: outlinesRef,
			...(i > 0 && { Prev: items[i - 1].ref }),
			...(i < items.length - 1 && { Next: items[i + 1].ref }),
			Dest: dest,
		}),
	);
});
context.assign(
	outlinesRef,
	context.obj({ Type: 'Outlines', First: items[0].ref, Last: items.at(-1).ref, Count: items.length }),
);
merged.catalog.set(PDFName.of('Outlines'), outlinesRef);

// Links point to the build-time localhost and break after merging, so rewrite them as internal PDF jumps
const pdfPages = merged.getPages();
const starts = [];
let offset = tocPages;
for (const part of parts) {
	starts.push(offset);
	offset += part.pdf.getPageCount();
}
const goto = (page, left = null, top = null) =>
	context.obj(
		left === null && top === null ? [pdfPages[page].ref, 'Fit'] : [pdfPages[page].ref, 'XYZ', left, top, null],
	);

pdfPages.forEach((page, i) => {
	const annots = page.node.Annots();
	const k = starts.findLastIndex((start) => start <= i);
	for (let j = 0; annots && j < annots.size(); j++) {
		const annot = annots.lookup(j, PDFDict);
		const name = annot.get(PDFName.of('Dest'));
		if (name instanceof PDFName) {
			const dest = parts[k]?.names.get(name.decodeText());
			if (dest) annot.set(PDFName.of('Dest'), goto(starts[k] + dest.page, dest.left, dest.top));
			else annot.delete(PDFName.of('Dest'));
			continue;
		}
		const uri = annot
			.lookupMaybe(PDFName.of('A'), PDFDict)
			?.lookupMaybe(PDFName.of('URI'), PDFString)
			?.decodeText();
		if (!uri?.startsWith(origin)) continue;
		const { pathname, search, hash } = new URL(uri);
		const target = parts.findIndex((part) => part.url === pathname);
		annot.delete(PDFName.of('A'));
		if (target >= 0) {
			const dest = parts[target].names.get(decodeURIComponent(hash.slice(1)));
			annot.set(
				PDFName.of('Dest'),
				dest ? goto(starts[target] + dest.page, dest.left, dest.top) : goto(starts[target]),
			);
		} else if (base) {
			// Pages outside the docs are not in the PDF, so point them back to the live URL
			annot.set(
				PDFName.of('A'),
				context.obj({ S: 'URI', URI: PDFString.of(new URL(pathname + search + hash, base).href) }),
			);
		}
	}
});

await writeFile(out, await merged.save());

await browser.close();
server.close();
