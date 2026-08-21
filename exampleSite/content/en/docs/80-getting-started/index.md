---
title: "Getting Started"
slug: getting-started
weight: 80
date: 2026-01-15T14:45:00+08:00
description: "Learn how to install the Yore Hugo theme using Git Submodule or Hugo Module, configure it for your site, and launch your first local build in minutes."
tags: ["guide", "installation", "setup", "getting-started"]
---

## Prerequisites

1. [Install Hugo](https://gohugo.io/installation/) extended version, the minimum version is `v0.164.0`.
2. [Install Git](https://git-scm.com/install/) version manager.
3. [Install Go](https://go.dev/doc/install), the minimum version is `v1.20.0`.

## Installing Yore

<!-- rumdl-disable MD077 -->

{{% steps %}}

  {{< step >}}

Create a site if you don't have one yet:

```bash
hugo new site my-site --format yaml
cd my-site
```

Otherwise, `cd` into your existing project.

  {{< /step >}}

  {{< step >}}

Initialize your site as a Hugo module:

```bash
hugo mod init github.com/username/repo  # or hugo mod init my-project
```

  {{< /step >}}

  {{< step >}}

  Copy the [configuration](../160-configuration/20-preconfigured-setting/index.md) and paste it into `hugo.yaml`.

{{< _internal/copy-setting >}}

  {{< /step >}}

  {{< step >}}

Set up the language configurations.

{{% tabs group="lang" %}}
  {{< tab label="Monolingual site" >}}

1. Change the `defaultContentLanguage` to your language.
2. Find the top-level `languages` setting (directly below *Language-specific configuration*). Change the `en` block to your language.

  {{< /tab >}}

  {{< tab label="Multilingual site" >}}

1. Change the `defaultContentLanguage` to your language.
2. Replace the existing `module` field with the following configuration. In each mount, replace `zh-cn` and `en` with your own language codes, in both the `source` path and the matching `matrix.languages` value.

    ```yaml
    module:
      imports:
        - path: github.com/ZhenShuo2021/hugo-yore
      mounts:
        - source: content/zh-cn
          target: content
          sites:
            matrix:
              languages: [zh-cn]  # matches languages.LANG (see next step)
        - source: content/en
          target: content
          sites:
            matrix:
              languages: [en]  # matches languages.LANG (see next step)
    ```

3. Next, find the top-level `languages` setting (directly below *Language-specific configuration*). This is a separate setting from `module.mounts` above. Change each language block to match your site's languages.

  {{< /tab >}}
{{% /tabs %}}

  {{< /step >}}

  {{< step >}}

Initialize a Git repository in your project root:

```sh
git init
```

Copy the `.gitignore` below into your project root:

```text
# Hugo
/public/
/resources/_gen/
jsconfig.json
hugo_stats.json
.hugo_build.lock

# System
.DS_Store

# JS
node_modules
```

> [!TIP]- Already tracked?
> Use `git rm -r --cached public/ resources/_gen/` to remove the files from Git tracking.

  {{< /step >}}

{{% /steps %}}

<!-- rumdl-enable MD077 -->

## Preview Your Site

With the theme installed, create some sample pages to see how it looks:

{{% tabs group="lang" %}}

  {{< tab label="Monolingual site" >}}

  ```bash
  hugo new content/_index.md
  hugo new content/blog/_index.md
  hugo new content/blog/first/index.md
  hugo new content/blog/second/index.md
  ```

  {{< /tab >}}

  {{< tab label="Multilingual site" >}}

  ```bash
  hugo new content/en/_index.md
  hugo new content/en/blog/_index.md
  hugo new content/en/blog/first/index.md
  hugo new content/en/blog/second/index.md
  ```

  {{< /tab >}}

{{% /tabs %}}

Start the development server:

```bash
hugo server -DEF
```

View the site at `http://localhost:1313/` and posts at `http://localhost:1313/blog/`. The browser reloads automatically on file save. Press `Ctrl+C` to stop the server.

> [!WARNING] Pages not found?
>
> Hugo skips draft, expired, and future-dated posts by default. If a post is missing, check these three flags first:
>
> - `-D` builds *draft* posts, controlled by the `draft` field in front matter
> - `-E` builds *expired* posts, controlled by the `expiryDate` field in front matter
> - `-F` builds *future* posts, controlled by the `date` field in front matter
>
> To avoid the draft issue entirely, remove `draft` from `archetypes/default.md`, the file that sets the default content for `hugo new content`.

## Build Your Site

`hugo server` runs in the development environment. To build the site for production, use `hugo build` instead.

## Keep Yore Updated

Since Yore is installed as a Hugo module, updating or pinning a version is a `hugo mod` command.

Update to the latest version:

```sh
hugo mod get -u github.com/ZhenShuo2021/hugo-yore
hugo mod tidy
git add go.mod go.sum
git commit -m "chore(deps): update hugo-yore"
```

To pin a specific version instead, replace `-u` with `@vX.X.X`:

```sh
hugo mod get github.com/ZhenShuo2021/hugo-yore@vX.X.X
hugo mod tidy
git add go.mod go.sum
git commit -m "chore(deps): pin hugo-yore to vX.X.X"
```

<div class="hidden">

{{% embed-md path="/docs/160-configuration/setting-snippet.md" %}}

</div>
