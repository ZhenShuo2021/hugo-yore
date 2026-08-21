---
title: "Blog"
slug: blog
weight: 80
date: 2026-07-07T00:00:00+08:00
description: "Configuration fields unique to the blog content type."
tags: ["reference", "blog-type"]
params:
  sourceLinks:
    - path: "layouts/_partials/page/"
      url: https://github.com/ZhenShuo2021/hugo-yore/tree/main/layouts/_partials/page
---

All configurations on `blog` content type. The `blog` and `docs` content types share most of their page and section fields, so the documented below are separate into unique fields and common fields.

These are theme parameters so the fields should goes under `params` key, e.g,

```yaml {title="content/blog/my-post.md"}
---
# top level: Hugo config
title: "My Post"
type: blog
# params: theme config
params:
  breadcrumb: true
  pageShowMeta: true
---
```

## Page configuration

### Unique fields{#unique-fields-page}

Accepted fields for individual pages of type `blog`. If the Front Matter column shows ❌, the field cannot be overridden via front matter.

| Name | Type | Front Matter | Description |
| --- | --- | :---: | --- |
| `pageSeriesStyle` | `string` | | Show series navigation on the page. Accepts `top`, `bottom`, or `both`. See [Series](../../200-features/200-series/index.md) for how series are defined. |
| `pageShowRelated` | `boolean` | | Show a list of related posts below the content. See [Related Article](../../320-advanced/40-related-article/index.md) for how related posts are determined. |
| `pageRelatedLimit` | `int` | :x: | Maximum number of related articles to show. |

### Common fields{#common-fields-page}

{{% embed-md path="/docs/160-configuration/snippets/shared-page.md" md=false %}}

## Section configuration

### Unique fields{#unique-fields-section}

The section fields of `blog` type is exactly the same as `docs` type.

### Common fields{#common-fields-section}

{{% embed-md path="/docs/160-configuration/snippets/shared-section.md" md=false %}}
