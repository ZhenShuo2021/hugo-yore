import { storage } from '../../core/js/utils.js';

const STORAGE_KEY = 'yore-appearance';
const MODES = ['light', 'dark', 'device'];
const root = document.documentElement;
const media = matchMedia('(prefers-color-scheme: dark)');
const dom = {
	footer: document.querySelector('#site-footer'),
	switchers: document.querySelectorAll('#desktop-appearance-switcher, #mobile-appearance-switcher'),
};

function getMode() {
	const mode = root.getAttribute('data-appearance');
	return MODES.includes(mode) ? mode : 'light';
}

function resolveTheme(mode) {
	if (mode === 'device') return media.matches ? 'dark' : 'light';
	return mode;
}

function dispatchAppearanceEvent(isDark) {
	const event = new CustomEvent('appearance-changed', {
		detail: { appearance: isDark ? 'dark' : 'light' },
	});
	window.dispatchEvent(event);
}

function updateLabels(mode) {
	dom.switchers.forEach((el) => {
		const label = el.dataset[`label${mode[0].toUpperCase()}${mode.slice(1)}`];
		if (!label) return;
		el.setAttribute('title', label);
		el.setAttribute('aria-label', label);
	});
}

function applyMode(mode) {
	const theme = resolveTheme(mode);
	root.setAttribute('data-appearance', mode);
	root.setAttribute('data-theme', theme);
	updateLabels(mode);
	dispatchAppearanceEvent(theme === 'dark');
}

// light -> dark -> device -> light
function toggleTheme() {
	const next = MODES[(MODES.indexOf(getMode()) + 1) % MODES.length];
	storage.setRaw(STORAGE_KEY, next);
	applyMode(next);
}

function init() {
	// Page load initialization
	updateLabels(getMode());
	dispatchAppearanceEvent(root.getAttribute('data-theme') === 'dark');

	media.addEventListener('change', () => {
		if (getMode() === 'device') applyMode('device');
	});

	dom.switchers.forEach((el) => {
		el.addEventListener('click', toggleTheme);
		el.addEventListener('contextmenu', (e) => {
			e.preventDefault();
			storage.remove(STORAGE_KEY);
		});
	});
}

const themeManager = { toggle: toggleTheme };

init();
window.themeManager = themeManager;
