---
title: Favicon
slug: favicon
weight: 90
date: 2026-01-30T21:09:00+08:00
description: "Configure the favicon and site icons for your website."
tags: ["favicon", "icons", "static-assets", "documentation"]
series: ["Documentation"]
series_weight: 90
---

A favicon is a small icon associated with a website. It is typically displayed in browser tabs, address bars, and bookmark lists to provide a visual identity for the site.

## Static Directory

Place the following assets in the `/static` directory to enable default favicon support:

```shell
static/
├── android-chrome-192x192.png
├── android-chrome-512x512.png
├── apple-touch-icon.png
├── favicon-16x16.png
├── favicon-32x32.png
├── favicon.ico
└── site.webmanifest
````

## Custom Favicon Setup

If the favicon format does not match the built-in requirements, create `layouts/partials/head/favicons.html` to override the default settings.

## Not Updating

If your favicon is not updating, it is usually due to browser caching. For example, to refresh the cache:

1. Press `F12` to open Chrome DevTools
2. Go to the `Network` panel
3. Enable `Disable cache`
4. Refresh the page
