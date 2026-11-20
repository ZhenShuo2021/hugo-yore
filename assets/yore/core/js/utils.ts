import * as params from '@params';

export { params };

export const storage = {
	get: <T = unknown>(key: string, fallback: T | null = null): T | null => {
		try {
			const value = localStorage.getItem(key);
			return value !== null ? (JSON.parse(value) as T) : fallback;
		} catch (e) {
			console.warn(`utils.js: Failed to get "${key}" from localStorage:`, e);
			return fallback;
		}
	},
	set: (key: string, value: unknown): boolean => {
		try {
			localStorage.setItem(key, JSON.stringify(value));
			return true;
		} catch (e) {
			console.warn(`utils.js: Failed to set "${key}" in localStorage:`, e);
			return false;
		}
	},
	remove: (key: string): boolean => {
		try {
			localStorage.removeItem(key);
			return true;
		} catch (e) {
			console.warn(`utils.js: Failed to remove "${key}" from localStorage:`, e);
			return false;
		}
	},
	getRaw: (key: string): string | null => {
		try {
			return localStorage.getItem(key);
		} catch (e) {
			console.warn(`utils.js: Failed to get raw "${key}" from localStorage:`, e);
			return null;
		}
	},
	setRaw: (key: string, value: string): boolean => {
		try {
			localStorage.setItem(key, value);
			return true;
		} catch (e) {
			console.warn(`utils.js: Failed to set raw "${key}" in localStorage:`, e);
			return false;
		}
	},
};

export const meta = (name: string): string | undefined =>
	(document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`) ?? undefined)?.content;

export const once = <T>(fn: () => Promise<T>): (() => Promise<T>) => {
	let p: Promise<T> | undefined;
	return () =>
		(p ??= fn().catch((err: unknown) => {
			p = undefined;
			return Promise.reject(err);
		}));
};

export function prefersReducedMotion(): boolean {
	return (
		window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
		storage.getRaw('yore-reduce-motion') === 'true'
	);
}
