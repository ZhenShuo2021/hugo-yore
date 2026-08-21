// Masonry layout, exposed globally as window.Masonry
//
// Custom usage — use window.Masonry in a </body> script (type="module"),
// not extend-head.html (runs before main bundle loads):
//   new window.Masonry(el, { itemSelector: '.card', minColumnWidth: 180 }).collectExisting();

// Class names below are duplicated in the CSS file; keep both in sync.
const CLASS_NAMES = {
	ready: 'masonry-js-ready',
	unknown: 'masonry-unknown',
	error: 'masonry-error',
	loaded: 'masonry-loaded',
};

const DEFAULT_OPTIONS = {
	minColumnWidth: 220,
	gapX: 12,
	gapY: null, // null => falls back to gapX / 2
	maxCols: 0,
	itemSelector: '.item',
	imageSelector: 'img',
};

export class Masonry {
	#container;
	#minColumnWidth;
	#gapX;
	#gapY;
	#maxCols;
	#itemSelector;
	#imageSelector;
	#columns = 1;
	#columnWidth = 0;
	#columnHeights = [];
	#items = [];
	#resizeObserver;
	#resizeScheduled = false;
	#resizeRafId = null;
	#lastContainerWidth = 0;
	#pendingCols = new Set();
	#flushScheduled = false;
	#flushRafId = null;
	#destroyed = false;

	constructor(container, options = {}) {
		this.#container = container;

		// Filter out undefined values before merging, so that callers can
		// pass `{ gapX: undefined }` (e.g. "this attribute wasn't present
		// on the element") without it clobbering the default.
		const provided = Object.fromEntries(Object.entries(options).filter(([, v]) => v !== undefined));
		const merged = { ...DEFAULT_OPTIONS, ...provided };
		this.#minColumnWidth = merged.minColumnWidth;
		this.#gapX = merged.gapX;
		this.#gapY = merged.gapY != null ? merged.gapY : this.#gapX / 2;
		this.#maxCols = merged.maxCols;
		this.#itemSelector = merged.itemSelector;
		this.#imageSelector = merged.imageSelector;

		// Replace the no-JS fallback first
		this.#container.classList.add(CLASS_NAMES.ready);

		// Compute columns synchronously once, instead of relying on
		// ResizeObserver's asynchronous first callback, to avoid
		// collectExisting() running before columns are ready and
		// causing a layout glitch.
		this.#computeColumns();
		this.#lastContainerWidth = this.#container.clientWidth;

		this.#resizeObserver = new ResizeObserver(() => this.#onResize());
		this.#resizeObserver.observe(this.#container);
	}

	#computeColumns() {
		const width = this.#container.clientWidth;
		if (width <= 0) {
			this.#columns = 1;
			this.#columnWidth = 0;
			this.#columnHeights = [0];
			return;
		}
		const autoCols = Math.max(1, Math.floor((width + this.#gapX) / (this.#minColumnWidth + this.#gapX)));
		// maxCols is a user-specified upper bound, not a forced value:
		// the actual column count is the smaller of "user upper bound"
		// and "auto column count the container width can fit". As the
		// container narrows (e.g. on mobile), autoCols naturally shrinks,
		// so min() lowers the column count automatically without needing
		// an extra breakpoint table or per-device config.
		const cols = this.#maxCols > 0 ? Math.min(this.#maxCols, autoCols) : autoCols;
		this.#columns = cols;
		this.#columnWidth = Math.max(0, (width - this.#gapX * (cols - 1)) / cols);
		this.#columnHeights = new Array(cols).fill(0);
	}

	#onResize() {
		this.#scheduleResizeFrame();
	}

	#scheduleResizeFrame() {
		if (this.#resizeScheduled) return;
		this.#resizeScheduled = true;
		this.#resizeRafId = requestAnimationFrame(() => {
			this.#resizeScheduled = false;
			this.#resizeRafId = null;
			if (this.#destroyed) return;
			// Skip relayout if width didn't actually change (e.g. only
			// height changed, which doesn't affect column layout).
			const newWidth = this.#container.clientWidth;
			if (newWidth === this.#lastContainerWidth) return;
			this.#lastContainerWidth = newWidth;
			this.#computeColumns();
			this.#relayoutAll();
		});
	}

	#relayoutAll() {
		this.#columnHeights.fill(0);
		for (const it of this.#items) {
			if (!it.placed) continue;
			this.#placeItem(it);
		}
		this.#updateContainerHeight();
	}

	#placeItem(it) {
		const shortest = this.#columnHeights.indexOf(Math.min(...this.#columnHeights));
		const x = shortest * (this.#columnWidth + this.#gapX);
		const y = this.#columnHeights[shortest];
		const h = this.#columnWidth > 0 ? this.#columnWidth / it.ratio : 0;

		it.col = shortest;
		it.el.style.width = this.#columnWidth + 'px';
		it.el.style.height = h + 'px';
		it.el.style.transform = `translate3d(${x}px, ${y}px, 0)`;

		this.#columnHeights[shortest] = y + h + this.#gapY;
	}

	#relayoutColumn(colIndex) {
		// The resize handler and the deferred column flush each run on
		// their own rAF schedule. If resize runs first and shrinks the
		// column count, the colIndex received here may already be a
		// stale index that no longer exists — bail out to avoid writing
		// into a phantom column beyond the current column count.
		if (colIndex >= this.#columns) return;
		const x = colIndex * (this.#columnWidth + this.#gapX);
		let y = 0;
		for (const it of this.#items) {
			if (it.col !== colIndex) continue;
			const h = this.#columnWidth > 0 ? this.#columnWidth / it.ratio : 0;
			it.el.style.height = h + 'px';
			it.el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
			y += h + this.#gapY;
		}
		this.#columnHeights[colIndex] = y;
		this.#updateContainerHeight();
	}

	#updateContainerHeight() {
		this.#container.style.height = Math.max(0, ...this.#columnHeights) + 'px';
	}

