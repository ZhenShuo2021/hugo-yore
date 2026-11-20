import * as params from '@params';
import { once } from '../../core/js/utils.js';
import { registerRouteHook } from '../../core/js/route.js';

const loadMath = once(async () => {
	await import(params.mathConfig);
	// MathJax can't find document.currentScript when loaded as a module, so set the component root explicitly
	window.MathJax.loader.paths.mathjax = params.texSvgJS.replace(/\/[^/]*$/, '');
	await import(params.texSvgJS);
	await window.MathJax.startup.promise;
});

// Relies on MathJax v4.1.1 internals
const reset = () => {
	const doc = window.MathJax?.startup?.document;
	if (!doc) return;
	doc.clear();
	doc.reset({ all: true });
};

let chain = Promise.resolve();

registerRouteHook(() => {
	if (!document.getElementById('yore-math-style')) return;
	chain = chain
		.then(loadMath)
		.then(() => {
			reset();
			return window.MathJax.typesetPromise();
		})
		.catch(console.error);
	return reset;
});
