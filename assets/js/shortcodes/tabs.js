function activateTab(container, activeIndex) {
	const buttons = container.querySelectorAll('.tab__button');
	const panels = container.querySelectorAll('.tab__panel');

	buttons.forEach((btn, index) => {
		if (index === activeIndex) {
			btn.classList.add('tab--active');
			btn.setAttribute('aria-selected', 'true');
		} else {
			btn.classList.remove('tab--active');
			btn.setAttribute('aria-selected', 'false');
		}
	});

	panels.forEach((panel, index) => {
		if (index === activeIndex) {
			panel.classList.add('tab--active');
			panel.querySelectorAll('[id^="echart-"]').forEach((chartDom) => {
				chartDom.dispatchEvent(new CustomEvent('tab-activated'));
			});
		} else {
			panel.classList.remove('tab--active');
		}
	});
}

function tabClickHandler(event) {
	const button = event.target.closest('.tab__button');
	if (!button) return;

	const container = button.closest('.tab__container');
	const tabIndex = parseInt(button.dataset.tabIndex);
	const tabLabel = button.dataset.tabLabel;
	const group = container.dataset.tabGroup;

	if (group) {
		const allGroupContainers = document.querySelectorAll(`.tab__container[data-tab-group="${group}"]`);

		allGroupContainers.forEach((groupContainer) => {
			const targetButton = Array.from(groupContainer.querySelectorAll('.tab__button')).find(
				(btn) => btn.dataset.tabLabel === tabLabel,
			);

			if (targetButton) {
				const targetIndex = parseInt(targetButton.dataset.tabIndex);
				activateTab(groupContainer, targetIndex);
			}
		});
	} else {
		activateTab(container, tabIndex);
	}
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
			activateTab(container, expectedIndex);
		}
	});

	document.addEventListener('click', tabClickHandler);
}

initTabs();

export {};
