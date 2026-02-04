---
title: Media and Content Embeddings
slug: media
weight: 2010
date: 2026-01-17T10:40:00+08:00
description: "Explore shortcodes for embedding external media, repository previews, and remote content."
tags: ["shortcodes", "embeddings", "media", "external-content"]
series: ["Shortcodes"]
---

## Article Card

The `article` shortcode generates a visual preview card for a specified internal page.

| Parameter | Description |
| --- | --- |
| `link` | **Required.** The relative permalink of the target internal page. |
| `showSummary` | **Optional.** Whether the page summary is displayed. **Default:** `true` |

**Example: Internal page link**

```md
{{</* article link="/docs/getting-started/" showSummary="true" */>}}
```

{{< article link="/docs/getting-started/" showSummary="true" >}}

## Col

`col` shortcode allows you to create flexible multi-column layouts with custom widths and optional responsive behaviors. Note that it uses markdown notation (`{{%/*  */%}}`).

| Parameter | Description |
| --- | --- |
| `widths` | **Optional.** Comma-separated list of column widths (e.g., `30%,70%`). If not specified, columns are evenly distributed. |
| `rwd` | **Optional.** Responsive web design (rwd) controls responsive behavior. When `true`, columns stack vertically on small screens and display horizontally on larger screens. **Default:** `true` |

```md
{{%/* cols widths="70%,30%" rwd=false %}}

![qwe](img/01.webp)

+++

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.

{{% /cols */%}}
```

{{% cols widths="70%,30%" rwd=false %}}

![qwe](img/01.webp)

+++

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.

{{% /cols %}}

See more examples in [rich-content](../../docs/800-rich-content/index.md/#col-shortcode).

## Code Importer

The `codeimporter` shortcode fetches source code from a remote URL and renders it as a highlighted code block.

| Parameter | Description |
| --- | --- |
| `url` | **Required.** The absolute URL of the remote source file. |
| `type` | **Optional.** The programming language for syntax highlighting. |
| `startLine` | **Optional.** The starting line number. **Default:** `1` |
| `endLine` | **Optional.** The ending line number. **Default:** `-1` |

**Example: Fetching specific lines from GitHub**

```md
{{</* codeimporter url="https://raw.githubusercontent.com/githubtraining/hellogitworld/refs/heads/master/src/main/java/com/github/App.java" type="java" startLine="3" endLine="7" */>}}
```

{{< codeimporter url="https://raw.githubusercontent.com/githubtraining/hellogitworld/refs/heads/master/src/main/java/com/github/App.java" type="java" startLine="3" endLine="7">}}

## Gist

The `gist` shortcode embeds a GitHub Gist into the page.

| Parameter | Description |
| --- | --- |
| `0` | **Required.** GitHub username. |
| `1` | **Required.** Gist ID. |
| `2` | **Optional.** Specific filename. |

**Example: Embedding a specific file**

```md
{{</* gist mudge 3064 "count_benchmark.rb" */>}}
```

{{< gist mudge 3064 "count_benchmark.rb" >}}

## GitHub

The `github` shortcode creates a dynamic preview card for a GitHub repository.

| Parameter | Description |
| --- | --- |
| `repo` | **Required.** Format `owner/repo`. |
| `showThumbnail` | **Optional.** Display Open Graph image. **Default:** `true` |

**Example: Repository preview with thumbnail**

```md
{{</* github repo="gohugoio/hugo" */>}}
```

{{< github repo="gohugoio/hugo" >}}

## Md Importer

The `mdimporter` shortcode fetches and renders remote Markdown content.

| Parameter | Description |
| --- | --- |
| `url` | **Required.** The absolute URL of the Markdown file. |

**Example: Remote documentation import**

```md
{{</* mdimporter url="https://github.com/githubtraining/hellogitworld/raw/refs/heads/master/README.txt" */>}}
```

*Result:*

<div class="shadow" style="padding: 1rem; background-color:var(--color-primary-foreground); border-radius: 0.375rem;">
{{< mdimporter url="https://github.com/githubtraining/hellogitworld/raw/refs/heads/master/README.txt" >}}
</div>

## Video

The `video` shortcode embeds a HTML5 video player.

| Parameter | Description |
| --- | --- |
| `src` | **Required.** Video URL or local path. Local lookup order: page resource → `assets/` → `static/`. |
| `poster` | **Optional.** Poster image URL or local path. If omitted, the shortcode attempts a same-name image in the page bundle. |
| `caption` | **Optional.** Markdown caption shown below the video. |
| `autoplay` | **Optional.** Enables autoplay when `true`. **Default:** `false` |
| `loop` | **Optional.** Loops when `true`. **Default:** `false` |
| `muted` | **Optional.** Mutes when `true`. **Default:** `false` |
| `controls` | **Optional.** Shows the browser’s default playback controls when `true`. **Default:** `true` |
| `playsinline` | **Optional.** Inline playback on mobile when `true`. **Default:** `true` |
| `preload` | **Optional.** `metadata` (load info), `none` (save bandwidth), or `auto` (preload more). **Default:** `metadata` |
| `start` | **Optional.** Start time in seconds. |
| `end` | **Optional.** End time in seconds. |
| `ratio` | **Optional.** Reserved aspect ratio for the player. Supports `16/9`, `4/3`, `1/1`, or custom `W/H`. **Default:** `16/9` |
| `fit` | **Optional.** How the video fits the ratio: `contain` (no crop), `cover` (crop to fill), `fill` (stretch). **Default:** `contain` |

**Example: Autoplay muted video**

```md
{{</* video
    src="https://upload.wikimedia.org/wikipedia/commons/5/5a/CC0_-_Public_Domain_Dedication_video_bumper.webm"
    poster="https://upload.wikimedia.org/wikipedia/commons/e/e0/CC0.jpg"
    caption="**Public domain demo** — CC0 video and poster."
    loop=true
    muted=true
*/>}}
```

{{< video
  src="https://upload.wikimedia.org/wikipedia/commons/5/5a/CC0_-_Public_Domain_Dedication_video_bumper.webm"
  poster="https://upload.wikimedia.org/wikipedia/commons/e/e0/CC0.jpg"
  caption="**Public domain demo** — CC0 video and poster."
  loop=true
  muted=true
>}}

## YouTube

The `youtubeLite` shortcode embeds an optimized YouTube video player.

| Parameter | Description |
| --- | --- |
| `id` | **Optional.** YouTube video ID. **Default:** `SgXhGb-7QbU` |
| `params` | **Optional.** URL parameters. |

**Example: Specific video with start time**

```md
{{</* youtubeLite id="SgXhGb-7QbU" params="start=30" */>}}
```

{{< youtubeLite id="SgXhGb-7QbU" params="start=30" >}}

## TypeIt

The `typeit` shortcode creates dynamic typewriter animations.

| Parameter | Description |
| --- | --- |
| `initialString` | **Optional.** Text shown before animation. |
| `speed` | **Optional.** Typing speed in ms. **Default:** `100` |
| `loop` | **Optional.** Whether to restart. **Default:** `false` |
| `tag` | **Optional.** HTML tag for wrapping. **Default:** `div` |

**Example: Looping animation with custom speed**

```md
{{</* typeit speed="50" loop="true" tag="h2" */>}}
Yore - A Simple Yet Powerful Hugo Theme
{{</* /typeit */>}}
```

{{< typeit speed="50" loop="true" tag="h2" >}}
Yore - A Simple Yet Powerful Hugo Theme
{{< /typeit >}}
