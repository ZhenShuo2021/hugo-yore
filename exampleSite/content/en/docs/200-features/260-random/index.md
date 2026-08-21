---
title: "Random Page"
slug: "random-page"
description: "A page that redirects visitors to a randomly chosen page on the site."
weight: 260
date: 2026-07-22T20:59:00+08:00
tags: ["guide", "random-page", "content-organization"]
params:
  sourceLinks:
    - path: "layouts/random/all.html"
    - path: "assets/css/layout-random.css"
---

The random page lets readers discover a random article, giving older posts a chance to be seen again. Visiting this page picks a random page from the site and redirects the visitor to it, showing the chosen page's title with a typing animation before redirecting.

This feature works exactly like [content-type](../../160-configuration/40-content-type/index.md): a markdown page under `random`, or any page with `type: random` set in its front matter, is rendered with this layout.

[Try it](../../../random.md)

## Excluding Pages

Set `pageNoList` in a page's front matter to exclude it from being picked.

```yaml {title="content/posts/example-article.md"}
---
title: "Example Article"
pageNoList: true
---
```
