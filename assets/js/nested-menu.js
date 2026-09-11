// Nested nav disclosure menu
//
// https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/
// https://www.w3.org/WAI/tutorials/menus/flyout/
// https://adrianroselli.com/2019/06/link-disclosure-widget-navigation.html
// https://w3c.github.io/aria-practices/examples/disclosure/disclosure-navigation-hybrid.html

const HOVER_CLOSE_DELAY = 100;

function initNavDisclosures(root) {
	const navItems = root.querySelectorAll('[data-nav-item]');
	const closers = new WeakMap();

	navItems.forEach((item) => {
		const toggle = item.querySelector('[data-dropdown-toggle]');
		const submenu = item.querySelector('[data-dropdown-menu]');
		if (!toggle || !submenu) return;

		let closeTimer = null;
		let openFrame = null;

		function isOpen() {
			return toggle.getAttribute('aria-expanded') === 'true';
		}

		function open() {
			clearTimeout(closeTimer);
			cancelAnimationFrame(openFrame);
			toggle.setAttribute('aria-expanded', 'true');
			submenu.hidden = false;

			openFrame = requestAnimationFrame(() => {
				submenu.setAttribute('data-nav-open', '');
			});
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

		closers.set(item, close);

		toggle.addEventListener('click', () => {
			if (isOpen()) {
				close();
			} else {
				open();
			}
		});

		item.addEventListener('mouseenter', open);
		item.addEventListener('mouseleave', scheduleClose);

		item.addEventListener('keydown', (event) => {
			if (event.key === 'Escape' && isOpen()) {
				// 避免 mobile dialog 被關掉
				event.preventDefault();
				close();
				toggle.focus();
			}
		});

		item.addEventListener('keydown', (event) => {
			if (!isOpen()) return;

			const links = Array.from(submenu.querySelectorAll('a'));
			if (links.length === 0) return;

			const currentIndex = links.indexOf(document.activeElement);
			if (currentIndex === -1) return;

			let nextIndex = null;

			switch (event.key) {
				case 'ArrowDown':
					nextIndex = (currentIndex + 1) % links.length;
					break;
				case 'ArrowUp':
					nextIndex = (currentIndex - 1 + links.length) % links.length;
					break;
				case 'Home':
					nextIndex = 0;
					break;
				case 'End':
					nextIndex = links.length - 1;
					break;
				default:
					return;
			}

			event.preventDefault();
			links[nextIndex].focus();
		});

		item.addEventListener('focusout', (event) => {
			const next = event.relatedTarget;
			if (!next || !item.contains(next)) {
				close();
			}
		});
	});

	document.addEventListener('click', (event) => {
		navItems.forEach((item) => {
			if (item.contains(event.target)) return;
			const toggle = item.querySelector('[data-dropdown-toggle]');
			if (toggle && toggle.getAttribute('aria-expanded') === 'true') {
				closers.get(item)();
			}
		});
	});
}

initNavDisclosures(document);
