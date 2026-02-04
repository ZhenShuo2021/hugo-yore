---
title: "Archive"
slug: "archive"
description: "Enable a comprehensive archive page to aggregate and display all posts across your site."
weight: 110
date: 2026-01-21T08:52:00+08:00
tags: ["archive", "list-page", "configuration", "documentation"]
series: ["Documentation"]
series_weight: 110
---

Yore provides a dedicated archive feature to aggregate all posts into a single chronological list.

## Basic Setup

To enable the archive page, create an `_index.md` file in `content/archive/`. Note the file must be named `_index.md`, using `index.md` will prevent Hugo from treating it as a list page.

To exclude a page from the archive, add `pageNoList` to its front matter.

> [!NOTE]
> `pageNoList` also excludes the article from search results but not from the sitemap.
>
> Yore uses Hugo's [built-in sitemap][sitemap-source], you would need to customize it to exclude the page. See [official documentation][sitemap-doc].

[sitemap-source]: https://github.com/gohugoio/hugo/blob/v0.154.5/tpl/tplimpl/embedded/templates/sitemap.xml
[sitemap-doc]: https://gohugo.io/templates/sitemap/

## Options

- Customizing the URL

    To modify the archive's access path, define the `url` parameter in the front matter of `content/archive/_index.md`:

    ```yaml
    ---
    title: "Post Archive"
    url: "/all-posts"
    ---
    ```

- Global List Scope

    You can transform any list page into an archive by utilizing the `listScope` parameter. Setting `listScope` to `site` instructs the template to fetch all regular pages from the entire site.

    ```yaml
    ---
    title: "Full Site Archive"
    params:
      listScope: "site"
    ---
    ```

    > [!INFO]
    > Keys inside the `params` field are not Hugo config but theme config.
