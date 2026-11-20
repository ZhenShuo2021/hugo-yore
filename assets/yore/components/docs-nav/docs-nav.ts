import * as params from '@params';
import { initRovingTabindex, isCollapsed } from './docs-nav-a11y';
import { registerRouteHook } from '../../core/js/route.js';
import { defineModule } from '../../core/js/modules.js';

const NAV_SELECTOR = '.docs-nav';
const DRAWER_MEDIA = '(min-width: 48em)';

function applyCollapsed(nav: HTMLElement, pageUid: string | undefined, collapsed: boolean): void {
	const btn = nav.querySelector(`a[data-section-trigger][data-page-uid="${pageUid}"]`);
	if (!btn) return;
	btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
}

function syncActive(nav: HTMLElement): void {
	nav.querySelectorAll('a[data-active]').forEach((el) => {
		el.removeAttribute('data-active');
		el.removeAttribute('aria-current');
	});
	const active = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a[data-page-uid]')).find(
		(a) => a.pathname === location.pathname,
	);
	if (!active) return;
	active.setAttribute('data-active', '');
	active.setAttribute('aria-current', 'page');

	if (active.matches('[data-section-trigger]')) applyCollapsed(nav, active.dataset.pageUid, false);
	for (
		let list = active.closest<HTMLElement>('[data-section-list]');
		list;
		list = list.parentElement?.closest<HTMLElement>('[data-section-list]') ?? null
	) {
		list.previousElementSibling?.setAttribute('data-active', '');
		applyCollapsed(nav, list.dataset.pageUid, false);
	}
}

function collapseOtherSiblings(nav: HTMLElement, btn: HTMLElement): void {
	nav
		.querySelectorAll<HTMLElement>(`[data-parent-page-uid="${btn.dataset.parentPageUid}"]`)
		.forEach((sibling) => {
			if (sibling === btn) return;
			if (!isCollapsed(sibling)) {
				applyCollapsed(nav, sibling.dataset.pageUid, true);
			}
		});
}

function initCollapseToggle(nav: HTMLElement): void {
	nav.querySelectorAll('a[data-section-trigger]').forEach((btn) => {
		btn.setAttribute('role', 'button');
	});

	nav.addEventListener('click', (e: MouseEvent) => {
		const btn = (e.target as Element).closest<HTMLElement>('a[data-section-trigger]');
		if (!btn) return;
		e.preventDefault();
		e.stopPropagation();
		const willExpand = isCollapsed(btn);
		if (willExpand && params.autoCollapseCategories) collapseOtherSiblings(nav, btn);
		applyCollapsed(nav, btn.dataset.pageUid, !willExpand);
	});
}

let collapseDrawer: (() => void) | undefined;

function initDrawer(signal: AbortSignal): void {
	const drawer = document.getElementById('docs-drawer');

	const openBtn = (): HTMLElement | null => document.getElementById('docs-drawer-open');
	if (!drawer || !openBtn()) return;
	const dr: HTMLElement = drawer;

	const isNativePopover = typeof dr.showPopover === 'function';
	const home = { parent: dr.parentNode, next: dr.nextSibling };
	let fallbackOpen = false;
	let fallbackBackdrop: HTMLDivElement | null = null;
	let savedStyleAttr: string | null = null;

	function showFallback(): void {
		savedStyleAttr = dr.getAttribute('style');

		const backdrop = document.createElement('div');
		fallbackBackdrop = backdrop;
		Object.assign(backdrop.style, {
			position: 'fixed',
			top: '0',
			right: '0',
			bottom: '0',
			left: '0',
			zIndex: '2147483646',
			background: 'rgba(0, 0, 0, 0.5)',
		});
		backdrop.style.background = 'var(--backdrop)';

		document.body.appendChild(backdrop);
		document.body.appendChild(dr);

		Object.assign(dr.style, {
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

	function hideFallback(): void {
		if (savedStyleAttr === null) dr.removeAttribute('style');
		else dr.setAttribute('style', savedStyleAttr);

		if (home.parent) {
			const next = home.next && home.next.parentNode === home.parent ? home.next : null;
			home.parent.insertBefore(dr, next);
		}
		if (fallbackBackdrop && fallbackBackdrop.parentNode) {
			fallbackBackdrop.parentNode.removeChild(fallbackBackdrop);
		}
		fallbackBackdrop = null;
		fallbackOpen = false;
	}

	function isDrawerOpen(): boolean {
		return isNativePopover ? dr.matches(':popover-open') : fallbackOpen;
	}

	function openDrawer(): void {
		if (isNativePopover) dr.showPopover();
		else showFallback();
		document.getElementById('main-content')?.setAttribute('inert', '');
		openBtn()?.setAttribute('aria-expanded', 'true');
		dr.focus({ preventScroll: true });
	}

	function closeDrawer(): void {
		if (isNativePopover) dr.hidePopover();
		else hideFallback();

		document.getElementById('main-content')?.removeAttribute('inert');
		openBtn()?.setAttribute('aria-expanded', 'false');
		openBtn()?.focus({ preventScroll: true });
	}

	collapseDrawer = () => {
		if (isDrawerOpen()) closeDrawer();
	};

	signal.addEventListener('abort', () => {
		if (fallbackOpen) hideFallback();
	});

	document.addEventListener(
		'click',
		(e: MouseEvent) => {
			const target = e.target as Node;
			if ((target as Element).closest('#docs-drawer-open')) {
				if (isDrawerOpen()) closeDrawer();
				else openDrawer();
				return;
			}
			if (isDrawerOpen() && !dr.contains(target)) closeDrawer();
		},
		{ signal },
	);

	document.addEventListener(
		'keydown',
		(e: KeyboardEvent) => {
			if (e.key === 'Escape' && isDrawerOpen()) closeDrawer();
		},
		{ signal },
	);

	const mql = matchMedia(DRAWER_MEDIA);
	const onMediaChange = (e: MediaQueryListEvent): void => {
		if (e.matches && isDrawerOpen()) closeDrawer();
	};
	mql.addEventListener('change', onMediaChange, { signal });
}

const SIDEBAR_HIDDEN_ATTR = 'data-docs-sidebar-hidden';

function initSidebarHideButton(aside: HTMLElement, signal: AbortSignal): void {
	const hideButton = aside.querySelector<HTMLElement>('.yr-docs-sidebar-hide-button');
	const sidebarPanel = aside.querySelector<HTMLElement>('.yr-docs-sidebar-panel');
	if (!hideButton || !sidebarPanel) return;
	const root = document.documentElement;
	const desktopMql = matchMedia(DRAWER_MEDIA);

	const syncSidebarHidden = (): void => {
		const isHidden = root.hasAttribute(SIDEBAR_HIDDEN_ATTR);
		const label = (isHidden ? hideButton.dataset.labelShow : hideButton.dataset.labelHide) ?? '';
		hideButton.setAttribute('title', label);
		hideButton.setAttribute('aria-label', label);

		sidebarPanel.inert = isHidden && desktopMql.matches;
	};

	syncSidebarHidden();
	hideButton.addEventListener(
		'click',
		() => {
			root.toggleAttribute(SIDEBAR_HIDDEN_ATTR);
			syncSidebarHidden();
		},
		{ signal },
	);
	desktopMql.addEventListener('change', syncSidebarHidden, { signal });
}

function initDocsNav(aside: HTMLElement, { signal }: { signal: AbortSignal }): void {
	const nav = aside.querySelector<HTMLElement>(NAV_SELECTOR);

	initDrawer(signal);
	initSidebarHideButton(aside, signal);
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
