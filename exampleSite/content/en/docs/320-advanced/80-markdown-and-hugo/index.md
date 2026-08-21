---
title: "Markdown and Hugo"
slug: markdown-and-hugo
weight: 80
date: 2026-01-20T11:30:00+08:00
description: "Understanding how Hugo processes Markdown and the technical nuances of content rendering."
tags: ["concept", "hugo-core", "markdown"]
---

## Semantic Markdown

In static site generation, Markdown is not merely a shorthand for text; it is a direct instruction for generating HTML. Hugo follows the [CommonMark](https://commonmark.org/) specification via the Goldmark engine. Understanding the underlying HTML output is essential for precise layout control.

Useful links:

- CommonMark [playground](https://spec.commonmark.org/dingus/?text=Soft%20Line%20Break%20%20%0ALine%202%20is%20in%20the%20same%20paragraph.%0A%0A---%0A%0AParagraph%201%20(%5C%3Cp%5C%3E%20tag)%0A%0AParagraph%202%20(%5C%3Cp%5C%3E%20tag)%0A)
- CommonMark [spec](https://spec.commonmark.org/)

### Paragraphs vs. Line Breaks

The visual distance between lines is determined by the generated HTML tags, which are influenced by your Markdown syntax:

1. **Soft Line Break** (Double Space):
Renders as a `<br>` tag within a single `<p>` element. This keeps lines close together.
2. **Paragraph** (Double Enter/Empty Line):
Renders as two separate `<p>` elements.

Major CSS frameworks set paragraphs with greater vertical spacing than soft line breaks. If you observe unexpectedly wide spacing, check whether your Markdown syntax is generating a `<p>` tag, this is often the root cause.

### List Item

To include multi-line content (like code blocks) inside a list item, you must maintain consistent indentation:

- **Incorrect**: Placing a code block immediately after a list item without indentation will break the list into two separate entities.
- **Correct**: Indenting the nested content with **four spaces** ensures it remains semantically bound to the parent `<li>` tag.

---

## Hugo Shortcodes

Shortcodes are used to insert complex HTML components that standard Markdown cannot describe. Hugo utilizes two [distinct syntaxes](https://gohugo.io/content-management/shortcodes/#notation) based on how the content should be processed.

- `{{</* name */>}}`: **Standard notation.**. The content inside is treated as raw HTML and is not parsed by the Markdown engine.
- `{{%/* name */%}}`: **Markdown notation.**. The content inside is sent back to the Markdown engine to be parsed into HTML.

> [!NOTE]
> When using Markdown notation, avoid indenting content inside the shortcode by **four** or more spaces. Per the CommonMark specification, four-space indentation is treated as a code block.
