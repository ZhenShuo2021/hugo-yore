---
title: "Service Worker"
slug: "service-worker"
description: "Configure the Service Worker for offline support and asset caching."
weight: 400
date: 2026-06-27T00:00:00+08:00
tags: ["guide", "scripting", "offline-caching"]
params:
  sourceLinks:
    - path: "assets/js/sw/sw.js"
    - path: "assets/js/sw/config.json.tmpl"
    - path: "layouts/_partials/head/resources.html"
---

The Service Worker intercepts network requests to serve cached assets as a fallback when offline, keeping the site accessible without a network connection.

The Service Worker is intentionally disabled in local development to prevent it from interfering with live page reloads and content updates.

## Configuration

All keys go under `params.sw` in `hugo.yaml`.

| Key | Type | Default | Description |
|---|---|---|---|
| `sw.enable` | `boolean` | `false` | Registers and activates the Service Worker. |
| `sw.precache.html` | `boolean` | `false` | Proactively cache all HTML pages in the background. Pages are fetched idly (one at a time) to avoid competing with user-initiated requests. HTML requests are always served network-first with offline fallback, regardless of this setting. |
| `sw.precache.assets` | `boolean` | `false` | Proactively cache critical assets during Service Worker installation, before the user visits any page. When disabled, assets are cached on first visit. |

```yaml {title="hugo.yaml"}
params:
  sw:
    enable: true
    precache:
      html: true
      assets: true
```
