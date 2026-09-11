function activatePanel(container, activeIndex) {
	const buttons = container.querySelectorAll('.tab__button');
	const panels = container.querySelectorAll('.tab__panel');

	buttons.forEach((btn, index) => {
		const isActive = index === activeIndex;
		btn.classList.toggle('tab--active', isActive);
		btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
	});

	panels.forEach((panel, index) => {
		const isActive = index === activeIndex;
		// Panels holding an echarts/mermaid instance must stay in the layout
		// (off-screen, not `hidden`) while inactive so the chart library can
		// render into real dimensions ahead of time. See tabs.css for the
		// matching `:has([id^='echart-'], .mermaid)` rule.
		const holdsChart = panel.querySelector('[id^="echart-"], .mermaid') !== null;

		panel.classList.toggle('tab--active', isActive);
		panel.hidden = !isActive && !holdsChart;

		if (isActive) {
			panel.querySelectorAll('[id^="echart-"]').forEach((chartDom) => {
				chartDom.dispatchEvent(new CustomEvent('tab-activated'));
			});
		}
	});
}

// Roving tabindex
function setFocusableTab(buttons, focusIndex) {
	buttons.forEach((btn, index) => {
		btn.setAttribute('tabindex', index === focusIndex ? '0' : '-1');
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
			setFocusableTab(groupButtons, groupTargetIndex);
		});
	} else {
		const buttons = container.querySelectorAll('.tab__button');
		activatePanel(container, targetIndex);
		setFocusableTab(buttons, targetIndex);
	}
}

function tabClickHandler(event) {
	const button = event.target.closest('.tab__button');
	if (!button) return;

	const container = button.closest('.tab__container');
	const tabIndex = parseInt(button.dataset.tabIndex);

	button.focus();
	switchTabs(container, tabIndex);
}

function tabKeydownHandler(event) {
	const button = event.target.closest('.tab__button');
	if (!button) return;

	const container = button.closest('.tab__container');
	const buttons = Array.from(container.querySelectorAll('.tab__button'));
	const currentIndex = buttons.indexOf(button);

	let nextIndex = null;

	switch (event.key) {
		case 'ArrowRight':
		case 'ArrowDown':
			nextIndex = (currentIndex + 1) % buttons.length;
			break;
		case 'ArrowLeft':
		case 'ArrowUp':
			nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
			break;
		case 'Home':
			nextIndex = 0;
			break;
		case 'End':
			nextIndex = buttons.length - 1;
			break;
		case ' ':
			event.preventDefault();
			return;
		default:
			return;
	}

	event.preventDefault();
	setFocusableTab(buttons, nextIndex);
	buttons[nextIndex].focus();
}

function initTabs() {
	document.querySelectorAll('.tab__container').forEach((container) => {
		const defaultTab = container.dataset.defaultTab;
		const panels = container.querySelectorAll('.tab__panel');
		const buttons = container.querySelectorAll('.tab__button');

		let expectedIndex = 0;
		if (defaultTab) {
			panels.forEach((panel, index) => {
				if (panel.dataset.tabLabel === defaultTab) expectedIndex = index;
			});
		}

		const alreadyCorrect =
			panels[expectedIndex]?.classList.contains('tab--active') &&
			buttons[expectedIndex]?.classList.contains('tab--active');

		if (!alreadyCorrect) {
			activatePanel(container, expectedIndex);
		}

		setFocusableTab(buttons, expectedIndex);
	});

	document.addEventListener('click', tabClickHandler);
	document.addEventListener('keydown', tabKeydownHandler);
}

initTabs();

export {};
