const getTheme = (value = document.documentElement.getAttribute('data-theme')) =>
	value === 'dark' ? 'dark' : null;

// echarts registers non-passive wheel listeners while initializing, make them passive
let initing = false;
const add = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function (t, f, o) {
	if (initing && /wheel/.test(t)) o = { capture: !!(o?.capture ?? o), passive: true };
	return add.call(this, t, f, o);
};

export default async function (dom, { signal }) {
	const { default: build } = await import(dom.dataset.chart);
	if (signal.aborted) return;

	const option = build();
	let theme = getTheme();
	let chart = null;

	const render = () => {
		chart?.dispose();
		initing = true;
		chart = echarts.init(dom, theme);
		initing = false;
		chart.setOption(option);
	};

	const observer = new IntersectionObserver(
		(list) => {
			if (!list.some((e) => e.isIntersecting)) return;
			observer.disconnect();
			render();
		},
		{ rootMargin: '200px 0px' },
	);
	observer.observe(dom);

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
}
