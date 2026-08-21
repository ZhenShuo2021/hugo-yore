---
name: yore-tailwind
description: Tailwind CSS v4 and design token system reference for hugo-theme-yore. Use when working on CSS, styling, color tokens, dark mode, theme customization, or any design system questions. Triggers for questions about token layers, semantic token usage, CSS load order, or the @theme static block.
---

## Tailwind CSS v4 Setup

- Entry: `assets/css/tailwind/main.css` imports `tailwindcss`, then `theme.css`, `typography.css`, components
- Dark mode variant: `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));`
- Theme tokens defined in `theme.css` using `@theme static { ... }`
- Source scanning uses `hugo_stats.json`; homepage partials excluded via `@source not`
- Enabled via `site.Params.hugoTailwind`; when disabled, `compiled.css` is used instead

### CSS file load order (`assets/css/main.css`)

1. Color scheme (`schemes/<name>.css`)
2. Tailwind compiled or import
3. Layout (`layout.css`)
4. Tokens (`tokens.css`)
5. Components (a11y, chroma, masonry, misc, tabs, toc, etc.)
6. Custom (`custom-advanced.css`, optional `custom.css`)

---

## Design Token System

Three layers:

1. **Raw palette** (`--clr-*`): defined per-site in color scheme files under `assets/css/schemes/`. Scales:
   `neutral`, `accent`, `brand` (50–950)
2. **Tailwind theme** (`--color-*`): mapped in `theme.css` `@theme static` block, consumed as Tailwind utilities
3. **Semantic tokens** (`--background`, `--foreground`, etc.): set per theme in `tokens.css` using
   `html[data-theme='light']` / `html[data-theme='dark']`

### Key semantic tokens

| Token                                    | Purpose                               |
| ---------------------------------------- | ------------------------------------- |
| `--background` / `--foreground`          | Page background & body text           |
| `--card` / `--card-foreground`           | Article lists, sidebar cards          |
| `--muted` / `--muted-foreground`         | Code blocks, ToC bg / dates, captions |
| `--primary` / `--primary-foreground`     | CTA buttons                           |
| `--secondary` / `--secondary-foreground` | Cancel/secondary buttons              |
| `--border`                               | General borders                       |
| `--link` / `--link-hover`                | Link color                            |
| `--sidebar-*`                            | Sidebar/ToC component tokens          |
| `--destructive`                          | Error states                          |

### Usage pattern

```html
<!-- Always prefer semantic tokens -->
<div class="bg-background text-foreground border-border">

<!-- Raw palette only when no semantic token fits -->
<div class="bg-neutral-100 text-neutral-400">
```

Dark mode is fully automatic via `data-theme` — no `dark:` prefix needed for semantic token utilities.

### Homepage exception

`_partials/home/` uses **plain CSS only** — never add Tailwind utilities there.
