import { utils } from './utils.js';

const STORAGE_KEY = 'a11ySettings';

const FEATURES = {
	underlineLinks: {
		default: false,
		apply: (enabled) => {
			const existing = document.getElementById('a11y-underline-links');
			if (enabled && !existing) {
				const style = document.createElement('style');
				style.id = 'a11y-underline-links';
				style.textContent = `a { text-decoration: underline !important; }`;
				document.head.appendChild(style);
			} else if (!enabled && existing) {
				existing.remove();
			}
		},
	},

	disableBackgroundImages: {
		default: false,
		apply: (enabled) => {
			const image = document.getElementById('hero-image');
			if (image) {
				image.style.display = enabled ? 'none' : '';
			}
		},
	},
};

let settings = null;

function getSettings() {
	if (settings) return settings;
	const defaults = Object.fromEntries(Object.entries(FEATURES).map(([key, config]) => [key, config.default]));
	const saved = utils.storage.get(STORAGE_KEY, {});
	settings = { ...defaults, ...saved };
	return settings;
}

function updateSetting(key, value) {
	const current = getSettings();
	current[key] = value;
	utils.storage.set(STORAGE_KEY, current);
	FEATURES[key]?.apply(value);
}

function initPanel(panelId) {
	const current = getSettings();

	Object.entries(FEATURES).forEach(([key, config]) => {
		const element = document.getElementById(key);

		if (element) {
			if (element.type === 'checkbox') {
				element.checked = current[key];
				element.onchange = (e) => updateSetting(key, e.target.checked);
			} else if (element.tagName === 'SELECT') {
				element.value = current[key];
				element.onchange = (e) => updateSetting(key, e.target.value);
			}
		}
	});

	function togglePanel() {
		const panel = document.getElementById(panelId);
		const overlay = document.getElementById('a11y-overlay');
		const toggles = document.querySelectorAll('[id$="a11y-toggle"]');

		if (!panel || !overlay) return;

		const isHidden = overlay.classList.contains('hidden');
		overlay.classList.toggle('hidden');
		panel.classList.toggle('hidden');

		toggles.forEach((t) => {
			t.setAttribute('aria-pressed', String(isHidden));
			t.setAttribute('aria-expanded', String(isHidden));
		});
	}

	document.querySelectorAll('[id$="a11y-toggle"]').forEach((btn) => (btn.onclick = togglePanel));

	const close = document.getElementById('a11y-close');
	const overlay = document.getElementById('a11y-overlay');

	if (close) close.onclick = togglePanel;
	if (overlay) overlay.onclick = (e) => e.target === overlay && togglePanel();

	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape') {
			const overlay = document.getElementById('a11y-overlay');
			if (overlay && !overlay.classList.contains('hidden')) {
				togglePanel();
			}
		}
	});
}

function applyAll() {
	const current = getSettings();
	Object.entries(current).forEach(([key, value]) => {
		FEATURES[key]?.apply(value);
	});
}

function init() {
	applyAll();
	const panel = document.getElementById('a11y-panel');
	if (panel) initPanel(panel.id);
}

if (window._a11yDisableImages) {
	new MutationObserver(() => {
		const img = document.getElementById('background-image');
		if (img) img.style.display = 'none';
	}).observe(document, { childList: true, subtree: true });
}

init();

export const a11yPanel = {
	getSettings,
	updateSetting,
	addFeature: (name, config) => {
		FEATURES[name] = config;
		FEATURES[name].apply(getSettings()[name] || config.default);
	},
};
