const text = document.documentElement.dataset.externalLinkWarning;

const whitelist = ['example.com', 'github.com'];

const guard = (e) => {
	const a = e.target.closest?.('a[href]');
	if (!a || !/^https?:$/.test(a.protocol) || a.origin === location.origin) return;
	if (whitelist.some((d) => a.hostname === d || a.hostname.endsWith('.' + d))) return;
	if (!confirm(text)) e.preventDefault();
};

document.addEventListener('click', guard, true);
document.addEventListener('auxclick', guard, true);
