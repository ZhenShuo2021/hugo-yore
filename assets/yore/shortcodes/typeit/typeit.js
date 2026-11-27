import { typeitSrc } from '@params';
import { defineModule } from '../../core/js/modules.js';

defineModule('typeit', async (el, { signal }) => {
	await import(typeitSrc);
	if (signal.aborted) return;

	const { strings, ...options } = JSON.parse(el.dataset.typeit);

	if (
		window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
		document.documentElement.getAttribute('data-a11y-reduce-motion') === 'true'
	) {
		el.textContent = strings.join(options.breakLines ? '\n' : '');
		return;
	}

	const instance = new TypeIt(el, { strings, ...options }).go();
	return () => instance.destroy();
});
