const header = document.getElementById('site-header');

if (header) {
	let lastScrollY = window.scrollY;
	let ticking = false;
	let blockUpdate = false;
	let blockTimeout = null;

	function updateHeader() {
		if (blockUpdate) {
			lastScrollY = window.scrollY;
			ticking = false;
			return;
		}

		const currentScrollY = window.scrollY;
		if (currentScrollY <= 0) {
			header.classList.remove('header-hidden');
			lastScrollY = currentScrollY;
			ticking = false;
			return;
		}

		const diff = currentScrollY - lastScrollY;
		if (Math.abs(diff) > 10) {
			if (diff > 0) {
				header.classList.add('header-hidden');
			} else {
				header.classList.remove('header-hidden');
			}
			lastScrollY = currentScrollY;
		}
		ticking = false;
	}

	const resetBlockUpdate = () => {
		if (blockTimeout) {
			clearTimeout(blockTimeout);
		}
		blockTimeout = setTimeout(() => {
			blockUpdate = false;
			blockTimeout = null;
		}, 100);
	};

	document.addEventListener('click', (e) => {
		if (e.target.closest('a[href^="#"]')) {
			header.classList.add('header-hidden');
			blockUpdate = true;
			resetBlockUpdate();
		}
	});

	window.addEventListener('hashchange', () => {
		requestAnimationFrame(() => {
			blockUpdate = false;
			if (blockTimeout) {
				clearTimeout(blockTimeout);
				blockTimeout = null;
			}
		});
	});

	window.addEventListener(
		'scroll',
		() => {
			if (!ticking) {
				window.requestAnimationFrame(updateHeader);
				ticking = true;
			}
		},
		{ passive: true },
	);
}

export {};
