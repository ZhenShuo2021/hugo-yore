import { once } from '../../core/js/utils.js';
import * as params from '@params';

const searchJS = params.searchJS;
const searchCSS = params.searchCSS;
const triggers = document.querySelectorAll('#pf-custom-icon-mobile, #pf-custom-icon-desktop');

// no-op when lazy loading is disabled, the modal is then expected to be loaded elsewhere
let loadSearch = async () => {};

// lazy load on load or interaction trigger
if (searchJS && searchCSS) {
	const MODAL_TIMEOUT = 8000;
	const RETRY_COOLDOWN = 10000;
	let retryAfter = 0;

	loadSearch = once(async () => {
		const css = Object.assign(document.createElement('link'), {
			rel: 'stylesheet',
			href: searchCSS,
		});
		const cssReady = new Promise((ok, fail) => {
			css.onload = ok;
			css.onerror = fail;
		});
		document.head.append(css);
		try {
			await Promise.all([import(searchJS), cssReady]);
			await Promise.race([
				customElements.whenDefined('pagefind-modal'),
				new Promise((_, fail) => setTimeout(fail, MODAL_TIMEOUT, new Error('pagefind-modal not defined'))),
			]);
		} catch (err) {
			css.remove();
			throw err;
		}
	});

	// passive triggers never throw, and back off after a failure
	const safeLoad = () => {
		if (Date.now() < retryAfter) return;
		loadSearch().catch(() => {
			retryAfter = Date.now() + RETRY_COOLDOWN;
		});
	};

	if (!navigator.connection?.saveData) {
		const preload = () => setTimeout(() => loadSearch().catch(() => {}), 5000);
		document.readyState === 'complete' ? preload() : addEventListener('load', preload, { once: true });
	}

	triggers.forEach((el) => {
		['pointerover', 'focus', 'touchstart'].forEach((type) =>
			el.addEventListener(type, safeLoad, { passive: true }),
		);
	});
}

// explicit triggers always retry, only the latest intent opens the modal
let openTicket = 0;
const openSearch = async () => {
	const ticket = ++openTicket;
	try {
		await loadSearch();
	} catch {
		return;
	}
	if (ticket !== openTicket) return;
	document.querySelector('pagefind-modal')?.open?.();
};

const onOpen = (e) => {
	if (e.type === 'keydown') {
		if (e.repeat || e.isComposing) return;
		if (!(e.metaKey || e.ctrlKey) || e.shiftKey || e.altKey || e.key?.toLowerCase() !== 'k') return;
		if (document.activeElement?.closest('input, textarea, [contenteditable]')) return;
		e.preventDefault();
	}
	openSearch();
};

triggers.forEach((el) => el.addEventListener('click', onOpen));
document.addEventListener('keydown', onOpen);
