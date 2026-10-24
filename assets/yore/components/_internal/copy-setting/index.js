document.addEventListener('DOMContentLoaded', function () {
	const btn = document.getElementById('copy-main-setting-btn');
	if (!btn) return;
	const label = btn.querySelector('.copy-btn-label');
	const defaultCopyText = label.textContent;
	const defaultCopiedText = document.documentElement.getAttribute('data-copied-text') ?? 'Copied';
	function legacyCopyCode(text) {
		const textarea = document.createElement('textarea');
		textarea.value = text;
		textarea.setAttribute('readonly', '');
		textarea.style.position = 'absolute';
		textarea.style.left = '-9999px';
		document.body.appendChild(textarea);
		textarea.select();
		document.execCommand('copy');
		document.body.removeChild(textarea);
	}
	function extractText(highlightDiv) {
		const codeElement = highlightDiv.querySelector('code');
		if (!codeElement) return '';
		const inlineLines = codeElement.querySelectorAll('.cl');
		if (inlineLines.length) {
			return Array.from(inlineLines)
				.map((line) => line.textContent.replace(/\n$/, ''))
				.join('\n');
		}
		const tableCode = highlightDiv.querySelector('.lntable .lntd:last-child code');
		return tableCode ? tableCode.textContent.trim() : codeElement.textContent.trim();
	}
	btn.addEventListener('click', async function () {
		const target = document.getElementById('main-setting');
		if (!target) return;
		const highlightDiv = target.querySelector('.highlight') || target;
		const text = extractText(highlightDiv);
		if (!text) return;
		try {
			if (navigator.clipboard && window.isSecureContext) {
				await navigator.clipboard.writeText(text);
			} else {
				legacyCopyCode(text);
			}
			btn.dataset.copied = 'true';
			label.textContent = defaultCopiedText;
			setTimeout(function () {
				btn.dataset.copied = 'false';
				label.textContent = defaultCopyText;
			}, 2000);
		} catch (err) {
			legacyCopyCode(text);
		}
	});
});
