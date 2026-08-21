---
title: "Reference - Icons"
weight: 1000
date: 2026-01-15T14:45:00+08:00
description: "Reference guide for the icon shortcode and partial, covering built-in icon sets and custom SVG icons."
tags: ["reference", "shortcodes", "icons", "assets"]
---

The `icon` shortcode and partial render inline SVG icons.

## Usage

Use the shortcode in Markdown files, or the partial in layouts. Pass the icon name, or a path relative to `assets/icons/`. A bare name resolves to the first match, and a full path matches exactly. **A bare name is sufficient in most cases**.

```go-template {title="Use as shortcode"}
{{</* icon "twitter" */>}}
{{</* icon "fa/brands/twitter" */>}}
```

```go-template {title="Use as partial"}
{{ partial "components/icon.html" "twitter" }}
{{ partial "components/icon.html" "fa/brands/twitter" }}
```

## Custom Icons

Place any `.svg` file under `assets/icons/` in your project root. Add `fill="currentColor"` to the SVG root element so the icon inherits the surrounding text color.

## References

All available icons are listed below.

### Yore

Icons bundled with the theme. Path prefix: `yore/`.

{{< _internal/icon-reference path="yore/" >}}

### Brand

Icons sourced from [Fort Awesome Brands](https://fontawesome.com/icons/packs/brands). Path prefix: `fa/brands/`.

{{< _internal/icon-reference path="yore" path="fa/brands/" >}}

### Iconoir

Icons sourced from [Iconoir](https://iconoir.com/). Path prefixes: `iconoir/regular/` and `iconoir/solid/`. Iconoir icons are not printed due to the size of the collection.

Notable icons are:

- menu
- nav
- arrow

#### Regular

{{< _internal/icon-reference path="yore" path="iconoir/regular/" printIcon=false >}}

#### Solid

{{< _internal/icon-reference path="yore" path="iconoir/solid/" printIcon=false >}}
