['pf-custom-icon-mobile', 'pf-custom-icon-desktop'].forEach((id) => {
	const el = document.getElementById(id);
	const trigger = () => {
		document.querySelector('pagefind-modal')?.open?.();
	};
	el?.addEventListener('click', trigger);
	el?.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			trigger();
		}
	});
});

document.addEventListener('keydown', (e) => {
	const isK = e.key.toLowerCase() === 'k';
	const isMod = e.metaKey || e.ctrlKey;
	if (!isK || !isMod) return;

	const activeEl = document.activeElement;
	const isTyping =
		activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable);
	if (isTyping) return;

	e.preventDefault();
	document.querySelector('pagefind-modal')?.open?.();
});
