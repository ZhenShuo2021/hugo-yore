---
title: "Shared Section Configuration"
build:
  list: never
  render: never
---

<!-- rumdl-disable-file MD057 -->

| Name | Type | Front Matter | Description |
| --- | --- | :---: | --- |
| `breadcrumb` | `boolean` | | Show breadcrumb navigation above the page title. |
| `listScope` | `string` | | Which pages to list. Set to `site` to list every regular page on the site, or leave unset to list only pages within the current section. |
| `sectionGroupBy` | `string` | | Group listed pages under headings. Accepts `Date`, `ExpiryDate`, `Lastmod`, `PublishDate`, or a page parameter prefixed with `Param.` (e.g. `Param.category`). Leave unset to disable grouping. |
| `sectionGroupLayout` | `string` | | Date format used for group headings when `sectionGroupBy` is a date field. See [layout strings](https://gohugo.io/methods/time/format/#layout-string). |
| `sectionGroupOrder` | `string` | | Order of groups. Accepts `asc` or `desc`. |
| `sectionSortBy` | `string` | | Sort key for listed pages within each group. Accepts `Date`, `ExpiryDate`, `Lastmod`, `Length`, `LinkTitle`, `PublishDate`, `Title`, `Weight`, or a page parameter prefixed with `Param.`. |
| `sectionSortOrder` | `string` | | Sort order. Accepts `asc` or `desc`. |
