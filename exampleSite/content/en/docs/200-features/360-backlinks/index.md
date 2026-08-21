---
title: "Backlinks"
slug: "backlinks"
description: "Enable and configure bidirectional linking to track article references."
weight: 360
date: 2026-01-22T16:40:00+08:00
tags: ["guide", "hugo-core", "backlinks", "content-organization"]
params:
  sourceLinks:
    - path: "layouts/_markup/render-link.backlinks.json"
    - path: "layouts/home.backlinks.json"
---

Yore embeds a backlink system based on [jmooring/hugo-module-backlinks](https://github.com/jmooring/hugo-module-backlinks) to track and display bidirectional links.

## Configuration

Add `backlinks` to `outputs.home` to generate the backlink index, and set `pageShowBacklinks: true` to display backlinks on pages:

```yaml {title="hugo.yaml"}
outputs:
  home:
    # The original outputs
    - html
    - rss
    # Add this line
    - backlinks
params:
  pageShowBacklinks: true
```

## Link Resolution

Backlinks are only detected when the link path can be resolved by Hugo's `.GetPage`. Simply put, you should always use syntax that includes the file extension (.md). This way, if resolution fails, you'll immediately notice that the link path includes `.md`, and your IDE will also be able to correctly recognize the file, enabling the jump-to-article feature to work properly.

It's recommended to use this alongside [rumdl](https://github.com/rvben/rumdl). The [MD057](https://rumdl.dev/md057/) rule can check the correctness of your links, and even supports custom root directories, allowing you to write `content/posts/p1.md` as `/posts/p1.md` while still having it checked correctly.

## How It Works

During rendering, Hugo's `render-link` hook intercepts each internal link and calls `.GetPage` on the destination path. If the path resolves to a page, a backlink entry is recorded in a global store that is built once per site build.
