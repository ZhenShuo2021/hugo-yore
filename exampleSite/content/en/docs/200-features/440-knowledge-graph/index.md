---
title: Knowledge Graph
slug: "knowledge-graph"
description: Visualize relationships between posts using backlinks and taxonomy with an interactive graph.
weight: 440
date: 2026-05-02T11:59:00+08:00
tags: ["guide", "hugo-core", "knowledge-graph", "content-organization", "visualization"]
params:
  sourceLinks:
    - url: "https://github.com/ZhenShuo2021/hugo-knowledge-graph/blob/main/layouts/home.knowledge-graph.json"
---

Knowledge Graph visualizes [backlink][backlink] and taxonomy relationships between articles as an interactive graph. Yore supports [Hugo Knowledge Graph][hkg] with no additional HTML/CSS configuration.

## Installation & Configuration

Pick one of these methods to set up.

### Git Submodule

```bash
git submodule add https://github.com/ZhenShuo2021/hugo-knowledge-graph themes/hugo-knowledge-graph
```

Configure `hugo.yaml`:

```yaml
theme:
  - hugo-knowledge-graph
  - hugo-yore

outputs:
  home:
    # The original outputs
    - html
    - rss
    # Add this lines
    - backlinks
    - knowledge-graph

params:
  pageKgStyle: bottom # bottom | sidebar | disable
```

### Hugo Module

Make sure your project already uses Hugo modules. If not, run `hugo mod init NAME` first.

Configure `hugo.yaml`:

```yaml
module:
  imports:
    - path: github.com/ZhenShuo2021/hugo-yore
    - path: github.com/ZhenShuo2021/hugo-knowledge-graph

outputs:
  home:
    # The original outputs
    - html
    - rss
    # Add this lines
    - backlinks
    - knowledge-graph

params:
  pageKgStyle: bottom # bottom | sidebar | disable
```

> [!NOTE]
> Yore already includes Hugo's embedded link render hook, so you do not need to set `useEmbedded = "always"`.

## Usage

`pageKgStyle` controls where the knowledge graph widget appears. `bottom` places it at the bottom of the page. `sidebar` places it above the ToC.

Creating `content/graph/_index.md` will generate the full version of the knowledge graph, including legend filters and search functionality.

For detailed configuration, refer to the [Hugo Knowledge Graph][hkg] README.

[hkg]: https://github.com/ZhenShuo2021/hugo-knowledge-graph
[backlink]: /docs/200-features/360-backlinks/index.md
