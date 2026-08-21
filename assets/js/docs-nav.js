import * as params from '@params';

const NAV_SELECTOR = '.docs-nav';
const STORAGE_KEY_PREFIX = 'yore-docs-nav-state';

// --- State shape ---
// { collapsed: { [sectionId]: boolean }, scroll: number }

function getStorageKey() {
	const aside = document.querySelector('.docs-sidebar-container');
	const docsRoot = aside?.dataset.docsRoot || '';
	return `${STORAGE_KEY_PREFIX}:${docsRoot}`;
}

function getStoredState() {
	try {
		return JSON.parse(sessionStorage.getItem(getStorageKey()) || '{}');
	} catch {
		return {};
	}
}

function saveState(state) {
	try {
		sessionStorage.setItem(getStorageKey(), JSON.stringify(state));
	} catch {}
}

// --- Helpers ---

function setCollapsed(nav, sectionId, collapsed) {
	const btn = nav.querySelector(`[data-section-id="${sectionId}"]`);
	const expander = nav.querySelector(`[data-section-expander="${sectionId}"]`);
	if (!btn || !expander) return;
	btn.classList.toggle('is-collapsed', collapsed);
	btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
	expander.classList.toggle('is-collapsed', collapsed);

	// Write into state
	const state = getStoredState();
	if (!state.collapsed) state.collapsed = {};
	state.collapsed[sectionId] = collapsed;
	saveState(state);
}

// --- Features ---

function collapseOtherSiblings(nav, btn) {
	nav.querySelectorAll(`[data-parent-id="${btn.dataset.parentId}"]`).forEach((sibling) => {
		if (sibling === btn) return;
		if (!sibling.classList.contains('is-collapsed')) {
			setCollapsed(nav, sibling.dataset.sectionId, true);
		}
	});
}

function initCollapseToggle(nav) {
	nav.addEventListener('click', (e) => {
		const btn = e.target.closest('[data-section-id]');
		if (!btn) return;
		e.preventDefault();
		e.stopPropagation();
		const willExpand = btn.classList.contains('is-collapsed');
		if (willExpand && params.autoCollapseCategories) collapseOtherSiblings(nav, btn);
		setCollapsed(nav, btn.dataset.sectionId, !willExpand);
	});
}

// Store scroll on page hide (avoids beforeunload bfcache issues)
function initScrollPersist() {
	const scrollContainer = document.querySelector('.docs-sidebar-container .scrollbar-mask');
	if (!scrollContainer) return;

	const persist = () => {
		const state = getStoredState();
		state.scroll = scrollContainer.scrollTop;
		saveState(state);
	};

	addEventListener('visibilitychange', () => {
		if (document.visibilityState === 'hidden') persist();
	});
	addEventListener('pagehide', persist);
}

// --- Init ---

function init() {
	if (document.documentElement.getAttribute('data-page-type') !== 'docs') return;
	if (!matchMedia('(min-width: 48em)').matches) return;

	const nav = document.querySelector(NAV_SELECTOR);
	if (!nav) return;

	initCollapseToggle(nav);
	initScrollPersist();
}

init();
