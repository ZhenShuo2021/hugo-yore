(() => {
	const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	document.querySelectorAll('[data-typeit]').forEach((el) => {
		const { strings, ...options } = JSON.parse(el.dataset.typeit);

		if (reduced) {
			el.textContent = strings.join(options.breakLines ? '\n' : '');
			return;
		}

		new TypeIt(el, { strings, ...options }).go();
	});
})();
