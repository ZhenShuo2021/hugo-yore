import mermaid from 'mermaid';
import { SvgToolbelt } from 'yore-svg-toolbelt';

function initSvgToolbelt() {
	const targets = Array.from(document.querySelectorAll('.mermaid')).filter(
		(el) => el.getAttribute('data-zoom') !== 'false',
	);
	// Read all heights first, then write, so layout is computed only once.
	const heights = targets.map((el) => el.getBoundingClientRect().height);
	targets.forEach((el, i) => {
		if (heights[i] < 50) return;
		new SvgToolbelt(el, {
			controlsPosition: 'bottom-right',
			// minScale: 0.2,
			// maxScale: 10,
			// zoomStep: 0.2,
		}).init();
	});
}

function updateTheme() {
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
	mermaid.run({ querySelector: '.mermaid' }).then(initSvgToolbelt);
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
