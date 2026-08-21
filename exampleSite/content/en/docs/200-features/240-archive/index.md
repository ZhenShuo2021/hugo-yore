---
title: "Archive"
slug: "archive"
description: "Enable a comprehensive archive page to aggregate and display all posts across your site."
weight: 240
date: 2026-01-21T08:52:00+08:00
tags: ["guide", "archive", "content-organization"]
params:
  sourceLinks:
    - path: "layouts/_partials/section/main.html"
---

Yore provides a dedicated archive feature to aggregate all posts into a single list.

## Setup

Create `_index.md` in your archive section and set `listScope: site` in its front matter. The file must be named `_index.md`. Using `index.md` prevents Hugo from treating it as a list page.

Sorting and grouping are not automatically chronological. Set `sectionSortBy`, `sectionGroupBy`, and related params explicitly to get the expected behavior.

```yaml {title="content/archive/_index.md"}
---
title: Archive
params:
  listScope: site
  sectionSortBy: Date
  sectionSortOrder: desc
  sectionGroupBy: Date
  sectionGroupLayout: "January 2006"
  sectionGroupOrder: desc
---
```

### Sorting and grouping options

The options of `sectionSortBy`, `sectionGroupBy` and related params uses [Hugo's method](https://gohugo.io/methods/pages/).

| Param | Type | Description |
|---|---|---|
| `sectionSortBy` | `string` | Field used to sort pages. Accepts any [Pages method](https://gohugo.io/methods/pages/): `Date`, `ExpiryDate`, `Lastmod`, `Length`, `LinkTitle`, `PublishDate`, `Title`, `Weight`, or `Param.[FRONT_MATTER_KEY]`. |
| `sectionSortOrder` | `'asc' \| 'desc'` | Sort direction. |
| `sectionGroupBy` | `string` | Field used to group pages. Accepts `Date`, `ExpiryDate`, `Lastmod`, `PublishDate`, or `Param.[FRONT_MATTER_KEY]`. |
| `sectionGroupLayout` | `string` | Go time format string for group headings. Example: `"January 2006"` or `"2006年1月"`. See [layout strings](https://gohugo.io/methods/time/format/#layout-string). |
| `sectionGroupOrder` | `'asc' \| 'desc'` | Group sort direction. |

## Excluding pages

`pageNoList: true` excludes a page from list pages (including the archive) and search results.

It does not remove the page from the sitemap. To exclude the page from the sitemap as well, customize Hugo's [built-in sitemap template][sitemap-source]. See the [official documentation][sitemap-doc].

[sitemap-source]: https://github.com/gohugoio/hugo/blob/v0.154.5/tpl/tplimpl/embedded/templates/sitemap.xml
[sitemap-doc]: https://gohugo.io/templates/sitemap/
