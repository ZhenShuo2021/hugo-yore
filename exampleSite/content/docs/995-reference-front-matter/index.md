---
title: "Reference - Front matter"
weight: 995
date: 2026-01-15T14:45:00+08:00
description: "Reference for Yore's front matter."
tags: ["front-matter", "configuration", "reference", "documentation"]
series: ["Documentation"]
series_weight: 995
---

These parameters extend standard Hugo functionality and are categorized into global site parameters and page-level Front Matter.

## Front Matter Reference

### Single Pages (Articles)

| Variable | Type | Description |
| --- | --- | --- |
| imagePosition | String | Sets the CSS object-position for the featured image to keep the subject properly framed. Supported values are as specified in the [MDN documentation](https://developer.mozilla.org/en-US/docs/Web/CSS/object-position#try_it). |
| breadcrumb | Bool | Controls whether hierarchical breadcrumb navigation is shown at the top of the article. |
| pageHeroStyle | String | Defines the visual style of the page hero section. Supported values: background, big, disable. |
| pageFeatureImage | String | Defines the feature image of a single page. |
| pageShowSeries| String | Controls the visibility and placement of the series taxonomy navigation. Supported values: top,bottom, both, disable. |
| pageShowNext| Bool | Controls whether a pagination link to the next chronological article is displayed. |
| pageShowRelated  | Bool | Controls whether the Related Articles section is displayed at the end of the content. |
| pageShowTags| Bool | Controls whether taxonomy tags assigned to the article are displayed.  |
| pageNoList | Bool | Exclude the page from list pages and search. |

### Section Pages

| Variable | Type | Description |
| --- | --- | --- |
| sectionQuickReference | Bool | Generates a simplified index for the section to support quick content discovery. |
