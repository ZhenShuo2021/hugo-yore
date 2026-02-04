---
title: "Related Article"
slug: "related-article"
weight: 140
date: 2026-01-30T03:14:00+08:00
description: "Overview of Hugo's related article algorithm, its indexing logic, and term-matching limitations."
tags: ["hugo", "related-content", "algorithms", "taxonomies", "documentation"]
series: ["Documentation"]
series_weight: 140
---


Hugo provides a built-in related article feature powered by an inverted index algorithm. This mechanism offers high performance, though its reliance on exact string matching requires specific taxonomy strategies to achieve optimal results.

## Principle

The system operates by indexing taxonomies (tags) and dates. It calculates similarity scores based on term overlap between the current page and other pages in the site.

[^1]: The technical implementation is derived from the following Hugo source files:

    - [inverted_index.go](https://github.com/gohugoio/hugo/blob/master/related/inverted_index.go): Core logic for the inverted index and scoring.
    - [page.go](https://github.com/gohugoio/hugo/blob/master/resources/page/page.go): Page-level attributes used for indexing.

The core logic follows a two-stage process[^1]:

1. **Pre-processing**: The engine extracts terms from all pages, maps them to their respective documents, and filters out high-frequency terms based on the `cardinalityThreshold`.
2. **Calculation**: It retrieves terms from the current page, looks up matching documents in the index, and applies weight-based scoring. Pages falling below the `threshold` are excluded.

> [!NOTE]
> Hugo only indexes exact string matches. If `fragments` are enabled, headings within the content are also included in the comparison.

> [!IMPORTANT]
> The algorithm requires **exact** string matching to index related content.

## Limitations

The effectiveness of this system depends on consistent taxonomy management:

- **Taxonomy Precision**: Results require precise control over tags. Unique tags may fail to form relationships, while overly generic terms may be discarded as noise by the algorithm.
- **Manual Synchronization**: Requires manual terminology alignment across all articles to ensure the exact string matching logic functions as intended.

## Configuration

The system utilizes Hugo's default weight settings unless explicitly defined. For custom weighting and indexing rules, refer to the [Hugo Related Content Documentation](https://gohugo.io/configuration/related-content/).
