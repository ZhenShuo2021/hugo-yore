---
name: yore-js
description: Rules for adding or changing JavaScript in hugo-theme-yore, which swaps pages with AJAX (swup). Use whenever writing, editing or reviewing any JS, adding a component or shortcode behavior, handling events, running per-page logic, or passing Hugo values into JS. Also use when touching main.js, modules.js or route.js.
---

# Yore JS

Pages are swapped by AJAX. Never call init or destroy for swapped content.
Every feature file registers itself at its top level. `main.js` only imports it, inside the same `{{ if site.Params.x }}` that gates the feature.

| # | Content | Bound to an element | Mechanism | Write |
| --- | --- | --- | --- | --- |
| 1 | Not replaced, or one registration covers it (event delegation) | - | Once | top-level code |
| 2 | Replaced | No | Route hook | `registerRouteHook(fn)` |
| 3 | Replaced | Yes | Element module | `defineModule(name, fn)` + `data-module` |

Replaced: `#main-content`, `.toc-sidebar`, `[data-swup-region]`, `.header-left`. Not replaced: `document`, `window`, header, footer, overlays.
One feature may use several rows. Put them in the same file.

## 1 Once

Runs when the file is imported. Do not export `init`.

```js
import delegateEvent from 'delegate-it';

delegateEvent('.tab__button', 'click', (e) => {
	const button = e.delegateTarget;
});
```

- Event delegation is mechanism 1 even when the target is replaced.
- Use `delegateEvent` from `delegate-it`. Non-bubbling events: use `focusin` and `mouseover`.
- A `window` value that other code needs is assigned in the same file.

Examples: scroll-to-top, search, mobile-menu, print, clicks of tabs and code copy.

## 2 Route hook

```js
import { registerRouteHook } from '../../core/js/route.js';

registerRouteHook(() => {
	startWork();
	return () => stopWork();
});
```

- Runs on load and after every content replacement. The returned cleanup runs before the next replacement.
- Keep these few.
- A module can follow navigation with `registerRouteHook(fn, { signal })`.

Examples: math, knowledge graph, PhotoSwipe lightbox.

## 3 Element module

```js
import { defineModule } from '../../core/js/modules.js';

defineModule('clock', (el, { signal }) => {
	el.addEventListener('click', onClick, { signal });
	const timer = setInterval(tick, 1000);
	return () => clearInterval(timer);
});
```

HTML: `data-module="clock"`. Several names are space separated.

- `el` is the element. Query inside `el` only.
- Pass `{ signal }` to every `addEventListener`, including on `document` and `window`.
- Return a cleanup function only for what `signal` cannot cover: timers, observers, library instances.
- May be `async`. Check `signal.aborted` after each `await`.
- No "already initialized" flags. Each element mounts once.
- Load a heavy library inside the module: `await import(params.xxx)` with `import * as params from '@params'`. Its URL and integrity go in `layouts/_partials/head/importmap.html`.
- The same Hugo Param gates the `main.js` import and the `data-module` output.
- Elements made by markdown (code blocks, footnotes) cannot carry the attribute. Put the name on `#main-content` through `layouts/_partials/lib/page-modules.html`.
- A file that only one shortcode or page publishes is not registered. The template puts its URL on the element: `data-module="name" data-module-src="{{ $js.RelPermalink }}"`. The file has `export default (el, { signal }) => cleanup?`.

Examples: carousel, chart, mermaid, typeit, toc, docs-nav, stale-warning, email, code copy buttons.

## Files

- JS lives in `assets/yore/components/<name>/` or `assets/yore/shortcodes/<name>/`.
- Hugo values reach JS through `js.Build` params: `import * as params from '@params'`.
- Shared names are unique and greppable: `delegateEvent`, `defineModule`, `registerRouteHook`.
- Never manually modify `assets/yore/lib`; only make changes through `scripts/post-install.js`.
