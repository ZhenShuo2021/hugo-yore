import delegateEvent from 'delegate-it';
import * as CookieConsent from '../../lib/cookieconsent/cookieconsent.esm.js';
import { enabledCategories as enabledCategoriesParam, hasSwitcher } from '@params';
import userConfig from './config.js';

declare global {
	interface Window {
		CookieConsent: typeof CookieConsent;
	}
}

interface Section {
	title?: string;
	description?: string;
	linkedCategory?: string;
}

interface Translation {
	preferencesModal: { sections: Section[] };
}

interface CategoryConfig {
	enabled?: boolean;
	readOnly?: boolean;
	autoClear?: { cookies: { name: RegExp }[] };
}

const scriptEl = document.getElementById('cookie-consent-script') as HTMLElement;
const lang = scriptEl.dataset.lang ?? '';
const translationURL = scriptEl.dataset.translationUrl ?? '';

const _categoryDefaults: Record<string, CategoryConfig> = {
	necessary: { enabled: true, readOnly: true },
	functional: { autoClear: { cookies: [{ name: /^yore-/ }] } },
	analytics: { autoClear: { cookies: [{ name: /^(_ga|_gid)/ }] } },
};

const enabledCategories = enabledCategoriesParam ?? [];

const categories: Record<string, CategoryConfig> = {};
for (const name of enabledCategories) {
	categories[name] = _categoryDefaults[name] ?? {};
}

function addCategory({
	name,
	categoryConfig = {},
	section = {},
}: {
	name: string;
	categoryConfig?: CategoryConfig;
	section?: { title?: string; description?: string };
}): void {
	categories[name] = categoryConfig;

	if (!section.title && !section.description) return;

	const sections = translation!.preferencesModal.sections;
	const existingIndex = sections.findIndex((s) => s.linkedCategory === name);
	const newSection: Section = { ...section, linkedCategory: name };

	if (existingIndex !== -1) {
		sections[existingIndex] = newSection;
	} else {
		sections.push(newSection);
	}
}

function syncDarkMode(isDark: boolean): void {
	document.documentElement.classList.toggle('cc--darkmode', isDark);
}

function waitForCSS(link: HTMLLinkElement | null): Promise<void> {
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

syncDarkMode(document.documentElement.getAttribute('data-theme') === 'dark');

if (hasSwitcher) {
	window.addEventListener('appearance-changed', (e: Event) => {
		syncDarkMode((e as CustomEvent<{ appearance: string }>).detail.appearance === 'dark');
	});
}

window.CookieConsent = CookieConsent;

delegateEvent('[data-cookie-settings]', 'click', () => CookieConsent.show(true));

let translation: Translation | undefined;
const translationPromise = fetch(translationURL, { priority: 'low' }).then(
	(r) => r.json() as Promise<Translation>,
);
const cssPromise = waitForCSS(document.getElementById('cc-css') as HTMLLinkElement | null);

void Promise.all([translationPromise, cssPromise]).then(([json]) => {
	translation = json;

	const generalSections = translation.preferencesModal.sections.filter((s) => !s.linkedCategory);
	const categorySections = enabledCategories
		.map((name) => translation!.preferencesModal.sections.find((s) => s.linkedCategory === name))
		.filter((s): s is Section => Boolean(s));

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
	void CookieConsent.run(config);
});
