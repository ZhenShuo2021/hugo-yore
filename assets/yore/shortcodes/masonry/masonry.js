import { initMasonryFromElement } from './masonry-core.js';
import { defineModule } from '../../core/js/modules.js';

function initMasonry(el, { signal }) {
	let instance;

	const id = requestIdleCallback(() => {
		if (signal.aborted) return;

		instance = initMasonryFromElement(el);
	});

	return () => {
		cancelIdleCallback(id);
		instance?.destroy();
	};
}

defineModule('masonry', initMasonry);
