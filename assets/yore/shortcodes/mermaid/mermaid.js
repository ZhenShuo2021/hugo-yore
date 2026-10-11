import { SvgToolbelt } from '../../lib/svg-toolbelt/svg-toolbelt.esm.js';

function initSvgToolbelt() {
	document.querySelectorAll('.mermaid').forEach((element) => {
		if (element.getAttribute('data-zoom') === 'false') return;
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
	mermaid.run({ querySelector: '.mermaid' }).then(() => {
		setTimeout(initSvgToolbelt, 200);
	});
}

const link = document.getElementById('svg-toolbelt-css');
if (link) {
	if (link.sheet) {
		link.media = 'all';
	} else {
		link.addEventListener('load', () => (link.media = 'all'), { once: true });
	}
}
window.addEventListener('appearance-changed', updateTheme);
updateTheme();

export {};
