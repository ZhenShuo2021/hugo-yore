const POPOVER_POLYFILL = 'https://unpkg.com/@oddbird/popover-polyfill@latest/dist/popover.min.js';
const INVOKERS_POLYFILL = 'https://esm.run/invokers-polyfill@latest';

// The popover polyfill injects UA-like styles (inset, margin: auto, fit-content, border,
// padding, background) that override the site styles. Save the original computed styles
// before loading it and re-apply them inline afterwards.
const MENU_STYLE_PROPS = [
	'backgroundColor',
	'color',
	'overflow',
	'paddingTop',
	'paddingRight',
	'paddingBottom',
	'paddingLeft',
	'borderTopWidth',
	'borderRightWidth',
	'borderBottomWidth',
	'borderLeftWidth',
	'borderTopStyle',
	'borderRightStyle',
	'borderBottomStyle',
	'borderLeftStyle',
	'borderTopColor',
	'borderRightColor',
	'borderBottomColor',
	'borderLeftColor',
];

function captureMenuStyle(menu) {
	const cs = getComputedStyle(menu);
	return Object.fromEntries(MENU_STYLE_PROPS.map((prop) => [prop, cs[prop]]));
}

function restoreMenuStyle(menu, saved) {
	Object.assign(menu.style, saved, {
		margin: '0',
		right: 'auto',
		bottom: 'auto',
		height: 'auto',
	});
	menu.style.width = '-webkit-max-content';
	menu.style.width = 'max-content';
}

async function loadPolyfills(menu) {
	try {
		if (!('popover' in HTMLElement.prototype)) {
			const saved = captureMenuStyle(menu);
			document.documentElement.classList.add('no-native-popover');
			await import(POPOVER_POLYFILL);
			restoreMenuStyle(menu, saved);
		}
		// Must load after the popover polyfill
		if (!('commandForElement' in HTMLButtonElement.prototype)) {
			await import(INVOKERS_POLYFILL);
		}
	} catch (err) {
		console.error('Failed to load dialog/popover polyfill:', err);
	}
}

async function init() {
	const container = document.querySelector('.page-actions');
	if (!container) {
		return;
	}
	const toggle = container.querySelector('.page-actions__toggle');
	const menu = container.querySelector('.page-actions__menu');
	const mdSourceLink = container.querySelector('.page-actions__view-source');
	const mdURL = mdSourceLink ? mdSourceLink.href : null;

	await loadPolyfills(menu);

	const GAP = 8;
	const VIEWPORT_PADDING = 8;

	function positionMenu() {
		const buttonRect = toggle.getBoundingClientRect();
		const menuRect = menu.getBoundingClientRect();

		let left = buttonRect.right - menuRect.width;
		if (left < VIEWPORT_PADDING) left = VIEWPORT_PADDING;

		menu.style.top = `${buttonRect.bottom + GAP}px`;
		menu.style.left = `${left}px`;
	}

	// The command/commandfor attributes already open and close the menu natively
	// The polyfill does not sync aria-expanded so keep it in sync manually
	menu.addEventListener('toggle', (event) => {
		const isOpen = 'newState' in event ? event.newState === 'open' : menu.matches(':popover-open');
		toggle.setAttribute('aria-expanded', String(isOpen));

		// Old browser fallback
		menu.style.display = isOpen ? 'block' : 'none';

		if (isOpen) {
			positionMenu();
			window.addEventListener('scroll', positionMenu, true);
			window.addEventListener('resize', positionMenu);
		} else {
			window.removeEventListener('scroll', positionMenu, true);
			window.removeEventListener('resize', positionMenu);
		}
	});

	async function copyText(text) {
		try {
			await navigator.clipboard.writeText(text);
		} catch {
			const ta = document.createElement('textarea');
			ta.value = text;
			ta.style.cssText = 'position:absolute;left:-9999px';
			document.body.appendChild(ta);
			ta.select();
			document.execCommand('copy');
			document.body.removeChild(ta);
		}
	}

	// Patch Safari copy issue
	async function copyTextFromPromise(textPromise) {
		if (window.ClipboardItem) {
			try {
				await navigator.clipboard.write([
					new ClipboardItem({
						'text/plain': textPromise.then((text) => new Blob([text], { type: 'text/plain' })),
					}),
				]);
				return;
			} catch {
				// Fall through to the plain await path below.
			}
		}
		await copyText(await textPromise);
	}

	function flashSuccess() {
		const iconEllipsis = toggle.querySelector('.page-actions__icon-ellipsis');
		const iconCheck = toggle.querySelector('.page-actions__icon-check');

		toggle.style.color = 'var(--adm-success-accent)';
		toggle.style.position = 'relative';

		iconEllipsis.style.opacity = '0';
		iconEllipsis.style.transform = 'scale(0.5) rotate(60deg)';

		iconCheck.style.opacity = '1';
		iconCheck.style.transform = 'scale(1) rotate(0deg)';

		setTimeout(() => {
			iconCheck.style.opacity = '0';
			iconCheck.style.transform = 'scale(0.5) rotate(-60deg)';

			iconEllipsis.style.opacity = '1';
			iconEllipsis.style.transform = 'scale(1) rotate(0deg)';

			toggle.style.color = '';
		}, 1200);
	}

	// Closing the menu is now handled declaratively by command="hide-popover" on each
	// button, so these listeners only need to perform the copy side effect.
	const copyUrlBtn = container.querySelector('.page-actions__copy-url');
	if (copyUrlBtn) {
		copyUrlBtn.addEventListener('click', async function () {
			await copyText(window.location.origin + window.location.pathname);
			flashSuccess();
		});
	}

	const copyMdBtn = container.querySelector('.page-actions__copy-md');
	if (copyMdBtn) {
		copyMdBtn.addEventListener('click', async function () {
			if (!mdURL) return;
			try {
				const textPromise = fetch(mdURL).then((r) => r.text());
				await copyTextFromPromise(textPromise);
				flashSuccess();
			} catch {
				console.warn('Failed to copy markdown');
			}
		});
	}
}

init();
