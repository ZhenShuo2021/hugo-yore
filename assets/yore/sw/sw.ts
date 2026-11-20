import * as config from '@params';

interface SwEvent extends Event {
	waitUntil: (promise: Promise<unknown>) => void;
}

interface SwFetchEvent extends Event {
	request: Request;
	respondWith: (response: Promise<Response>) => void;
}

interface SwEventMap {
	install: SwEvent;
	activate: SwEvent;
	fetch: SwFetchEvent;
	message: MessageEvent;
}

interface SwScope {
	addEventListener: <K extends keyof SwEventMap>(type: K, listener: (event: SwEventMap[K]) => void) => void;
	location: Location;
	navigator: Navigator & { connection?: NetworkInformation };
	caches: CacheStorage;
}

interface NetworkInformation {
	saveData?: boolean;
	type?: string;
	effectiveType?: string;
}

const swScope = self as unknown as SwScope;

const _BUILD = Object.freeze({
	version: config.version as string,
	cdnDomains: config.cdnDomains as string[],
	precacheHtml: config.precacheHtml as boolean,
	precacheAssets: (config.precacheAssets as string[] | undefined) ?? [],
	pages: config.pages as string[],
});

const VERSION = _BUILD.version;
const CDN_DOMAINS = new Set(_BUILD.cdnDomains);

const CACHE_VERSIONED = `versioned-${VERSION}`;
const CACHE_IMAGES = 'images-v1';
const CACHE_PAGES = `pages-${VERSION}`;

const IS_LOCAL =
	/^(localhost|127\.0\.0\.1|\[::1\]|::1)$/i.test(swScope.location.hostname) ||
	swScope.location.hostname.endsWith('.localhost');

function saveData(): boolean {
	const conn = swScope.navigator?.connection;
	if (!conn) return false;

	if (conn.saveData) return true;
	if (conn.type === 'cellular') return true;

	if (typeof conn.effectiveType === 'string' && /^(slow-2g|2g|3g)$/i.test(conn.effectiveType)) return true;

	return false;
}

let pageLoaded: () => void = () => {};
const PAGE_LOADED = new Promise<void>((resolve) => {
	pageLoaded = resolve;
});
swScope.addEventListener('message', (event) => {
	if (event.data === 'page-loaded') pageLoaded();
});

swScope.addEventListener('install', (event) => {
	if (IS_LOCAL) return;

	event.waitUntil(
		PAGE_LOADED.then(() => caches.open(CACHE_VERSIONED)).then((cache) => {
			return Promise.allSettled(
				_BUILD.precacheAssets.map((url) =>
					fetch(url).then((res) => {
						if (res.ok) void cache.put(url, res);
					}),
				),
			);
		}),
	);
});

swScope.addEventListener('activate', (event) => {
	if (IS_LOCAL) return;

	const keep = new Set([CACHE_VERSIONED, CACHE_IMAGES, CACHE_PAGES]);

	event.waitUntil(
		caches
			.keys()
			.then((keys) => Promise.all(keys.filter((k) => !keep.has(k)).map((k) => caches.delete(k))))
			.then(() => {
				if (_BUILD.precacheHtml && !saveData()) void idlePrecacheHtml();
			}),
	);
});

swScope.addEventListener('fetch', (event) => {
	if (IS_LOCAL) return;

	const { request } = event;
	if (request.method !== 'GET') return;

	const url = new URL(request.url);
	if (!/^https?:$/i.test(url.protocol)) return;

	if (request.headers.get('Accept')?.includes('text/html')) {
		respond(event, CACHE_PAGES);
		return;
	}

	if (
		/\/css\/.*\.css$/i.test(url.pathname) ||
		/\/js\/.*\.(js|mjs|cjs)$/i.test(url.pathname) ||
		/\/lib\/.+/i.test(url.pathname)
	) {
		respond(event, CACHE_VERSIONED);
		return;
	}

	if (/\.(png|jpe?g|avif|webp|gif|svg|ico)$/i.test(url.pathname)) {
		respond(event, CACHE_IMAGES);
		return;
	}

	if (CDN_DOMAINS.has(url.hostname)) {
		respond(event, CACHE_VERSIONED);
		return;
	}
});

let foreground = 0;

function respond(event: SwFetchEvent, cacheName: string): void {
	foreground++;
	event.respondWith(
		networkFirst(event.request, cacheName).finally(() => {
			foreground--;
		}),
	);
}

async function networkFirst(request: Request, cacheName: string): Promise<Response> {
	const cache = await caches.open(cacheName);

	try {
		const response = await fetch(request);
		if (response.ok) void cache.put(request, response.clone());
		return response;
	} catch (err) {
		const cached = await cache.match(request);
		if (cached) return cached;
		throw err;
	}
}

const PRECACHE_CONCURRENCY = 3;
const PRECACHE_BACKOFF_MS = 300;

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

async function idlePrecacheHtml(): Promise<void> {
	const cache = await caches.open(CACHE_PAGES);
	const cached = await cache.keys();
	const cachedUrls = new Set(cached.map((r) => r.url));

	const pending = _BUILD.pages.filter((url) => {
		const abs = new URL(url, swScope.location.origin).href;
		return !cachedUrls.has(abs);
	});

	let next = 0;

	async function worker(): Promise<void> {
		while (next < pending.length) {
			if (saveData()) return;
			if (foreground > 0) {
				await sleep(PRECACHE_BACKOFF_MS);
				continue;
			}
			const url = pending[next++];
			if (url === undefined) return;
			try {
				const response = await fetch(url);
				if (response.ok) await cache.put(url, response);
			} catch {}
		}
	}

	const count = Math.min(PRECACHE_CONCURRENCY, pending.length);
	await Promise.all(Array.from({ length: count }, () => worker()));
}
