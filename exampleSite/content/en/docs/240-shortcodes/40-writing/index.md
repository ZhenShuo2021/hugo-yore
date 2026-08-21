---
title: Writing
slug: writing
weight: 40
date: 2026-01-17T10:40:00+08:00
description: "Master Hugo shortcodes for admonitions, figures, lightboxes, lead text, and tabs."
tags: ["reference", "shortcodes", "writing-shortcodes"]
series: ["Shortcodes"]
---

## Admonition

Admonitions allow you to insert eye-catching callout boxes in your content.

`[!TYPE]` is a GitHub-flavored admonition. The `[!TYPE]+`/`[!TYPE]-` syntax controls whether the admonition is collapsible and its default state. This syntax is *only* supported in Obsidian.

**Example: Markdown syntax with custom icon**

```md
> [!TIP]- Custom Title
> This is a collapsible tip with a custom icon.
{icon="twitter"}
```

> [!TIP]- Custom Title
> This is a collapsible tip with a custom icon.
{icon="twitter"}

> [!INFO] Supported types
> Valid admonition types include [GitHub alert types](https://github.blog/changelog/2023-12-14-new-markdown-extension-alerts-provide-distinctive-styling-for-significant-content/) and [Obsidian callout types](https://help.obsidian.md/callouts). The types are case-insensitive.
>
> **GitHub types:** `NOTE`, `TIP`, `IMPORTANT`, `WARNING`, `CAUTION`  
> **Obsidian types:** `note`, `abstract`, `info`, `todo`, `tip`, `success`, `question`, `warning`, `failure`, `danger`, `bug`, `example`, `quote`

{{% admonition type="INFO" sign="-" title="Shortcode version" %}}

Admonition also has a shortcode version, which avoids having to prefix every line with `>`.

**Admonition parameters**

| Parameter | Description |
| --- | --- |
| `type` | **Required.** Admonition type. Accepts the same [GitHub alert types](https://github.blog/changelog/2023-12-14-new-markdown-extension-alerts-provide-distinctive-styling-for-significant-content/) and [Obsidian callout types](https://help.obsidian.md/callouts) as the markdown syntax above. Case-insensitive. |
| `title` | **Optional.** Custom title displayed in the admonition header. Defaults to the localized name of `type`. |
| `sign` | **Optional.** `+` for open, `-` for closed, others for not collapsible. |
| `icon` | **Optional.** Icon name to override the default icon for `type`. |

**Example: Shortcode syntax with custom icon**

```md
{{%/* admonition type="tip" sign="-" title="Custom Title" icon="twitter" %}}
This is a collapsible tip with a custom icon.
{{% /admonition */%}}
```

{{% admonition type="tip" sign="-" title="Custom Title" icon="twitter" %}}
This is a collapsible tip with a custom icon.
{{% /admonition %}}

> [!NOTE]
> This shortcode must used with markdown notation `{{%/*   */%}}`.

{{% /admonition %}}

## Lead

`lead` is used to bring emphasis to the start of an article, typically for introductions or key information.

**Example: Introductory text**

```md
{{%/* lead %}}
This is a **bold introduction** to grab the reader's attention.
{{% /lead */%}}
```

{{% lead %}}
This is a **bold introduction** to grab the reader's attention.
{{% /lead %}}

> [!NOTE]
> This shortcode must used with markdown notation `{{%/*   */%}}`.

## Text Center

`text-center` creates a larger and centered text.

```txt
{{%/* text-center %}}
*{{% ruby "とうきょう" %}}東京[^1]{{% /ruby %}}* text.

[^1]: footnote content
{{% /text-center */%}}
```

{{% text-center %}}
*{{% ruby "とうきょう" %}}東京[^1]{{% /ruby %}}* text.
{{% /text-center %}}

[^1]: footnote content

> [!NOTE]
> This shortcode must used with markdown notation `{{%/*   */%}}`.

## Ruby

The `ruby` shortcode renders [ruby annotations](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/ruby), commonly used to show pronunciation guides (such as Japanese furigana) above or beside base text.

| Parameter | Description |
| --- | --- |
| `0` (positional) | **Required.** The annotation text displayed above the base text. |

**Example: Furigana annotation**

```md
{{%/* ruby "とうきょう" */%}}東京{{%/* /ruby */%}}
```

{{% ruby "とうきょう" %}}東京{{% /ruby %}}

## Steps

The `steps` shortcode renders a styled ordered step list, useful for presenting sequential instructions or workflows.

Each step is defined with the `step` inner shortcode, which accepts either a `label` (custom text) or an `icon` to display in the step indicator. Use `circleClass` to inject additional CSS classes into the indicator, for example, to mark a completed step with a success color.

**Steps parameters**

| Parameter | Description |
| --- | --- |
| `number` | **Optional.** Boolean. Automated step counter. Default is `true`. |

**Step parameters**

| Parameter | Description |
| --- | --- |
| `label` | **Optional.** Custom text displayed in the step indicator. |
| `icon` | **Optional.** Icon name displayed in the step indicator. Takes priority over `label` when both are set. |
| `circleClass` | **Optional.** Additional CSS classes applied to the step indicator circle. Useful for conveying step state, such as `text-success bg-success` for completed steps. |

**Example: Installation steps with labels and icons**

`````md
{{%/* steps %}}

  {{< step label=":watermelon:" >}}

  <h3>Install Dependencies</h3>

  Run `npm install` in your project root.

  {{< /step >}}

  {{< step label="2" >}}

  <h3>Configure Environment</h3>

  Copy `.env.example` to `.env` and fill in the required values.

  {{< /step >}}

  {{< step icon="check-circle" circleClass="text-success" >}}

  <h3>Verify Setup</h3>

  Run `npm run dev` and open `http://localhost:1313` in your browser.

  {{< /step >}}

  {{< step icon="check" circleClass="bg-success" >}}

  <h3>Done</h3>

  Your site is up and running[^fn-steps].

  [^fn-steps]: Footnotes are supported!

  {{< /step >}}

{{% /steps */%}}
`````

{{% steps %}}

  {{< step label=":watermelon:" >}}

  <h3>Install Dependencies</h3>

  Run `npm install` in your project root.

  {{< /step >}}

  {{< step label="2" >}}

  <h3>Configure Environment</h3>

  Copy `.env.example` to `.env` and fill in the required values.

  {{< /step >}}

  {{< step icon="check-circle" circleClass="text-success" >}}

  <h3>Verify Setup</h3>

  Run `npm run dev` and open `http://localhost:1313` in your browser.

  {{< /step >}}

  {{< step icon="check" circleClass="bg-success" >}}

  <h3>Done</h3>

  Your site is up and running[^fn-steps].

  [^fn-steps]: Footnotes are supported!

  {{< /step >}}

{{% /steps %}}

## Tabs

The `tabs` shortcode is used to present different variants of content, such as installation steps or code examples, with optional synchronization.

**Tabs parameters**

| Parameter | Description |
| --- | --- |
| `group` | **Optional.** Group name for synchronized tab switching. |
| `default` | **Optional.** Label of the tab to be active by default. |

**Tab parameters**

| Parameter | Description |
| --- | --- |
| `label` | **Required.** The text label displayed on the tab button. |
| `icon` | **Optional.** Icon name to display before the label. |

**Example: Synchronized tabs with icons**

`````md
{{%/* tabs group="lang" default="Python" %}}
  {{< tab label="JavaScript" icon="code" >}}

  ```javascript
  console.log("Hello");
  ```

  {{< /tab >}}

  {{< tab label="Python" icon="sun-light" >}}

  ```python
  print("Hello")
  ```

  {{< /tab >}}

  {{< tab label="Go" icon="half-moon" >}}

  ```go
  fmt.Println("Hello")
  ```

  {{< /tab >}}
{{% /tabs %}}

{{% tabs group="lang" default="Python" %}}
  {{< tab label="JavaScript" icon="code" >}}

  ```javascript
  const add = (a, b) => a + b;
  ```

  {{< /tab >}}

  {{< tab label="Python" icon="sun-light" >}}

  ```python
  def add(a, b): return a + b
  ```

  {{< /tab >}}

  {{< tab label="Go" icon="half-moon" >}}

  ```go
  func add(a, b int) int { return a + b }
  ```

  {{< /tab >}}
{{% /tabs */%}}
`````

{{% tabs group="lang" default="Python" %}}
  {{< tab label="JavaScript" icon="code" >}}

  ```javascript
  console.log("Hello");
  ```

  {{< /tab >}}

  {{< tab label="Python" icon="sun-light" >}}

  ```python
  print("Hello")
  ```

  {{< /tab >}}

  {{< tab label="Go" icon="half-moon" >}}

  ```go
  fmt.Println("Hello")
  ```

  {{< /tab >}}
{{% /tabs %}}

{{% tabs group="lang" default="Python" %}}
  {{< tab label="JavaScript" icon="code" >}}

  ```javascript
  const add = (a, b) => a + b;
  ```

  {{< /tab >}}

  {{< tab label="Python" icon="sun-light" >}}

  ```python
  def add(a, b): return a + b
  ```

  {{< /tab >}}

  {{< tab label="Go" icon="half-moon" >}}

  ```go
  func add(a, b int) int { return a + b }
  ```

  {{< /tab >}}
{{% /tabs %}}

## Accordion

The `accordion` shortcode renders a collapsible list of content panels, useful for FAQs, progressive disclosure of details, or grouping related content that doesn't need to be visible all at once.

**Accordion parameters**

| Parameter | Description |
| --- | --- |
| `exclusive` | **Optional.** Boolean. When `true`, opening a panel automatically closes any other open panel. Default is `false`. |
| `separated` | **Optional.** Boolean. When `true`, renders each `accordion-item` as an individually bordered, rounded card with spacing between them, instead of a single connected block with divider lines. Default is `false`. |

**Accordion-item parameters**

| Parameter | Description |
| --- | --- |
| `title` | **Required.** Text displayed in the item header. |
| `open` | **Optional.** Boolean. Whether this panel is expanded by default. Default is `false`. |

**Example:**

`````md
{{%/* accordion exclusive=true separated=true %}}

  {{< accordion-item title="What is this *framework* built on?" >}}

  This site is built with **Hugo**, a fast static site generator written in Go.

  {{< /accordion-item >}}

  {{< accordion-item title="Can I use custom shortcodes?" >}}

  Yes, custom shortcodes can be added under `layouts/shortcodes/`.

  {{< /accordion-item >}}

  {{< accordion-item title="Is dark mode supported?" >}}

  Dark mode is supported out of the box and follows the visitor's system preference.

  {{< /accordion-item >}}

{{% /accordion */%}}
`````

{{% accordion exclusive=true separated=true %}}

  {{< accordion-item title="What is this *framework* built on?" >}}

  This site is built with **Hugo**, a fast static site generator written in Go.

  {{< /accordion-item >}}

  {{< accordion-item title="Can I use custom shortcodes?" >}}

  Yes, custom shortcodes can be added under `layouts/shortcodes/`.

  {{< /accordion-item >}}

  {{< accordion-item title="Is dark mode supported?" >}}

  Dark mode is supported out of the box and follows the visitor's system preference.

  {{< /accordion-item >}}

{{% /accordion %}}
