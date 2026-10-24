// Scroll restore + flush forced-expand state.
(() => {
	if (window._docsNavDirty && window._docsNavState && window._docsNavStorageKey) {
		try {
			sessionStorage.setItem(window._docsNavStorageKey, JSON.stringify(window._docsNavState));
		} catch {}
	}
	delete window._docsNavState;
	delete window._docsNavDirty;
	delete window._docsNavStorageKey;

	if (!window._docsNavScrollRestore) return;
	const el = document.querySelector('.docs-sidebar-container .scrollbar-mask');
	if (el) el.scrollTop = window._docsNavScrollRestore;
	delete window._docsNavScrollRestore;
})();
(() => {
	const nav = document.querySelector('.docs-nav');
	const asideEl = document.querySelector('.docs-sidebar-container');
	const currentPageUid = asideEl?.dataset.currentPageUid || '';
	if (!nav || !currentPageUid) return;
	const activeLink =
		Array.from(nav.querySelectorAll('a[data-page-uid]')).find(
			(link) => link.dataset.pageUid === currentPageUid,
		) ?? null;
	if (!activeLink) return;

	activeLink.classList.add('docs-nav__link--active');
	activeLink.setAttribute('aria-current', 'page');

	let node = activeLink.parentElement;
	while (node && node !== nav) {
		if (node.hasAttribute('data-section-list')) {
			node.previousElementSibling.classList.add('docs-nav__link--active');
		}
		node = node.parentElement;
	}
})();
