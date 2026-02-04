---
title: "Reference - Icons"
weight: 1000
lastmod: 2022-03-09
date: 2026-01-15T14:45:00+08:00
description: "Reference guide for built-in and custom SVG icon support using shortcodes and partials."
tags: ["icons", "svg", "shortcodes", "reference", "documentation"]
series: ["Documentation"]
series_weight: 1000
---

This page lists all built-in icons in Yore.

You can also use custom icons by placing SVG assets in the `assets/icons/` directory at your project root. To enable automatic color matching, ensure every SVG path includes the `fill="currentColor"` attribute.

Access these icons using the `{{</* icon "ICON_NAME" */>}}` shortcode or the `{{ partial "components/icon.html" "ICON_NAME" }}` partial.

{{< docs-icon >}}
