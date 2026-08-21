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

Set `pageShowStaleWarning` to enable this feature, and set `pageStaleDays` to control how many days may pass before an article is considered stale.

```yaml {title="hugo.yaml"}
params:
  pageShowStaleWarning: true
  pageStaleDays: 365
```

The `pageStaleDays` defaults to `365`.
