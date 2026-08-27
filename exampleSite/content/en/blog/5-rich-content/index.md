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
- src: /img/02.webp
  alt: Fly high
- src: /img/03.webp
  alt: Contrails
- src: /img/04.webp
  alt: Parapet
- src: /img/05.webp
  alt: Wing
- src: /img/06.webp
  alt: Eaves
- src: /img/07.webp
  alt: Biplane sunset
- src: /img/drop.svg
  alt: SVG sample
  caption: example of SVG image
- src: https://cdn.zsl0621.cc/2025/docs/gemini-imagen-3-git-cover---2025-04-27T17-47-47.webp
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
