---
title: "PDF Export"
slug: "pdf-export"
description: "Build a single PDF of the documentation with a table of contents, bookmarks, and working internal links."
weight: 290
date: 2026-11-27T05:00:00+08:00
tags: ["guide", "pdf"]
---

{{< badge
  text="build-pdf.js"
  url="https://github.com/ZhenShuo2021/hugo-yore/blob/main/scripts/build-pdf.js"
  variant="muted"
  appearance="accent"
  pill=true
>}}

The PDF export script merges every page of the documentation into one PDF file. It is a standalone Node.js script that runs after the site is built, and does not affect the Hugo build itself.

It serves the built site with a local static server, prints each page with [Playwright](https://playwright.dev/) in print mode, and merges the results with [pdf-lib](https://pdf-lib.js.org/). The merged file includes:

- A table of contents with page numbers.
- PDF bookmarks (outline) for every page.
- Page numbers in the header of each page.
- Internal links and footnotes that jump within the PDF. Links to pages outside the documentation point back to the live site when `--base` is set.

<!-- rumdl-disable MD057 -->

[Example](/docs.pdf)

<!-- rumdl-enable MD057 -->

## Step 1: Copy the script

Copy [`scripts/build-pdf.js`](https://github.com/ZhenShuo2021/hugo-yore/blob/main/scripts/build-pdf.js) to the same path in your project root. After upgrading the theme, copy it again to get the latest version.

## Step 2: Install dependencies

Install [Node.js](https://nodejs.org/en/download), then add the required packages to your development dependencies:

```bash
npm install -D playwright pdf-lib
```

The script uses ES modules, so make sure `package.json` declares the module type.

```json {title="package.json"}
{
  "type": "module"
}
```

## Step 3: Prepare Playwright

Playwright drives a Chromium browser to render the pages. Download it once:

```bash
npx playwright install chromium
```

On Linux machines and CI runners, also install the system libraries Chromium depends on:

```bash
npx playwright install --with-deps chromium
```

## Step 4: Build the PDF

Build the site first, then run the script against the output directory.

```bash
hugo --gc --minify
node scripts/build-pdf.js --site public --start /docs/ --out docs.pdf --base https://example.com
```

| Argument | Required | Description |
| --- | --- | --- |
| `--site` | Yes | Directory of the built site, usually `public`. |
| `--start` | Yes | Path of the first documentation page, such as `/docs/`. Only pages under this path are included. |
| `--out` | Yes | Output PDF file path. |
| `--base` | No | URL of the live site. Links to pages not included in the PDF are rewritten to this address. |

Add a script to `package.json` for convenience:

```json {title="package.json"}
{
  "scripts": {
    "build": "hugo --gc --minify",
    "pdf": "node scripts/build-pdf.js --site public --start /docs/ --out docs.pdf --base https://example.com"
  }
}
```

> [!IMPORTANT]
> Run the script **after** the site is built.

## How it works

### Page order

The script opens the start page and reads the links in the docs sidebar. The sidebar order is used as the document order, and the nesting depth of each page controls the indentation in the table of contents.
