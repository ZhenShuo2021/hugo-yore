# hugo-theme-yore

A text-first Hugo theme. Hugo v0.146.0 new template system, Tailwind CSS v4, pnpm.

## Hard Rules

Never violate these rules.

- Never nest `define`. Never put `define` inside `if/else/with`. Use one `return` per partial.
- Never edit `i18n/*.yaml` directly. Always use `node scripts/manage-i18n.js`.
- Never use the `dark:` prefix. Dark mode uses the `data-theme` attribute, and semantic tokens (e.g. `bg-background`, `text-foreground`) resolve per theme automatically.
- Always use trim markers (`{{- ... -}}`) unless trimming would change the output.

## Workflow

Work incrementally. In the first pass, implement only the core behavior. Do not write documentation, handle exhaustive edge cases, or polish details. Treat the first pass as a draft and wait for feedback before refining.

## Environment Setup

Run this first to detect the environment:

```sh
[ -d /mnt/user-data ] && echo sandbox || echo normal
```

If `sandbox`, follow [sandbox-env/SKILL.md](.claude/skills/sandbox-env/SKILL.md) and skip the rest of this section.

If `normal`, ensure these are installed:

1. pnpm
2. hugo (version: `grep HUGO_VERSION ./build.sh | head -1`)
3. go (version: `grep GO_VERSION ./build.sh | head -1`)

Commands:

```sh
pnpm dev:hugo     # Hugo dev server
pnpm dev:css      # Tailwind watch
pnpm build:hugo   # Build example site
pnpm build:css    # Build Tailwind
```

## Design Principles

Typography is the primary design element. Do not add shadows, gradients, or decorative borders unless they serve a functional purpose (e.g. distinguishing interactive elements). Maintain WCAG a11y guidelines.

## Hugo Templates

Paths used by this project:

- Page templates are at the `layouts/` root: `page.html`, `section.html`, `taxonomy.html`, `term.html`, `home.html`
- Partials: `layouts/_partials/` (not `layouts/partials/`)
- Shortcodes: `layouts/_shortcodes/` (not `layouts/shortcodes/`)
- Base templates use dot-separated names (`baseof.list.html`, not `list-baseof.html`)

The `define` name determines how to call it:

```go-html-template
{{ define "_partials/inline/foo.html" }}...{{ end }}
{{/* call: {{ partial "inline/foo.html" . }} */}}

{{ define "foo" }}...{{ end }}
{{/* call: {{ template "foo" . }} */}}
```

## Where New Code Goes

| What                             | Where                            |
| -------------------------------- | -------------------------------- |
| Reusable UI component            | `_partials/components/`          |
| Data-only helper (returns value) | `_partials/lib/`                 |
| Shortcode                        | `_shortcodes/`                   |
| JS/CSS feature                   | `assets/yore/components/<name>/` |

## CSS Rules

1. Always use Tailwind CSS.
2. Put variant classes (e.g. `yr-active`) in a standalone CSS file under `assets/yore/components/<name>/`.
3. Prefix all custom classes with `yr-`.
4. Put reusable atomic utility classes in `assets/yore/core/css/utilities.css`.

## JS Rules

Generic JS means JS reused across pages. Non-generic JS belongs to one feature.

1. Put generic JS in `assets/yore/components/<name>/` and always import it from `assets/yore/core/js/main.js`.
2. HTML loads generic JS with `type="module"`. Do not use a DOM-load listener. Code must follow ES module rules.
3. Small non-generic JS (tabs, accordion, roughly 20 lines) is also imported from `main.js`.
4. Large non-generic JS is loaded individually in its own HTML.
5. Load conditionally. For shortcodes, gate with `.HasShortcode`. Otherwise, gate with `.Page.Store`.

Pass Hugo values into JS through `js.Build` params and read them with `import * as params from '@params'`:

```go-html-template
{{- $jsParams := dict "myKey" (site.Params.myValue | default "fallback") }}
{{- $opts := dict "format" "esm" "minify" (not hugo.IsServer) "target" hugo.Data.theme.esBuildTarget "params" $jsParams }}
{{- $js := resources.Get "js/my-script.js" | js.Build $opts | fingerprint }}
<script type="module" src="{{ $js.RelPermalink }}" integrity="{{ $js.Data.Integrity }}"></script>
```

## A11y Rules

Every style affected by an a11y feature must check both the standard media query and the custom attribute. Example for reduced motion:

```css
@media not (prefers-reduced-motion: reduce) {
  html:not([data-a11y-reduce-motion]) {
    /* ... */
  }
}
```

Supported a11y features:

1. high-contrast
2. reduce-motion
3. reduce-transparency
4. link-underline

Implementation details are in `assets/yore/core/js/critical.js`. The a11y panel is controlled by `assets/yore/components/a11y/a11y.js`.

## Naming

- Files (templates, JS, CSS): kebab-case
- Hugo template variables: camelCase
- JS variables and functions: camelCase
- `site.Params` keys: camelCase
- i18n keys: `group.snake_case_key`
