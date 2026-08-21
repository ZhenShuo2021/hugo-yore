---
title: "Gallery"
slug: gallery
weight: 160
date: 2026-07-07T00:00:00+08:00
description: "Configuration fields for the gallery content type."
tags: ["reference", "gallery-type"]
params:
  sourceLinks:
    - path: "layouts/gallery/page.html"
    - path: "layouts/gallery/section.html"
---

The `gallery` content type is designed to be minimal. Pages render without a sidebar, table of contents, or related content by default. These are theme parameters so the fields should goes under `params` key.

## Page configuration

Accepted fields for individual pages of type `gallery`. If the Front Matter column shows ❌, the field cannot be overridden via front matter.

| Name | Type | Front Matter | Description |
| --- | --- | :---: | --- |
| `link` | `boolean` | | URL link to any internal or external page. |
| `breadcrumb` | `boolean` | | Show breadcrumb navigation above the page title. Not shown unless explicitly enabled. |
| `galleryPageLead` | `string` | | A short lead paragraph shown below the title. |
| `pageShowMeta` | `boolean` | | Show the publish date below the title. |
| `pageNoList` | `boolean` | | Exclude this page from search indexing and from list views. |

## Section configuration

Gallery sections share the same grouping and sorting fields as `blog` and `docs` sections. See [shared configuration](../80-blog/index.md#common-fields-section) for `listScope`, `sectionGroupBy`, `sectionGroupLayout`, `sectionGroupOrder`, `sectionSortBy`, and `sectionSortOrder`.

## Advanced Usage

The blog section's layout doesn't support cover images. To add cover image support, set its `type` to `gallery` to use the gallery's section layout instead.

```yaml {title="hugo.yaml"}
cascade:
  - type: gallery
    target:
      path: '{/blog,/blog/**}'
      kind: section
```

You might also want to give your blog cover a different look, which you can specify using a CSS selector:

```css
main:has(.gallery-page-item[href*='/blog/']) /* ... */ {
  /* ... */
}
```
