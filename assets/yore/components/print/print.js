const root = document.documentElement;
const printQuery = matchMedia('print');

let openedDetails = [];
let themeBeforePrint = null;

function dispatchAppearanceEvent(isDark) {
	window.dispatchEvent(
		new CustomEvent('appearance-changed', {
			detail: { appearance: isDark ? 'dark' : 'light' },
		}),
	);
}

function enterPrint() {
	// Open all closed details
	openedDetails = Array.from(document.querySelectorAll('details:not([open])'));
	openedDetails.forEach((d) => d.setAttribute('open', ''));

	// Force light theme without touching data-appearance or localStorage
	const theme = root.getAttribute('data-theme');
	if (themeBeforePrint === null && theme !== 'light') {
		themeBeforePrint = theme;
		root.setAttribute('data-theme', 'light');
		dispatchAppearanceEvent(false);
	}
}

function exitPrint() {
	openedDetails.forEach((d) => d.removeAttribute('open'));
	openedDetails = [];

	if (themeBeforePrint !== null) {
		const theme = themeBeforePrint;
		themeBeforePrint = null;
		root.setAttribute('data-theme', theme);
		dispatchAppearanceEvent(theme === 'dark');
	}
}

function init() {
	window.addEventListener('beforeprint', enterPrint);
	window.addEventListener('afterprint', exitPrint);
	// Some browsers fire only one of the two, so also listen to the media query
	printQuery.addEventListener('change', (e) => (e.matches ? enterPrint() : exitPrint()));
}

init();
