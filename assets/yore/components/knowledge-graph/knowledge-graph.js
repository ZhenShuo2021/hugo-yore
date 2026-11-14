import { registerRouteHook } from '../../core/js/route.js';

// The package's lazy-loader stub loads the graph near the viewport, then the real init takes its place
registerRouteHook(() => {
	window.__HKG?.init();
	return () => window.__HKG?.destroy();
});
