# hugo-theme-yore

A text-first Hugo theme. Hugo v0.146.0 new template system · Tailwind CSS v4 · pnpm

## Design Philosophy

Typography is the primary design element. No shadows, gradients, or decorative borders unless they serve a
functional purpose (e.g. distinguishing interactive elements). Maintain WCAG AA contrast in both light and dark
themes.

## Development

```sh
pnpm dev:hugo     # Hugo dev server
pnpm dev:css      # Tailwind watch
pnpm build:hugo   # Build example site
pnpm build:css    # Build Tailwind
```

## Hard Rules

Follow these rules without exception or explanation.

- **No nested `define`**, no `define` inside `if/else/with`, one `return` per partial. Hugo silently ignores or errors on these.
- **No `IsSet`**. Use `with` (skip if falsy) or `| default value` (provide fallback).
- **No direct edits to `i18n/*.yaml`**. Always use `node scripts/manage-i18n.js`.
- **Avoid `dark:` prefix**. Dark mode uses `data-theme` attribute. Semantic tokens (e.g. `bg-background`, `text-foreground`) resolve per-theme automatically.
- Always trim spaces unless it cannot be trimmed (`{{- ... -}}`).

## Hugo v0.146.0 Template Paths

This project uses Hugo's new template system. The paths below are what this project actually uses:

- Page templates live at `layouts/` root: `page.html`, `section.html`, `taxonomy.html`, `term.html`, `home.html`
- Partials: `layouts/_partials/` (not `layouts/partials/`)
- Shortcodes: `layouts/_shortcodes/` (not `layouts/shortcodes/`)
- Internal templates: call with `{{ partial "x.html" . }}` (not `{{ template "_internal/x.html" . }}`)
- Base template naming: dot-separated (`baseof.list.html`, not `list-baseof.html`)

## `define` and Partial Calling

The `define` name determines how to call it:

```go-html-template
{{ define "_partials/inline/foo.html" }}...{{ end }}
{{/* -> {{ partial "inline/foo.html" . }} */}}

{{ define "foo" }}...{{ end }}
{{/* -> {{ template "foo" . }} */}}
```

## Where New Code Goes

| What                                      | Where                                               |
| ----------------------------------------- | --------------------------------------------------- |
| Reusable UI component                     | `_partials/components/`                             |
| Data-only helper (returns value, no HTML) | `_partials/lib/`                                    |
| Shortcode                                 | `_shortcodes/`, complex logic in `_partials/impls/` |
| JS feature                                | `assets/yore/components/<name>/`                    |
| CSS component                             | `assets/yore/components/<name>/`                    |
| Home layout variant                       | `_partials/home/` (plain CSS only, no Tailwind)     |

## CSS Rules

1. Always use Tailwind CSS.
2. Variant classes (e.g. `is-active`) go in a standalone CSS file under `assets/yore/components/<name>/`.
3. Reusable atomic utility classes go in `assets/yore/core/css/utilities.css`.

## JS Rules

1. Generic JS goes in `assets/yore/components/<name>/`, always imported by `assets/yore/core/js/main.js.tmpl`.
2. Generic JS is referenced by HTML as `type="module"`, so no DOM-load listener is needed. Code must conform to module rules.
3. Small non-generic JS (tabs, accordion, roughly 20 lines) is also loaded by `main.js.tmpl`.
4. Large non-generic JS is loaded individually in its own HTML. For shortcodes, gate it with `.HasShortcode`.
5. Conditional loading: Use `.Page.Store` only for conditional loading.
6. Duplicated loading check: `.Page.Store` is the worst option, since Store values update incorrectly during Hugo live reload.

## JS Build Pattern

Pass Hugo values into JS through `js.Build` params, read in JS with `import * as params from '@params'`:

```go-html-template
{{- $jsParams := dict "myKey" (site.Params.myValue | default "fallback") }}
{{- $opts := dict "format" "esm" "minify" (not hugo.IsServer) "target" hugo.Data.theme.esBuildTarget "params" $jsParams }}
{{- $js := resources.Get "js/my-script.js" | js.Build $opts | fingerprint }}
<script type="module" src="{{ $js.RelPermalink }}" integrity="{{ $js.Data.Integrity }}"></script>
```

## A11y Rules

Check both the standard media query and the custom a11y feature together. Example for reduced motion:

```css
@media not (prefers-reduced-motion: reduce) {
  html:not([data-a11y-reduce-motion]) {
    /* ... */
  }
}
```

This project's a11y features:

1. high-contrast
2. reduce-motion
3. reduce-transparency
4. link-underline

Details are in the first 20 lines of `layouts/_partials/head/resources.html`, and the a11y panel is controlled by `assets/yore/components/a11y/a11y.js`.

## Naming

- Files (templates, JS, CSS): kebab-case
- Hugo template variables: camelCase
- JS variables and functions: camelCase
- `site.Params` keys: camelCase
- i18n keys: `group.snake_case_key`
