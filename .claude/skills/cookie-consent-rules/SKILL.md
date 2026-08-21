---
name: cookie-consent-rules
description: Cookie consent storage management rules for hugo-theme-yore. Use when working on any JS file that reads or writes localStorage/sessionStorage, or when integrating new features with the cookie consent system.
---

## System Overview

- Cookie consent controlled by `site.Params.cookieConsent` (default `true`)
- `cc:onConsent` is dispatched natively by cookieconsent to `window` — never dispatch it manually
- Consent state lives in `utils.consent` (`assets/js/utils.js`)
- When `cookieConsent: false`: all storage works immediately, no event wait

## `utils.consent` API

```js
utils
	.consent
	.isGranted(
		category = 'functional',
	); // sync; returns false until resolved
utils
	.consent
	.onReady(
		fn,
	); // deferred until consent resolved; immediate if already resolved
```

## Every entry point must pass `cookieConsent` via `js.Build` params

`utils.js` reads `params.cookieConsent` at build time. Each bundled entry point needs it:

| Entry point          | Where to pass                                                |
| -------------------- | ------------------------------------------------------------ |
| `main.js`            | `layouts/_partials/head/js.html`                             |
| `docs-nav.js`        | `layouts/_partials/docs/main.html`                           |
| Any new shortcode JS | its shortcode template, using `js.Build` (not bare `minify`) |

## Adding storage to a new JS file

1. `import { utils } from './utils.js'` (adjust path)
2. **Read** (restore state on load) → wrap in `utils.consent.onReady(() => { ... })`
3. **Write** (persist a user action) → guard with `if (utils.consent.isGranted()) { ... }`
4. Functions that don't touch storage run immediately — do not gate them

```js
// restore saved state — needs consent
utils
	.consent
	.onReady(
		() => {
			const saved = utils
				.storage
				.get(
					KEY,
				);
			if (
				saved
			) {
				apply(
					saved,
				);
			}
		},
	);

// persist user action — guard the write, not the action itself
function onUserAction(
	value,
) {
	applyToDOM(
		value,
	); // always runs
	if (
		utils
			.consent
			.isGranted()
	) {
		utils
			.storage
			.set(
				KEY,
				value,
			); // gated
	}
}
```

## Rules

- All theme storage keys are **functional** category — do not invent new categories
- Never modify existing function signatures to pass consent state; query `utils.consent` inside
- Before shipping: grep `localStorage.setItem`, `sessionStorage.setItem`, `storage.set`, `storage.setRaw` —
  every write must be gated or inside `onReady`
