(() => {
	const entries = [];

	const render = (entry, theme) => {
		entry.chart?.dispose();
		entry.chart = echarts.init(entry.dom, theme);
		entry.chart.setOption(entry.option);
	};

	window.__echartsRegister = (id, build) => {
		const dom = document.getElementById(id);
		if (!dom) return;

		const entry = { dom, option: build(), chart: null };
		entries.push(entry);
		render(entry);

		dom.addEventListener('tab-activated', () => {
			requestAnimationFrame(() => entry.chart?.resize());
		});
	};

	window.addEventListener('resize', () => {
		entries.forEach((entry) => entry.chart?.resize());
	});

	window.addEventListener('appearance-changed', (e) => {
		const theme = e.detail.appearance;
		entries.forEach((entry) => render(entry, theme));
	});
})();
