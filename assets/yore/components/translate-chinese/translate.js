import * as params from '@params';
const OpenCC = await import(params.url);
const button = document.getElementById('chinese-translate');
const status = document.getElementById('chinese-translate-status');
if (button) {
	button.disabled = false;

	button.addEventListener('click', () => {
		const locale = new Intl.Locale(document.documentElement.lang || 'zh-CN');

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

		for (const el of document.querySelectorAll('[alt],[aria-label],[title],[placeholder]')) {
			for (const attr of ['alt', 'aria-label', 'title', 'placeholder']) {
				if (el.hasAttribute(attr)) el.setAttribute(attr, converter(el.getAttribute(attr)));
			}
		}
		document.title = converter(document.title);

		document.documentElement.lang = isTraditionalChinese ? 'zh-Hans' : 'zh-Hant';
		status.textContent = isTraditionalChinese ? '已切换为简体中文' : '已切換為繁體中文';
	});
}
