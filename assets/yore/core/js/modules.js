// See .claude/skills/yore-js/SKILL.md
const registry = new Map();
const mounted = new WeakMap();
const SELECTOR = '[data-module]';

// Registers a module at the top level of a feature file. A name can be defined only once
export function defineModule(name, fn) {
	if (registry.has(name)) throw new Error(`yore: module "${name}" is already defined`);
	registry.set(name, fn);
	if (process.env.NODE_ENV !== 'production') console.debug('yore: define', name, fn);
}

// Runs every module named on the element, in order. A failing module is logged and does not stop the others
async function mountModule(el) {
	if (mounted.has(el)) return;
	const ctrl = new AbortController();
	const cleanups = [];
	mounted.set(el, { ctrl, cleanups });

	for (const name of el.dataset.module.split(/\s+/).filter(Boolean)) {
		try {
			let fn = registry.get(name);
			if (!fn && el.dataset.moduleSrc) fn = (await import(el.dataset.moduleSrc)).default;
			if (typeof fn !== 'function') {
				console.warn(`yore: module "${name}" is not defined`);
				continue;
			}
			// The element left the document while the module was loading
			if (ctrl.signal.aborted) return;
			if (process.env.NODE_ENV !== 'production') console.debug('yore: mount', name, el);
			const cleanup = await fn(el, { signal: ctrl.signal });
			// A [data-module] element without this attribute failed or is still loading
			if (process.env.NODE_ENV !== 'production') el.dataset.moduleMounted = `${el.dataset.moduleMounted ?? ''} ${name}`.trim();
			if (typeof cleanup !== 'function') continue;
			if (ctrl.signal.aborted) cleanup();
			else cleanups.push(cleanup);
		} catch (e) {
			console.error(`yore: module "${name}" failed`, e);
		}
	}
}

// Aborts the signal first so listeners are removed, then runs the cleanup functions the modules returned
function unmountModule(el) {
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

// Calls fn for the node itself and for every descendant that carries data-module
function forEachModuleElement(node, fn) {
	if (node.nodeType !== 1) return;
	if (node.matches(SELECTOR)) fn(node);
	node.querySelectorAll(SELECTOR).forEach(fn);
}

// Mounts the elements already in the document, then follows every later insertion and removal
export function startModules() {
	forEachModuleElement(document.documentElement, mountModule);
	new MutationObserver((records) => {
		for (const record of records) {
			// Callbacks see the final DOM, so a node that was moved is connected again and keeps its module
			record.removedNodes.forEach((node) =>
				forEachModuleElement(node, (el) => el.isConnected || unmountModule(el)),
			);
			record.addedNodes.forEach((node) => forEachModuleElement(node, mountModule));
		}
	}).observe(document, { childList: true, subtree: true });
}
