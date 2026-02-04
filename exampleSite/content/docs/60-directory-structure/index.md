---
title: "Directory Structure and Assets"
slug: "directory-structure"
description: "Understand Hugo's directory layout and how to manage static and processed assets."
weight: 60
date: 2026-01-30T03:54:00+08:00
tags: ["directory-structure", "assets", "documentation", "page-bundles"]
series: ["Documentation"]
series_weight: 60
---

Understanding Hugo's directory structure is essential for managing content and assets effectively.

## Directory Structure

A typical Hugo project follows this structure:

```text
.
├── archetypes/      # Templates for new Markdown files
├── assets/          # Processed assets (images, CSS, JS)
├── content/         # Markdown files and page bundles
├── data/            # Custom configuration data
├── i18n/            # Translation files
├── layouts/         # Custom layout files
├── static/          # Raw static files (favicons, robots.txt)
├── themes/          # Theme files
└── hugo.yaml        # Site configuration
```

This guide focuses on three key directories: `assets/`, `static/`, and `content/`, as these are the ones you'll work with most frequently.

## Page Bundles

Hugo supports two content structures for Markdown files in the `content/` directory.

A **standalone page** is stored as `name.md`. This structure cannot associate images or other resources with the page, making it unsuitable for thumbnails or bundled assets.

A **leaf bundle** is created by placing content in an `index.md` file within a directory. Any images in the same directory (or subdirectories) become page resources that the theme can automatically discover and use.

Convert this structure:

```shell
content/
└── awesome_article.md
```

into this:

```shell
content/
└── awesome_article/
    ├── index.md
    └── feature.png
```

Create a new article using: `hugo new content posts/first/index.md`

## Asset Placement: Assets vs. Static

### 1. `assets/` (Processable)

Hugo has the ability to process files here (resize images, convert to WebP, minify CSS/JS). All images and stylesheets go here.

### 2. `static/` (Raw Files)

Hugo cannot process files here, they are copied directly to the build directory. Use for raw files such as favicons and `robots.txt`.

> [!IMPORTANT]
> Place most assets in `assets/` rather than `static/`. The `assets/` directory offers two advantages: links dynamically adapt to URL changes, and Hugo only publishes explicitly referenced files. In contrast, `static/` uses fixed paths and copies everything to output regardless of use.

## Referencing Assets in Markdown

### Global Resources

To reference an image in `assets/img/example.webp`, use a leading slash:

```md
![alt text](/img/logo.svg "image description")
```

### Local Resources

For **leaf bundles** (directories containing `index.md`), place images directly within the bundle's folder:

```text
content/
└── posts/
    └── my-article/
        ├── index.md
        └── local-image.png
```

Reference them locally within `index.md`:

```md
![alt text](./local-image.png "image description")
```
