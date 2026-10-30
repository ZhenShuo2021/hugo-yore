import * as params from '@params';
const OpenCC = await import(params.url);
const button = document.getElementById('chinese-translate');
if (button) {
	button.addEventListener('click', () => {
		const currentLanguage = document.documentElement.lang || 'zh-CN';
		const locale = new Intl.Locale(currentLanguage);

		const isTraditionalChinese =
			locale.language === 'zh' &&
			(locale.maximize().script === 'Hant' || ['TW', 'HK', 'MO'].includes(locale.region));

		const converter = OpenCC.Converter(
			isTraditionalChinese ? { from: 'tw', to: 'cn' } : { from: 'cn', to: 'tw' },
		);

		const textWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);

		let textNode;

		while ((textNode = textWalker.nextNode())) {
			if (textNode.textContent.trim()) {
				textNode.textContent = converter(textNode.textContent);
			}
		}

		document.documentElement.lang = isTraditionalChinese ? 'zh-CN' : 'zh-TW';
	});
}
