const ATTR = 'data-email-cloak';
const MARKER = 'HGuO03HaHa0xQ7zK';

function decloak(el) {
	const raw = el.getAttribute(ATTR);
	if (!raw) return;

	const b64 = raw.replace(MARKER, '');

	let addr;
	try {
		addr = atob(b64);
	} catch (e) {
		return;
	}

	const href = addr.startsWith('mailto:') ? addr : `mailto:${addr}`;

	el.href = href;
	if (el.hasAttribute('data-email-fill')) {
		el.textContent = addr.replace(/^mailto:/, '');
		el.removeAttribute('data-email-fill');
	}
	el.removeAttribute(ATTR);
}

document.querySelectorAll(`[${ATTR}]`).forEach(decloak);
