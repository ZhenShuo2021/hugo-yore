---
title: Feature Images
slug: feature-images
weight: 80
date: 2026-01-15T14:45:00+08:00
description: "Configure feature images for your articles."
tags: ["guide", "feature-images", "visualization"]
params:
  sourceLinks:
    - path: "layouts/_partials/head/social.html"
    - path: "layouts/_partials/page/hero/main.html"
      label: hero/main.html
---

Feature images in Yore appear as hero banners, thumbnails, and social sharing metadata.

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

## Fallback

The `imageFeatured` in `hugo.yaml` is used if the feature image does not exists. The `imageSocial` in `hugo.yaml` is a subdivision for meta tags used for social sharing image.

## Hero Image Styles

The `pageHeroStyle` parameter controls how the hero image is displayed. It can be set globally in `hugo.yaml` or overridden per page in front matter.

```md {title="index.md"}
---
title: My Article
params:
  pageHeroStyle: background
---
```

- `big`: Large hero image at full content width
- `background`: Full-width background image with text overlay
- `disable`: No hero image display (image still used for metadata)
