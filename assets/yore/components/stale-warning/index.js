(function () {
	var dataEl = document.getElementById('stale-content-warning-data');
	if (!dataEl) return;

	var payload = JSON.parse(dataEl.textContent);
	var lastmod = new Date(payload.lastmod);

	if (isNaN(lastmod.getTime())) return;

	var msPerDay = 1000 * 60 * 60 * 24;
	var daysSince = Math.floor((Date.now() - lastmod.getTime()) / msPerDay);

	if (daysSince >= payload.thresholdDays) {
		var wrapper = document.createElement('div');
		wrapper.innerHTML = payload.html;
		dataEl.replaceWith(wrapper);
	}
})();
