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

function setCollapsed(nav, pageUid, collapsed) {
	const btn = nav.querySelector(`a[data-section-trigger][data-page-uid="${pageUid}"]`);
	const list = nav.querySelector(`[data-section-list][data-page-uid="${pageUid}"]`);
	if (!btn || !list) return;
	btn.classList.toggle('is-collapsed', collapsed);
	btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
	list.classList.toggle('is-collapsed', collapsed);

	// Write into state
	const state = getStoredState();
	if (!state.collapsed) state.collapsed = {};
	state.collapsed[pageUid] = collapsed;
	saveState(state);
}

// --- Features ---

function collapseOtherSiblings(nav, btn) {
	nav.querySelectorAll(`[data-parent-page-uid="${btn.dataset.parentPageUid}"]`).forEach((sibling) => {
		if (sibling === btn) return;
		if (!sibling.classList.contains('is-collapsed')) {
			setCollapsed(nav, sibling.dataset.pageUid, true);
		}
	});
}

function initCollapseToggle(nav) {
	nav.addEventListener('click', (e) => {
		const btn = e.target.closest('a[data-section-trigger]');
		if (!btn) return;
		e.preventDefault();
		e.stopPropagation();
		const willExpand = btn.classList.contains('is-collapsed');
		if (willExpand && params.autoCollapseCategories) collapseOtherSiblings(nav, btn);
		setCollapsed(nav, btn.dataset.pageUid, !willExpand);
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
