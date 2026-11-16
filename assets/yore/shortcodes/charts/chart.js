import * as params from '@params';
import { defineModule } from '../../core/js/modules.js';

defineModule('chart', async (el, { signal }) => {
	await import(params.echartsJS);
	if (signal.aborted) return;
	const { default: mountChart } = await import(params.chartsJS);
	return mountChart(el, { signal });
});
