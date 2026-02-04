function updateTheme() {
	if (typeof mermaid === 'undefined') return;

	const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

	document.querySelectorAll('.mermaid').forEach((el) => {
		if (el.getAttribute('data-processed')) {
			el.removeAttribute('data-processed');
			const originalCode = el.getAttribute('data-graph');
			if (originalCode) {
				el.innerHTML = originalCode;
			} else {
				el.setAttribute('data-graph', el.textContent);
			}
		} else {
			el.setAttribute('data-graph', el.textContent);
		}
	});

	mermaid.initialize({
		startOnLoad: false,
		theme: isDark ? 'dark' : 'base',
	});

	mermaid.run({
		querySelector: '.mermaid',
	});
}

window.addEventListener('appearance-changed', updateTheme);
updateTheme();

export {};
