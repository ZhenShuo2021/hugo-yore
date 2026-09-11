// --- Roving tabindex + full keyboard navigation for docs-nav ---
function getVisibleLinks(nav) {
	return Array.from(nav.querySelectorAll('a[data-depth]')).filter((link) => {
		let node = link.parentElement;
		while (node && node !== nav) {
			if (node.hasAttribute('data-section-list') && node.classList.contains('is-collapsed')) {
				return false;
			}
			node = node.parentElement;
		}
		return true;
	});
}

function setTabbable(nav, target) {
	nav.querySelectorAll('a[data-depth]').forEach((link) => {
		link.tabIndex = link === target ? 0 : -1;
	});
}

function initRovingTabindex(nav) {
	const links = nav.querySelectorAll('a[data-depth]');
	if (links.length === 0) return;

	const active = nav.querySelector('a.docs-nav__link--active') || links[0];
	setTabbable(nav, links[0]);

	nav.addEventListener('keydown', (e) => {
		const current = e.target.closest('a[data-depth]');
		if (!current) return;

		const visible = getVisibleLinks(nav);
		const index = visible.indexOf(current);
		if (index === -1) return;

		let target = null;

		switch (e.key) {
			case 'ArrowDown':
				target = visible[Math.min(index + 1, visible.length - 1)];
				break;
			case 'ArrowUp':
				target = visible[Math.max(index - 1, 0)];
				break;
			case 'Home':
				target = visible[0];
				break;
			case 'End':
				target = visible[visible.length - 1];
				break;
			case 'ArrowRight':
				if (current.hasAttribute('data-section-trigger') && current.classList.contains('is-collapsed')) {
					current.click();
					return;
				}
				target = visible[Math.min(index + 1, visible.length - 1)];
				break;
			case 'ArrowLeft':
				if (current.hasAttribute('data-section-trigger') && !current.classList.contains('is-collapsed')) {
					current.click();
					return;
				}
				{
					const parentUid = current.closest('[data-section-list]')?.dataset.pageUid;
					if (parentUid) {
						target = nav.querySelector(`a[data-section-trigger][data-page-uid="${parentUid}"]`);
					}
				}
				break;
			default:
				return;
		}

		if (!target) return;
		e.preventDefault();
		setTabbable(nav, target);
		target.focus();
	});

	// section 展開/收合後，若目前 tabbable 的項目變成隱藏，
	// 把 tabstop 移回觸發變化的按鈕本身。
	nav.addEventListener('click', (e) => {
		const btn = e.target.closest('a[data-section-trigger]');
		if (!btn) return;
		queueMicrotask(() => {
			const tabbable = nav.querySelector('a[tabindex="0"]');
			if (!tabbable || getVisibleLinks(nav).includes(tabbable)) return;
			setTabbable(nav, btn);
		});
	});
}

export { initRovingTabindex };
