class FootnoteTooltip {
	constructor() {
		this.tooltip = null;
		this.tooltipContent = null;
		this.currentTarget = null;
		this.hideTimeout = null;
		this.init();
	}

	init() {
		this.createTooltip();
		this.attachEventListeners();
	}

	createTooltip() {
		this.tooltip = document.createElement('div');
		this.tooltip.className = 'footnote-tooltip';

		this.tooltipContent = document.createElement('div');
		this.tooltipContent.className = 'prose dark:prose-invert footnote-tooltip-content';

		this.tooltip.appendChild(this.tooltipContent);
		document.body.appendChild(this.tooltip);

		this.tooltip.addEventListener('mouseenter', () => {
			clearTimeout(this.hideTimeout);
		});

		this.tooltip.addEventListener('mouseleave', () => {
			this.scheduleHide();
		});
	}

	attachEventListeners() {
		document.addEventListener('mouseover', (e) => {
			const footnoteRef = e.target.closest('.footnote-ref');
			if (footnoteRef) {
				clearTimeout(this.hideTimeout);
				this.showTooltip(footnoteRef);
			}
		});

		document.addEventListener('mouseout', (e) => {
			const footnoteRef = e.target.closest('.footnote-ref');
			if (footnoteRef && !footnoteRef.contains(e.relatedTarget)) {
				this.scheduleHide();
			}
		});

		document.addEventListener('pointerup', (e) => {
			const footnoteRef = e.target.closest('.footnote-ref');

			if (footnoteRef) {
				clearTimeout(this.hideTimeout);

				if (this.currentTarget === footnoteRef && this.tooltip.classList.contains('is-visible')) {
					this.hideTooltip();
				} else {
					this.showTooltip(footnoteRef);
				}
				return;
			}

			if (!this.tooltip.contains(e.target)) {
				this.hideTooltip();
			}
		});

		document.addEventListener('click', (e) => {
			if (e.target.closest('.footnote-ref')) {
				e.preventDefault();
			}
		});
	}

	hideTooltip() {
		clearTimeout(this.hideTimeout);
		this.tooltip.classList.remove('is-visible');
		this.currentTarget = null;
	}

	scheduleHide() {
		clearTimeout(this.hideTimeout);
		this.hideTimeout = setTimeout(() => {
			this.hideTooltip();
		}, 150);
	}

	showTooltip(refLink) {
		const href = refLink.getAttribute('href');
		const footnoteId = href.substring(1);

		const footnoteElement = document.getElementById(footnoteId);
		if (!footnoteElement) return;

		const content = footnoteElement.cloneNode(true);
		const backrefs = content.querySelectorAll('.footnote-backref');
		backrefs.forEach((el) => el.remove());

		this.tooltipContent.innerHTML = content.innerHTML;
		this.tooltip.classList.add('is-visible');

		this.positionTooltip(refLink);

		this.currentTarget = refLink;
	}

	positionTooltip(refLink) {
		const GAP = 8;
		const EDGE_PADDING = 10;

		const rect = refLink.getBoundingClientRect();
		const { width: tooltipWidth, height: tooltipHeight } = this.tooltip.getBoundingClientRect();
		const viewportWidth = document.documentElement.clientWidth;

		const spaceBelow = window.innerHeight - rect.bottom;
		const spaceAbove = rect.top;
		const showBelow = spaceBelow >= tooltipHeight + GAP + EDGE_PADDING || spaceBelow >= spaceAbove;

		const top = showBelow ? rect.bottom + GAP : Math.max(EDGE_PADDING, rect.top - tooltipHeight - GAP);
		this.tooltip.setAttribute('data-placement', showBelow ? 'bottom' : 'top');

		// Horizontally: Centered on the link; if it extends beyond the viewport,
		// it will be contained within the boundaries
		const linkCenterX = rect.left + rect.width / 2;
		const minLeft = EDGE_PADDING;
		const maxLeft = viewportWidth - tooltipWidth - EDGE_PADDING;
		const left = Math.max(minLeft, Math.min(linkCenterX - tooltipWidth / 2, maxLeft));

		this.tooltip.style.left = `${left}px`;
		this.tooltip.style.top = `${top}px`;
	}
}

const footnoteTooltip = new FootnoteTooltip();

export default FootnoteTooltip;
