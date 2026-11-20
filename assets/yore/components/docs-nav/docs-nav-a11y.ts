export function isCollapsed(btn: Element): boolean {
	return btn.getAttribute('aria-expanded') === 'false';
}

function getVisibleLinks(nav: HTMLElement): HTMLAnchorElement[] {
	return Array.from(nav.querySelectorAll<HTMLAnchorElement>('a[data-depth]')).filter((link) => {
		let node: HTMLElement | null = link.parentElement;
		while (node && node !== nav) {
			if (node.hasAttribute('data-section-list') && isCollapsed(node.previousElementSibling as Element)) {
				return false;
			}
			node = node.parentElement;
		}
		return true;
	});
}

function setTabbable(nav: HTMLElement, target: HTMLAnchorElement): void {
	nav.querySelectorAll<HTMLAnchorElement>('a[data-depth]').forEach((link) => {
		link.tabIndex = link === target ? 0 : -1;
	});
}

export function initRovingTabindex(nav: HTMLElement): void {
	const links = nav.querySelectorAll<HTMLAnchorElement>('a[data-depth]');
	if (links.length === 0) return;

	setTabbable(nav, links[0] as HTMLAnchorElement);

	nav.addEventListener('keydown', (e: KeyboardEvent) => {
		const current = (e.target as Element).closest<HTMLAnchorElement>('a[data-depth]');
		if (!current) return;

		const visible = getVisibleLinks(nav);
		const index = visible.indexOf(current);
		if (index === -1) return;

		let target: HTMLAnchorElement | null = null;

		switch (e.key) {
			case 'ArrowDown':
				target = visible[Math.min(index + 1, visible.length - 1)] ?? null;
				break;
			case 'ArrowUp':
				target = visible[Math.max(index - 1, 0)] ?? null;
				break;
			case 'Home':
				target = visible[0] ?? null;
				break;
			case 'End':
				target = visible[visible.length - 1] ?? null;
				break;
			case 'ArrowRight':
				if (current.hasAttribute('data-section-trigger') && isCollapsed(current)) {
					current.click();
					return;
				}
				target = visible[Math.min(index + 1, visible.length - 1)] ?? null;
				break;
			case 'ArrowLeft': {
				if (current.hasAttribute('data-section-trigger') && !isCollapsed(current)) {
					current.click();
					return;
				}
				const parentUid = current.closest<HTMLElement>('[data-section-list]')?.dataset.pageUid;
				if (parentUid) {
					target = nav.querySelector<HTMLAnchorElement>(
						`a[data-section-trigger][data-page-uid="${parentUid}"]`,
					);
				}
				break;
			}
			default:
				return;
		}

		if (!target) return;
		e.preventDefault();
		setTabbable(nav, target);
		target.focus();
	});

	nav.addEventListener('click', (e: MouseEvent) => {
		const btn = (e.target as Element).closest<HTMLAnchorElement>('a[data-section-trigger]');
		if (!btn) return;
		queueMicrotask(() => {
			const tabbable = nav.querySelector<HTMLAnchorElement>('a[tabindex="0"]');
			if (!tabbable || getVisibleLinks(nav).includes(tabbable)) return;
			setTabbable(nav, btn);
		});
	});
}
