import * as params from '@params';

if (navigator.serviceWorker) {
	navigator.serviceWorker.register(params.swURL, { scope: params.scope }).then((reg) => {
		const ping = () => {
			const w = reg.installing || reg.waiting || reg.active;
			if (w) w.postMessage('page-loaded');
		};
		if (document.readyState === 'complete') ping();
		else window.addEventListener('load', ping);
	});
}
