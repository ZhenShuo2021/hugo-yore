import config from './sw-config.json';

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

// ─── Install ─────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
	if (IS_LOCAL) return;

	event.waitUntil(
		caches.open(CACHE_VERSIONED).then((cache) => {
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
		event.respondWith(networkFirst(request, CACHE_PAGES));
		return;
	}

	// 2. CSS/JS/lib — Network First, tied to VERSION
	if (
		/\/css\/.*\.css$/i.test(url.pathname) ||
		/\/js\/.*\.(js|mjs|cjs)$/i.test(url.pathname) ||
		/\/lib\/.+/i.test(url.pathname)
	) {
		event.respondWith(networkFirst(request, CACHE_VERSIONED));
		return;
	}

	// 3. Images — Network First, cross-version cache
	if (/\.(png|jpe?g|avif|webp|gif|svg|ico)$/i.test(url.pathname)) {
		event.respondWith(networkFirst(request, CACHE_IMAGES));
		return;
	}

	// 4. CDN third-party resources — Network First, tied to VERSION
	if (CDN_DOMAINS.has(url.hostname)) {
		event.respondWith(networkFirst(request, CACHE_VERSIONED));
		return;
	}
});

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

async function idlePrecacheHtml() {
	const cache = await caches.open(CACHE_PAGES);
	const cached = await cache.keys();
	const cachedUrls = new Set(cached.map((r) => r.url));

	const pending = _BUILD.pages.filter((url) => {
		const abs = new URL(url, self.location.origin).href;
		return !cachedUrls.has(abs);
	});

	if (pending.length === 0) return;

	function scheduleNext(index) {
		if (index >= pending.length) return;
		if (saveData()) return;
		setTimeout(async () => {
			try {
				const response = await fetch(pending[index]);
				if (response.ok) await cache.put(pending[index], response);
			} catch (_) {}
			scheduleNext(index + 1);
		}, 0);
	}

	scheduleNext(0);
}
