// See .claude/skills/yore-js/SKILL.md
const hooks = new Set();
let cleanups = [];

// Registers a hook at the top level of a feature file
export function registerRouteHook(fn, { signal } = {}) {
	if (signal?.aborted) return;
	hooks.add(fn);
	if (process.env.NODE_ENV !== 'production') console.debug('yore: route hook', fn);
	signal?.addEventListener('abort', () => hooks.delete(fn), { once: true });
}

// Called by main.js before the old content is replaced
export function runRouteCleanups() {
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

// Called by main.js on load and after the new content is in place
export function runRouteHooks() {
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
		console.debug(`yore: route hooks ${hooks.size}, cleanups ${cleanups.length}, ${(performance.now() - start).toFixed(1)}ms`);
	}
}
