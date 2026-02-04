---
title: Feature Images
slug: feature-images
weight: 80
date: 2026-01-15T14:45:00+08:00
description: "Configure feature images for your articles."
tags: ["feature-images", "hero-images", "documentation", "images"]
series: ["Documentation"]
series_weight: 80
---

Feature images in Yore serve multiple purposes: they appear as hero banners, thumbnails, and social sharing metadata. This functionality relies on Hugo page bundles.

## Automatic Detection

When using `index.md` inside a directory (creating a leaf bundle), Yore automatically detects images with the `feature*` prefix and uses them as the page's feature image.

For example, this structure:

```text
content/
└── posts/
    └── my-article/
        ├── index.md
        └── feature.webp
```

will automatically use `feature.webp` as the hero image, thumbnail, and social sharing image.

## Manual Configuration

You can explicitly specify a feature image using the `pageFeatureImage` parameter in front matter:

```md {title="index.md"}
---
title: My Article
params:
  # Specifies the image in `assets/img/07.webp`
  pageFeatureImage: img/07.webp
---
```

> [!INFO]
> The `params` field contains theme-specific configuration, not Hugo core settings.

## Hero Image Styles

The `pageHeroStyle` parameter controls how the hero image is displayed. This can be set globally in site configuration or overridden per page:

```md {title="index.md"}
---
title: My Article
params:
  pageFeatureImage: img/07.webp
  pageHeroStyle: background
---
```

Available styles are:

- `big`: Large hero image at full content width
- `background`: Full-width background image with text overlay
- `disable`: No hero image display (image still used for metadata)
