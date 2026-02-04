---
title: Rich Content
slug: rich-content
date: 2026-01-20T11:30:00+08:00
weight: 800
tags: ["related-articles", "algorithm", "taxonomies", "documentation"]
series: ["Documentation"]
series_weight: 800
---

This article offers a sample of basic Markdown formatting that can be used in Yore, also it shows how some basic HTML elements are decorated.

<!--more-->

## Paragraph

Hi, <mark>This is a double-space new line</mark>.  
Xerum, quo qui aut unt expliquam qui dolut labo. Aque venitatiusda cum, voluptionse latur sitiae dolessi aut parist aut dollo enim qui voluptate ma dolestendit peritin re plis aut quas inctum laceat est volestemque commosa as cus endigna tectur, offic to cor sequas etum rerum idem sintibus eiur  (<mark>This is a double line-break new line</mark>).

Itatur? Quiatae cullecum rem ent aut odis in re eossequodi nonsequ idebis ne sapicia is sinveli squiatum, core et que aut hariosam ex eat.

## Blockquotes

> Xerum, quo qui aut unt expliquam qui dolut labo.

## Tables

| Name  | Age |
| ----- | --- |
| Bob   | 27  |
| Alice | 23  |

## Code Blocks

General code block

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Example HTML5 Document</title>
  </head>
  <body>
    <p>Test</p>
  </body>
</html>
```

Code block with title and line highlight

```html {title="example.html" lineNos=inline hl_lines=[4,"7-9"]}
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Example HTML5 Document</title>
</head>
<body>
  <p>Test</p>
</body>
</html>
```

## List

1. First item
2. Second item
3. Third item
   - Item 1
   - Item 2
     - Item 2-1
       - Item 2-1-1
         - Item 2-1-1-1

## sub, sup, kbd, mark

H<sub>2</sub>O  
X<sup>n</sup> + Y<sup>n</sup> = Z<sup>n</sup>  
<kbd>Ctrl</kbd> + <kbd>C</kbd>, <kbd>Enter</kbd>  
Hello <mark>world</mark>!

## Images

```md
![qwe](img/animated-webp-supported.webp "[Source](https://mathiasbynens.be/demo/animated-webp)")
```

![qwe](img/animated-webp-supported.webp "[Source](https://mathiasbynens.be/demo/animated-webp)")

[Markdown attributes](https://gohugo.io/content-management/markdown-attributes/) is also supported, for example:

```md
![qwe](img/animated-webp-supported.webp "[Source](https://mathiasbynens.be/demo/animated-webp)")
{class="center-img center-cap"}
```

![qwe](img/animated-webp-supported.webp "[Source](https://mathiasbynens.be/demo/animated-webp)")
{class="center-img center-cap"}

Note that Markdown attributes require [configuration](https://gohugo.io/content-management/markdown-attributes/) of the Goldmark renderer.

## Col shortcode

`col` shortcode allows you to create flexible multi-column layouts with custom widths and optional responsive behaviors.

{{% cols widths="70%,30%" rwd=false %}}

![qwe](img/01.webp)

+++

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.

{{% /cols %}}

{{% cols widths="50,50" rwd=false %}}

![qwe](img/02.webp)

+++

![qwe](img/04.webp)

{{% /cols %}}

<!-- Col Start -->

{{% cols widths="67%,33%" %}}

{{% cols widths="67%,33%" rwd=false %}}

![qwe](img/07.webp)

+++

![qwe](img/06.webp)
![qwe](img/02.webp)

{{% /cols %}}

+++

Sed[^1] ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.

{{% /cols %}}

[^1]: eqwdasd

<!-- Col END -->

{{% cols widths="50,50" rwd=true %}}

{{% cols widths="50,50" rwd=false %}}

![qwe](img/03.webp)

+++

![qwe](img/05.webp)

{{% /cols %}}

+++

{{% cols widths="50,50" rwd=false %}}

![qwe](img/04.webp)

+++

![qwe](img/07.webp)

{{% /cols %}}

{{% /cols %}}

## Admonitions (Alerts)

Github Alerts

> [!NOTE]
> Highlights information that users should take into account, even when skimming.

> [!TIP]
> Optional information to help a user be more successful.

> [!IMPORTANT]
> Crucial information necessary for users to succeed.

> [!WARNING]
> Critical content demanding immediate user attention due to potential risks.

> [!CAUTION]
> Negative potential consequences of an action.

Docusaurus Admonitions

> [!NOTE]
> Highlights information that users should take into account, even when skimming.

> [!TIP]
> Optional information to help a user be more successful.

> [!INFO]
> Crucial information necessary for users to succeed.

> [!WARNING]
> Critical content demanding immediate user attention due to potential risks.

> [!CAUTION]
> Negative potential consequences of an action.

> [!TIP] One liner

> [!TIP]- Custom Icon + Fold
> Content
{icon="code"}
