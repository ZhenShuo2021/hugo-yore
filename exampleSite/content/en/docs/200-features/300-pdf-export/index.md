---
title: "PDF Export"
slug: "pdf-export"
description: "Build a single PDF of the documentation with a table of contents, bookmarks, and working internal links."
weight: 290
date: 2026-11-27T05:00:00+08:00
tags: ["guide", "pdf"]
---

{{< badge
  text="hugo-yore-pdf"
  url="https://github.com/ZhenShuo2021/hugo-yore/tree/main/scripts/pdf"
  variant="muted"
  appearance="accent"
  pill=true
>}}

The PDF export command merges every page of the documentation into one PDF file. It is a standalone Node.js package, `hugo-yore-pdf`, that runs after the site is built and does not affect the Hugo build itself. It shares its version number with the theme and is delivered as a tarball attached to each [GitHub Release](https://github.com/ZhenShuo2021/hugo-yore/releases).

It serves the built site with a local static server, prints each page with [Playwright](https://playwright.dev/) in print mode, and merges the results with [pdf-lib](https://pdf-lib.js.org/). The merged file includes:

- A table of contents with page numbers.
- PDF bookmarks (outline) for every page.
- Page numbers in the header of each page.
- Internal links and footnotes that jump within the PDF. Links to pages outside the documentation point back to the live site when `--base` is set.

<a href="/docs.pdf" data-no-swup>Example</a>

## Step 1: Install the package

Install [Node.js](https://nodejs.org/en/download) (18.14 or later), then install the tarball from the release into your development dependencies:

```bash
npm install -D https://github.com/ZhenShuo2021/hugo-yore/releases/download/v0.14.0/hugo-yore-pdf-0.14.0.tgz
```

This adds the `hugo-yore-pdf` command, and also installs its dependencies [Playwright](https://playwright.dev/) and [pdf-lib](https://pdf-lib.js.org/). The package declares its own module type, so your `package.json` needs no changes.

The script depends on the markup and print styles of the theme, so use the same version as your theme. To upgrade, replace the version in the URL with the new theme version, for example `vX.Y.Z` and `hugo-yore-pdf-X.Y.Z.tgz`.

## Step 2: Prepare Playwright

Playwright drives a Chromium browser to render the pages. Download it once:

```bash
npx playwright install chromium
```

On Linux machines and CI runners, also install the system libraries Chromium depends on:

```bash
npx playwright install --with-deps chromium
```

> [!NOTE]
> If Chromium fails with `error while loading shared libraries` and you cannot install system packages, for example on a build service without root access, download the missing libraries into a private folder with `apt-get download` and point `LD_LIBRARY_PATH` at it. [`scripts/chromium-libs.sh`](https://github.com/ZhenShuo2021/hugo-yore/blob/main/scripts/chromium-libs.sh) in the theme repository does this and can be copied as a starting point.

## Step 3: Build the PDF

Build the site first, then run the command against the output directory.

```bash
hugo --gc --minify
npx hugo-yore-pdf --site public/ --start /docs/ --out docs.pdf --base https://example.com/
```

| Argument | Required | Description |
| --- | --- | --- |
| `--site` | Yes | Directory of the built site, usually `public/`. |
| `--start` | Yes | Path of the first documentation page, such as `/docs/`. Only pages under this path are included. |
| `--out` | Yes | Output PDF file path. |
| `--base` | No | URL of the live site. Links to pages not included in the PDF are rewritten to this address. |

The examples write a trailing slash on `--site`, `--start` and `--base`. The script accepts either form, so `docs`, `/docs` and `/docs/` are equivalent for `--start`.

Add a script to `package.json` for convenience:

```json {title="package.json"}
{
  "scripts": {
    "build": "hugo --gc --minify",
    "pdf": "hugo-yore-pdf --site public/ --start /docs/ --out docs.pdf --base https://example.com/"
  }
}
```

> [!IMPORTANT]
> Run the command **after** the site is built.

## How it works

### Page order

The script opens the start page and reads the links in the docs sidebar. The sidebar order is used as the document order, and the nesting depth of each page controls the indentation in the table of contents.
