---
title: Page Actions
slug: page-actions
weight: 320
date: 2026-04-19T06:50:00+08:00
description: "Per-page action menu with copy URL, copy Markdown, and view repo source."
tags: ["guide", "scripting", "page-actions"]
params:
  sourceLinks:
    - path: "assets/js/page-actions.js"
    - path: "layouts/_partials/page/page-actions.html"
---

Page actions add a per-page dropdown menu with utilities for sharing and inspecting content.

## Configuration

All keys go under `params` in `hugo.yaml`. `pageShowActions` can also be set per-page in front matter.

| Key | Type | Description |
|---|---|---|
| `pageShowActions` | bool | Show the page actions menu |
| `repoURL` | string | Branch root URL, enables *View Repo Source* |
| `repoSubdir` | string | Path from repo root to Hugo project directory; set when the Hugo project is not at the repo root |

`repoURL` must point to the branch root, not the repository root. For example:

```yaml {title="hugo.yaml"}
params:
  pageShowActions: true
  repoURL: https://github.com/example/my-site/blob/main
  repoSubdir: exampleSite  # omit if Hugo project is at repo root
```

## Actions

Some actions are always available. Others require additional configuration to activate.

| Action | Condition |
|---|---|
| Copy URL | Always present |
| Copy Markdown | Requires `markdown` in page outputs |
| View Source | Requires `markdown` in page outputs |
| View Repo Source | Requires `repoURL` |

Copy Markdown and View Source serve the raw Markdown of the current page. Set the `markdown` output in `hugo.yaml`:

```diff {title="hugo.yaml"}
outputs: # Custom output formats per page type
  home:
    - HTML
    - RSS
    - backlinks
    - knowledge-graph
+   - markdown
  section:
    - HTML
    - RSS
+   - markdown
  page:
    - HTML
+   - markdown
```
