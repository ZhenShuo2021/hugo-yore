// https://github.com/GoogleChrome/modern-web-guidance/blob/4dd968349e54ca45a05dd5c818fb035c9054b022/skills/modern-web-guidance/guides/ui-components/carousel.md
import { defineModule } from '../../core/js/modules.js';

const TOLERANCE = 2;
const SETTLE_DELAY = 150;

const idle = (cb) =>
	'requestIdleCallback' in window ? requestIdleCallback(cb, { timeout: 500 }) : setTimeout(cb, 50);
const cancelIdle = (id) => ('cancelIdleCallback' in window ? cancelIdleCallback(id) : clearTimeout(id));

function createCarousel(root) {
	const track = root.querySelector('.carousel-track');
	const counter = root.querySelector('.carousel-counter');
	const caption = root.querySelector('.carousel-caption');
	const status = root.querySelector('.carousel-status');
	const prev = root.querySelector('.carousel-prev');
	const next = root.querySelector('.carousel-next');
	const thumbs = [...root.querySelectorAll('.carousel-thumb')];
	const slides = [...root.querySelectorAll('.carousel-item')];
	if (!track || !caption || !slides.length) return null;

	const total = slides.length;
	// Looping relies on CSS sibling-count() and sibling-index() to park end slides
	const loop = total >= 3 && CSS.supports('width', 'calc(sibling-index() * 1px)');
	const hasScrollEnd = 'onscrollend' in window;
	const abort = new AbortController();
	const { signal } = abort;

	let liveIndex = 0; // slide shown by the markers, caption and counter
	let settledIndex = null; // last slide the track rested on
	let parkedFor = null; // value of --current currently applied
	let pending = null; // slide index a click is scrolling to
	let frame = 0;
	let timer = 0;
	let unlockFrame = 0;
	let idleId = 0;

	// Offset of a slide's center from the track's center along the inline axis
	function offsetOf(slide) {
		const t = track.getBoundingClientRect();
		const s = slide.getBoundingClientRect();
		return s.left + s.width / 2 - (t.left + t.width / 2);
	}

	function nearestIndex() {
		let best = 0;
		let bestDistance = Infinity;
		slides.forEach((slide, i) => {
			const distance = Math.abs(offsetOf(slide));
			if (distance < bestDistance) {
				best = i;
				bestDistance = distance;
			}
		});
		return best;
	}

	// Visual order differs from DOM order while an end slide is parked
	function visualOrder() {
		return [...slides].sort((a, b) => a.getBoundingClientRect().left - b.getBoundingClientRect().left);
	}

	function render(index) {
		liveIndex = index;
		if (counter) counter.textContent = `${index + 1} / ${total}`;
		caption.textContent = slides[index].getAttribute('data-caption') ?? '';

		thumbs.forEach((thumb, i) => {
			if (i === index) thumb.setAttribute('aria-current', 'true');
			else thumb.removeAttribute('aria-current');
		});

		// Scroll the thumbnail strip itself so the page never moves
		const container = thumbs[index]?.parentElement;
		if (!container) return;
		const c = container.getBoundingClientRect();
		const t = thumbs[index].getBoundingClientRect();
		if (t.left >= c.left && t.right <= c.right) return;
		const reduceMotion =
			window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
			document.documentElement.hasAttribute('data-a11y-reduce-motion');
		container.scrollBy({
			left: (t.left + t.right) / 2 - (c.left + c.right) / 2,
			behavior: reduceMotion ? 'instant' : 'smooth',
		});
	}

	function setActive(index) {
		if (index !== liveIndex) render(index);
	}

	// Single handler for everything that waits for scrolling to finish
	function settle() {
		if (pending !== null) {
			// Ignore a scrollend from a scroll that was replaced by a newer one
			if (Math.abs(offsetOf(slides[pending])) > TOLERANCE) return;
			pending = null;
		}

		const index = nearestIndex();
		setActive(index);

		if (!loop) {
			const order = visualOrder();
			const pos = order.indexOf(slides[index]);
			if (prev) prev.disabled = pos <= 0;
			if (next) next.disabled = pos >= order.length - 1;
		}

		if (status && settledIndex !== null && index !== settledIndex) {
			status.textContent = slides[index].getAttribute('data-status') ?? '';
		}
		settledIndex = index;

		if (!loop || parkedFor === index) return;

		// Park an end slide beside the current one so the track always has a neighbor on both sides.
		// It forces a reflow, so it runs when the browser is idle.
		cancelIdle(idleId);
		idleId = idle(() => {
			idleId = 0;
			if (pending !== null || parkedFor === settledIndex) return;
			const current = settledIndex;
			parkedFor = current;

			const slide = slides[current];
			const before = slide.getBoundingClientRect().left;

			cancelAnimationFrame(unlockFrame);
			track.style.scrollSnapType = 'none';
			track.style.overflowX = 'hidden';

			track.style.setProperty('--current', current);
			slides.forEach((s, i) => {
				s.inert = (i === 0 && current >= total - 2) || (i === total - 1 && current <= 1);
			});

			const after = slide.getBoundingClientRect().left;
			if (after !== before) track.scrollBy({ left: after - before, behavior: 'instant' });

			track.style.scrollSnapType = '';
			// Restoring overflow immediately breaks looping, so wait two frames
			unlockFrame = requestAnimationFrame(() => {
				unlockFrame = requestAnimationFrame(() => {
					track.style.overflowX = '';
				});
			});
		});
	}

	function scrollToSlide(index) {
		pending = index;
		setActive(index);

		const delta = offsetOf(slides[index]);
		if (Math.abs(delta) <= TOLERANCE) {
			pending = null;
			return;
		}
		// Uses the track's CSS scroll-behavior, so reduced motion is respected
		track.scrollBy({ left: delta });
	}

	function step(direction) {
		const base = pending ?? nearestIndex();
		const order = visualOrder();
		const target = order[order.indexOf(slides[base]) + direction];
		if (target) scrollToSlide(slides.indexOf(target));
	}

	function onScroll() {
		if (!hasScrollEnd) {
			clearTimeout(timer);
			timer = setTimeout(settle, SETTLE_DELAY);
		}

		// A pending click already set the marker, and recomputing during a scripted scroll stutters Safari
		if (pending !== null || frame) return;
		frame = requestAnimationFrame(() => {
			frame = 0;
			setActive(nearestIndex());
		});
	}

	function destroy() {
		abort.abort();
		cancelAnimationFrame(frame);
		cancelAnimationFrame(unlockFrame);
		cancelIdle(idleId);
		clearTimeout(timer);
		pending = null;
		parkedFor = null;
		settledIndex = null;

		track.style.removeProperty('--current');
		track.style.scrollSnapType = '';
		track.style.overflowX = '';
		slides.forEach((slide) => {
			slide.inert = false;
		});
		track.scrollTo({ left: 0, behavior: 'instant' });

		render(0);
		if (status) status.textContent = '';
		if (prev) prev.disabled = false;
		if (next) next.disabled = false;
	}

	track.addEventListener('scroll', onScroll, { signal, passive: true });
	if (hasScrollEnd) track.addEventListener('scrollend', settle, { signal });

	// User input takes over from any pending click target
	const releasePending = () => {
		pending = null;
	};
	track.addEventListener('pointerdown', releasePending, { signal });
	track.addEventListener('wheel', releasePending, { signal, passive: true });
	track.addEventListener('keydown', releasePending, { signal });

	thumbs.forEach((thumb, i) => {
		thumb.addEventListener(
			'click',
			(e) => {
				e.preventDefault();
				e.stopPropagation();
				scrollToSlide(i);
			},
			{ signal },
		);
	});

	prev?.addEventListener('click', () => step(-1), { signal });
	next?.addEventListener('click', () => step(1), { signal });

	// Initial load: no measuring, the markup already renders slide 0 as current
	caption.textContent = slides[0].getAttribute('data-caption') ?? '';
	if (!loop) {
		if (prev) prev.disabled = true;
		if (next) next.disabled = total < 2;
	}

	// The first settle waits for the first layout. IntersectionObserver callbacks run after layout.
	const firstLayout = new IntersectionObserver(() => {
		firstLayout.disconnect();
		settle();
	});
	firstLayout.observe(track);
	signal.addEventListener('abort', () => firstLayout.disconnect());

	return { destroy };
}

function initCarousel(root) {
	const instance = createCarousel(root);
	return instance ? () => instance.destroy() : undefined;
}

defineModule('carousel', initCarousel);
