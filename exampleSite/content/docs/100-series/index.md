---
title: "Series"
slug: "series"
description: "Organize related articles across different dates and sections using the Series taxonomy."
weight: 100
date: 2026-01-21T08:52:00+08:00
tags: ["series", "taxonomy", "organization", "documentation"]
series: ["Documentation"]
series_weight: 100
---

The Series feature enables the logical grouping of multiple articles published across different dates or sections. A Series is implemented as a taxonomy, which is why the front matter variable is defined as a list of strings.

## Configuration

Ensure the `series` taxonomy is explicitly defined in your project configuration:

```yaml {title="hugo.yaml"}
taxonomies:
  tag: tags
  series: series
```

## Front Matter Setup

Define the series name and the display order within the article's front matter. Use the `series_weight` key to control the sequence of articles within a specific series according to Hugo's [taxonomic weight](https://gohugo.io/content-management/taxonomies/#taxonomic-weight) rules.

```yaml {title="content/posts/example-article.md"}
---
title: "Example Article"
series: ["Documentation"]
series_weight: 10
---
```

## Sorting Logic

Articles within a series are sorted by their [taxonomic weight](https://gohugo.io/content-management/taxonomies/#taxonomic-weight). To specify the order, define the `series_weight` key in the front matter; otherwise, Hugo applies its [default sort order](https://gohugo.io/quick-reference/glossary/#default-sort-order).
