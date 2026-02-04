---
title: "Getting Started"
slug: getting-started
weight: 40
date: 2026-01-15T14:45:00+08:00
description: 
tags: ["installation", "setup", "configuration", "documentation"]
series: ["Documentation"]
series_weight: 40
---

## Prerequisites

1. [Install Hugo](https://gohugo.io/installation/) extended version, the minimum version is `v0.155.1`.
2. [Install Git](https://git-scm.com/install/windows) version manager.
3. (Optional) [Install Go](https://go.dev/doc/install) if you want to install Yore using Hugo module instead of Git submodule.

## Installing Yore

Pick one of these three ways to set up the Yore theme on your new site.

### Git Submodule

This is the recommended method to install Yore. Start by creating a new site:

```bash
hugo new site my-site --format yaml
cd my-site
```

Then, add the theme to your project:

```bash
git init
git submodule add https://github.com/ZhenShuo2021/hugo-yore themes/hugo-yore
```

### Hugo Module

> [!Note]
> You must have Go (version 1.25+) installed for this method.

Create your site:

```bash
hugo new site my-site --format yaml
cd my-site
```

Initialize your site as a module:

```bash
hugo mod init github.com/yourusername/my-site
```

Add this to `hugo.yaml`:

```yaml
module:
  imports:
  - path: github.com/ZhenShuo2021/hugo-yore
```

Finally, download the theme:

```bash
hugo mod get -u
```

### Using the Demo Site Template

If you want a pre-configured site with CSS customization examples, you can clone the setup from our documentation:

```sh
# Download the repo
git clone https://github.com/ZhenShuo2021/hugo-yore my-site

# Enter the folder
cd my-site

# ==================================================================
# 1. Delete everything except the `exampleSite` folder,
#    including the `.git` folder.
# 
# 2. Move the files inside `exampleSite` out into your main `my-site` folder.
# ==================================================================

# Initialize Git 
git init

# Add the theme
git submodule add https://github.com/ZhenShuo2021/hugo-yore themes/hugo-yore
```

---

## Basic Configuration

The Yore theme can be initialized with a minimal configuration. To enable the theme, add the following line:

```yaml {title="hugo.yaml"}
theme: hugo-yore  # this is not required if you use Hugo Module
```

It is highly recommended starting with the [Reference Configuration](../994-reference-configuration/index.md). It provides preconfigured settings that allow you to focus on content creation immediately, bypassing the need for manual configuration.

---

## Launch Your Site

With the theme installed, let's see how it looks. First, create some sample pages:

```bash
hugo new content posts/_index.md
hugo new content posts/first/index.md
hugo new content posts/second/index.md
```

Start the development server:

```bash
hugo server -D
```

*The `-D` flag tells Hugo to build the posts even if they are marked as "draft".*

View the site at `http://localhost:1313/` and posts at `http://localhost:1313/posts/`.

### Live Reload

Live Reload automatically refreshes the browser when files are saved.

### Stop the Server

Press `Ctrl+C` in the terminal to stop the server.

## Update Yore

### Git submodule

```sh
git submodule update --remote --merge
```

### Hugo module

```sh
hugo mod get -u
```

### Using the Demo Site Template

```sh
git submodule update --remote --merge
```
