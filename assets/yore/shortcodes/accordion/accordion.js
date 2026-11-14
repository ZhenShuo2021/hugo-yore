import delegateEvent from 'delegate-it';

delegateEvent('.accordion-trigger', 'click', (e) => {
	const trigger = e.delegateTarget;
	const root = trigger.closest('[data-accordion]');
	if (!root) return;

	const exclusive = root.dataset.exclusive === 'true';
	const panel = document.getElementById(trigger.getAttribute('aria-controls'));
	const willOpen = trigger.getAttribute('aria-expanded') !== 'true';

	if (exclusive && willOpen) {
		root.querySelectorAll('.accordion-trigger').forEach((other) => {
			if (other === trigger) return;
			other.setAttribute('aria-expanded', 'false');
			document.getElementById(other.getAttribute('aria-controls'))?.classList.remove('is-open');
		});
	}

	trigger.setAttribute('aria-expanded', String(willOpen));
	if (panel) panel.classList.toggle('is-open', willOpen);
});
