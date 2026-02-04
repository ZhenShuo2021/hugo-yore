const toggle = document.getElementById('mobile-menu-toggle');
const overlay = document.getElementById('mobile-menu-overlay');
const close = document.getElementById('mobile-menu-close');

if (toggle && overlay && close) {
	function openMenu() {
		overlay.classList.remove('invisible', 'opacity-0');
		overlay.setAttribute('aria-hidden', 'false');
		toggle.setAttribute('aria-expanded', 'true');
		document.body.style.overflow = 'hidden';
	}

	function closeMenu() {
		overlay.classList.add('invisible', 'opacity-0');
		overlay.setAttribute('aria-hidden', 'true');
		toggle.setAttribute('aria-expanded', 'false');
		document.body.style.overflow = '';
	}

	toggle.addEventListener('click', openMenu);
	close.addEventListener('click', closeMenu);

	// Close on escape key
	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && overlay.getAttribute('aria-hidden') === 'false') {
			closeMenu();
		}
	});

	// Close when clicking outside menu content
	overlay.addEventListener('click', function (e) {
		if (e.target === overlay) {
			closeMenu();
		}
	});
}

export {};
