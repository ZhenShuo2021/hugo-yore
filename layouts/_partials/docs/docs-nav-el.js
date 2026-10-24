(() => {
	try {
		const asideEl = document.querySelector('.docs-sidebar-container');
		const docsRoot = asideEl?.dataset.docsRoot || '';
		const storageKey = 'yore-docs-nav-state:' + docsRoot;
		window._docsNavStorageKey = storageKey;
		const state = JSON.parse(sessionStorage.getItem(storageKey) || '{}');
		// Stash scroll so the post-tree script can apply it.
		if (state.scroll) window._docsNavScrollRestore = state.scroll;
		if (!state.collapsed) state.collapsed = {};
		// Use the page uid (hash of .Path) rather than pathname/href,
		// since a section with build.render: never has no RelPermalink
		// and therefore no usable href/pathname.
		const currentPageUid = asideEl?.dataset.currentPageUid || '';
		// Stash so the post-tree script (which runs after the whole nav
		// tree, including every <sl-nav-restore>, has been parsed) can
		// flush any forced-expand writes back to sessionStorage.
		// NOTE: a microtask queued here would run before the parser gets
		// to the rest of the tree, so flushing must happen later.
		window._docsNavState = state;
		window._docsNavDirty = false;
		// Define sl-nav-restore so connectedCallback fires for each
		// section toggle as the browser parses the DOM, before first paint.
		customElements.define(
			'sl-nav-restore',
			class extends HTMLElement {
				connectedCallback() {
					try {
						const pageUid = this.dataset.pageUid;
						const stored = state.collapsed[pageUid];
						// Walk up to find the wrapping trigger <a> and its sibling list.
						// They share the same parent <div>, so traverse from this element.
						const wrapper = this.parentElement;
						const btn = wrapper?.querySelector(`a[data-section-trigger][data-page-uid="${pageUid}"]`);
						const list = wrapper?.querySelector(`[data-section-list][data-page-uid="${pageUid}"]`);
						if (!btn || !list) return;
						// If this section is an ancestor of the current page, it must
						// stay expanded regardless of the stored collapsed state —
						// otherwise the user loses track of where they are in the nav.
						const containsActiveLink = Array.from(wrapper.querySelectorAll('a[data-page-uid]')).some(
							(link) => !!currentPageUid && link.dataset.pageUid === currentPageUid,
						);
						if (!containsActiveLink && typeof stored !== 'boolean') return;
						const collapsed = containsActiveLink ? false : stored;

						btn.classList.toggle('is-collapsed', collapsed);
						btn.setAttribute('aria-expanded', collapsed ? 'false' : 'true');
						list.classList.toggle('is-collapsed', collapsed);

						// Persist the forced-expand
						if (containsActiveLink && stored !== false) {
							state.collapsed[pageUid] = false;
							window._docsNavDirty = true;
						}
					} catch {}
				}
			},
		);
	} catch {}
})();
