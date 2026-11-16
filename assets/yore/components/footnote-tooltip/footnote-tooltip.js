import { defineModule } from '../../core/js/modules.js';

// Not using the popover API due to 3 polyfill requirements, positioning issue, and modern JS/CSS API.
// The current implementation meets WCAG 1.4.13 with minimal additional code.
//
// https://github.com/GoogleChrome/modern-web-guidance/blob/22ab18dfb50a5d7e3bdcf471c14076a5534eae4e/skills/modern-web-guidance/guides/ui-behaviors/interest-triggered-tooltips.md
// https://github.com/GoogleChrome/modern-web-guidance/blob/22ab18dfb50a5d7e3bdcf471c14076a5534eae4e/skills/modern-web-guidance/guides/ui-atoms/position-aware-tooltips.md
class FootnoteTooltip {
	constructor() {
		this.tooltip = null;
		this.tooltipContent = null;
		this.currentTarget = null;
		this.hideTimeout = null;
		this.touched = false;
		this.createTooltip();
		this.attachEventListeners();
	}

	// Returns the description nodes it created so the caller can remove them with the page
	scanFootnotes(scope = document) {
		const descs = [];
		scope.querySelectorAll('.footnote-ref').forEach((el) => {
			const footnote = document.getElementById(el.getAttribute('href').substring(1));
			if (!footnote) return;
			const desc = document.createElement('div');
			desc.id = `${footnote.id}-desc`;
			desc.hidden = true;
			desc.setAttribute('data-footnote-desc', '');
			desc.innerHTML = this.getContent(footnote);
			document.body.appendChild(desc);
			descs.push(desc);
			el.setAttribute('aria-describedby', desc.id);
		});
		return descs;
	}

	getContent(footnote) {
		const content = footnote.cloneNode(true);
		content.querySelectorAll('.footnote-backref').forEach((el) => el.remove());
		return content.innerHTML;
	}

	createTooltip() {
		this.tooltip = document.createElement('div');
		this.tooltip.className = 'footnote-tooltip';
		// use aria-describedby
		this.tooltip.setAttribute('aria-hidden', 'true');

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

		document.addEventListener('focusin', (e) => {
			const footnoteRef = e.target.closest('.footnote-ref');
			if (footnoteRef) {
				clearTimeout(this.hideTimeout);
				this.showTooltip(footnoteRef);
			}
		});

		document.addEventListener('focusout', (e) => {
			const footnoteRef = e.target.closest('.footnote-ref');
			if (footnoteRef) {
				this.hideTooltip();
			}
		});

		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && this.tooltip.classList.contains('is-visible')) {
				// APG: keep focus on the trigger element throughout; hover must not steal focus
				this.hideTooltip();
			}
		});

		document.addEventListener('pointerup', (e) => {
			const footnoteRef = e.target.closest('.footnote-ref');

			if (footnoteRef) {
				if (e.pointerType !== 'touch') return;
				this.touched = true;
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
			// Only intercept touch-generated clicks; keyboard Enter and mouse keep link navigation
			if (this.touched && e.target.closest('.footnote-ref')) {
				e.preventDefault();
			}
			this.touched = false;
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

		this.tooltipContent.innerHTML = this.getContent(footnoteElement);
		this.tooltip.classList.add('is-visible');

		this.positionTooltip(refLink);

		this.currentTarget = refLink;
	}

	positionTooltip(refLink) {
		const arrowSize = parseFloat(getComputedStyle(this.tooltip).getPropertyValue('--arrow-size'));
		const GAP = Math.round(arrowSize * Math.SQRT1_2); // rotate 45 degree
		const ARROW_EDGE = 8 + GAP;
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

		const arrowX = Math.max(ARROW_EDGE, Math.min(linkCenterX - left, tooltipWidth - ARROW_EDGE));
		this.tooltip.style.setProperty('--arrow-x', `${arrowX}px`);

		this.tooltip.style.left = `${left}px`;
		this.tooltip.style.top = `${top + 4}px`;
	}
}

const footnoteTooltip = new FootnoteTooltip();

defineModule('footnotes', (root) => {
	const descs = footnoteTooltip.scanFootnotes(root);
	return () => {
		footnoteTooltip.hideTooltip();
		descs.forEach((el) => el.remove());
	};
});
