---
title: "Docs"
slug: docs
weight: 120
date: 2026-07-07T00:00:00+08:00
description: "Configuration fields unique to the docs content type."
tags: ["reference", "docs-type"]
params:
  sourceLinks:
    - path: "layouts/_partials/docs/main.html"
    - path: "layouts/_partials/docs/dfs-init.html"
---

All configurations on `docs` content type. The `blog` and `docs` content types share most of their page and section fields, so the documented below are separate into unique fields and common fields. These are theme parameters so the fields should goes under `params` key.

## Page configuration

### Unique fields{#unique-fields-page}

Accepted fields for individual pages of type `docs`. All settings can be overridden in the front matter, unless explicitly noted as unsupported.

| Name | Type | Description |
| --- | --- | --- |
| `sourceLinks` | `[]object` | A list of source files shown at the bottom of the page. Each entry accepts `path` (relative to the site's source repository) and an optional `label` and `url` to override the auto-generated link[^sl]. |
| `docsNavCollapsed` | `boolean` | Collapse this section by default in the sidebar navigation. Only applies to section pages. |
| `docsAutoCollapseCategories` | `boolean` | Auto collapse other sections when expanding one. Cannot be overridden in the front matter. |
| `docsIcon` | `string` | Icon shown next to this page or section in the sidebar navigation. |
| `docsNavClass` | `string` | Additional CSS class applied to the sidebar nav. |

[^sl]: For example:

    ```yaml
    sourceLinks:
      - path: "layouts/_partials/page/"
        url: https://github.com/ZhenShuo2021/hugo-yore/tree/main/layouts/_partials/page
    ```

> [!NOTE]
> Previous/next links on docs pages only traverse other pages within the same docs section, unlike blog's previous/next links, which span the entire site.

### Common fields{#common-fields-page}

{{% embed-md path="/docs/160-configuration/snippets/shared-page.md" md=false %}}

## Section configuration

### Unique fields{#unique-fields-section}

| Name | Type | Description |
| --- | --- | --- |
| `docsNavSort` | `string` | Sort order for child pages in the sidebar navigation. Accepts `Date`, `ExpiryDate`, `Lastmod`, `Length`, `LinkTitle`, `PublishDate`, `Title`, `Weight`, or a page parameter prefixed with `Param.`. Defaults to Hugo's default page order if unset or invalid. |

### Common fields{#common-fields-section}

{{% embed-md path="/docs/160-configuration/snippets/shared-section.md" md=false %}}