	#scheduleColumnFlush(colIndex) {
		this.#pendingCols.add(colIndex);
		if (this.#flushScheduled) return;
		this.#flushScheduled = true;
		this.#flushRafId = requestAnimationFrame(() => {
			this.#flushScheduled = false;
			this.#flushRafId = null;
			if (this.#destroyed) return;
			for (const col of this.#pendingCols) this.#relayoutColumn(col);
			this.#pendingCols.clear();
		});
	}

	// Scan existing item elements (per itemSelector) in the container. If
	// the img element carries width/height attributes (the standard HTML
	// way of declaring intrinsic image size), treat them as known
	// dimensions and position immediately. If unknown, do NOT
	// place the item yet — placing it now would mean choosing its column
	// based on a guessed ratio, and that column choice is never revisited
	// later (only its height within the column is corrected). Instead,
	// wait for the img's load/error event to get the real size, and only
	// then call #placeItem for the first time, so the column choice is
	// always based on real data.
	collectExisting() {
		// Re-entrancy guard: if this instance already collected items,
		// bail out instead of pushing duplicate entries into #items
		// (which would double-count column heights).
		if (this.#items.length > 0) return;

		const elements = this.#container.querySelectorAll(`:scope > ${this.#itemSelector}`);
		for (const el of elements) {
			const img = el.querySelector(this.#imageSelector);
			if (!img) continue;

			const dataW = Number(img.getAttribute('width')) || 0;
			const dataH = Number(img.getAttribute('height')) || 0;
			const known = dataW > 0 && dataH > 0;

			if (known) {
				const it = { el, ratio: dataW / dataH, img, placed: true };
				this.#items.push(it);
				this.#placeItem(it);
				this.#watchLoad(it, img, /* needsMeasure */ false);
			} else {
				// Not placed yet: no ratio, no column, not counted in
				// column heights until the real size is known.
				const it = { el, ratio: 0, img, placed: false };
				this.#items.push(it);
				this.#watchLoad(it, img, /* needsMeasure */ true);
			}
		}
		this.#updateContainerHeight();
	}

	#watchLoad(it, img, needsMeasure) {
		const onDone = (ok) => {
			if (this.#destroyed) return;
			if (!ok || !img.naturalWidth || !img.naturalHeight) {
				it.el.classList.remove(CLASS_NAMES.unknown);
				it.el.classList.add(CLASS_NAMES.error);
				return;
			}
			// Add the "loaded" class on the next frame to trigger the
			// opacity transition. If the class is added in the same tick
			// as the load event, the browser may paint the first frame
			// directly at opacity:1, and the fade-in effect would be lost.
			requestAnimationFrame(() => {
				if (this.#destroyed) return;
				img.classList.add(CLASS_NAMES.loaded);
			});

			if (needsMeasure) {
				it.ratio = img.naturalWidth / img.naturalHeight;
				it.el.classList.remove(CLASS_NAMES.unknown);
				if (!it.placed) {
					// First real placement: column choice is now based
					// on the true aspect ratio, not a guess.
					it.placed = true;
					this.#placeItem(it);
					this.#updateContainerHeight();
				} else {
					this.#scheduleColumnFlush(it.col);
				}
			}
		};

		// The image may already be in the complete state due to a browser
		// cache hit, in which case the load event won't fire again — we
		// need to check proactively once to avoid missing it.
		if (img.complete) {
			onDone(img.naturalWidth > 0 && img.naturalHeight > 0);
			return;
		}
		img.addEventListener('load', () => onDone(true), { once: true });
		img.addEventListener('error', () => onDone(false), { once: true });
	}

	destroy() {
		this.#destroyed = true;
		this.#resizeObserver.disconnect();
		this.#pendingCols.clear();
		if (this.#resizeRafId != null) cancelAnimationFrame(this.#resizeRafId);
		if (this.#flushRafId != null) cancelAnimationFrame(this.#flushRafId);
	}
}

// Convenience helper: reads configuration from an element's data-*
// attributes (matching the Hugo shortcode's output) and initializes a
// Masonry instance on it. Guards against double-initialization (e.g.
// script re-run, hot reload, or SPA-style partial page updates) by
// destroying any previous instance already attached to this element.
//
// This function owns the "how do I call Masonry from a data-attribute
// driven template" concern; the Masonry class itself has no knowledge
// of dataset reading or of being re-initialized on the same element.
export function initMasonryFromElement(el) {
	if (el.__masonryInstance) {
		el.__masonryInstance.destroy();
		el.__masonryInstance = null;
	}

	const gapX = el.dataset.gapX != null ? Number(el.dataset.gapX) : undefined;
	const masonry = new Masonry(el, {
		minColumnWidth: el.dataset.minColumnWidth != null ? Number(el.dataset.minColumnWidth) : undefined,
		gapX,
		gapY: el.dataset.gapY != null ? Number(el.dataset.gapY) : undefined,
		maxCols: el.dataset.maxCols != null ? Number(el.dataset.maxCols) : undefined,
	});
	masonry.collectExisting();
	el.__masonryInstance = masonry;
	return masonry;
}
