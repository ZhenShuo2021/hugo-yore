import { SvgToolbelt } from '../../lib/svg-toolbelt/svg-toolbelt.esm.js';
import * as params from '@params';

function needsElk() {
	return [...document.querySelectorAll('.mermaid')].some((el) =>
		new RegExp('layout\\s*:\\s*elk').test(el.textContent),
	);
}

async function registerElkIfNeeded(mermaid) {
	if (!needsElk()) return;
	const url = new URL(params.elkUrl, location.origin);
	const { default: elkLayouts } = await import(url.href);
	mermaid.registerLayoutLoaders(elkLayouts);
}

function initSvgToolbelt() {
	document.querySelectorAll('.mermaid').forEach((element) => {
		if (element.getBoundingClientRect().height >= 50) {
			new SvgToolbelt(element, {
				controlsPosition: 'bottom-right',
				// minScale: 0.2,
				// maxScale: 10,
				// zoomStep: 0.2,
			}).init();
		}
	});
}

function updateTheme() {
	const mermaid = window.mermaid;
	if (!mermaid) return;

	const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

	document.querySelectorAll('.mermaid').forEach((el) => {
		const wrapper = el.closest('.svg-toolbelt-wrapper');
		if (wrapper) {
			if (wrapper.svgToolbeltInstance) wrapper.svgToolbeltInstance.destroy();
			wrapper.parentNode.insertBefore(el, wrapper);
			wrapper.remove();
		}

		if (el.getAttribute('data-processed')) {
			el.removeAttribute('data-processed');
			const originalCode = el.getAttribute('data-graph');
			if (originalCode) el.innerHTML = originalCode;
		} else {
			el.setAttribute('data-graph', el.textContent);
		}
	});

	mermaid.initialize({ startOnLoad: false, theme: isDark ? 'dark' : 'base' });
	registerElkIfNeeded(mermaid).then(() => {
		mermaid.run({ querySelector: '.mermaid' }).then(() => {
			setTimeout(initSvgToolbelt, 200);
		});
	});
}

window.addEventListener('appearance-changed', updateTheme);
updateTheme();

export {};
