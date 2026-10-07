---
title: Rich Content & Media Layout Demo
date: 2026-01-20T11:30:00+08:00
slug: rich-content
series: ["blog"]
weight: 5
params:
  blogLayout: 2-col
  pageTocStyle: sidebar
  pageHeroStyle: background
  pageFeatureImage: img/07.webp
---

Rich-content example with front matter

- blogLayout: 2-col
- pageTocStyle: sidebar
- pageHeroStyle: background
- pageFeatureImage: img/07.webp

## Images

### Basic Markdown Syntax

![qwe](/img/animated-webp-supported.webp "[Source](https://mathiasbynens.be/demo/animated-webp)")

### Masonry Shortcode

{{< masonry >}}

- src: /img/01.webp
  alt: Biplane
  width: 1920
  height: 1078
- src: /img/02.webp
  alt: Fly high
  width: 1920
  height: 1283
- src: /img/03.webp
  alt: Contrails
  width: 1920
  height: 1333
- src: /img/04.webp
  alt: Parapet
  width: 1920
  height: 1280
- src: /img/05.webp
  alt: Wing
  width: 1920
  height: 1440
- src: /img/06.webp
  alt: Eaves
  width: 1920
  height: 1152
- src: /img/07.webp
  alt: Biplane sunset
  width: 1920
  height: 1315
- src: /img/drop.svg
  alt: SVG sample
  caption: example of SVG image
  width: 1084
  height: 322
- src: https://cdn.zsl0621.cc/2025/docs/gemini-imagen-3-git-cover---2025-04-27T17-47-47.webp
  width: 2048
  height: 2048
  alt: External image sample
  caption: example of external image

{{< /masonry >}}

### Carousel Shortcode

{{< carousel ratio="16/7" fit="cover" arrows=false >}}

- match: /img/*.webp
- src: /img/drop.svg

{{< /carousel >}}

### Float Shortcode

{{% float side="end" size="m" %}}

{{% fig attrs="class='center-cap center-img'" src="/img/07.webp" alt="Float and footnote sample" caption="Foo[^foo]" %}}

{{% /float %}}

Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit amet consectetur adipisci[ng] velit, sed quia non numquam [do] eius modi tempora inci[di]dunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum[d] exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? [D]Quis autem vel eum i[r]ure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?

{{% float-clear %}}

[^foo]: Example of footnote inside shortcodes.

    Ut enim ad minima veniam, quis nostrum...

*Photo credit: [Pixabay](https://pixabay.com/photos/aircraft-double-decker-biplane-1813731/)*

![qweqwe](/img/png.png)
