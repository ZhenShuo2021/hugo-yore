---
title: "Content Type"
weight: 40
date: 2026-07-07T00:00:00+08:00
description: "How to assign a content type (blog, docs, gallery) to your pages."
tags: ["concept", "hugo-core"]
params:
  sourceLinks:
---

Yore provides three content types: `blog`, `docs`, and `gallery`. Each type renders pages with a different set of templates and supports a different set of configuration fields. This guide shows you how to assign a type to your pages.

## Setup

There are two ways to assign a content type to a page.

### Directory-based

Place your Markdown files under the matching content directory. Hugo automatically assigns the type based on the directory name:

```txt
content/docs/     → type: docs
content/gallery/  → type: gallery
```

The default type `blog` is assigned if the path doesn't match any of them.

### Cascade

Use `cascade` when your content structure does not map directly to the matching directory. Set it in `hugo.yaml` to target arbitrary path patterns, or in a section's `_index.md` to scope it to that section only.

```yaml {title="hugo.yaml"}
cascade:
  - type: docs
    target:
      path: '{/shortcodes,/shortcodes/**}'
```

```yaml {title="content/shortcodes/_index.md"}
---
title: Shortcode Section
cascade:
  type: docs
---
```

The `hugo.yaml` setup is more flexible and centralized than front matter setup.

## What's next

- To setup blog pages, see [Blog Configuration](../80-blog/index.md).
- To setup docs pages, see [Docs Configuration](../120-docs/index.md).
- To setup gallery pages, see [Gallery Configuration](../160-gallery/index.md).
- To see a detailed explanation of the features Yore provides, see the [Features section](../../200-features/40-color-scheme/index.md).
