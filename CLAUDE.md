# hugo-theme-yore

A text-first Hugo theme. Hugo v0.146.0 new template system · Tailwind CSS v4 · pnpm

## Design Philosophy

Typography is the primary design element. No shadows, gradients, or decorative borders unless they serve a
functional purpose (e.g. distinguishing interactive elements). Maintain WCAG AA contrast in both light and dark
themes.

---

## Hard Rules

These override any default assumption. Every rule exists because violations cause build failures or silent bugs
in this project.

- **No `{{ block }}`**. This project uses `{{ define "main" }}` in page templates rendered through
  `baseof.html`.
- **No nested `define`**, no `define` inside `if/else/with`, one `return` per partial. Hugo silently ignores or
  errors on these.
- **No `IsSet`**. Use `with` (skip if falsy) or `| default value` (provide fallback).
- **No direct edits to `i18n/*.yaml`**. Always use `scripts/i18n_input.txt` + `node scripts/manage-i18n.js` to
  add/remove keys. The script handles nested YAML structure and alphabetical sorting.
- **No `data-*` attributes or inline `<script>` for passing config to JS**. Use `js.Build` params (see JS Build
  Pattern below).
- **No `.Site.IsServer`**. Use `hugo.IsDevelopment` or `hugo.IsServer`.
- **Avoid `dark:` prefix**. Dark mode uses `data-theme` attribute. Semantic tokens (e.g. `bg-background`,
  `text-foreground`) resolve per-theme automatically.

---

## Hugo v0.146.0 Template Paths

This project uses Hugo's new template system. The paths below are what this project actually uses:

- Page templates live at `layouts/` root: `page.html`, `section.html`, `taxonomy.html`, `term.html`, `home.html`
- Partials: `layouts/_partials/` (not `layouts/partials/`)
- Shortcodes: `layouts/_shortcodes/` (not `layouts/shortcodes/`)
- Internal templates: call with `{{ partial "x.html" . }}` (not `{{ template "_internal/x.html" . }}`)
- Base template naming: dot-separated (`baseof.list.html`, not `list-baseof.html`)

---

## `define` and Partial Calling

The `define` name determines how to call it:

```go-html-template
{{ define "_partials/inline/foo.html" }}...{{ end }}
{{/* -> {{ partial "inline/foo.html" . }} */}}

{{ define "foo" }}...{{ end }}
{{/* -> {{ template "foo" . }} */}}
```

Calling conventions used in this project:

- Default: pass `.` (full page context)
- Custom context: `partial "x.html" (dict "key" val)`
- Dynamic name: `partial (printf "home/%s.html" layout) .`
- `partialCached` for pure/immutable partials (admonition maps, init, math)
- `templates.Exists` to gate optional extension points (`extend-head.html`, `comments.html`)

---

## Where New Code Goes

| What                                      | Where                                                                       |
| ----------------------------------------- | --------------------------------------------------------------------------- |
| Reusable UI component                     | `_partials/components/`                                                     |
| Data-only helper (returns value, no HTML) | `_partials/lib/`                                                      |
| Shortcode                                 | `_shortcodes/`, complex logic in `_partials/impls/`                         |
| JS feature                                | `assets/js/` as kebab-case `.js` file, wire in via `_partials/head/js.html` |
| CSS component                             | `assets/css/components/`                                                    |
| Home layout variant                       | `_partials/home/` (plain CSS only, no Tailwind)                             |

---

## JS Build Pattern

Pass Hugo values into JS through `js.Build` params, read in JS with `import * as params from '@params'`:

```go-html-template
{{- $jsParams := dict "myKey" (site.Params.myValue | default "fallback") }}
{{- $opts := dict "format" "esm" "minify" (not hugo.IsServer) "target" hugo.Data.theme.esBuildTarget "params" $jsParams }}
{{- $js := resources.Get "js/my-script.js" | js.Build $opts | fingerprint }}
<script type="module" src="{{ $js.RelPermalink }}" integrity="{{ $js.Data.Integrity }}"></script>
```

- JS and CSS are fingerprinted in production only.
- `esBuildTarget` comes from `hugo.Data.theme.esBuildTarget` (data file, not hardcoded).
- Tailwind CSS uses `templates.Defer` for deferred processing.

---

## i18n Workflow

Never edit `i18n/*.yaml` directly. Write changes to `scripts/i18n_input.txt`, then run
`node scripts/manage-i18n.js`:

```text
en:
+ dot.separated.key Value here
- old.key.to.remove

zh-TW:
+ dot.separated.key 對應翻譯
- old.key.to.remove
```

Key format: dot notation with snake_case segments (`a11y.font_size`, `article.related_articles`).

---

## Error Handling

**Hugo templates**: required values use `errorf` (stops build), recoverable issues use `warnf` (build
continues), optional values use `with` or `| default`.

**JavaScript**: wrap localStorage and fetch in `try/catch`. Use `console.warn` for expected/recoverable issues,
`console.error` for unexpected failures. Silent catch only for non-critical UI like clipboard.

**Shortcodes**: validate enum args with `errorf` on invalid values, use `| default` for optional args.

---

## Whitespace Trimming

Always trim spaces unless it cannot be trimmed (`{{- ... -}}`).

---

## Naming

- Files (templates, JS, CSS): kebab-case (`scroll-to-top.js`, `cookie-settings.html`)
- Hugo template variables: camelCase (`$isDocsPage`, `$imageOptimization`)
- JS variables and functions: camelCase (`themeManager`, `debounce`)
- `site.Params` keys: camelCase (`searchEnabled`, `tocHighlight`)
- i18n keys: `group.snake_case_key` (`a11y.font_size`, `search.input_placeholder`)

---

## Development

```sh
pnpm dev:hugo     # Hugo dev server
pnpm dev:css      # Tailwind watch
pnpm build:hugo   # Build example site
pnpm build:css    # Build Tailwind
```
