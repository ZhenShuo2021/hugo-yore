import PhotoSwipeLightbox from '../lib/photoswipe/photoswipe-lightbox.esm.min.js';
import PhotoSwipe from '../lib/photoswipe/photoswipe.esm.min.js';

function initPhotoSwipe() {
	const images = document.querySelectorAll('.prose img:not(a img)');

	images.forEach((img) => {
		const link = document.createElement('a');
		link.href = img.src;
		link.dataset.pswpWidth = img.getAttribute('width') || img.naturalWidth || 0;
		link.dataset.pswpHeight = img.getAttribute('height') || img.naturalHeight || 0;
		link.target = '_blank';

		const figure = img.closest('figure');
		const figcaption = figure ? figure.querySelector('figcaption') : null;
		if (figcaption) {
			link.dataset.captionHtml = figcaption.innerHTML;
		}

		img.parentNode.insertBefore(link, img);
		link.appendChild(img);
	});

	const lightbox = new PhotoSwipeLightbox({
		gallery: '.prose',
		children: 'a[data-pswp-width]',
		pswpModule: PhotoSwipe,

		bgOpacity: 0.97,
		showHideAnimationType: 'zoom',
		showAnimationDuration: 200,
		hideAnimationDuration: 200,
		zoomAnimationDuration: 200,

		paddingFn: (viewportSize, itemData) => {
			return {
				top: 10,
				bottom: itemData.element.dataset.captionHtml ? 50 : 30,
				left: 10,
				right: 10,
			};
		},
	});

	lightbox.on('uiRegister', function () {
		lightbox.pswp.ui.registerElement({
			name: 'download-button',
			order: 8,
			isButton: true,
			tagName: 'a',
			html: {
				isCustomSVG: true,
				inner:
					'<path d="M20.5 14.3 17.1 18V10h-2.2v7.9l-3.4-3.6L10 16l6 6.1 6-6.1ZM23 23H9v2h14Z" id="pswp__icn-download"/>',
				outlineID: 'pswp__icn-download',
			},
			onInit: (el, pswp) => {
				el.setAttribute('download', '');
				el.setAttribute('target', '_blank');
				el.setAttribute('rel', 'noopener');
				pswp.on('change', () => {
					el.href = pswp.currSlide.data.src;
				});
			},
		});

		lightbox.pswp.ui.registerElement({
			name: 'custom-caption',
			order: 9,
			isButton: false,
			appendTo: 'root',
			onInit: (el, pswp) => {
				pswp.on('change', () => {
					const currSlideElement = pswp.currSlide.data.element;
					if (currSlideElement && currSlideElement.dataset.captionHtml) {
						el.style.display = 'block';
						el.innerHTML = currSlideElement.dataset.captionHtml;
					} else {
						el.style.display = 'none';
					}
				});
			},
		});
	});

	lightbox.init();
}

initPhotoSwipe();

export {};
