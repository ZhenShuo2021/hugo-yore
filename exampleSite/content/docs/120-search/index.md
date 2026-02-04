---
title: "Search"
slug: "search"
description: "Configure the site-wide search functionality powered by Fuse.js."
weight: 120
date: 2026-01-22T16:30:00+08:00
tags: ["search", "fuse.js", "configuration", "documentation"]
series: ["Documentation"]
series_weight: 120
---

Yore built-in search utilizes [Fuse.js](https://www.fusejs.io/) to provide client-side indexing and real-time search results.

## Configuration

To enable search functionality, you must configure both the global parameters and the Hugo output formats. Ensure the search feature is toggled on:

```yaml {title="hugo.yaml"}
params:
  searchEnabled: true
```

Search requires a JSON index to function. Update your `hugo.yaml` to generate the `fuse-search` output for the home page:

```yaml {title="hugo.yaml"}
outputs:
  home:
    - HTML
    - RSS
    - fuse-search

outputFormats:
  fuse-search:
    mediaType: application/json
    baseName: fuse-search
    isPlainText: true
    notAlternative: true
    weight: 10
```

> [!INFO]
> To exclude specific pages from the search index, use the `pageNoList` parameter in that page's front matter.

## Keyboard Shortcuts

- `/`, `Ctrl + K` or `Cmd + K` to open the search modal.
- `Esc` to close.
- `ArrowUp` and `ArrowDown` to navigate

## Search Scope & Weighting

The search module indexes all the [regular pages](https://gohugo.io/methods/site/regularpages), following fields with decreasing priority:

1. **Title** (Highest weight)
2. **Summary** & **Headings**
3. **Content** (Lowest weight)
