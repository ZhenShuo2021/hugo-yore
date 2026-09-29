import * as params from '@params';

export { params };

export const storage = {
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

export const meta = (name) => document.querySelector(`meta[name="${name}"]`)?.content;

export const once = (fn) => {
	let p;
	return () => (p ??= fn().catch((err) => ((p = undefined), Promise.reject(err))));
};

export function prefersReducedMotion() {
	return (
		window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
		storage.getRaw('yore-reduce-motion') === 'true'
	);
}
