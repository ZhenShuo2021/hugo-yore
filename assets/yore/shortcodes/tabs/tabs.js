import delegateEvent from 'delegate-it';
import { defineModule } from '../../core/js/modules.js';

function activatePanel(container, activeIndex) {
	const buttons = container.querySelectorAll('.tab__button');
	const panels = container.querySelectorAll('.tab__panel');

	buttons.forEach((btn, index) => {
		const isActive = index === activeIndex;
		btn.ariaSelected = isActive;
		// focus entering the tablist lands on the selected tab (nomemory)
		btn.toggleAttribute('focusgroupstart', isActive);
	});

	panels.forEach((panel, index) => {
		const isActive = index === activeIndex;

		panel.toggleAttribute('data-active', isActive);
		panel.hidden = isActive ? false : 'until-found';
		if (isActive) panel.tabIndex = 0;
		else panel.removeAttribute('tabindex');
	});
}

function switchTabs(container, targetIndex) {
	const group = container.dataset.tabGroup;

	if (group) {
		const allGroupContainers = document.querySelectorAll(`.tab__container[data-tab-group="${group}"]`);
		const sourceButtons = container.querySelectorAll('.tab__button');
		const targetLabel = sourceButtons[targetIndex]?.dataset.tabLabel;

		allGroupContainers.forEach((groupContainer) => {
			const groupButtons = groupContainer.querySelectorAll('.tab__button');
			const targetButton = Array.from(groupButtons).find((btn) => btn.dataset.tabLabel === targetLabel);
			if (!targetButton) return;

			const groupTargetIndex = parseInt(targetButton.dataset.tabIndex);
			activatePanel(groupContainer, groupTargetIndex);
		});
	} else {
		activatePanel(container, targetIndex);
	}
}

// Selection follows focus, focusgroup moves focus with arrow keys. Click is kept for Safari, which does not focus buttons on click
for (const type of ['click', 'focusin']) {
	delegateEvent('.tab__button', type, (event) => {
		const button = event.delegateTarget;
		switchTabs(button.closest('.tab__container'), parseInt(button.dataset.tabIndex));
	});
}

// beforematch does not bubble, hence capture
document.addEventListener(
	'beforematch',
	(event) => {
		const panel = event.target.closest?.('.tab__panel');
		if (panel) switchTabs(panel.closest('.tab__container'), parseInt(panel.dataset.tabIndex));
	},
	true,
);

// Initial state of one container, data-module="tabs"
function initTabs(container) {
	const defaultTab = container.dataset.defaultTab;
	const panels = container.querySelectorAll('.tab__panel');

	let expectedIndex = 0;
	if (defaultTab) {
		panels.forEach((panel, index) => {
			if (panel.dataset.tabLabel === defaultTab) expectedIndex = index;
		});
	}
	activatePanel(container, expectedIndex);
}

defineModule('tabs', initTabs);
