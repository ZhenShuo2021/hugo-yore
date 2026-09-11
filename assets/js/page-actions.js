async function init() {
	(async () => {
		try {
			if (!('popover' in HTMLElement.prototype)) {
				await import('https://unpkg.com/@oddbird/popover-polyfill@latest/dist/popover.min.js');
			}
			if (!('commandForElement' in HTMLButtonElement.prototype)) {
				await import('https://esm.run/invokers-polyfill');
			}
		} catch (err) {
			console.error('Failed to load dialog/popover polyfill:', err);
		}
	})();

	const container = document.querySelector('.page-actions');
	if (!container) {
		return;
	}
	const toggle = container.querySelector('.page-actions__toggle');
	const menu = container.querySelector('.page-actions__menu');
	const mdSourceLink = container.querySelector('.page-actions__view-source');
	const mdURL = mdSourceLink ? mdSourceLink.href : null;

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
				const text = await fetch(mdURL).then((r) => r.text());
				await copyText(text);
				flashSuccess();
			} catch {
				console.warn('Failed to copy markdown');
			}
		});
	}
}

init();
