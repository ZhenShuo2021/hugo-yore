import * as params from '@params';
import { initRovingTabindex, isCollapsed } from './docs-nav-a11y';
import { registerRouteHook } from '../../core/js/route.js';
import { defineModule } from '../../core/js/modules.js';

const NAV_SELECTOR = '.docs-nav';
const DRAWER_MEDIA = '(min-width: 48em)';

// --- Helpers ---

function applyCollapsed(nav, pageUid, collapsed) {
	const btn = nav.querySelector(`a[data-section-trigger][data-page-uid="${pageUid}"]`);
	if (!btn) return;
	btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
}

function syncActive(nav) {
	nav.querySelectorAll('.docs-nav__link--active').forEach((el) => {
		el.classList.remove('docs-nav__link--active');
		el.removeAttribute('aria-current');
	});
	const active = Array.from(nav.querySelectorAll('a[data-page-uid]')).find(
		(a) => a.pathname === location.pathname,
	);
	if (!active) return;
	active.classList.add('docs-nav__link--active');
	active.setAttribute('aria-current', 'page');

	// Ancestor sections of the current page must be expanded, otherwise users can't tell where they are
	if (active.matches('[data-section-trigger]')) applyCollapsed(nav, active.dataset.pageUid, false);
	for (
		let list = active.closest('[data-section-list]');
		list;
		list = list.parentElement.closest('[data-section-list]')
	) {
		list.previousElementSibling.classList.add('docs-nav__link--active');
		applyCollapsed(nav, list.dataset.pageUid, false);
	}
}

// --- Features ---

function collapseOtherSiblings(nav, btn) {
	nav.querySelectorAll(`[data-parent-page-uid="${btn.dataset.parentPageUid}"]`).forEach((sibling) => {
		if (sibling === btn) return;
		if (!isCollapsed(sibling)) {
			applyCollapsed(nav, sibling.dataset.pageUid, true);
		}
	});
}

function initCollapseToggle(nav) {
	nav.querySelectorAll('a[data-section-trigger]').forEach((btn) => {
		btn.setAttribute('role', 'button');
	});

	nav.addEventListener('click', (e) => {
		const btn = e.target.closest('a[data-section-trigger]');
		if (!btn) return;
		e.preventDefault();
		e.stopPropagation();
		const willExpand = isCollapsed(btn);
		if (willExpand && params.autoCollapseCategories) collapseOtherSiblings(nav, btn);
		applyCollapsed(nav, btn.dataset.pageUid, !willExpand);
	});
}

// The sidebar persists within one docsRoot, so an open drawer would otherwise stay open after navigation
let collapseDrawer;

function initDrawer(signal) {
	const drawer = document.getElementById('docs-drawer');
	// The button lives in the header, which swup replaces on every visit, so it is looked up when used
	const openBtn = () => document.getElementById('docs-drawer-open');
	if (!drawer || !openBtn()) return;

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
		document.getElementById('main-content')?.setAttribute('inert', '');
		openBtn()?.setAttribute('aria-expanded', 'true');
		drawer.focus({ preventScroll: true });
	}

	function closeDrawer() {
		isNativePopover ? drawer.hidePopover() : hideFallback();

		document.getElementById('main-content')?.removeAttribute('inert');
		openBtn()?.setAttribute('aria-expanded', 'false');
		openBtn()?.focus({ preventScroll: true });
	}

	collapseDrawer = () => isDrawerOpen() && closeDrawer();

	// Fallback mode moves the drawer and backdrop to body, so they must be put back
	signal.addEventListener('abort', () => fallbackOpen && hideFallback());

	document.addEventListener(
		'click',
		(e) => {
			if (e.target.closest('#docs-drawer-open')) {
				isDrawerOpen() ? closeDrawer() : openDrawer();
				return;
			}
			if (isDrawerOpen() && !drawer.contains(e.target)) closeDrawer();
		},
		{ signal },
	);

	document.addEventListener(
		'keydown',
		(e) => {
			if (e.key === 'Escape' && isDrawerOpen()) closeDrawer();
		},
		{ signal },
	);

	const mql = matchMedia(DRAWER_MEDIA);
	const onMediaChange = (e) => {
		if (e.matches && isDrawerOpen()) closeDrawer();
	};
	mql.addEventListener('change', onMediaChange, { signal });
}

// --- Init ---
// The sidebar persists within one docsRoot and is replaced otherwise, so it mounts once per sidebar element
function initDocsNav(aside, { signal }) {
	const nav = aside.querySelector(NAV_SELECTOR);

	initDrawer(signal);
	if (!nav) return;

	syncActive(nav);
	initCollapseToggle(nav);
	initRovingTabindex(nav);

	registerRouteHook(
		() => {
			collapseDrawer?.();
			syncActive(nav);
		},
		{ signal },
	);
}

defineModule('docs-nav', initDocsNav);
