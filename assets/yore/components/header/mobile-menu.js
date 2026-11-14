function init() {
	const overlay = document.getElementById('mobile-menu-overlay');
	const close = document.getElementById('mobile-menu-close');

	overlay?.querySelectorAll('[data-mobile-submenu-trigger]').forEach((btn) => {
		const content = document.getElementById(btn.getAttribute('aria-controls'));
		if (!content) return;

		content.classList.toggle('is-expanded', btn.getAttribute('aria-expanded') === 'true');

		btn.addEventListener('click', () => {
			const expanded = btn.getAttribute('aria-expanded') === 'true';
			btn.setAttribute('aria-expanded', String(!expanded));
			content.classList.toggle('is-expanded', !expanded);
		});
	});

	if (overlay && close) {
		// The toggle lives in the header, which swup replaces on every visit, so it is looked up at event time
		const toggle = () => document.getElementById('mobile-menu-toggle');

		function openMenu() {
			overlay.showModal();
			toggle()?.setAttribute('aria-expanded', 'true');
		}

		function closeMenu() {
			overlay.close();
			toggle()?.setAttribute('aria-expanded', 'false');
		}

		document.addEventListener('click', (e) => {
			if (e.target.closest('#mobile-menu-toggle')) openMenu();
		});
		close.addEventListener('click', closeMenu);

		// The overlay lives outside the swup region, so it would stay open over the new page
		overlay.addEventListener('click', (e) => {
			if (e.target.closest('a[href]')) closeMenu();
		});

		// dialog closes natively on Esc, but that calls close() internally and bypasses closeMenu()
		// Sync aria-expanded via the 'close' event to cover Esc and any other path that calls close()
		overlay.addEventListener('close', () => {
			toggle()?.setAttribute('aria-expanded', 'false');
		});
	}
}

init();
