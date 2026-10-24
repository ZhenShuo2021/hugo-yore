(function () {
	var { pick, reduceMotion, i18n } = window.__rp;
	if (!pick) return;
	var titleEl = document.getElementById('rp-title');
	var titleLine = titleEl.querySelector('.rp-title-line');
	var subEl = document.getElementById('rp-sub');

	function go() {
		window.location.replace(pick.url);
	}

	if (reduceMotion) {
		setTimeout(go, 1500);
		return;
	}

	setTimeout(() => {
		titleEl.setAttribute('aria-hidden', 'false');
		titleEl.classList.add('rp-typing');

		new TypeIt(titleLine, {
			strings: [pick.title || i18n.untitled],
			speed: 36,
			cursor: true,
			afterComplete: () => {
				setTimeout(() => {
					subEl.classList.remove('rp-sub');
					void subEl.offsetWidth;
					subEl.textContent = i18n.takingYouThere;
					subEl.classList.add('rp-sub');
					setTimeout(go, 1200);
				}, 900);
			},
		}).go();
	}, 300);
})();
