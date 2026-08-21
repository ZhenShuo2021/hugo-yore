---
title: Favicon
slug: favicon
weight: 160
date: 2026-01-30T21:09:00+08:00
description: "Configure the favicon and site icons for your website."
tags: ["guide", "favicon", "icons"]
params:
  sourceLinks:
    - path: "layouts/_partials/head/favicons.html"
---

Favicons are icons that represent websites on browser tabs. This page explains how to provide favicon resources and how to customize them when the default formats are insufficient.

## Setup

Place the following assets in the `/assets/favicons` directory.

```shell
assets/favicons/
├── favicon.ico
├── favicon.svg
├── apple-touch-icon.png
├── android-chrome-192x192.png
├── android-chrome-512x512.png
└── site.webmanifest
```

All files are optional. The simplest setup is a single `favicon.ico`. See [How to Favicon in 2026: Three files that fit most needs](https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs) for recommended favicon formats and browser support details.

## Custom Favicon Setup

If the favicon format does not match the built-in requirements, create `layouts/partials/head/favicons.html` to [override](../../320-advanced/120-customization/index.md#override-templates) the default settings.

## Favicon Not Updating

Test using a guest profile in your browser. If the favicon appears correctly there, the issue is browser caching on your original profile, not a problem with your setup.
