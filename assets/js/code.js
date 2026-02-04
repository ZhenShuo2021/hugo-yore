const defaultCopyText = document.documentElement.getAttribute('data-copy-text') || 'Copy';
const defaultCopiedText = document.documentElement.getAttribute('data-copied-text') || 'Copied';

function createCopyButton(highlightDiv) {
	const button = document.createElement('button');
	button.className = 'copy-button';
	button.ariaLabel = defaultCopyText;
	button.textContent = defaultCopyText;
	button.addEventListener('click', () => copyCode(button, highlightDiv));
	highlightDiv.insertBefore(button, highlightDiv.firstChild);
}

async function copyCode(button, highlightDiv) {
	const codeText = extractText(highlightDiv);
	if (!codeText) return;

	try {
		await navigator.clipboard.writeText(codeText);
	} catch {
		legacyCopyCode(codeText);
	}

	button.textContent = defaultCopiedText;
	setTimeout(() => {
		button.textContent = defaultCopyText;
	}, 2000);
}

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

	const inlineLines = codeElement.querySelectorAll('.cl'); // linenos=inline
	if (inlineLines.length) {
		return Array.from(inlineLines)
			.map((line) => line.textContent.replace(/\n$/, ''))
			.join('\n');
	}

	const tableCode = highlightDiv.querySelector('.lntable .lntd:last-child code'); // linenos=inline
	return tableCode ? tableCode.textContent.trim() : codeElement.textContent.trim();
}

document.querySelectorAll('.highlight:has(pre.chroma)').forEach(createCopyButton);
