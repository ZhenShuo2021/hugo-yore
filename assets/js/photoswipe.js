import PhotoSwipeLightbox from '../lib/photoswipe/photoswipe-lightbox.esm.min.js';
import PhotoSwipe from '../lib/photoswipe/photoswipe.esm.min.js';

const lightboxOptions = {
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
};

function initPhotoSwipe() {
	// --- Article images ---
	const proseImages = document.querySelectorAll(
		'.prose img:not(a img):not(.carousel-slide img):not(.carousel-thumb img)',
	);

	proseImages.forEach((img) => {
		const link = wrapImageForLightbox(img);
		link.classList.add('pswp-link');

		const figure = img.closest('figure');
		const figcaption = figure ? figure.querySelector('figcaption') : null;
		if (figcaption) {
			link.dataset.captionHtml = figcaption.innerHTML;
		}
	});

	const proseLightbox = new PhotoSwipeLightbox({
		...lightboxOptions,
		gallery: '.prose',
		children: 'a.pswp-link',
	});
	registerLightboxUI(proseLightbox);
	proseLightbox.init();

	// --- Carousel slide images ---
	const carouselImages = document.querySelectorAll('.carousel-slide img:not(a img)');

	carouselImages.forEach((img) => {
		const link = wrapImageForLightbox(img);
		link.style.display = 'flex';
		link.style.alignItems = 'center';
		link.style.justifyContent = 'center';
		link.style.width = '100%';
		link.style.height = '100%';

		const slide = img.closest('.carousel-slide');
		if (slide && slide.dataset.caption) {
			link.dataset.captionHtml = slide.dataset.caption;
		}
	});

	const carouselLightbox = new PhotoSwipeLightbox({
		...lightboxOptions,
		gallery: '[data-pswp-carousel]',
		children: 'a[data-pswp-width]',
	});
	registerLightboxUI(carouselLightbox);
	carouselLightbox.init();
}

// --- Helpers ---

function wrapImageForLightbox(img) {
	const link = document.createElement('a');
	link.href = img.src;
	link.target = '_blank';
	link.style.gridRowEnd = img.style.gridRowEnd;

	const altText = img.getAttribute('alt');
	link.setAttribute('aria-label', altText ? `Open image in lightbox: ${altText}` : 'Open image in lightbox');

	const w = img.getAttribute('width') || img.naturalWidth;
	const h = img.getAttribute('height') || img.naturalHeight;
	link.dataset.pswpWidth = w || 1600;
	link.dataset.pswpHeight = h || 900;

	if (!w || !h) {
		img.addEventListener(
			'load',
			() => {
				link.dataset.pswpWidth = img.naturalWidth || 1600;
				link.dataset.pswpHeight = img.naturalHeight || 900;
			},
			{ once: true },
		);
	}

	img.parentNode.insertBefore(link, img);
	link.appendChild(img);
	return link;
}

function registerLightboxUI(lightbox) {
	lightbox.on('openingAnimationEnd', () => {
		const handler = () => {
			lightbox.pswp?.close();
			window.removeEventListener('wheel', handler);
		};
		window.addEventListener('wheel', handler, { once: true });
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
				el.setAttribute('aria-label', 'Download image');
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
				el.setAttribute('aria-live', 'polite');
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
}

initPhotoSwipe();

export {};
