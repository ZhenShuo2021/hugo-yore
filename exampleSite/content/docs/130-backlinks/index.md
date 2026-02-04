---
title: "Backlinks"
slug: "backlinks"
description: "Enable and configure bidirectional linking to track article references."
weight: 130
date: 2026-01-22T16:40:00+08:00
tags: ["backlinks", "linking", "configuration", "documentation"]
series: ["Documentation"] 
series_weight: 130
---

Yore embeds a backlink system based on [jmooring/hugo-module-backlinks](https://github.com/jmooring/hugo-module-backlinks) to track and display bidirectional links.

## Principle

The system utilizes Hugo's `render-link` hook to capture internal references. It functions by passing the link's destination to the `.GetPage` method. If Hugo successfully resolves the path to a page, a backlink entry is recorded in the site-wide store.

> [!NOTE]
> Backlinks rely on global state. You need to restart the development server to see updated reference.

## Setup

Enable the `backlinks` output format in `hugo.yaml`:

```yaml {title="hugo.yaml"}
outputs:
  home:
    - HTML
    - RSS
    - backlinks
outputFormats:
  backlinks:
    mediaType: application/json
    baseName: backlinks
    isPlainText: true
    notAlternative: true
    weight: 1
params:
  backlinkEnabled: true
```

## Link Resolution

To ensure backlinks are correctly indexed, use paths relative to the current file or the `content` directory.

For example, with this directory structure:

```text
content/
├── docs/
│   ├── installation
│   │   └── index.md
│   └── usage.md
└── posts/
    └── feature-update.md
```

In `docs/installation/index.md`, you can reference the other content using:

- `[text](../usage.md)`
- `[text](/posts/feature-update.md)` or `[text](../../posts/feature-update.md)`

And in `docs/usage.md`, you can reference the other content using:

- `[text](./installation/index.md)`
- `[text](/posts/feature-update.md)` or `[text](../posts/feature-update.md)`

> [!CAUTION]
> For a backlink to be detected, the link path must be resolvable by Hugo's [GetPage](https://gohugo.io/methods/page/getpage/) method. If the path returns `nil`, the reference will not be indexed.
