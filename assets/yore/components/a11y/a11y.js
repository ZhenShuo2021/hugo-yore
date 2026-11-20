import { storage } from '../../core/js/utils.js';

const STORAGE_KEY = 'yore-a11ySettings';

let fontMetrics = null;

const LINE_HEIGHTS = [0, 2.25, 2.75];

function announce(text) {
	const status = document.getElementById('a11y-status');
	if (!status || !text) return;
	status.textContent = '';
	setTimeout(() => {
		status.textContent = text;
	}, 50);
	setTimeout(() => {
		status.textContent = '';
	}, 1500);
}

function getFontMetrics() {
	if (fontMetrics) return fontMetrics;

	// Capture the CSS-defined base font size, bypassing any inline override set by the critical script
	const inlineFontSize = document.documentElement.style.fontSize;
	document.documentElement.style.fontSize = '';
	const baseFontSizePx = parseFloat(getComputedStyle(document.documentElement).fontSize);
	document.documentElement.style.fontSize = inlineFontSize;

	const tmp = document.createElement('div');
	tmp.style.cssText = 'font-size:medium;position:absolute;visibility:hidden';
	document.head.appendChild(tmp);
	const browserDefaultPx = parseFloat(getComputedStyle(tmp).fontSize);
	tmp.remove();

	fontMetrics = { baseFontSizePx, browserDefaultPx };
	return fontMetrics;
}

function initCycle(key, btnId, min, max, current) {
	const btn = document.getElementById(btnId);
	if (!btn) return;

	const render = (level, speak) => {
		btn.querySelectorAll('.a11y-levels__dot').forEach((dot) => {
			dot.toggleAttribute('data-active', Number(dot.dataset.level) === level);
		});
		const label = `${btn.dataset.label}, ${level - min + 1} / ${max - min + 1}`;
		btn.setAttribute('aria-label', label);
		if (speak) announce(label);
	};

	btn.onclick = () => {
		const level = getSettings()[key];
		const next = level >= max ? min : level + 1;
		updateSetting(key, next);
		render(next, true);
	};

	render(current, false);
}

const FEATURES = {
	underlineLinks: {
		default: false,
		apply: (enabled) => {
			if (enabled) {
				document.documentElement.setAttribute('data-a11y-link-underline', 'true');
			} else {
				document.documentElement.removeAttribute('data-a11y-link-underline');
			}
			storage.setRaw('yore-link-underline', enabled);
		},
	},

	highContrast: {
		default: false,
		apply: (enabled) => {
			if (enabled) {
				document.documentElement.setAttribute('data-a11y-high-contrast', 'true');
			} else {
				document.documentElement.removeAttribute('data-a11y-high-contrast');
			}
			storage.setRaw('yore-high-contrast', enabled);
		},
	},

	reduceMotion: {
		default: false,
		apply: (enabled) => {
			if (enabled) {
				document.documentElement.setAttribute('data-a11y-reduce-motion', 'true');
			} else {
				document.documentElement.removeAttribute('data-a11y-reduce-motion');
			}
			storage.setRaw('yore-reduce-motion', enabled);
		},
	},

	reduceTransparency: {
		default: false,
		apply: (enabled) => {
			if (enabled) {
				document.documentElement.setAttribute('data-a11y-reduce-transparency', 'true');
			} else {
				document.documentElement.removeAttribute('data-a11y-reduce-transparency');
			}
			storage.setRaw('yore-reduce-transparency', enabled);

			const image = document.getElementById('hero-image');
			if (image) {
				image.style.display = enabled ? 'none' : '';
			}
		},
	},

	lineHeight: {
		default: 0,
		apply: (level) => {
			const value = LINE_HEIGHTS[level];
			const root = document.documentElement;
			if (value) {
				root.setAttribute('data-a11y-line-height', '');
				root.style.setProperty('--a11y-line-height', value);
			} else {
				root.removeAttribute('data-a11y-line-height');
				root.style.removeProperty('--a11y-line-height');
			}
		},
		initUI: (key, level) => initCycle(key, 'line-height-btn', 0, LINE_HEIGHTS.length - 1, level),
	},

	fontSize: {
		default: 0, // offset from base: -2, -1, 0, 1, 2
		apply: (level, initial = false) => {
			if (level === 0) {
				document.documentElement.style.fontSize = '';
				storage.remove('yore-a11yFontSize');
			} else {
				// On initial load the critical script has already applied the stored value inline,
				// so skip the computation (and the forced reflow it would cause).
				if (initial && document.documentElement.style.fontSize) return;

				const { baseFontSizePx, browserDefaultPx } = getFontMetrics();
				const pct = ((baseFontSizePx + level * 4) / browserDefaultPx) * 100;
				const value = `${pct}%`;
				document.documentElement.style.fontSize = value;
				storage.setRaw('yore-a11yFontSize', value);
			}
		},
		initUI: (key, level) => initCycle(key, 'font-size-btn', -2, 2, level),
	},
};

