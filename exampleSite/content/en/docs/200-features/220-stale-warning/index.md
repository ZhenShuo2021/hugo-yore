---
title: "Stale Content Warning"
linkTitle: Stale Warning
slug: "stale-content-warning"
description: "Display a warning when an article has not been updated in a long time."
weight: 220
date: 2026-07-22T00:08:00+08:00
tags: ["guide", "stale-warning"]
params:
  sourceLinks:
    - path: "layouts/_partials/components/stale-warning.html"
---

The stale content warning shows an admonition on an article when it has not been updated within a configurable number of days. The partial reads `lastmod` in front matter, and falls back to `date`.

## Configuration

Set `staleContentWarning` to enable this feature, and set `staleDays` to control how many days may pass before an article is considered stale.

```yaml {title="hugo.yaml"}
params:
  staleContentWarning: true
  staleDays: 365
```

The `staleDays` defaults to `365`.
