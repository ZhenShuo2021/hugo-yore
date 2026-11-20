type Cleanup = () => void;
type RouteHook = () => Cleanup | void;

const hooks = new Set<RouteHook>();
let cleanups: Cleanup[] = [];

export function registerRouteHook(fn: RouteHook, { signal }: { signal?: AbortSignal } = {}): void {
	if (signal?.aborted) return;
	hooks.add(fn);
	if (process.env.NODE_ENV !== 'production') console.debug('yore: route hook', fn);
	signal?.addEventListener('abort', () => hooks.delete(fn), { once: true });
}

export function runRouteCleanups(): void {
	if (process.env.NODE_ENV !== 'production') console.debug('yore: route cleanups', cleanups.length);
	const fns = cleanups;
	cleanups = [];
	fns.forEach((fn) => {
		try {
			fn();
		} catch (e) {
			console.error(e);
		}
	});
}

export function runRouteHooks(): void {
	const start = process.env.NODE_ENV !== 'production' ? performance.now() : 0;
	for (const fn of hooks) {
		try {
			const cleanup = fn();
			if (typeof cleanup === 'function') cleanups.push(cleanup);
		} catch (e) {
			console.error(e);
		}
	}
	if (process.env.NODE_ENV !== 'production') {
		console.debug(
			`yore: route hooks ${hooks.size}, cleanups ${cleanups.length}, ${(performance.now() - start).toFixed(1)}ms`,
		);
	}
}
