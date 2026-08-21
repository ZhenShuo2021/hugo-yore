---
title: Markdown Formatting Showcase
date: 2026-01-20T11:30:00+08:00
slug: md-formatting
series: ["blog"]
weight: 4
params:
  blogLayout: 2-col
  pageTocStyle: sidebar
---

Markdown Formatting Showcase.

<!--more-->

## Paragraph

Hi, <mark>This is a double-space new line</mark>.  
Xerum, quo qui aut unt expliquam qui dolut labo. Aque venitatiusda cum, voluptionse latur sitiae dolessi aut parist aut dollo enim qui voluptate ma dolestendit peritin re plis aut quas inctum laceat est volestemque commosa as cus endigna tectur, offic to cor sequas etum rerum idem sintibus eiur (<mark>This is a double line-break new line</mark>).

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
