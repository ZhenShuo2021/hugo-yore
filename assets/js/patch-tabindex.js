// patch code and table render hooks' tabindex
function isScrollable(el) {
	return el.scrollWidth > el.clientWidth;
}

function setTabindex(el, scrollable) {
	if (scrollable) el.setAttribute('tabindex', '0');
	else el.removeAttribute('tabindex');
}

function getScrollTarget(wrapper) {
	// table wrapper scrolls itself, code wrapper scrolls via its inner pre
	return wrapper.hasAttribute('data-code-wrapper') ? wrapper.querySelector('pre') : wrapper;
}

function initScrollableWrappers() {
	const wrappers = document.querySelectorAll('[data-table-wrapper], [data-code-wrapper]');
	if (wrappers.length === 0) return;

	const scrollers = [];
	wrappers.forEach((wrapper) => {
		const scroller = getScrollTarget(wrapper);
		if (scroller) scrollers.push(scroller);
	});

	const ro = new ResizeObserver((entries) => {
		// prevent layout thrashing
		const updates = entries.map((entry) => ({
			target: entry.target,
			scrollable: isScrollable(entry.target),
		}));

		updates.forEach(({ target, scrollable }) => {
			setTabindex(target, scrollable);
		});
	});

	let started = false;

	function start() {
		if (started) return;
		started = true;
		scrollers.forEach((scroller) => {
			setTabindex(scroller, isScrollable(scroller));
			ro.observe(scroller);
		});
	}

	document.addEventListener(
		'keydown',
		(e) => {
			if (e.key === 'Tab') start();
		},
		{ once: true, capture: true },
	);
}

initScrollableWrappers();
export { initScrollableWrappers };
