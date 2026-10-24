document.addEventListener('DOMContentLoaded', function () {
	const root = document.getElementById('themeSwitcher');
	const dynEl = document.getElementById('dynScheme');
	const CUSTOM_SCHEME_NAME = 'custom';
	const DEFAULT_SCHEME_NAME = 'latex';
	let schemes = {};
	try {
		schemes = JSON.parse(root.dataset.schemes || '{}');
	} catch (e) {}

	/* rewrite html[data-color-scheme="xxx"] selector name to newName,
		so an imported scheme's CSS matches whatever name it's applied under */
	function renameSchemeSelector(cssText, newName) {
		return cssText.replace(/data-color-scheme=(["'])[^"']*\1/g, `data-color-scheme="${newName}"`);
	}

	/* resolve oklch vars from a CSS string via a throwaway DOM node */
	function resolveColors(cssText, varNames, name) {
		const wrap = document.createElement('div');
		wrap.style.cssText = 'position:absolute;width:1px;height:1px;opacity:0;overflow:hidden';
		const st = document.createElement('style');
		st.textContent = cssText;
		wrap.appendChild(st);
		document.body.appendChild(wrap);

		const htmlEl = document.documentElement;
		const prev = htmlEl.getAttribute('data-color-scheme');
		htmlEl.setAttribute('data-color-scheme', name);

		const out = varNames.map((v) => {
			const p = document.createElement('div');
			p.style.cssText = `position:absolute;background:var(${v})`;
			wrap.appendChild(p);
			const c = getComputedStyle(p).backgroundColor;
			wrap.removeChild(p);
			return c === 'rgba(0, 0, 0, 0)' ? null : c;
		});

		if (prev === null) htmlEl.removeAttribute('data-color-scheme');
		else htmlEl.setAttribute('data-color-scheme', prev);

		document.body.removeChild(wrap);
		return out;
	}

	/* apply a scheme: inject CSS, let preview use its semantic tokens directly */
	function apply(cssText, name) {
		dynEl.textContent = cssText;
		document.documentElement.setAttribute('data-color-scheme', name);
	}

	/* populate pill dots from scheme CSS */
	function paintDots(name, cssText) {
		const el = document.getElementById(`dots-${name}`);
		if (!el) return;
		const [c1, c2, c3] = resolveColors(
			cssText,
			['--clr-neutral-300', '--clr-brand-500', '--clr-accent-500'],
			name,
		);
		const dots = el.querySelectorAll('.ts-dot');
		if (dots[0]) dots[0].style.background = c1 || '#888';
		if (dots[1]) dots[1].style.background = c2 || '#aaa';
		if (dots[2]) dots[2].style.background = c3 || '#ccc';
	}

	/* scheme picker */
	const picker = document.getElementById('schemePicker');
	if (picker) {
		const pills = picker.querySelectorAll('.ts-pill');
		pills.forEach((p) => {
			const n = p.dataset.scheme;
			if (schemes[n]) paintDots(n, schemes[n]);
			p.addEventListener('click', () => {
				pills.forEach((x) => x.classList.remove('on'));
				p.classList.add('on');
				if (schemes[n]) apply(schemes[n], n);
			});
		});
		/* apply default on load */
		const active = picker.querySelector('.ts-pill.on') || pills[0];
		if (active) {
			active.classList.add('on');
			const n = active.dataset.scheme;
			if (schemes[n]) apply(schemes[n], n);
		}
	}

	/* tabs */
	let cmReady = false;
	document.querySelectorAll('.ts-tab').forEach((tab) => {
		tab.addEventListener('click', () => {
			document.querySelectorAll('.ts-tab').forEach((t) => t.classList.remove('on'));
			document.querySelectorAll('.ts-pnl').forEach((p) => p.classList.remove('on'));
			tab.classList.add('on');
			document.getElementById(`pnl-${tab.dataset.p}`).classList.add('on');
			if (tab.dataset.p === 'custom') {
				if (!cmReady) initCM();
				else window._cm.focus();
			}
		});
	});

	/* load dropdown — built from schemes, no hardcoded data */
	function buildDrop() {
		const drop = document.getElementById('loadDrop');
		drop.innerHTML = '';
		Object.entries(schemes)
			.sort(([a], [b]) => a.localeCompare(b))
			.forEach(([name, css]) => {
				const item = document.createElement('div');
				item.className = 'ts-load-item';
				const dotWrap = document.createElement('div');
				dotWrap.className = 'ts-load-dots';
				const [c1, c2, c3] = resolveColors(
					css,
					['--clr-accent-500', '--clr-brand-500', '--clr-neutral-300'],
					name,
				);
				[c1 || '#888', c2 || '#aaa', c3 || '#ccc'].forEach((c) => {
					const d = document.createElement('div');
					d.className = 'ts-load-dot';
					d.style.background = c;
					dotWrap.appendChild(d);
				});
				const nm = document.createElement('span');
				nm.className = 'ts-load-name';
				nm.textContent = name;
				item.appendChild(dotWrap);
				item.appendChild(nm);
				item.addEventListener('click', () => {
					const renamed = renameSchemeSelector(css, CUSTOM_SCHEME_NAME);
					if (window._cm) window._cm.setValue(renamed);
					drop.classList.remove('on');
					apply(renamed, CUSTOM_SCHEME_NAME);
					picker?.querySelectorAll('.ts-pill').forEach((p) => p.classList.remove('on'));
				});
				drop.appendChild(item);
			});
	}

	document.getElementById('btnLoad')?.addEventListener('click', () => {
		const drop = document.getElementById('loadDrop');
		if (!drop.classList.contains('on')) {
			buildDrop();
			drop.classList.add('on');
		} else drop.classList.remove('on');
	});

	/* CodeMirror */
	function initCM() {
		const ta = document.getElementById('cssEditor');
		if (!ta || typeof CodeMirror === 'undefined') return;
		const cm = CodeMirror.fromTextArea(ta, {
			mode: 'css',
			theme: 'night',
			lineNumbers: false,
			lineWrapping: false,
			tabSize: 2,
			indentWithTabs: false,
		});
		window._cm = cm;
		cmReady = true;
		cm.focus();
		let t;
		cm.on('change', () => {
			const v = cm.getValue();
			clearTimeout(t);
			t = setTimeout(() => {
				if (v.trim() === '') {
					const fallback = schemes[DEFAULT_SCHEME_NAME];
					if (fallback) apply(fallback, DEFAULT_SCHEME_NAME);
				} else {
					apply(v, CUSTOM_SCHEME_NAME);
				}
			}, 400);
		});
	}
});
