function init() {
	const btn = document.getElementById('scroll-to-top');
	const sentinel = document.getElementById('scroll-sentinel');
	// The element that fades in and out: the ring wrapper when enabled, otherwise the button itself
	const target = __READING_PROGRESS__ ? document.getElementById('scroll-progress') : btn;

	new IntersectionObserver(function (entries) {
		target.classList.toggle('visible', !entries[entries.length - 1].isIntersecting);
	}).observe(sentinel);

	btn.addEventListener('click', function () {
		window.scrollTo({ top: 0, behavior: 'instant' });
	});

	// https://github.com/GoogleChrome/modern-web-guidance/blob/2b4aa13a/skills/modern-web-guidance/guides/ui-components/progress-ring.md
	if (__READING_PROGRESS__) {
		const progress = document.getElementById('reading-progress');

		// Reading progress, throttled to one update per frame
		let ticking = false;
		let current = -1;

		const update = function () {
			ticking = false;
			const root = document.documentElement;
			const max = root.scrollHeight - root.clientHeight;
			const ratio = max > 0 ? root.scrollTop / max : 0;
			// Two decimals keeps the ring smooth without integer steps
			const value = Math.round(Math.min(1, Math.max(0, ratio)) * 10000) / 100;
			if (value === current) return;
			current = value;
			progress.setAttribute('value', value);
		};

		const onScroll = function () {
			if (ticking) return;
			ticking = true;
			requestAnimationFrame(update);
		};

		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onScroll, { passive: true });

		// Runs after layout each frame, so reads here are free. The initial callback
		// after observe() sets the first value, and later height changes (images, embeds) are caught too
		new ResizeObserver(update).observe(document.body);

		// Fallback: sync the value attribute to --value where attr() is unsupported
		if (!CSS.supports('width: attr(value type(<number>))')) {
			const sync = function () {
				progress.style.setProperty('--value', progress.getAttribute('value'));
			};
			sync();
			new MutationObserver(sync).observe(progress, {
				attributes: true,
				attributeFilter: ['value'],
			});
		}
	}
}

init();
