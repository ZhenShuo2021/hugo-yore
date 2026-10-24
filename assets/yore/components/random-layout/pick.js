(function () {
	var data = JSON.parse(document.getElementById('rp-data').textContent);
	var items = data.items;
	var i18n = data.i18n;
	var reduceMotion =
		window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
		localStorage.getItem('yore-reduce-motion') === 'true';
	var pick = items.length ? items[Math.floor(Math.random() * items.length)] : null;
	window.__rp = { pick, reduceMotion, i18n };

	if (!pick) {
		document.getElementById('rp-sub').textContent = i18n.noPosts;
		return;
	}

	if (reduceMotion) {
		var titleLine = document.querySelector('#rp-title .rp-title-line');
		document.getElementById('rp-title').setAttribute('aria-hidden', 'false');
		titleLine.textContent = pick.title || i18n.untitled;
		document.getElementById('rp-sub').textContent = i18n.redirecting;
	}
})();
