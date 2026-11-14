import { initMasonryFromElement } from './masonry-core.js';
import { defineModule } from '../../core/js/modules.js';

function initMasonry(el) {
	const instance = initMasonryFromElement(el);
	return () => instance.destroy();
}

defineModule('masonry', initMasonry);
