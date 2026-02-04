---
title: Writing
slug: writing
weight: 2000
date: 2026-01-17T10:40:00+08:00
description: "Master Hugo shortcodes for admonitions, figures, lightboxes, lead text, and tabs."
tags: ["shortcodes", "writing", "markdown", "images"]
series: ["Shortcodes"]
---

## Admonition

Admonitions allow you to insert eye-catching callout boxes in your content.

**Example: Markdown syntax with custom icon**

```md
> [!TIP]+ Custom Title
> This is a collapsible tip with a custom icon.
{icon="twitter"}

```

> [!TIP]+ Custom Title
> This is a collapsible tip with a custom icon.
{icon="twitter"}

> [!INFO]- Supported types
> Valid admonition types include [GitHub alert types](https://github.blog/changelog/2023-12-14-new-markdown-extension-alerts-provide-distinctive-styling-for-significant-content/) and [Obsidian callout types](https://help.obsidian.md/callouts). The types are case-insensitive.
>
> **GitHub types:** `NOTE`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`  
> **Obsidian types:** `note`, `abstract`, `info`, `todo`, `tip`, `success`, `question`, `warning`, `failure`, `danger`, `bug`, `example`, `quote`

## Figure

Other than the markdown image syntax `![](img.jpg)`, Yore includes a `figure` shortcode for adding images to content. It provides more detail control to the markdown syntax.

You should always choose markdown syntax unless you need to insert custom classes to the images.

| Parameter | Description |
| --- | --- |
| `src` | **Required.** The local path/filename or URL of the image. |
| `alt` | Alternative text description for the image. |
| `caption` | Markdown for the image caption, displayed below the image. |
| `class` | Additional CSS classes to apply to the image. |
| `href` | URL that the image should be linked to. |
| `target` | The target attribute for the `href` URL. |

**Example: Image with caption and link**

```md
{{</* figure
    src="img/07.webp"
    alt="Nature scene"
    caption="A beautiful photo from [Pixabay](https://pixabay.com/images/search/user_id%3a127419%20plane/)"
*/>}}
```

{{< figure
    src="img/07.webp"
    alt="Nature scene"
    caption="A beautiful photo from [Pixabay](https://pixabay.com/images/search/user_id%3a127419%20plane/)"
>}}

<details>
<summary>Markdown syntax example</summary>

```md
![Alt text](img/07.webp "A beautiful photo from [Pixabay](https://pixabay.com/images/search/user_id%3a127419%20plane/)")
```

![Alt text](img/07.webp "A beautiful photo from [Pixabay](https://pixabay.com/images/search/user_id%3a127419%20plane/)")

You can also leverage [Markdown attributes](https://gohugo.io/content-management/markdown-attributes/) to add custom attributes to the generated HTML element.

For example, to center an image and set its width to 50%:

```md
![Alt text](img/07.webp "A beautiful photo from [Pixabay](https://pixabay.com/images/search/user_id%3a127419%20plane/)")
{style="margin: 0 auto; width: 50%;"}
```

![Alt text](img/07.webp "A beautiful photo from [Pixabay](https://pixabay.com/images/search/user_id%3a127419%20plane/)")
{style="margin: 0 auto; width: 50%;"}

Note that Markdown attributes require [configuration](https://gohugo.io/content-management/markdown-attributes/) of the Goldmark renderer.

</details>

## Lead

`lead` is used to bring emphasis to the start of an article, typically for introductions or key information.

The input is written in Markdown so you can format it however you please.

**Example: Introductory text**

```md
{{</* lead */>}}
This is a **bold introduction** to grab the reader's attention.
{{</* /lead */>}}

```

{{< lead >}}
This is a **bold introduction** to grab the reader's attention.
{{< /lead >}}

## Tabs

The `tabs` shortcode is used to present different variants of content, such as installation steps or code examples, with optional synchronization.

| Parameter | Description |
| --- | --- |
| `group` | **Optional.** Group name for synchronized tab switching. |
| `default` | **Optional.** Label of the tab to be active by default. |
| `label` | **Required.** The text label displayed on the tab button. |
| `icon` | **Optional.** Icon name to display before the label. |

**Example: Synchronized tabs with icons**

```md
{{</* tabs group="lang" default="Python" >}}
    {{< tab label="JavaScript" icon="code" >}}
    ```javascript
    console.log("Hello");
    ```
    {{< /tab >}}

    {{< tab label="Python" icon="sun" >}}
    ```python
    print("Hello")
    ```
    {{< /tab >}}

    {{< tab label="Go" icon="moon" >}}
    ```go
    fmt.Println("Hello")
    ```
    {{< /tab >}}
{{< /tabs >}}

{{< tabs group="lang" default="Python" >}}
    {{< tab label="JavaScript" icon="code" >}}
    ```javascript
    const add = (a, b) => a + b;
    ```
    {{< /tab >}}

    {{< tab label="Python" icon="sun" >}}
    ```python
    def add(a, b): return a + b
    ```
    {{< /tab >}}

    {{< tab label="Go" icon="moon" >}}
    ```go
    func add(a, b int) int { return a + b }
    ```
    {{< /tab >}}
{{< /tabs */>}}
```

{{< tabs group="lang" default="Python" >}}
    {{< tab label="JavaScript" icon="code" >}}
    ```javascript
    console.log("Hello");
    ```
    {{< /tab >}}

    {{< tab label="Python" icon="sun" >}}
    ```python
    print("Hello")
    ```
    {{< /tab >}}

    {{< tab label="Go" icon="moon" >}}
    ```go
    fmt.Println("Hello")
    ```
    {{< /tab >}}
{{< /tabs >}}

{{< tabs group="lang" default="Python" >}}
    {{< tab label="JavaScript" icon="code" >}}
    ```javascript
    const add = (a, b) => a + b;
    ```
    {{< /tab >}}

    {{< tab label="Python" icon="sun" >}}
    ```python
    def add(a, b): return a + b
    ```
    {{< /tab >}}

    {{< tab label="Go" icon="moon" >}}
    ```go
    func add(a, b int) int { return a + b }
    ```
    {{< /tab >}}
{{< /tabs >}}
