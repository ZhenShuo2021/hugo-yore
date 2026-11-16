// Nested nav disclosure menu
//
// https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
// https://www.w3.org/WAI/tutorials/menus/flyout/
// https://adrianroselli.com/2019/06/link-disclosure-widget-navigation.html
// https://w3c.github.io/aria-practices/examples/disclosure/disclosure-navigation-hybrid.html

import { defineModule } from '../../core/js/modules.js';

const HOVER_CLOSE_DELAY = 100;

defineModule('nested-menu', (item, { signal }) => {
	const toggle = item.querySelector('[data-dropdown-toggle]');
	const submenu = item.querySelector('[data-dropdown-menu]');
	if (!toggle || !submenu) return;

	let closeTimer = null;
	let openFrame = null;

	const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

	function open() {
		clearTimeout(closeTimer);
		cancelAnimationFrame(openFrame);
		toggle.setAttribute('aria-expanded', 'true');
		submenu.hidden = false;
		openFrame = requestAnimationFrame(() => submenu.setAttribute('data-nav-open', ''));
	}

	function close() {
		cancelAnimationFrame(openFrame);
		toggle.setAttribute('aria-expanded', 'false');
		submenu.removeAttribute('data-nav-open');
		clearTimeout(closeTimer);
		closeTimer = setTimeout(() => {
			submenu.hidden = true;
		}, HOVER_CLOSE_DELAY);
	}

	function scheduleClose() {
		clearTimeout(closeTimer);
		closeTimer = setTimeout(close, HOVER_CLOSE_DELAY);
	}

	toggle.addEventListener('click', () => (isOpen() ? close() : open()), { signal });
	submenu.addEventListener('click', (e) => e.target.closest('a') && close(), { signal });
	item.addEventListener('mouseenter', open, { signal });
	item.addEventListener('mouseleave', scheduleClose, { signal });

	item.addEventListener(
		'keydown',
		(e) => {
			if (e.key === 'Escape' && isOpen()) {
				// Avoid closing the mobile dialog
				e.preventDefault();
				close();
				toggle.focus();
			}
		},
		{ signal },
	);

	item.addEventListener(
		'keydown',
		(e) => {
			if (!isOpen()) return;
			const links = Array.from(submenu.querySelectorAll('a'));
			const i = links.indexOf(document.activeElement);
			if (i === -1) return;

			const next = {
				ArrowDown: (i + 1) % links.length,
				ArrowUp: (i - 1 + links.length) % links.length,
				Home: 0,
				End: links.length - 1,
			}[e.key];
			if (next === undefined) return;

			e.preventDefault();
			links[next].focus();
		},
		{ signal },
	);

	item.addEventListener('focusout', (e) => item.contains(e.relatedTarget) || close(), { signal });
	document.addEventListener('click', (e) => !item.contains(e.target) && isOpen() && close(), { signal });

	return () => {
		clearTimeout(closeTimer);
		cancelAnimationFrame(openFrame);
	};
});
