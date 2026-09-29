import { once } from '../../core/js/utils.js';
import * as params from '@params';

// lazy load photoswipe near the viewport or on interaction, never before the load event
const photoswipeJS = params.photoswipeJS;
const galleries = document.querySelectorAll('.pswp-gallery');
if (photoswipeJS) {
	const ac = typeof AbortController === 'function' ? new AbortController() : null;
	const signal = ac?.signal;
	let done = false;
	let timer;
	let observer;

	// remove every listener, timer and observer once photoswipe is loaded
	const cleanup = () => {
		done = true;
		ac?.abort();
		clearTimeout(timer);
		observer?.disconnect();
	};

	const load = once(async () => {
		await import(photoswipeJS);
		cleanup();
	});
	const warm = () => load().catch(() => {});

	// click before ready: take over, load, then replay the click for photoswipe's own handler
	const onClick = async (e) => {
		const img = e.target.closest('img');
		if (done || !img || img.closest('a') || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
		e.preventDefault();
		try {
			await load();
		} catch {
			location.href = img.currentSrc || img.src;
			return;
		}
		img.closest('a')?.click();
	};

	galleries.forEach((el) => {
		['pointerover', 'focusin', 'touchstart'].forEach((type) =>
			el.addEventListener(type, warm, { once: true, passive: true, signal }),
		);
		el.addEventListener('click', onClick, { signal });
	});

	if (!navigator.connection?.saveData) {
		const preload = () => {
			timer = setTimeout(warm, 5000);
		};
		document.readyState === 'complete' ? preload() : addEventListener('load', preload, { once: true, signal });

		const margin = `${Math.round(window.innerHeight * 2)}px 0px`;
		observer = new IntersectionObserver(
			(entries) => {
				if (!entries.some((entry) => entry.isIntersecting)) return;
				observer.disconnect();
				warm();
			},
			{ rootMargin: margin, threshold: 0 },
		);
		const observe = () => galleries.forEach((el) => observer.observe(el));
		document.readyState === 'complete' ? observe() : addEventListener('load', observe, { once: true, signal });
	}
}
