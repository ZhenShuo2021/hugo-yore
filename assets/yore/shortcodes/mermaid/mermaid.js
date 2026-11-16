import * as params from '@params';
import { defineModule } from '../../core/js/modules.js';

async function initMermaid(el, { signal }) {
	const { mount } = await import(params.mermaidSrc);
	if (signal.aborted) return;
	const instance = mount(el, el.textContent, { zoom: el.getAttribute('data-zoom') !== 'false' });
	el.setAttribute('data-processed', 'true');
	return () => instance.destroy();
}

defineModule('mermaid', initMermaid);
