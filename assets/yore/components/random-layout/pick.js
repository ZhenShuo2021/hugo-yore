(function () {
	const data = JSON.parse(document.getElementById('rp-data').textContent);
	const items = data.items;
	const i18n = data.i18n;
	const reduceMotion =
		window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
		localStorage.getItem('yore-reduce-motion') === 'true';
	const pick = items.length ? items[Math.floor(Math.random() * items.length)] : null;
	window.__rp = { pick, reduceMotion, i18n };

	if (!pick) {
		document.getElementById('rp-sub').textContent = i18n.noPosts;
		return;
	}

	if (reduceMotion) {
		const titleLine = document.querySelector('#rp-title .rp-title-line');
		document.getElementById('rp-title').setAttribute('aria-hidden', 'false');
		titleLine.textContent = pick.title || i18n.untitled;
		document.getElementById('rp-sub').textContent = i18n.redirecting;
	}
})();
