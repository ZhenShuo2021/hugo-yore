import * as params from '@params';
import { initRovingTabindex } from './docs-nav-a11y';

const NAV_SELECTOR = '.docs-nav';
const STORAGE_KEY_PREFIX = 'yore-docs-nav-state';
const DRAWER_MEDIA = '(min-width: 48em)';

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

function initDrawer() {
	const drawer = document.getElementById('docs-drawer');
	const openBtn = document.getElementById('docs-drawer-open');
	if (!drawer || !openBtn) return;

	const mainEl = document.getElementById('main-content');

	// Browsers without the Popover API: the drawer is opened with inline styles instead.
	const isNativePopover = typeof drawer.showPopover === 'function';
	const home = { parent: drawer.parentNode, next: drawer.nextSibling };
	let fallbackOpen = false;
	let fallbackBackdrop = null;
	let savedStyleAttr = null;

	function showFallback() {
		savedStyleAttr = drawer.getAttribute('style');

		fallbackBackdrop = document.createElement('div');
		Object.assign(fallbackBackdrop.style, {
			position: 'fixed',
			top: '0',
			right: '0',
			bottom: '0',
			left: '0',
			zIndex: '2147483646',
			background: 'rgba(0, 0, 0, 0.5)',
		});
		fallbackBackdrop.style.background = 'var(--backdrop)';

		// Emulate the top layer: attach to body so no ancestor can clip or stack over it
		document.body.appendChild(fallbackBackdrop);
		document.body.appendChild(drawer);

		Object.assign(drawer.style, {
			display: 'flex',
			position: 'fixed',
			top: '0',
			bottom: '0',
			insetInlineStart: '0',
			width: `${Math.min(384, window.innerWidth * 0.8)}px`,
			maxWidth: '80vw',
			height: 'auto',
			maxHeight: 'none',
			margin: '0',
			border: '0',
			transform: 'none',
			zIndex: '2147483647',
		});
		fallbackOpen = true;
	}

	function hideFallback() {
		if (savedStyleAttr === null) drawer.removeAttribute('style');
		else drawer.setAttribute('style', savedStyleAttr);

		if (home.parent) {
			const next = home.next && home.next.parentNode === home.parent ? home.next : null;
			home.parent.insertBefore(drawer, next);
		}
		if (fallbackBackdrop && fallbackBackdrop.parentNode) {
			fallbackBackdrop.parentNode.removeChild(fallbackBackdrop);
		}
		fallbackBackdrop = null;
		fallbackOpen = false;
	}

	function isDrawerOpen() {
		return isNativePopover ? drawer.matches(':popover-open') : fallbackOpen;
	}

	function openDrawer() {
		isNativePopover ? drawer.showPopover() : showFallback();
		if (mainEl) mainEl.setAttribute('inert', '');
		openBtn.setAttribute('aria-expanded', 'true');
		drawer.focus({ preventScroll: true });
	}

	function closeDrawer() {
		isNativePopover ? drawer.hidePopover() : hideFallback();

		if (mainEl) mainEl.removeAttribute('inert');
		openBtn.setAttribute('aria-expanded', 'false');
		openBtn.focus({ preventScroll: true });
	}

	openBtn.addEventListener('click', () => {
		if (isDrawerOpen()) {
			closeDrawer();
		} else {
			openDrawer();
		}
	});

	document.addEventListener('click', (e) => {
		if (!isDrawerOpen()) return;
		if (drawer.contains(e.target) || e.target.closest('#docs-drawer-open')) return;
		closeDrawer();
	});

	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && isDrawerOpen()) closeDrawer();
	});

	const mql = matchMedia(DRAWER_MEDIA);
	const onMediaChange = (e) => {
		if (e.matches && isDrawerOpen()) closeDrawer();
	};
	mql.addEventListener('change', onMediaChange);
}

// --- Init ---

function init() {
	if (document.documentElement.getAttribute('data-page-type') !== 'docs') return;

	initDrawer();

	const nav = document.querySelector(NAV_SELECTOR);
	if (!nav) return;

	initCollapseToggle(nav);
	initScrollPersist();
	initRovingTabindex(nav);
}

init();
