---
title: Color Schemes
weight: 40
date: 2026-01-21T10:30:00+08:00
tags: ["guide", "styling", "color-scheme"]
params:
  sourceLinks:
    - path: "assets/css/schemes/"
---

Yore ships with several built-in color schemes, selectable via `themeColorScheme` in `hugo.yaml`.

A color scheme is a CSS file that defines three groups of color tokens, `--clr-neutral-*`, `--clr-brand-*`, and `--clr-accent-*`, which serve as the foundation from which the entire theme derives its colors.

```yaml {title="hugo.yaml"}
params:
  themeColorScheme: SCHEME-NAME
```

## Built-in schemes

Use the theme switcher below to preview all built-in schemes.

{{< _internal/theme-switcher >}}

## Create a custom scheme

{{% steps %}}

  {{< step label="1" >}}

  Create `assets/css/schemes/custom.css`. The file must define all 33 tokens, wrapped in a `html[data-color-scheme="custom"]` selector:

  ```css {title="assets/css/schemes/custom.css"}
  html[data-color-scheme="custom"] {
    --clr-neutral-50: oklch(1 0 0);
    --clr-neutral-100: oklch(0.97 0.01 248);
    --clr-neutral-200: oklch(0.93 0.03 256);
    --clr-neutral-300: oklch(0.87 0.04 253);
    --clr-neutral-400: oklch(0.71 0.05 257);
    --clr-neutral-500: oklch(0.55 0.06 257);
    --clr-neutral-600: oklch(0.45 0.05 257);
    --clr-neutral-700: oklch(0.34 0.04 256);
    --clr-neutral-800: oklch(0.21 0.03 253);
    --clr-neutral-900: oklch(0.17 0.014 258);
    --clr-neutral-950: oklch(0.14 0.01 266);

    --clr-brand-50: oklch(0.95 0.02 242);
    --clr-brand-100: oklch(0.88 0.06 248);
    --clr-brand-200: oklch(0.82 0.1 247);
    --clr-brand-300: oklch(0.74 0.14 247);
    --clr-brand-400: oklch(0.69 0.17 249);
    --clr-brand-500: oklch(0.65 0.19 251);
    --clr-brand-600: oklch(0.62 0.21 256);
    --clr-brand-700: oklch(0.57 0.2 259);
    --clr-brand-800: oklch(0.43 0.2 262);
    --clr-brand-900: oklch(0.35 0.2 268);
    --clr-brand-900: oklch(0.19 0.2 268);

    --clr-accent-50: oklch(0.957 0.049 151.7);
    --clr-accent-100: oklch(0.891 0.096 151.2);
    --clr-accent-200: oklch(0.812 0.154 150.1);
    --clr-accent-300: oklch(0.726 0.164 149.5);
    --clr-accent-400: oklch(0.634 0.162 148.4);
    --clr-accent-500: oklch(0.524 0.14 148.1);
    --clr-accent-600: oklch(0.439 0.118 148.1);
    --clr-accent-700: oklch(0.374 0.104 148.5);
    --clr-accent-800: oklch(0.314 0.088 149.3);
    --clr-accent-900: oklch(0.26 0.07 151.1);
  }
  ```

  {{< /step >}}

  {{< step label="2" >}}

  Set `themeColorScheme` to the file name (without `.css`):

  ```yaml {title="hugo.yaml"}
  params:
    themeColorScheme: custom
  ```

  {{< /step >}}
  {{% /steps %}}

For how these tokens map to semantic variables like `--background`, `--foreground`, and `--primary`, see the [customization guide](../../320-advanced/120-customization/index.md#base-colors).
