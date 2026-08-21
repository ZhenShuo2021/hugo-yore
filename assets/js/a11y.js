import { utils } from './utils.js';

const STORAGE_KEY = 'yore-a11ySettings';

// Capture the CSS-defined base font size, bypassing any inline override set by the critical script
const _inlineFontSize = document.documentElement.style.fontSize;
document.documentElement.style.fontSize = '';
const baseFontSizePx = parseFloat(getComputedStyle(document.documentElement).fontSize);
document.documentElement.style.fontSize = _inlineFontSize;

const tmp = document.createElement('div');
tmp.style.cssText = 'font-size:medium;position:absolute;visibility:hidden';
document.head.appendChild(tmp);
const browserDefaultPx = parseFloat(getComputedStyle(tmp).fontSize);
tmp.remove();

const FEATURES = {
	underlineLinks: {
		default: false,
		apply: (enabled) => {
			if (enabled) {
				document.documentElement.setAttribute('data-a11y-link-underline', 'true');
			} else {
				document.documentElement.removeAttribute('data-a11y-link-underline');
			}
			utils.storage.setRaw('yore-link-underline', enabled);
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
			utils.storage.setRaw('yore-high-contrast', enabled);
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
			utils.storage.setRaw('yore-reduce-motion', enabled);
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
			utils.storage.setRaw('yore-reduce-transparency', enabled);

			const image = document.getElementById('hero-image');
			if (image) {
				image.style.display = enabled ? 'none' : '';
			}
		},
	},

	fontSize: {
		default: 0, // offset from base: -2, -1, 0, 1, 2
		apply: (level) => {
			if (level === 0) {
				document.documentElement.style.fontSize = '';
				utils.storage.remove('yore-a11yFontSize');
			} else {
				const pct = ((baseFontSizePx + level * 4) / browserDefaultPx) * 100;
				const value = `${pct}%`;
				document.documentElement.style.fontSize = value;
				utils.storage.setRaw('yore-a11yFontSize', value);
			}
		},
		initUI: (key, currentLevel) => {
			const updateDots = (level) => {
				document.querySelectorAll('.font-size-dot').forEach((dot) => {
					dot.classList.toggle('active', Number(dot.dataset.level) === level);
				});
				const decreaseBtn = document.getElementById('font-size-decrease');
				const increaseBtn = document.getElementById('font-size-increase');
				if (decreaseBtn) decreaseBtn.disabled = level <= -2;
				if (increaseBtn) increaseBtn.disabled = level >= 2;
			};

			const decreaseBtn = document.getElementById('font-size-decrease');
			const increaseBtn = document.getElementById('font-size-increase');

			if (decreaseBtn) {
				decreaseBtn.onclick = () => {
					const level = getSettings().fontSize;
					if (level > -2) {
						updateSetting(key, level - 1);
						updateDots(level - 1);
					}
				};
			}

			if (increaseBtn) {
				increaseBtn.onclick = () => {
					const level = getSettings().fontSize;
					if (level < 2) {
						updateSetting(key, level + 1);
						updateDots(level + 1);
					}
				};
			}

			updateDots(currentLevel);
		},
	},
};

let settings = null;

function getSettings() {
	if (settings) return settings;
	const defaults = Object.fromEntries(Object.entries(FEATURES).map(([key, config]) => [key, config.default]));
	const saved = utils.storage.get(STORAGE_KEY, {});
	settings = { ...defaults, ...saved };
	settings.fontSize = Number(settings.fontSize) || 0;
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
		if (config.initUI) {
			config.initUI(key, current[key]);
			return;
		}

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
		const toggles = document.querySelectorAll('[id$="a11y-toggle"]');

		if (!panel) return;

		const isClosed = !panel.open;

		if (isClosed) {
			panel.showModal();
		} else {
			panel.close();
		}

		toggles.forEach((t) => {
			t.setAttribute('aria-pressed', String(isClosed));
			t.setAttribute('aria-expanded', String(isClosed));
		});
	}

	document.querySelectorAll('[id$="a11y-toggle"]').forEach((btn) => (btn.onclick = togglePanel));

	const close = document.getElementById('a11y-close');
	const panelEl = document.getElementById(panelId);

	if (close) close.onclick = togglePanel;

	// 點擊 backdrop 關閉：用 mousedown 座標判斷是否落在 dialog 的實際內容框之外
	// （而非用 event.target 比對，避免內部元素的點擊事件冒泡誤判成點了 backdrop）
	if (panelEl) {
		panelEl.addEventListener('mousedown', (e) => {
			const rect = panelEl.getBoundingClientRect();
			const clickedOutside =
				e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom;

			if (clickedOutside && panelEl.open) {
				togglePanel();
			}
		});
	}
}

function applyAll() {
	const current = getSettings();
	Object.entries(current).forEach(([key, value]) => {
		FEATURES[key]?.apply(value);
	});
}

const panel = document.getElementById('a11y-panel');
if (panel) initPanel(panel.id);

if (window._a11yDisableImages) {
	new MutationObserver(() => {
		const img = document.getElementById('background-image');
		if (img) img.style.display = 'none';
	}).observe(document, { childList: true, subtree: true });
}

applyAll();

export const a11yPanel = {
	getSettings,
	updateSetting,
	addFeature: (name, config) => {
		FEATURES[name] = config;
		FEATURES[name].apply(getSettings()[name] || config.default);
	},
};
