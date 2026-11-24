import { echartsJS } from '@params';
import { defineModule } from '../../core/js/modules.js';

const getTheme = (value = document.documentElement.getAttribute('data-theme')) =>
	value === 'dark' ? 'dark' : null;

let echartsReady;
const loadEcharts = () =>
	(echartsReady ??= import(echartsJS).catch((e) => {
		echartsReady = null;
		throw e;
	}));

// echarts adds non-passive wheel listeners, which delay page scrolling.
// Force passive only during echarts.init(). preventDefault() in them is ignored,
// so wheel-based dataZoom will also scroll the page.
let initing = false;
const nativeAdd = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function (type, fn, opts) {
	if (initing && type === 'wheel') opts = { capture: !!(opts?.capture ?? opts), passive: true };
	return nativeAdd.call(this, type, fn, opts);
};

defineModule('chart', async (el, { signal }) => {
	const [, { default: build }] = await Promise.all([loadEcharts(), import(el.dataset.chart)]);
	if (signal.aborted) return;

	const option = build();
	let theme = getTheme();
	let chart = null;

	const render = () => {
		chart?.dispose();
		initing = true;
		chart = echarts.init(el, theme);
		initing = false;
		chart.setOption(option);
	};

	const observer = new IntersectionObserver(
		([entry]) => {
			if (!entry.isIntersecting) return;
			observer.disconnect();
			render();
		},
		{ rootMargin: '200px 0px' },
	);
	observer.observe(el);

	window.addEventListener('resize', () => chart?.resize(), { signal });
	window.addEventListener(
		'appearance-changed',
		(e) => {
			theme = getTheme(e.detail.appearance);
			if (chart) render();
		},
		{ signal },
	);

	return () => {
		observer.disconnect();
		chart?.dispose();
	};
});
