const DURATION = 25;
const FRICTION = 0.68;
const STEP = 1000 / 60;
const SETTLE_LIMIT = 0.0001;

const instances = new WeakMap();

const mod = (n, m) => ((n % m) + m) % m;

const shouldReduceMotion = () =>
	window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
	document.documentElement.hasAttribute('data-a11y-reduce-motion');

function findRoots(scope) {
	// The carousel root is the parent element of its viewport
	return Array.from(scope.querySelectorAll('.carousel-viewport'), (viewport) => viewport.parentElement).filter(Boolean);
}

function createCarousel(root) {
	const viewport = root.querySelector('.carousel-viewport');
	const strip = root.querySelector('.carousel-strip');
	const counter = root.querySelector('.carousel-counter');
	const caption = root.querySelector('.carousel-caption');
	const thumbs = root.querySelectorAll('.carousel-thumb');
	const slides = root.querySelectorAll('.carousel-item');
	if (!viewport || !strip || !caption || !slides.length) return null;

	const total = slides.length;
	const abort = new AbortController();
	const { signal } = abort;
	let current = 0;

	// Positions are measured in slide widths, so no pixel measurement is needed
	let targetPos = 0;
	let pos = 0;
	let prevPos = 0;
	let velocity = 0;
	let rafId = 0;
	let lastTime = null;
	let lag = 0;
	let stripX = null;
	const shifts = new Array(total).fill(0);

	function render(alpha) {
		const offset = pos * alpha + prevPos * (1 - alpha);

		const x = Math.round(-offset * 100 * 1000) / 1000;
		if (x !== stripX) {
			strip.style.transform = `translate3d(${x}%,0,0)`;
			stripX = x;
		}

		// Each slide is moved to its nearest copy so wrapping takes the shortest path
		slides.forEach((slide, i) => {
			const k = Math.round((offset - i) / total);
			if (k !== shifts[i]) {
				slide.style.transform = k ? `translateX(${k * total * 100}%)` : '';
				shifts[i] = k;
			}
		});

		return offset;
	}

	function update() {
		prevPos = pos;
		velocity += (targetPos - pos) / DURATION;
		velocity *= FRICTION;
		pos += velocity;
	}

	function stop() {
		if (rafId) cancelAnimationFrame(rafId);
		rafId = 0;
		lastTime = null;
		lag = 0;
	}

	function tick(time) {
		if (!rafId) return;

		if (lastTime === null) {
			lastTime = time;
			update();
			update();
		}

		lag += Math.min(time - lastTime, 100);
		lastTime = time;
		while (lag >= STEP) {
			update();
			lag -= STEP;
		}

		const offset = render(lag / STEP);

		if (Math.abs(targetPos - offset) < SETTLE_LIMIT) {
			stop();
			pos = prevPos = targetPos;
			velocity = 0;
			render(1);
			return;
		}

		rafId = requestAnimationFrame(tick);
	}

	function start() {
		if (rafId) return;
		rafId = requestAnimationFrame(tick);
	}

	function jump() {
		stop();
		pos = prevPos = targetPos;
		velocity = 0;
		render(1);
	}

	function syncUI() {
		if (counter) counter.textContent = `${current + 1} / ${total}`;
		caption.textContent = thumbs[current]?.getAttribute('data-caption') ?? '';

		thumbs.forEach((t, i) => {
			t.classList.toggle('border-accent-500', i === current);
			t.classList.toggle('border-transparent', i !== current);
		});

		slides.forEach((slide, i) => {
			slide.inert = i !== current;
		});
	}

	function scrollThumbIntoView() {
		const active = thumbs[current];
		if (!active) return;

		const { left: sL, right: sR } = active.parentElement.getBoundingClientRect();
		const { left: tL, right: tR } = active.getBoundingClientRect();
		if (tL < sL || tR > sR) {
			active.scrollIntoView({ inline: 'center', behavior: 'smooth', block: 'nearest' });
		}
	}

	function move(delta) {
		if (!delta) return;

		targetPos += delta;
		current = mod(targetPos, total);
		syncUI();
		scrollThumbIntoView();

		if (shouldReduceMotion()) {
			jump();
		} else {
			start();
		}
	}

	function goTo(index) {
		let delta = mod(index, total) - current;
		if (delta > total / 2) delta -= total;
		else if (delta < -total / 2) delta += total;
		move(delta);
	}

	function destroy() {
		abort.abort();
		stop();
		current = 0;
		syncUI();
		strip.style.transform = '';
		slides.forEach((slide) => {
			slide.style.transform = '';
			slide.inert = false;
		});
		thumbs[0]?.parentElement.classList.remove('thumb-hovered');
	}

	// Browsers scroll an overflow-hidden container when a clipped element gets focus, which conflicts with the transform
	viewport.addEventListener(
		'scroll',
		() => {
			viewport.scrollLeft = 0;
		},
		{ signal }
	);

	thumbs.forEach((thumb) => {
		thumb.addEventListener(
			'click',
			(e) => {
				e.preventDefault();
				e.stopPropagation();
				goTo(parseInt(thumb.getAttribute('data-index'), 10));
			},
			{ signal }
		);

		const thumbStrip = thumb.parentElement;
		thumb.addEventListener('mouseenter', () => thumbStrip.classList.add('thumb-hovered'), { signal });
		thumb.addEventListener('mouseleave', () => thumbStrip.classList.remove('thumb-hovered'), { signal });
	});

	root.querySelector('.carousel-prev')?.addEventListener('click', () => move(-1), { signal });
	root.querySelector('.carousel-next')?.addEventListener('click', () => move(1), { signal });

	syncUI();

	return { destroy };
}

export function initCarousels(scope = document) {
	findRoots(scope).forEach((root) => {
		if (instances.has(root)) return;
		const instance = createCarousel(root);
		if (instance) instances.set(root, instance);
	});
}

export function destroyCarousels(scope = document) {
	findRoots(scope).forEach((root) => {
		instances.get(root)?.destroy();
		instances.delete(root);
	});
}
