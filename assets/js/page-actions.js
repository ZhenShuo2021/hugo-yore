const container = document.querySelector('.page-actions');
const toggle = container.querySelector('.page-actions__toggle');
const menu = container.querySelector('.page-actions__menu');
const mdSourceLink = container.querySelector('.page-actions__view-source');
const mdURL = mdSourceLink ? mdSourceLink.href : null;

function closeMenu() {
	menu.classList.add('hidden');
	toggle.setAttribute('aria-expanded', 'false');
}

toggle.addEventListener('click', function (e) {
	e.stopPropagation();
	const isHidden = menu.classList.toggle('hidden');
	toggle.setAttribute('aria-expanded', String(!isHidden));
});

document.addEventListener('click', closeMenu);

async function copyText(text) {
	try {
		await navigator.clipboard.writeText(text);
	} catch {
		const ta = document.createElement('textarea');
		ta.value = text;
		ta.style.cssText = 'position:absolute;left:-9999px';
		document.body.appendChild(ta);
		ta.select();
		document.execCommand('copy');
		document.body.removeChild(ta);
	}
}

function flashSuccess() {
	const iconEllipsis = toggle.querySelector('.page-actions__icon-ellipsis');
	const iconCheck = toggle.querySelector('.page-actions__icon-check');

	toggle.style.color = 'var(--adm-success-accent)';
	toggle.style.position = 'relative';

	iconEllipsis.style.opacity = '0';
	iconEllipsis.style.transform = 'scale(0.5) rotate(60deg)';

	iconCheck.style.opacity = '1';
	iconCheck.style.transform = 'scale(1) rotate(0deg)';

	setTimeout(() => {
		iconCheck.style.opacity = '0';
		iconCheck.style.transform = 'scale(0.5) rotate(-60deg)';

		iconEllipsis.style.opacity = '1';
		iconEllipsis.style.transform = 'scale(1) rotate(0deg)';

		toggle.style.color = '';
	}, 1200);
}

const copyUrlBtn = container.querySelector('.page-actions__copy-url');
if (copyUrlBtn) {
	copyUrlBtn.addEventListener('click', async function () {
		await copyText(window.location.origin + window.location.pathname);
		closeMenu();
		flashSuccess();
	});
}

const copyMdBtn = container.querySelector('.page-actions__copy-md');
if (copyMdBtn) {
	copyMdBtn.addEventListener('click', async function () {
		if (!mdURL) return;
		try {
			const text = await fetch(mdURL).then((r) => r.text());
			await copyText(text);
			flashSuccess();
		} catch {
			console.warn('Failed to copy markdown');
		}
		closeMenu();
	});
}
