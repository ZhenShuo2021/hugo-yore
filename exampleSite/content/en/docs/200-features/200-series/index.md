---
title: "Series"
slug: "series"
description: "Organize related articles across different dates and sections using the Series taxonomy."
weight: 200
date: 2026-01-21T08:52:00+08:00
tags: ["guide", "taxonomy-system", "series", "content-organization"]
params:
  sourceLinks:
    - path: "layouts/_partials/page/series.html"
---

The Series feature groups multiple articles published across different dates or sections into a named sequence.

Series is implemented as a taxonomy, which is why the front matter variable is defined as a list of strings.

## Configuration

Ensure the `series` taxonomy is explicitly defined in your project configuration.

```yaml {title="hugo.yaml"}
taxonomies:
  series: series
```

## Front Matter Setup

Set `series` to the series name and `series_weight` to control the article's position within the sequence.

```yaml {title="content/posts/example-article.md"}
---
title: "Example Article"
series: ["Documentation"]
series_weight: 10
---
```

## Sorting Logic

Articles within a series are sorted by their [taxonomic weight](https://gohugo.io/content-management/taxonomies/#taxonomic-weight). If `series_weight` is not set, Hugo applies its [default sort order](https://gohugo.io/quick-reference/glossary/#default-sort-order).
