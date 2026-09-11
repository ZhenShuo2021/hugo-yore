import * as params from '@params';

const storage = {
	get: (key, fallback = null) => {
		try {
			const value = localStorage.getItem(key);
			return value !== null ? JSON.parse(value) : fallback;
		} catch (e) {
			console.warn(`utils.js: Failed to get "${key}" from localStorage:`, e);
			return fallback;
		}
	},

	set: (key, value) => {
		try {
			localStorage.setItem(key, JSON.stringify(value));
			return true;
		} catch (e) {
			console.warn(`utils.js: Failed to set "${key}" in localStorage:`, e);
			return false;
		}
	},

	remove: (key) => {
		try {
			localStorage.removeItem(key);
			return true;
		} catch (e) {
			console.warn(`utils.js: Failed to remove "${key}" from localStorage:`, e);
			return false;
		}
	},

	getRaw: (key) => {
		try {
			return localStorage.getItem(key);
		} catch (e) {
			console.warn(`utils.js: Failed to get raw "${key}" from localStorage:`, e);
			return null;
		}
	},

	setRaw: (key, value) => {
		try {
			localStorage.setItem(key, value);
			return true;
		} catch (e) {
			console.warn(`utils.js: Failed to set raw "${key}" in localStorage:`, e);
			return false;
		}
	},
};

function debounce(fn, delay) {
	let timeoutId;
	return (...args) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn(...args), delay);
	};
}

const _consentCallbacks = [];
let _consentCategories = null;

const consent = {
	isGranted: (category = 'functional') => _consentCategories?.includes(category) ?? false,
	onReady: (fn) => {
		if (_consentCategories !== null) {
			fn();
			return;
		}
		_consentCallbacks.push(fn);
	},
};

if (!params.cookieConsent) {
	_consentCategories = new Proxy([], {
		has: () => true,
		get: (t, p) => (p === 'includes' ? () => true : t[p]),
	});
	_consentCallbacks.splice(0).forEach((fn) => fn());
} else {
	window.addEventListener(
		'cc:onConsent',
		({ detail }) => {
			_consentCategories = detail.cookie.categories;
			_consentCallbacks.splice(0).forEach((fn) => fn());
		},
		{ once: true },
	);
}

function prefersReducedMotion() {
	return (
		window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
		utils.storage.getRaw('yore-reduce-motion') === 'true'
	);
}

export const utils = {
	storage,
	debounce,
	prefersReducedMotion,
	consent,
	params,
};
