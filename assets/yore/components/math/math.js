import * as params from '@params';
import { once } from '../../core/js/utils.js';
import { registerRouteHook } from '../../core/js/route.js';

const loadMath = once(async () => {
	await import(params.mathJS);
	// MathJax can't find document.currentScript when loaded as a module, the component root must be set explicitly
	window.MathJax.loader.paths.mathjax = params.texSvgJS.replace(/\/[^/]*$/, '');
	await import(params.texSvgJS);
});

registerRouteHook(() => {
	if (!document.getElementById('yore-math-style')) return;
	loadMath()
		.then(() => window.__mathTypeset?.())
		.catch(console.error);
	return () => window.__mathClear?.();
});
