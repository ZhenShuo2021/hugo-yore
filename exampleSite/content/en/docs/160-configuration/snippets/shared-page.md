---
title: "Shared Page Configuration"
build:
  list: never
  render: never
---

<!-- if referenced by multiple pages, they must be in the same level so the link resolution works  -->

| Name | Type | Front Matter | Description |
| --- | --- | :---: | --- |
| `link` | `boolean` | | URL link to any internal or external page. |
| `breadcrumb` | `boolean` | | Show breadcrumb navigation above the page title. |
| `pageHeroStyle` | `string` | | Render a hero section above the page. Set to `disable` to turn it off for a specific page. |
| `pageTOCStyle` | `string` | | Where the table of contents is rendered. Accepts `top`, `sidebar`, or `disable`. On docs pages, `top` is treated the same as `sidebar`. |
| `pageKgStyle` | `string` | | Where the knowledge graph widget is rendered. See [Knowledge Graph](../../200-features/440-knowledge-graph/index.md) for what this widget does. |
| `pageShowActions` | `boolean` | | Show action buttons (e.g. share, copy link) next to the page title. |
| `pageShowMeta` | `boolean` | | Show publish date, last-updated date, and author info below the title. |
| `pageShowAuthors` | `boolean` | | Show author information. Only takes effect when `pageShowMeta` is enabled. |
| `pageShowCategories` | `boolean` | | Show the page's categories below the content. |
| `pageShowTags` | `boolean` | | Show the page's tags below the content. |
| `pageShowNext` | `boolean` | | Show previous/next page links at the bottom of the page. |
| `pageShowBacklinks` | `boolean` | | Show a list of pages that link back to this one. |
| `pageShowStaleWarning` | `boolean` | | Show a warning when an article has not been updated in pageStaleDays. |
| `pageStaleDays` | `int` | | Number of days before an article is considered stale. |
| `pageNoList` | `boolean` | | Exclude this page from search indexing and from list views. |
