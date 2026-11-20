type Cleanup = () => void;
type ModuleFn = (el: HTMLElement, ctx: { signal: AbortSignal }) => Cleanup | void | Promise<Cleanup | void>;
const registry = new Map<string, ModuleFn>();
const mounted = new WeakMap<HTMLElement, { ctrl: AbortController; cleanups: Cleanup[] }>();
const SELECTOR = '[data-module]';

export function defineModule(name: string, fn: ModuleFn): void {
	if (registry.has(name)) throw new Error(`yore: module "${name}" is already defined`);
	registry.set(name, fn);
	if (process.env.NODE_ENV !== 'production') console.debug('yore: define', name, fn);
}

async function mountModule(el: HTMLElement): Promise<void> {
	if (mounted.has(el)) return;
	const ctrl = new AbortController();
	const cleanups: Cleanup[] = [];
	mounted.set(el, { ctrl, cleanups });

	for (const name of (el.dataset.module ?? '').split(/\s+/).filter(Boolean)) {
		try {
			let fn: ModuleFn | undefined = registry.get(name);
			if (!fn && el.dataset.moduleSrc)
				fn = ((await import(el.dataset.moduleSrc)) as { default: ModuleFn }).default;
			if (typeof fn !== 'function') {
				console.warn(`yore: module "${name}" is not defined`);
				continue;
			}

			if (ctrl.signal.aborted) return;
			if (process.env.NODE_ENV !== 'production') console.debug('yore: mount', name, el);
			const cleanup = await fn(el, { signal: ctrl.signal });

			if (process.env.NODE_ENV !== 'production')
				el.dataset.moduleMounted = `${el.dataset.moduleMounted ?? ''} ${name}`.trim();
			if (typeof cleanup !== 'function') continue;
			if (ctrl.signal.aborted) cleanup();
			else cleanups.push(cleanup);
		} catch (e) {
			console.error(`yore: module "${name}" failed`, e);
		}
	}
}

function unmountModule(el: HTMLElement): void {
	const record = mounted.get(el);
	if (!record) return;
	mounted.delete(el);
	if (process.env.NODE_ENV !== 'production') {
		console.debug('yore: unmount', el);
		delete el.dataset.moduleMounted;
	}
	record.ctrl.abort();
	record.cleanups.forEach((fn) => {
		try {
			fn();
		} catch (e) {
			console.error(e);
		}
	});
}

function forEachModuleElement(node: Node, fn: (el: HTMLElement) => void): void {
	if (node.nodeType !== 1) return;
	if (!(node instanceof HTMLElement)) return;
	if (node.matches(SELECTOR)) fn(node);
	node.querySelectorAll<HTMLElement>(SELECTOR).forEach(fn);
}

export function startModules(): void {
	forEachModuleElement(document.documentElement, mountModule);
	new MutationObserver((records: MutationRecord[]) => {
		for (const record of records) {
			record.removedNodes.forEach((node) =>
				forEachModuleElement(node, (el: HTMLElement) => el.isConnected || unmountModule(el)),
			);
			record.addedNodes.forEach((node) => forEachModuleElement(node, mountModule));
		}
	}).observe(document, { childList: true, subtree: true });
}
