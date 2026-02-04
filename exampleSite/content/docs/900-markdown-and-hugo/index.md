---
title: "Markdown and Hugo"
slug: markdown-and-hugo
weight: 900
date: 2026-01-20T11:30:00+08:00
description: "Understanding how Hugo processes Markdown and the technical nuances of content rendering."
tags: ["markdown", "shortcodes", "rendering", "documentation"]
series: ["Documentation"]
series_weight: 900
---

## Semantic Markdown

In static site generation, Markdown is not merely a shorthand for text; it is a direct instruction for generating HTML. Hugo follows the **CommonMark** specification via the Goldmark engine. Understanding the underlying HTML output is essential for precise layout control.

### Paragraphs vs. Line Breaks

The visual distance between lines is determined by the generated HTML tags, which are influenced by your Markdown syntax:

1. **Soft Line Break** (Double Space):
Renders as a `<br>` tag within a single `<p>` element. This keeps lines close together.
2. **Paragraph** (Double Enter/Empty Line):
Renders as two separate `<p>` elements.

Major CSS frameworks set paragraphs with greater vertical spacing than soft line breaks. If you observe unexpectedly wide spacing, check whether your Markdown syntax is generating a `<p>` tag, this is often the root cause. You can verify the rendered output using the [CommonMark dingus](https://spec.commonmark.org/dingus/).

### List Item

To include multi-line content (like code blocks) inside a list item, you must maintain consistent indentation:

- **Incorrect**: Placing a code block immediately after a list item without indentation will break the list into two separate entities.
- **Correct**: Indenting the nested content with **four spaces** ensures it remains semantically bound to the parent `<li>` tag.

---

## Hugo Shortcodes

Shortcodes are used to insert complex HTML components that standard Markdown cannot describe. Hugo utilizes two [distinct syntaxes](https://gohugo.io/content-management/shortcodes/#notation) based on how the content should be processed.

- `{{</* name */>}}`: **Direct output**. The content inside is treated as raw HTML and is not parsed by the Markdown engine.
- `{{%/* name */%}}`: **Markdown rendered**. The content inside is sent back to the Markdown engine to be parsed into HTML.

> **Note**: Using `{{%/*  */%}}` for raw HTML components may lead to unintended rendering errors if the internal HTML conflicts with Markdown rules.
