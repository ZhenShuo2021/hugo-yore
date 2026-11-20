import { defineModule } from '../../core/js/modules.js';

function showStaleWarning(dataEl) {
	const payload = JSON.parse(dataEl.textContent);
	const lastmod = new Date(payload.lastmod);

	if (isNaN(lastmod.getTime())) return;

	const msPerDay = 1000 * 60 * 60 * 24;
	const daysSince = Math.floor((Date.now() - lastmod.getTime()) / msPerDay);

	if (daysSince >= payload.thresholdDays) {
		const wrapper = document.createElement('div');
		wrapper.innerHTML = payload.html;
		dataEl.replaceWith(wrapper);
	}
}

defineModule('stale-warning', showStaleWarning);
