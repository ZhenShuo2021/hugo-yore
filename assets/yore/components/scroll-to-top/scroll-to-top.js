const btn = document.getElementById('scroll-to-top');
const sentinel = document.getElementById('scroll-sentinel');

new IntersectionObserver(function (entries) {
	btn.classList.toggle('visible', !entries[entries.length - 1].isIntersecting);
}).observe(sentinel);

btn.addEventListener('click', function () {
	window.scrollTo({ top: 0, behavior: 'instant' });
});
