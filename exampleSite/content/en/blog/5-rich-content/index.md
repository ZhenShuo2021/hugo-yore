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

### Cols Shortcode

{{% cols widths="70%,30%" rwd=false %}}

![qwe](/img/01.webp)

<!-- cell -->

{{< typeit speed="50" loop="true" tag="p" >}}
Nemo enim ipsam voluptatem quia voluptas sit.
{{< /typeit >}}

{{% /cols %}}

{{% cols widths="50,50" rwd=false %}}

![qwe](/img/02.webp)

<!-- cell -->

![qwe](/img/04.webp)

{{% /cols %}}

<!-- Col Start -->

{{% cols widths="67%,33%" %}}

{{% cols widths="67%,33%" rwd=false %}}

![qwe](/img/07.webp)

<!-- cell -->

![qwe](/img/06.webp)

![qwe](/img/02.webp)

{{% /cols %}}

<!-- cell -->

Sed[^foo] ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

{{% /cols %}}

[^foo]: Example of footnote inside shortcodes.

    [32] Sed ut perspiciatis, unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa, quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt, explicabo. Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos, qui ratione voluptatem sequi nesciunt, neque porro quisquam est, qui dolorem ipsum, quia dolor sit amet consectetur adipisci[ng] velit, sed quia non numquam [do] eius modi tempora inci[di]dunt, ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum[d] exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? [D]Quis autem vel eum i[r]ure reprehenderit, qui in ea voluptate velit esse, quam nihil molestiae consequatur, vel illum, qui dolorem eum fugiat, quo voluptas nulla pariatur?<br>

    [33] At vero eos et accusamus et iusto odio dignissimos ducimus, qui blanditiis praesentium voluptatum deleniti atque corrupti, quos dolores et quas molestias excepturi sint, obcaecati cupiditate non provident, similique sunt in culpa, qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem reru[d]um facilis est e[r]t expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio, cumque nihil impedit, quo minus id, quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellend[a]us. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet, ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.

<!-- Col END -->

{{% cols widths="50,50" rwd=true %}}

{{% cols widths="50,50" rwd=false %}}

![qwe](/img/03.webp)

<!-- cell -->

![qwe](/img/05.webp)

{{% /cols %}}

<!-- cell -->

{{% cols widths="50,50" rwd=false %}}

![qwe](/img/04.webp)

<!-- cell -->

![qwe](/img/07.webp)

{{% /cols %}}

{{% /cols %}}

*Photo credit: [Pixabay](https://pixabay.com/photos/aircraft-double-decker-biplane-1813731/)*
