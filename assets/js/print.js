let openedDetails = [];
window.addEventListener('beforeprint', () => {
	openedDetails = Array.from(document.querySelectorAll('details:not([open])'));
	openedDetails.forEach((d) => d.setAttribute('open', ''));
});
window.addEventListener('afterprint', () => {
	openedDetails.forEach((d) => d.removeAttribute('open'));
	openedDetails = [];
});
