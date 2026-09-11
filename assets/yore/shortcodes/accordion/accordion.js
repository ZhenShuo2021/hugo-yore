function initAccordion(root) {
	if (root.dataset.accordionReady) return;
	root.dataset.accordionReady = 'true';

	var exclusive = root.dataset.exclusive === 'true';
	var triggers = root.querySelectorAll('.accordion-trigger');

	triggers.forEach(function (trigger) {
		trigger.addEventListener('click', function () {
			var panel = document.getElementById(trigger.getAttribute('aria-controls'));
			var willOpen = trigger.getAttribute('aria-expanded') !== 'true';

			if (exclusive && willOpen) {
				triggers.forEach(function (otherTrigger) {
					if (otherTrigger === trigger) return;
					otherTrigger.setAttribute('aria-expanded', 'false');
					var otherPanel = document.getElementById(otherTrigger.getAttribute('aria-controls'));
					if (otherPanel) otherPanel.classList.remove('is-open');
				});
			}

			trigger.setAttribute('aria-expanded', String(willOpen));
			if (panel) panel.classList.toggle('is-open', willOpen);
		});
	});
}

document.querySelectorAll('[data-accordion]').forEach(initAccordion);
