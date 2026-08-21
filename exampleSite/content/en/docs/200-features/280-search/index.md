---
title: "Search"
slug: "search"
description: "Configure the site-wide search functionality powered by Pagefind."
weight: 280
date: 2026-01-22T16:30:00+08:00
tags: ["guide", "search"]
params:
  sourceLinks:
    - path: "assets/css/components/search.css"
    - path: "build.sh"
---

Built-in search is powered by [Pagefind](https://pagefind.app/), a static search library that serves results entirely in the browser with no external service needed.

Enabling search requires two steps: setting a config flag so Yore renders the search UI, and running Pagefind after every build to generate the search index. Both are required because the UI will not work without the index.

## Step 1: Enable the search UI

```yaml {title="hugo.yaml"}
params:
  searchEnabled: true
```

## Step 2: Generate the search index

Pagefind reads the HTML files Hugo produces and builds a search index from them. Install [Node.js](https://nodejs.org/en/download), then add Pagefind to your development dependencies:

```bash
npm install -D pagefind
```

Add the following scripts to `package.json`.

```json {title="package.json"}
{
  "scripts": {
    "pagefind": "pagefind --site public",
    "build": "hugo --gc --minify && npm run pagefind",
    "dev": "hugo server"
  }
}
```

Finally, run `npm run pagefind` *after* the site is built.

> [!IMPORTANT]
> Include the indexing step in your deployment script (GitHub workflow, Cloudflare build script, etc.), otherwise search will not appear on the deployed site.

## Exclude a page from search

Set `pageNoList: true` in a page's front matter to exclude it from search results and list pages.
