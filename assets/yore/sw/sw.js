import config from '@params';

const _BUILD = Object.freeze({
	version: config.version,
	cdnDomains: config.cdnDomains,
	precacheHtml: config.precacheHtml,
	precacheAssets: config.precacheAssets || [],
	pages: config.pages,
});

const VERSION = _BUILD.version;
const CDN_DOMAINS = new Set(_BUILD.cdnDomains);

// Named caches
const CACHE_VERSIONED = `versioned-${VERSION}`; // CSS/JS bundles + CDN, tied to build version
const CACHE_IMAGES = 'images-v1'; // Images: network first, cross-version
const CACHE_PAGES = `pages-${VERSION}`; // HTML pages, populated on visit; precacheHtml adds idle prefetching

const IS_LOCAL =
	/^(localhost|127\.0\.0\.1|\[::1\]|::1)$/i.test(self.location.hostname) ||
	self.location.hostname.endsWith('.localhost');

function saveData() {
	const conn = self.navigator?.connection;
	if (!conn) return false;

	if (conn.saveData) return true;
	if (conn.type === 'cellular') return true;

	if (typeof conn.effectiveType === 'string' && /^(slow-2g|2g|3g)$/i.test(conn.effectiveType)) return true;

	return false;
}

let pageLoaded;
const PAGE_LOADED = new Promise((resolve) => {
	pageLoaded = resolve;
});
self.addEventListener('message', (event) => {
	if (event.data === 'page-loaded') pageLoaded();
});

// ─── Install ─────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
	if (IS_LOCAL) return;

	event.waitUntil(
		PAGE_LOADED.then(() => caches.open(CACHE_VERSIONED)).then((cache) => {
			return Promise.allSettled(
				_BUILD.precacheAssets.map((url) =>
					fetch(url).then((res) => {
						if (res.ok) cache.put(url, res);
					}),
				),
			);
		}),
	);
});

// ─── Activate ────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
	if (IS_LOCAL) return;

	const keep = new Set([CACHE_VERSIONED, CACHE_IMAGES, CACHE_PAGES]);

	event.waitUntil(
		caches
			.keys()
			.then((keys) => Promise.all(keys.filter((k) => !keep.has(k)).map((k) => caches.delete(k))))
			.then(() => {
				if (_BUILD.precacheHtml && !saveData()) idlePrecacheHtml();
			}),
	);
});

// ─── Fetch ───────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
	if (IS_LOCAL) return;

	const { request } = event;
	if (request.method !== 'GET') return;

	const url = new URL(request.url);
	if (!/^https?:$/i.test(url.protocol)) return;

	// 1. HTML — Network First; precache.html only controls proactive idle prefetching
	if (request.headers.get('Accept')?.includes('text/html')) {
		respond(event, CACHE_PAGES);
		return;
	}

	// 2. CSS/JS/lib — Network First, tied to VERSION
	if (
		/\/css\/.*\.css$/i.test(url.pathname) ||
		/\/js\/.*\.(js|mjs|cjs)$/i.test(url.pathname) ||
		/\/lib\/.+/i.test(url.pathname)
	) {
		respond(event, CACHE_VERSIONED);
		return;
	}

	// 3. Images — Network First, cross-version cache
	if (/\.(png|jpe?g|avif|webp|gif|svg|ico)$/i.test(url.pathname)) {
		respond(event, CACHE_IMAGES);
		return;
	}

	// 4. CDN third-party resources — Network First, tied to VERSION
	if (CDN_DOMAINS.has(url.hostname)) {
		respond(event, CACHE_VERSIONED);
		return;
	}
});

// ─── Foreground tracking ─────────────────────────────────────────────────────
// Count requests the user is actually waiting on, so idle precache can back off.
let foreground = 0;

function respond(event, cacheName) {
	foreground++;
	event.respondWith(
		networkFirst(event.request, cacheName).finally(() => {
			foreground--;
		}),
	);
}

// ─── Strategies ──────────────────────────────────────────────────────────────

async function networkFirst(request, cacheName) {
	const cache = await caches.open(cacheName);

	try {
		const response = await fetch(request);
		if (response.ok) cache.put(request, response.clone());
		return response;
	} catch (err) {
		const cached = await cache.match(request);
		if (cached) return cached;
		throw err;
	}
}

// ─── Idle Precache ───────────────────────────────────────────────────────────

const PRECACHE_CONCURRENCY = 3;
const PRECACHE_BACKOFF_MS = 300;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function idlePrecacheHtml() {
	const cache = await caches.open(CACHE_PAGES);
	const cached = await cache.keys();
	const cachedUrls = new Set(cached.map((r) => r.url));

	const pending = _BUILD.pages.filter((url) => {
		const abs = new URL(url, self.location.origin).href;
		return !cachedUrls.has(abs);
	});

	let next = 0;

	// Each worker pulls the next url. It pauses while the user has live requests.
	async function worker() {
		while (next < pending.length) {
			if (saveData()) return;
			if (foreground > 0) {
				await sleep(PRECACHE_BACKOFF_MS);
				continue;
			}
			const url = pending[next++];
			try {
				const response = await fetch(url);
				if (response.ok) await cache.put(url, response);
			} catch (_) {}
		}
	}

	const count = Math.min(PRECACHE_CONCURRENCY, pending.length);
	await Promise.all(Array.from({ length: count }, worker));
}
