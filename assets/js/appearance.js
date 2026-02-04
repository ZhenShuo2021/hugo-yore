import { utils } from './utils.js';

const STORAGE_KEY = 'appearance';
const dom = {
	footer: document.querySelector('#site-footer'),
	switchers: document.querySelectorAll('#desktop-appearance-switcher, #mobile-appearance-switcher'),
};

function dispatchAppearanceEvent(isDark) {
	const event = new CustomEvent('appearance-changed', {
		detail: { appearance: isDark ? 'dark' : 'light' },
	});
	window.dispatchEvent(event);
}

function toggleTheme() {
	const currentTheme = document.documentElement.getAttribute('data-theme');
	const isDark = currentTheme !== 'dark';
	const themeValue = isDark ? 'dark' : 'light';

	document.documentElement.setAttribute('data-theme', themeValue);
	utils.storage.setRaw(STORAGE_KEY, themeValue);
	dispatchAppearanceEvent(isDark);
}

function init() {
	// Page load initialization
	const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
	dispatchAppearanceEvent(isDark);

	dom.switchers.forEach((el) => {
		el.addEventListener('click', toggleTheme);
		el.addEventListener('contextmenu', (e) => {
			e.preventDefault();
			utils.storage.remove(STORAGE_KEY);
		});
	});
}

init();
export const themeManager = { toggle: toggleTheme };
