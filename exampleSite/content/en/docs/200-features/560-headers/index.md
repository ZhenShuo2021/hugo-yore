---
title: "Headers"
slug: headers
weight: 560
date: 2026-10-24T22:35:00+08:00
description: "Enable Yore's default HTTP response header template to strengthen your site's security."
tags: ["guide", "hugo-core"]
params:
  sourceLinks:
    - path: "layouts/_partials/head/resources.html"
    - path: "layouts/home.headers"
---

Headers are the HTTP response headers a server sends along with its response to the browser. Yore includes a default headers template. When you enable it, Yore generates a `_headers` file.

## Before you begin

- The `_headers` file works only on Netlify and Cloudflare.
- Most sites don't need **custom headers**. Enable this feature only when you know why you need it.

## Configuration

Add `headers` to `outputs.home` to enable the default template:

```yaml {title="hugo.yaml"}
outputs:
  home:
    # Your existing output formats
    - html
    - rss
    # Add this line
    - headers
```

## What the template does

The [default template](https://github.com/ZhenShuo2021/hugo-yore/blob/main/layouts/home.headers) provides the following:

- Sets `charset=utf-8` for Markdown files so browsers don't display garbled text.
- Enables a strict Content Security Policy (CSP).
- Adds common security headers that enforce HTTPS, stop browsers from guessing file types, restrict embedding your site in other sites, and disable camera, microphone, geolocation, and payment permissions.

## How strict CSP affects your site

A strict CSP limits what your site can load:

- Inline scripts are blocked, and you can't insert script nodes dynamically with JavaScript.
- Scripts can come only from your own site and specific CDNs.
- Iframes are allowed only for Giscus and YouTube.
- Other restrictions also apply.

If you add your own inline scripts or content from other sources, the browser refuses to load them.

Yore is a purely static site, so a strict CSP offers limited practical benefit. If your site doesn't need to pass a strict security audit, don't enable the headers feature.
