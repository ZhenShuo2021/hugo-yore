---
title: "Directory Structure and Assets"
linkTitle: Directory Structure
slug: "directory-structure"
description: "Understand Hugo's directory layout and how to manage assets."
weight: 120
date: 2026-01-30T03:54:00+08:00
tags: ["concept", "hugo-core", "directory-structure", "assets", "page-bundles"]
---

Understanding Hugo's directory structure is essential for managing content and assets effectively.

## Directory Structure

Hugo projects follow a conventional layout. Each directory has a fixed role and Hugo will not look for files outside their expected locations.

```text
.
├── archetypes/      # Templates for new Markdown files
├── assets/          # Processable assets (images, CSS, JS)
├── content/         # Markdown files
├── data/            # Structured data (yaml, json, toml, org, csv, xml)
├── i18n/            # Translation files
├── layouts/         # Custom layout files
├── static/          # Raw static files (CNAME, .woff2)
├── themes/          # Theme files
└── hugo.yaml        # Site configuration
```

The rest of this page covers the three directories you will interact with most: `assets/`, `static/`, and `content/`.

## Page Bundles

Hugo supports two ways to organize content files in `content/`.

A **standalone page** is a single `.md` file, such as `content/about.md`. It has no associated resources, so you cannot attach images or other files directly to the page.

A **leaf bundle** is a directory containing an `index.md` file, such as `content/about/index.md`. Images and other files placed in the same directory are treated as page resources, meaning the theme can use them for thumbnails, galleries, or other features.

```text
content/
└── awesome_article/    <-- leaf bundle
    ├── index.md
    └── feature.png     <-- page resource, available to the theme
```

This documentation defaults to the leaf bundle structure in its examples, since it keeps each post's images alongside its content. If your posts have few or no images, or you prefer to keep images centralized in assets/, a standalone page works just as well.

## Asset Placement: `assets/` vs. `static/`

### `assets/`

Hugo can process files in this directory before publishing them. For images, this means automatic resizing and format conversion (e.g. to WebP). For CSS and JS, Hugo can minify and fingerprint them. Place all images and stylesheets here.

### `static/`

Hugo copies files in this directory to the build output as-is, without any processing. Use it for files that do not need transformation, such as font files.

> [!IMPORTANT]
> Prefer `assets/` over `static/` for most files. Hugo only publishes files in `assets/` that are actually referenced, and their URLs update automatically if paths change. Files in `static/` are always copied to output regardless of whether they are used.

## Referencing Assets in Markdown

### Images in `assets/`

Hugo strips the `assets/` prefix when publishing, so the file `assets/img/logo.svg` is served at `/img/logo.svg`. Reference it from any page using an absolute path:

```md
![alt text](/img/logo.svg "image description")
```

### Images in a Leaf Bundle

If you are using a leaf bundle, you can place images in the same directory as `index.md` and reference them with a relative path. This keeps the image scoped to the article and avoids polluting the global `assets/` directory.

For example, with directory structure like this:

```text
content/
└── posts/
    └── my-article/
        ├── index.md
        └── local-image.png
```

And reference them within `index.md`:

```md
![alt text](./local-image.png "image description")
```

## Page Types

Hugo classifies every page into one of four types, and each type determines which template Hugo uses to render it.

- **home** — The site root, `/`. Every site has exactly one.
- **section** — A directory that lists other content, such as a blog index.
- **page** — A single piece of content, such as a post or an about page.
- **taxonomy** — A list of terms for a classification, such as all tags. Hugo generates one automatically for each taxonomy defined in the site configuration.
- **term** — A single value within a taxonomy, such as the tag `golang`. Lists every page tagged with it.

```text
content/
├── _index.md              <-- home
└── blog/
    ├── _index.md          <-- section
    ├── first-post/
    │   └── index.md       <-- page
    ├── second-post/
    │   └── index.md       <-- page
    └─── third-post.md     <-- page

tags/                      <-- taxonomy
└── golang/                <-- term
```
