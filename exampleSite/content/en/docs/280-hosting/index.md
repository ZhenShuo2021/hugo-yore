---
title: "Hosting"
slug: "hosting"
description: "Deploy your Hugo site."
weight: 280
date: 2026-01-22T16:30:00+08:00
tags: ["guide", "hosting"]
---

## Prerequisites

Before deploying, make sure your site builds locally with `hugo` without errors.

## Deploy to GitHub Pages

GitHub Pages builds your site using GitHub Actions. The workflow installs Hugo, runs Pagefind, and publishes the result. Your repository must be hosted on GitHub.

1. In your repository, go to **Settings > Pages**.

2. Under **Build and deployment**, set the source to **GitHub Actions**.

3. Create `.github/workflows/deploy.yml`. The workflow has two jobs: `build` checks out the repo, installs Hugo and Node dependencies, builds the site, runs Pagefind, and uploads the output as an artifact. `deploy` then publishes that artifact to GitHub Pages.

    ```yaml {title=".github/workflows/deploy.yml"}
    name: Deploy to GitHub Pages
    on:
      push:
        branches:
          - main
      workflow_dispatch:

    permissions:
      contents: read
      pages: write
      id-token: write

    concurrency:
      group: pages
      cancel-in-progress: false

    jobs:
      build:
        runs-on: ubuntu-latest
        environment:
          name: github-pages
          url: ${{ steps.deployment.outputs.page_url }}
        env:
          GO_VERSION: 1.25.0  # matches the version in go.mod
          HUGO_VERSION: 0.164.0
          NODE_VERSION: 22
          TZ: Asia/Taipei
        steps:
          - name: Checkout
            uses: actions/checkout@v7
            with:
              submodules: recursive
              # fetch-depth: 0  # Optional, for enableGitInfo

          - name: Setup Pages
            id: pages
            uses: actions/configure-pages@v6

          - name: Setup NodeJS
            uses: actions/setup-node@v6
            with:
              node-version: ${{ env.NODE_VERSION }}

          - name: Setup Go
            uses: actions/setup-go@v5
            with:
              go-version: ${{ env.GO_VERSION }}

          - name: Setup Hugo
            uses: peaceiris/actions-hugo@v3.0.0
            with:
              hugo-version: ${{ env.HUGO_VERSION }}
              extended: true

          - name: Install pnpm
            uses: pnpm/action-setup@v5

          - name: Install dependencies
            run: npm ci --omit=dev --ignore-scripts

          - name: Build
            run: hugo build --gc --minify --baseURL "${{ steps.pages.outputs.base_url }}/" && npx pagefind --site public

          - name: Upload artifact
            uses: actions/upload-pages-artifact@v5
            with:
              include-hidden-files: false
              path: ./public

          - name: Deploy to GitHub Pages
            id: deployment
            uses: actions/deploy-pages@v5
    ```

4. Commit and push the file. GitHub Actions will trigger automatically.

## Deploy to Other Hosting Services

See Hugo's [official tutorial](https://gohugo.io/host-and-deploy/). Add `npm run pagefind` to your build step to generate the search index.
