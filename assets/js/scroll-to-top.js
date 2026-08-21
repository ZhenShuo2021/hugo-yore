const btn = document.getElementById('scroll-to-top');
const threshold = 50;

function toggleButton() {
	if (window.scrollY > threshold) {
		btn.classList.add('visible');
	} else {
		btn.classList.remove('visible');
	}
}

window.addEventListener('scroll', toggleButton, { passive: true });
toggleButton();

btn.addEventListener('click', function () {
	window.scrollTo({ top: 0, behavior: 'instant' });
});
