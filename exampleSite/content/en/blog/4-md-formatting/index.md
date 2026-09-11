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

## Images

![sample image](/img/01.webp "Image with caption")
{class="center-cap crop-img" style="--ratio:21/9;--position:50% 0%;"}

## Blockquotes

> Xerum, quo qui aut unt expliquam qui dolut labo.

## Tables

**Default**

| Metric | Q1 Target | Q1 Actual | Variance |
| --- | --- | --- | --- |
| Revenue | $1,200,000 | $1,150,000 | -4.17% |
| Operating Expenses | $450,000 | $430,000 | +4.44% |
| Net Profit Margin | 22.5% | 24.1% | +1.60% |

**Center**

| Metric | Q1 Target | Q1 Actual | Variance |
| --- | --- | --- | --- |
| Revenue | $1,200,000 | $1,150,000 | -4.17% |
| Operating Expenses | $450,000 | $430,000 | +4.44% |
| Net Profit Margin | 22.5% | 24.1% | +1.60% |
{center="true"}

**Compact**

| Metric | Q1 Target | Q1 Actual | Variance |
| --- | --- | --- | --- |
| Revenue | $1,200,000 | $1,150,000 | -4.17% |
| Operating Expenses | $450,000 | $430,000 | +4.44% |
| Net Profit Margin | 22.5% | 24.1% | +1.60% |
{compact="true"}

## Code Blocks

General code block

```c
#include <stdio.h>

int main(void) {
    printf("Test\n");
    int x = 10;
    int y = 20;
    int z = x + y;
    printf("%d\n", z);
    return 0;
}
```

Code block with title and line highlight

```c {title="example.c" lineNos=inline hl_lines=[1,"5-7"]}
#include <stdio.h>

int main(void) {
    printf("Test\n");
    int x = 10;
    int y = 20;
    int z = x + y;
    printf("%d\n", z);
    return 0;
}
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
