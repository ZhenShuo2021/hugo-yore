import { initMasonryFromElement } from './masonry-core.js';

document.addEventListener('DOMContentLoaded', () => {
	document.querySelectorAll('.masonry-grid').forEach(initMasonryFromElement);
});
