import { youtubeSrc } from '@params';
import { defineModule } from '../../core/js/modules.js';

defineModule('youtube', async () => {
	await import(youtubeSrc);
});
