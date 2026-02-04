import Fuse from '../lib/fuse/fuse.min.mjs';
import { utils } from './utils.js';

export const SearchModule = (() => {
	const dom = {
		showButtonDesktop: document.querySelector('#desktop-search-button'),
		showButtonMobile: document.querySelector('#mobile-search-button'),
		hideButton: document.querySelector('#close-search-button'),
		wrapper: document.querySelector('#search-wrapper'),
		modal: document.querySelector('#search-modal'),
		input: document.querySelector('#search-query'),
		output: document.querySelector('#search-results'),
	};

	const missingElements = Object.entries(dom)
		.filter(([key, el]) => el === null)
		.map(([key]) => key);

	if (missingElements.length > 0) {
		console.error(`DOM elements not found: ${missingElements.join(', ')}`);
		return {};
	}

	const state = {
		fuse: null,
		searchVisible: false,
		indexed: false,
		hasResults: false,
		lastActiveElement: null,
		fetchPromise: null,
		indexPromise: null,
	};

	const KEYS = {
		SLASH: '/',
		K: 'k',
		ESCAPE: 'Escape',
		ARROW_DOWN: 'ArrowDown',
		ARROW_UP: 'ArrowUp',
		ENTER: 'Enter',
	};

	// Utilities
	const isInputField = (el) => ['INPUT', 'TEXTAREA'].includes(el?.tagName) || el?.isContentEditable;

	// Plainify HTML
	const stripHtml = (html) => (html || '').replace(/<[^>]*>?/gm, '');

	function findLongestMatch(indices) {
		if (!indices.length) return null;
		return indices.reduce(
			(longest, [start, end]) => {
				const length = end - start + 1;
				const longestLength = longest.end - longest.start + 1;
				return length > longestLength ? { start, end } : longest;
			},
			{ start: indices[0][0], end: indices[0][1] },
		);
	}

	function getContext(text, indices, contextLength = 80) {
		if (!indices.length) return text;

		const longestMatch = findLongestMatch(indices);
		const start = Math.max(0, longestMatch.start - contextLength);
		const end = Math.min(text.length, longestMatch.end + 1 + contextLength);

		const snippet = text.substring(start, end);
		return (start > 0 ? '...' : '') + snippet + (end < text.length ? '...' : '');
	}

	// Search Display
	async function showSearch() {
		if (state.searchVisible) return;

		state.lastActiveElement = document.activeElement;
		document.body.style.overflow = 'hidden';
		dom.wrapper.style.visibility = 'visible';
		dom.input.focus();
		state.searchVisible = true;

		if (!state.indexed) await buildIndex();
	}

	function hideSearch() {
		if (!state.searchVisible) return;

		document.body.style.overflow = 'visible';
		dom.wrapper.style.visibility = 'hidden';
		dom.input.value = '';
		dom.output.innerHTML = '';
		state.searchVisible = false;
		state.hasResults = false;

		if (state.lastActiveElement) state.lastActiveElement.focus();
	}

	// Data Fetching
	async function fetchData() {
		if (state.fetchPromise) return state.fetchPromise;

		state.fetchPromise = (async () => {
			const baseURL = (dom.wrapper.getAttribute('data-url') || '').replace(/\/?$/, '/');
			try {
				const response = await fetch(`${baseURL}fuse-search.json`);
				if (!response.ok) throw new Error('Index fetch failed');
				return await response.json();
			} catch (error) {
				console.error('Search fetch error:', error);
				state.fetchPromise = null;
				throw error;
			}
		})();

		return state.fetchPromise;
	}

	// Index Building
	async function buildIndex() {
		if (state.indexPromise) return state.indexPromise;

		state.indexPromise = (async () => {
			try {
				const data = await fetchData();

				// Validate JSON structure
				if (Array.isArray(data) && data.length > 0) {
					const requiredKeys = ['title', 'summary', 'content', 'permalink'];
					requiredKeys.forEach((key) => {
						if (!(key in data[0])) {
							console.warn(`Search JSON format warning: Missing expected key "${key}"`);
						}
					});
				}

				state.fuse = new Fuse(data, {
					isCaseSensitive: false,
					ignoreDiacritics: true,
					includeMatches: true,
					minMatchCharLength: true,
					shouldSort: true,
					findAllMatches: true,
					threshold: 0.15,
					ignoreLocation: true,
					ignoreFieldNorm: false,
					fieldNormWeight: 0.75, // defaults to 1, the lower the value, the smaller impact of a short field matches
					keys: [
						{ name: 'title', weight: 1 },
						{ name: 'summary', weight: 0.8 },
						{ name: 'headings', weight: 0.8 },
						{ name: 'content', weight: 0.4 },
					],
				});
				state.indexed = true;
			} catch (error) {
				console.error('Search index error:', error);
				state.indexPromise = null;
			}
		})();

		return state.indexPromise;
	}

	function executeQuery(term) {
		if (!term.trim() || !state.fuse) {
			dom.output.innerHTML = '';
			state.hasResults = false;
			return [];
		}

		const results = state.fuse.search(term);
		state.hasResults = results.length > 0;

		if (state.hasResults) {
			dom.output.innerHTML = results.map(renderResult).join('');
		} else {
			const noResultMsg = document.documentElement.getAttribute('data-search-no-result');
			dom.output.innerHTML = `
        <div class="py-12 text-center text-muted-foreground">
          ${noResultMsg} <span class="text-foreground font-medium">"${term}"</span>
        </div>`;
		}

		return results;
	}

	function renderResult(result) {
		const title = result.item.title || 'Untitled';
		let description = '';

		const matchesByKey = {};
		if (result.matches) {
			result.matches.forEach((match) => {
				if (!matchesByKey[match.key]) matchesByKey[match.key] = [];
				matchesByKey[match.key].push(match);
			});
		}

		if (matchesByKey.summary) {
			const allIndices = matchesByKey.summary.flatMap((m) => m.indices);
			description = getContext(stripHtml(result.item.summary), allIndices);
		} else if (matchesByKey.content) {
			const allIndices = matchesByKey.content.flatMap((m) => m.indices);
			description = getContext(stripHtml(result.item.content), allIndices);
		} else {
			description = stripHtml(result.item.summary);
		}

		return `
    <li class="my-2">
      <a href="${result.item.permalink}" class="group flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/50 hover:bg-brand/10 focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all duration-200">
        <div class="flex-1 min-w-0">
          <div class="text-base font-semibold text-foreground group-hover:text-brand transition-colors">${title}</div>
          <div class="mt-1.5 text-sm text-muted-foreground line-clamp-2 leading-relaxed">${description}</div>
        </div>
        <svg class="w-5 h-5 text-muted-foreground/40 group-hover:text-brand/60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
        </svg>
      </a>
    </li>`;
	}

	// Keyboard Navigation
	function handleGlobalKeys(event) {
		const isCmdK = (event.metaKey || event.ctrlKey) && event.key === KEYS.K;
		const isSlash = event.key === KEYS.SLASH;

		// Open
		if ((isCmdK || isSlash) && !state.searchVisible && !isInputField(document.activeElement)) {
			event.preventDefault();
			showSearch();
			return;
		}

		// After activate search
		if (state.searchVisible) {
			if (event.key === KEYS.ESCAPE) {
				event.preventDefault();
				hideSearch();
				return;
			}

			const focusable = Array.from(dom.output.querySelectorAll('a'));
			const currentIndex = focusable.indexOf(document.activeElement);

			if (event.key === KEYS.ARROW_DOWN) {
				event.preventDefault();
				if (document.activeElement === dom.input) focusable[0]?.focus();
				else focusable[currentIndex + 1]?.focus();
			} else if (event.key === KEYS.ARROW_UP) {
				event.preventDefault();
				if (document.activeElement === focusable[0]) dom.input.focus();
				else focusable[currentIndex - 1]?.focus();
			} else if (event.key === KEYS.ENTER && document.activeElement === dom.input) {
				event.preventDefault();
				focusable[0]?.click();
			}
		}
	}

	const debouncedExecuteQuery = utils.debounce(async (value) => {
		if (!state.indexed) await buildIndex();
		executeQuery(value);
	}, 300);

	dom.showButtonDesktop.addEventListener('click', showSearch);
	dom.showButtonMobile.addEventListener('click', showSearch);
	dom.hideButton.addEventListener('click', hideSearch);
	dom.wrapper.addEventListener('click', (e) => e.target === dom.wrapper && hideSearch());
	dom.modal.addEventListener('click', (e) => e.stopPropagation());
	dom.input.addEventListener('input', (e) => debouncedExecuteQuery(e.target.value));
	document.addEventListener('keydown', handleGlobalKeys);

	const preloadEnabled = document.documentElement.getAttribute('data-search-preload') === 'true';
	if (preloadEnabled) {
		const run = () => buildIndex();
		setTimeout(() => (window.requestIdleCallback ? requestIdleCallback(run) : run()), 2000);
		dom.showButtonDesktop.addEventListener('mouseenter', run, { once: true });
		dom.showButtonMobile.addEventListener('mouseenter', run, { once: true });
	}

	return { show: showSearch, hide: hideSearch, search: executeQuery };
})();

window.SearchModule = SearchModule;
