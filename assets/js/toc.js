const CONFIG = {
	tocSelector: '.toc-sidebar',
	linkActiveClassName: 'toc--active',
};

function getVisibleBoundingClientRect(element) {
	const rect = element.getBoundingClientRect();
	const hasNoHeight = rect.top === rect.bottom;
	if (hasNoHeight && element.parentNode) {
		return getVisibleBoundingClientRect(element.parentNode);
	}
	return rect;
}

function getTocLinks() {
	const toc = document.querySelector(CONFIG.tocSelector);
	if (!toc) return [];
	return Array.from(toc.querySelectorAll('a[href^="#"]'));
}

function getAnchorsFromTOC() {
	const tocLinks = getTocLinks();
	const anchors = [];

	tocLinks.forEach((link) => {
		const href = link.getAttribute('href');
		if (!href || !href.includes('#')) return;
		const id = decodeURIComponent(href.substring(1));
		const element = document.getElementById(id);
		if (element) {
			anchors.push(element);
		}
	});

	return anchors;
}

function getActiveAnchor(anchors, navbarHeight) {
	const TOLERANCE = -5;
	const nextVisibleAnchor = anchors.find((anchor) => {
		const boundingRect = getVisibleBoundingClientRect(anchor);
		return boundingRect.top > navbarHeight + TOLERANCE;
	});

	if (nextVisibleAnchor) {
		const boundingRect = getVisibleBoundingClientRect(nextVisibleAnchor);

		if (boundingRect.top > navbarHeight + TOLERANCE && boundingRect.bottom < window.innerHeight / 2) {
			return nextVisibleAnchor;
		}

		const index = anchors.indexOf(nextVisibleAnchor);
		return anchors[index - 1] || null;
	}

	return anchors[anchors.length - 1] || null;
}

function getLinkAnchorValue(link) {
	const href = link.getAttribute('href');
	if (!href || !href.includes('#')) return '';
	return decodeURIComponent(href.substring(href.indexOf('#') + 1));
}

function getAnchorTopOffset() {
	const layout = document.documentElement.getAttribute('data-header-layout');
	if (layout !== 'sticky') {
		return 0;
	}
	const navbar = document.querySelector('#site-header');
	return navbar ? navbar.clientHeight : 0;
}

let lastActiveLink = null;

function updateActiveLink() {
	const tocLinks = getTocLinks();
	if (tocLinks.length === 0) return;

	const anchors = getAnchorsFromTOC();
	if (anchors.length === 0) return;

	const navbarHeight = getAnchorTopOffset();
	const activeAnchor = getActiveAnchor(anchors, navbarHeight);
	const activeLink = tocLinks.find((link) => activeAnchor && activeAnchor.id === getLinkAnchorValue(link));

	tocLinks.forEach((link) => {
		const isActive = link === activeLink;
		if (isActive) {
			if (lastActiveLink && lastActiveLink !== link) {
				lastActiveLink.classList.remove(CONFIG.linkActiveClassName);
			}
			link.classList.add(CONFIG.linkActiveClassName);
			lastActiveLink = link;
		} else {
			link.classList.remove(CONFIG.linkActiveClassName);
		}
	});
}

function init() {
	const toc = document.querySelector(CONFIG.tocSelector);
	if (!toc) {
		console.info('No TOC element found in this page:', CONFIG.tocSelector);
		return;
	}

	document.addEventListener('scroll', updateActiveLink, { passive: true });
	window.addEventListener('resize', updateActiveLink, { passive: true });
	updateActiveLink();
}

init();
