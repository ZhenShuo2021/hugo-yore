import * as CookieConsent from '../../lib/cookieconsent/cookieconsent.esm.js';
import * as params from '@params';
import userConfig from './config.js';

const lang = window.__ccLang;
const translationURL = window.__ccTranslationURL;

const _categoryDefaults = {
	necessary: { enabled: true, readOnly: true },
	functional: { autoClear: { cookies: [{ name: /^yore-/ }] } },
	analytics: { autoClear: { cookies: [{ name: /^(_ga|_gid)/ }] } },
};

const enabledCategories = params.enabledCategories || [];

const categories = {};
for (const name of enabledCategories) {
	categories[name] = _categoryDefaults[name] || {};
}

/**
 * Registers a new category and its preferences modal section.
 * Must be called before CookieConsent.run().
 *
 * @param {string} name - Category name; used in data-category attributes
 * @param {object} categoryConfig - vanilla-cookieconsent category config (enabled, readOnly, autoClear, services)
 * @param {object} section - preferencesModal section fields (title, description)
 */
function addCategory({ name, categoryConfig = {}, section = {} }) {
	categories[name] = categoryConfig;

	// No explicit section text. The JSON translation already handles it.
	if (!section.title && !section.description) return;

	const sections = translation.preferencesModal.sections;
	const existingIndex = sections.findIndex((s) => s.linkedCategory === name);
	const newSection = { ...section, linkedCategory: name };

	if (existingIndex !== -1) {
		sections[existingIndex] = newSection;
	} else {
		sections.push(newSection);
	}
}

function syncDarkMode(isDark) {
	document.documentElement.classList.toggle('cc--darkmode', isDark);
}

function waitForCSS(link) {
	if (!link) return Promise.resolve();
	if (link.sheet) {
		link.media = 'all';
		return Promise.resolve();
	}
	return new Promise((resolve) => {
		link.addEventListener(
			'load',
			() => {
				link.media = 'all';
				resolve();
			},
			{ once: true },
		);
		link.addEventListener('error', () => resolve(), { once: true });
	});
}

syncDarkMode(params.isDark);

if (params.hasSwitcher) {
	window.addEventListener('appearance-changed', (e) => {
		syncDarkMode(e.detail.appearance === 'dark');
	});
}

window.CookieConsent = CookieConsent;

let translation;
const translationPromise = fetch(translationURL, { priority: 'low' }).then((r) => r.json());
const cssPromise = waitForCSS(document.getElementById('cc-css'));

Promise.all([translationPromise, cssPromise]).then(([json]) => {
	translation = json;

	const generalSections = translation.preferencesModal.sections.filter((s) => !s.linkedCategory);
	const categorySections = enabledCategories
		.map((name) => translation.preferencesModal.sections.find((s) => s.linkedCategory === name))
		.filter(Boolean);

	translation.preferencesModal.sections = [...generalSections, ...categorySections];

	const config = {
		categories,
		language: {
			default: lang,
			autoDetect: 'document',
			translations: {
				[lang]: translation,
			},
		},
	};

	if (typeof userConfig === 'function') {
		userConfig({ addCategory });
	}
	CookieConsent.run(config);
});
