export function initCarousel(ID) {
	const root = document.getElementById(ID);
	if (!root) return;

	const viewport = root.querySelector('.carousel-viewport');
	const strip = root.querySelector('.carousel-strip');
	const counter = root.querySelector('.carousel-counter');
	const caption = root.querySelector('.carousel-caption');
	const thumbs = root.querySelectorAll('.carousel-thumb');
	const links = root.querySelectorAll('.pswp-link');
	const total = root.querySelectorAll('.carousel-item').length;
	let current = 0;

	function updateLinkTabIndex() {
		links.forEach((link, i) => {
			link.setAttribute('tabindex', i === current ? '0' : '-1');
		});
	}

	function goTo(index) {
		if (index < 0) index = total - 1;
		if (index >= total) index = 0;
		current = index;

		strip.style.transform = `translateX(-${current * 100}%)`;
		if (counter) counter.textContent = `${current + 1} / ${total}`;

		const cap = thumbs[current]?.getAttribute('data-caption') ?? '';
		caption.textContent = cap;

		thumbs.forEach((t, i) => {
			t.classList.toggle('border-accent-500', i === current);
			t.classList.toggle('border-transparent', i !== current);
		});

		updateLinkTabIndex();

		const active = thumbs[current];
		if (active) {
			const thumbStrip = active.parentElement;
			const { left: sL, right: sR } = thumbStrip.getBoundingClientRect();
			const { left: tL, right: tR } = active.getBoundingClientRect();
			if (tL < sL || tR > sR) {
				active.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' });
			}
		}
	}

	// 瀏覽器在 focus 到視野外元素時，會把 overflow-hidden 的 viewport 捲動，
	// 這裡強制把 scrollLeft 拉回 0，避免跟 transform 位移打架造成跳圖假象
	if (viewport) {
		viewport.addEventListener('scroll', () => {
			viewport.scrollLeft = 0;
		});
	}

	thumbs.forEach((thumb) => {
		thumb.addEventListener('click', (e) => {
			e.preventDefault();
			e.stopPropagation();
			goTo(parseInt(thumb.getAttribute('data-index'), 10));
		});

		const thumbStrip = thumb.parentElement;
		thumb.addEventListener('mouseenter', () => thumbStrip.classList.add('thumb-hovered'));
		thumb.addEventListener('mouseleave', () => thumbStrip.classList.remove('thumb-hovered'));
	});

	root.querySelector('.carousel-prev')?.addEventListener('click', () => goTo(current - 1));
	root.querySelector('.carousel-next')?.addEventListener('click', () => goTo(current + 1));

	updateLinkTabIndex();
	caption.textContent = thumbs[0]?.getAttribute('data-caption') ?? '';
}
