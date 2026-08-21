if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
	/* disabled */
} else {
	var minTimer = setTimeout(function () {
		if (domReady) hide();
		minDone = true;
	}, 25);
	setTimeout(function () {
		hide();
	}, 1000);

	var domReady = false;
	var minDone = false;

	function hide() {
		document.getElementById('page-loader').classList.add('hide');
	}

	document.addEventListener('DOMContentLoaded', function () {
		domReady = true;
		if (minDone) hide();
	});

	document.addEventListener('click', function (e) {
		if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

		var link = e.target.closest('a[href]');
		if (!link) return;

		var href = link.getAttribute('href');
		if (
			link.target === '_blank' ||
			href.startsWith('#') ||
			href.startsWith('javascript:') ||
			href.startsWith('mailto:') ||
			(link.hostname && link.hostname !== window.location.hostname)
		)
			return;

		document.getElementById('page-loader').classList.remove('hide');
	});

	window.addEventListener('pageshow', function (e) {
		if (e.persisted) {
			document.getElementById('page-loader').classList.add('hide');
		}
	});
}
