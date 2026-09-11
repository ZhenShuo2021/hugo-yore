const POPOVER_POLYFILL_URL = 'https://unpkg.com/@oddbird/popover-polyfill@latest/dist/popover.min.js';
const INVOKERS_POLYFILL_URL = 'https://esm.run/invokers-polyfill';

let popoverPromise;
let invokersPromise;
let bothPromise;

export function ensurePopoverPolyfill() {
	if (!popoverPromise) {
		popoverPromise = (async () => {
			if (!('popover' in HTMLElement.prototype)) {
				await import(POPOVER_POLYFILL_URL);
			}
		})();
	}
	return popoverPromise;
}

export function ensureInvokersPolyfill() {
	if (!invokersPromise) {
		invokersPromise = (async () => {
			if (!('commandForElement' in HTMLButtonElement.prototype)) {
				await import(INVOKERS_POLYFILL_URL);
			}
		})();
	}
	return invokersPromise;
}

export function ensureDialogPolyfills() {
	if (!bothPromise) {
		bothPromise = (async () => {
			try {
				await Promise.all([ensurePopoverPolyfill(), ensureInvokersPolyfill()]);
			} catch (err) {
				console.error('Failed to load dialog/popover polyfill:', err);
			}
		})();
	}
	return bothPromise;
}
