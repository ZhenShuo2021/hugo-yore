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

export const utils = {
	storage,
	debounce,
};