let settings = null;

function getSettings() {
	if (settings) return settings;
	const defaults = Object.fromEntries(Object.entries(FEATURES).map(([key, config]) => [key, config.default]));
	const saved = storage.get(STORAGE_KEY, {});
	settings = { ...defaults, ...saved };
	settings.fontSize = Number(settings.fontSize) || 0;
	settings.lineHeight = Number(settings.lineHeight) || 0;
	return settings;
}

function updateSetting(key, value) {
	const current = getSettings();
	current[key] = value;
	storage.set(STORAGE_KEY, current);
	FEATURES[key]?.apply(value);
}

function initPanel(panelId) {
	const current = getSettings();

	Object.entries(FEATURES).forEach(([key, config]) => {
		if (config.initUI) {
			config.initUI(key, current[key]);
			return;
		}

		const element = document.getElementById(key);

		if (element) {
			if (element.type === 'checkbox') {
				element.checked = current[key];
				element.onchange = (e) => updateSetting(key, e.target.checked);
				element.addEventListener('keydown', (e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
						element.click();
					}
				});
			} else if (element.tagName === 'SELECT') {
				element.value = current[key];
				element.onchange = (e) => updateSetting(key, e.target.value);
			}
		}
	});

	function togglePanel() {
		const panel = document.getElementById(panelId);
		const toggles = document.querySelectorAll('[id$="a11y-toggle"]');

		if (!panel) return;

		const isClosed = !panel.open;

		if (isClosed) {
			panel.showModal();
		} else {
			panel.close();
		}

		toggles.forEach((t) => {
			t.setAttribute('aria-expanded', String(isClosed));
		});
	}

	document.querySelectorAll('[id$="a11y-toggle"]').forEach((btn) => (btn.onclick = togglePanel));

	const close = document.getElementById('a11y-close');
	const panelEl = document.getElementById(panelId);

	if (close) close.onclick = togglePanel;

	// closedby="any" closes on backdrop click and Esc without calling togglePanel, so sync aria-expanded here
	panelEl?.addEventListener('close', () => {
		document.querySelectorAll('[id$="a11y-toggle"]').forEach((t) => t.setAttribute('aria-expanded', 'false'));
	});
}

function applyAll() {
	const current = getSettings();
	Object.entries(current).forEach(([key, value]) => {
		FEATURES[key]?.apply(value, true);
	});
}

function init() {
	const panel = document.getElementById('a11y-panel');
	if (panel) initPanel(panel.id);

	if (window._a11yDisableImages) {
		new MutationObserver(() => {
			const img = document.getElementById('background-image');
			if (img) img.style.display = 'none';
		}).observe(document, { childList: true, subtree: true });
	}

	applyAll();
}

const a11yPanel = {
	getSettings,
	updateSetting,
	addFeature: (name, config) => {
		FEATURES[name] = config;
		FEATURES[name].apply(getSettings()[name] || config.default);
	},
};

init();
window.a11yPanel = a11yPanel;
