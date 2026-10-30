const defaultCopyText = document.documentElement.getAttribute('data-copy-text') ?? 'Copy';
const defaultCopiedText = document.documentElement.getAttribute('data-copied-text') ?? 'Copied';
const defaultCopyFailedText = document.documentElement.getAttribute('data-copy-failed-text') ?? 'Unable to copy';

const copyIcon = `<svg aria-hidden="true" width="24" height="24" stroke-width="2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19.4 20H9.6C9.26863 20 9 19.7314 9 19.4V9.6C9 9.26863 9.26863 9 9.6 9H19.4C19.7314 9 20 9.26863 20 19.4V19.4C20 19.7314 19.7314 20 19.4 20Z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"></path><path d="M15 9V4.6C15 4.26863 14.7314 4 14.4 4H4.6C4.26863 4 4 4.26863 4 4.6V14.4C4 14.7314 4.26863 15 4.6 15H9" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const checkIcon = `<svg aria-hidden="true" width="24" height="24" stroke-width="2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 13L9 17L19 7" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

function createCopyButton(highlightDiv) {
	const button = document.createElement('button');
	button.className = 'copy-button';
	button.setAttribute('aria-label', defaultCopyText);
	button.title = defaultCopyText;
	button.innerHTML = copyIcon;
	highlightDiv.appendChild(button);
}

async function copyCode(button, highlightDiv) {
	const codeText = extractText(highlightDiv);

	if (!codeText) return;

	try {
		await navigator.clipboard.writeText(codeText);
	} catch {
		try {
			if (!legacyCopyCode(codeText, button)) {
				return;
			}
		} catch {
			return;
		}
	}

	button.innerHTML = checkIcon;
	button.classList.add('copied');

	setTimeout(() => {
		button.innerHTML = copyIcon;
		button.classList.remove('copied');
	}, 2000);
}

function legacyCopyCode(text, button) {
	const ta = document.createElement('textarea');
	ta.value = text;
	ta.style.cssText = 'position:absolute;left:-9999px';
	document.body.appendChild(ta);
	ta.select();

	let success = false;

	try {
		success = document.execCommand('copy');
	} finally {
		document.body.removeChild(ta);
		button.focus();
	}

	return success;
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

document.addEventListener('click', (event) => {
	const button = event.target.closest('.copy-button');
	if (!button) return;

	const highlightDiv = button.closest('.highlight');
	if (!highlightDiv) return;

	copyCode(button, highlightDiv);
});
