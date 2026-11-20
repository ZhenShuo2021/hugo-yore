import Swup from '../../lib/swup/core/Swup.modern.js';
import SwupHeadPlugin from '../../lib/swup/head-plugin/index.modern.js';
import SwupPreloadPlugin from '../../lib/swup/preload-plugin/index.modern.js';

interface VisitLike {
	to: { document: Document };
	containers: string[];
}

export function init() {
	const swup = new Swup({
		containers: ['#main-content'],
		animationSelector: false,
		linkToSelf: 'navigate',
		// Language/version switches change the whole header and the random page only redirects; both use native navigation
		ignoreVisit: (url: string, { el }: { el?: Element } = {}) =>
			new URL(url, location.href).pathname === document.documentElement.dataset.randomUrl ||
			el?.getAttribute('href') === '#' ||
			!!el?.closest('[data-no-swup], .yr-translation, .yr-version-switcher'),
		plugins: [
			new SwupHeadPlugin({
				attributes: ['lang', 'dir', 'data-page-kind', 'data-page-type'],
				awaitAssets: true,
				persistAssets: true,
			}),
			new SwupPreloadPlugin(),
		],
	});
	window.swup = swup;

	// 404 handling and its bfcache fix
	swup.hooks.replace(
		'fetch:request',
		async (
			visit: unknown,
			args: { url: string },
			defaultHandler: (visit: unknown, args: unknown) => Promise<{ status: number }>,
		) => {
			const response = await defaultHandler(visit, args);
			if (response.status === 404) throw new Error(`404: ${args.url}`);
			return response;
		},
	);
	window.addEventListener('pageshow', (event) => {
		if (!event.persisted) return;
		swup.navigating = false;
		swup.options.skipPopStateHandling = swup.defaults.skipPopStateHandling;
		swup.location = new (swup.location.constructor as new (url: string) => typeof swup.location)(
			window.location.href,
		);
		swup.currentHistoryIndex = window.history.state?.index ?? 1;
	});

	// Docs pages share one sidebar per docsRoot, so only a root change replaces the whole region.
	// Entering or leaving docs also changes the header, which lives outside the region and is never replaced
	swup.hooks.before(
		'content:replace',
		(visit: VisitLike) => {
			const next = visit.to.document;
			const cur = document;
			const isDocs = (doc: Document) => doc.documentElement.dataset.pageType === 'docs';
			const docsRoot = (doc: Document) =>
				doc.querySelector<HTMLElement>('.docs-sidebar-container')?.dataset.docsRoot;
			const hasToc = (doc: Document) => !!doc.querySelector('.toc-sidebar');
			if (isDocs(cur) && isDocs(next)) {
				visit.containers =
					docsRoot(cur) !== docsRoot(next) ? ['[data-swup-region]'] : [...visit.containers, '.toc-sidebar'];
			} else if (isDocs(cur) !== isDocs(next)) {
				const left = '#site-header .header-left';
				cur.querySelector(left)!.replaceWith(cur.importNode(next.querySelector(left)!, true));
				visit.containers = ['[data-swup-region]'];
			} else {
				const crossRegion =
					['data-page-kind', 'data-page-type'].some(
						(a) => next.documentElement.getAttribute(a) !== cur.documentElement.getAttribute(a),
					) ||
					docsRoot(cur) !== docsRoot(next) ||
					hasToc(cur) !== hasToc(next);
				if (crossRegion) visit.containers = ['[data-swup-region]'];
				else if (hasToc(cur)) visit.containers = [...visit.containers, '.toc-sidebar'];
			}
			cur.body.className = next.body.className;
		},
		{ priority: -1 },
	);

	// The content may even be nonexistent, so the slot content needs to be changed.
	swup.hooks.on('content:replace', (visit: VisitLike) => {
		const next = visit.to.document.querySelectorAll('[data-header-slot]');
		document.querySelectorAll('[data-header-slot]').forEach((slot, i) => {
			slot.innerHTML = next[i]!.innerHTML;
		});
	});

	// Sync the site header with the new page. It lives outside the swup container and isn't replaced,
	// so its active state is copied over and its hidden state (hide-on-scroll) would otherwise persist
	swup.hooks.on('content:replace', (visit: VisitLike) => {
		const sel = '#site-header a, #site-header [data-dropdown-toggle]';
		const next = visit.to.document.querySelectorAll(sel);
		document.querySelectorAll(sel).forEach((el, i) => {
			el.toggleAttribute('data-active', next[i]!.hasAttribute('data-active'));
			const current = next[i]!.getAttribute('aria-current');
			if (current) el.setAttribute('aria-current', current);
			else el.removeAttribute('aria-current');
		});
		document.getElementById('site-header')?.classList.remove('yr-header-hidden');
	});

	// anchor link focus
	// https://github.com/swup/a11y-plugin/issues/43
	swup.hooks.on('scroll:anchor', (visit: unknown, { hash }: { hash: string }) => {
		let id = hash.replace(/^#/, '');
		try {
			id = decodeURIComponent(id);
		} catch {}
		const target = document.getElementById(id);
		if (target) {
			const prev = target.getAttribute('tabindex');
			target.setAttribute('tabindex', '-1');
			target.focus({ preventScroll: true });
			target.blur();
			if (prev === null) {
				target.removeAttribute('tabindex');
			} else {
				target.setAttribute('tabindex', prev);
			}
		}
	});

	// a11y
	const announcer = document.createElement('p');
	announcer.setAttribute('aria-live', 'assertive');
	announcer.setAttribute('aria-atomic', 'true');
	announcer.style.cssText =
		'position:absolute;top:0;left:0;clip:rect(0 0 0 0);clip-path:inset(50%);overflow:hidden;white-space:nowrap;width:1px;height:1px;';
	document.body.appendChild(announcer);

	swup.hooks.on('visit:start', () => document.documentElement.setAttribute('aria-busy', 'true'));

	swup.hooks.on('visit:end', () => {
		document.documentElement.removeAttribute('aria-busy');

		const h1 = document.querySelector('main h1, h1');
		let text = h1?.getAttribute('aria-label') || h1?.textContent || document.title;
		// Identical text isn't re-announced; append a period to force an update
		if (announcer.textContent === text) text += '.';
		setTimeout(() => {
			announcer.textContent = '';
			announcer.textContent = text;
		}, 100);
	});

	return swup;
}
