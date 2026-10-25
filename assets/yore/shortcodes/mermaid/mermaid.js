import * as params from '@params';

import(params.src).then(({ mount }) => {
	document.querySelectorAll('pre.mermaid').forEach((el) => {
		mount(el, el.textContent, { zoom: el.getAttribute('data-zoom') !== 'false' });
		el.setAttribute('data-processed', 'true');
	});
});

export {};
