---
title: Media and Content Embeddings
linkTitle: Media
slug: media
weight: 80
date: 2026-01-17T10:40:00+08:00
description: "Explore shortcodes for embedding external media, repository previews, and remote content."
tags: ["reference", "shortcodes", "media-embeds"]
series: ["Shortcodes"]
---

<!-- rumdl-disable MD045 -->
<!-- most image here are decorative, not related to the docs -->

## Email

The `email` shortcode obfuscates an email address to reduce exposure to scrapers. The address is base64-encoded at build time and decoded client-side into a `mailto` link.

| Parameter | Description |
| --- | --- |
| `address` | **Required.** Email address. |

**Example**

```text
{{</* email address="hello@example.com" */>}}
```

{{< email address="hello@example.com" >}}

## Embed Code

The `embed-code` shortcode fetches source code from a remote URL and renders it as a highlighted code block.

| Parameter | Description |
| --- | --- |
| `url` | **Required.** The absolute URL of the remote source file. |
| `type` | **Optional.** The programming language for syntax highlighting. |
| `lines` | **Optional.** Line range in `start-end` format (e.g. `3-7`), or a single line number. Omit to include the entire file. |

**Example: Fetching specific lines from GitHub**

```md
{{</* embed-code url="https://raw.githubusercontent.com/githubtraining/hellogitworld/refs/heads/master/src/main/java/com/github/App.java" type="java" lines="3-7" */>}}
```

{{< embed-code url="https://raw.githubusercontent.com/githubtraining/hellogitworld/refs/heads/master/src/main/java/com/github/App.java" type="java" lines="3-7">}}

## Embed Markdown

The `embed-md` shortcode fetches and renders remote Markdown content. This shortcode must be called with markdown notation (`{{/*%  %*/}}`)

| Parameter | Description                                                                   |
| --------- | ----------------------------------------------------------------------------- |
| `url`     | **Optional.** The absolute URL of the Markdown file.                          |
| `page`    | **Optional.** The logical path of the target internal page.                   |

**Example**

Include an external page:

```md
{{%/* embed-md url="https://github.com/ZhenShuo2021/hugo-yore/raw/refs/heads/main/README.md" md=false */%}}
```

Include an internal page:

```md
{{%/* embed-md page="/docs/shortcodes/40-math/index.md" */%}}
```

## Fig

The `fig` shortcode renders an image inside a `<figure>` element with a `figcaption` that supports footnotes. Use it only when the caption needs a footnote, otherwise use standard Markdown image syntax.

| Parameter | Description |
| --- | --- |
| `src` | **Required.** Image path. |
| `alt` | **Optional.** Alt text for the image. |
| `caption` | **Optional.** Caption text shown in the `figcaption`. |
| `attrs` | **Optional.** Raw HTML attributes applied to the `<figure>` element. |

**Example**

```md
{{%/* fig
  attrs="class='yr-center-cap yr-center-img' style='width:50%'"
  src="/img/04.webp"
  alt=""
  caption="*1234*[^fn_a]"
*/%}}

[^fn_a]: Footnote text.
```

{{% fig
  attrs="class='yr-center-cap yr-center-img' style='width:50%'"
  src="/img/04.webp"
  alt=""
  caption="*1234*[^fn_a]"
%}}

This is equivalent to the standard markdown image syntax below, but the syntax does not support footnotes.

```md
![](/img/04.webp "*1234*")
{class="yr-center-cap yr-center-img" style="width:50%"}
```

[^fn_a]: Footnote text.

## Float

{{% float side="end" %}}

![](/img/04.webp)

{{% /float %}}

The `float` shortcode wraps arbitrary content with text flowing around it, floating left or right with configurable width.

| Parameter | Description |
| --- | --- |
| `side` | **Optional.** Float direction, `start` or `end`. **Default:** `start` |
| `size` | **Optional.** Float width, `s`, `m`, or `l`. **Default:** `m` |

**Example:**

```md
{{%/* float side="end" %}}

![](/img/04.webp)

{{% /float */%}}
```

Use `{{%/* float-clear */%}}` to cancel the float effect.

## Cols

`cols` shortcode allows you to create flexible multi-column layouts with custom widths and optional responsive behaviors. Note that it uses markdown notation (`{{%/*  */%}}`).

| Parameter | Description |
| --- | --- |
| `widths` | **Optional.** Comma-separated list of column widths (e.g., `30%,70%`). If not specified, columns are evenly distributed. |
| `rwd` | **Optional.** Responsive web design (rwd) controls responsive behavior. When `true`, columns stack vertically on small screens and display horizontally on larger screens. **Default:** `true` |

```md
{{%/* cols widths="70%,30%" rwd=false %}}

![](/img/01.webp)

<!-- cell -->

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.

{{% /cols */%}}
```

{{% cols widths="70%,30%" rwd=false %}}

![](/img/01.webp)

<!-- cell -->

Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.

{{% /cols %}}

## Carousel

The `carousel` shortcode displays an image carousel with a main viewport, navigation buttons, and a scrollable thumbnail strip. The inner content uses YAML format to define images.

Images can be specified individually with `src`, or batch-loaded with `match`.

| Parameter | Description |
| --- | --- |
| `src` | **Optional.** YAML path to the image configuration file. Takes precedence over the shortcode's inner content. |
| `ratio` | **Optional.** Aspect ratio of the slide frame, in `x/y` format. **Default:** `4/3` |
| `fit` | **Optional.** How images fill the frame. `contain` shows the full image (may letterbox); `cover` crops to fill. **Default:** `contain` |
| `thumbs` | **Optional.** Whether to show the thumbnail strip. **Default:** `true` |
| `arrows` | **Optional.** Whether to show the previous/next buttons. **Default:** `true` |
| `counter` | **Optional.** Whether to show the slide counter. **Default:** `true` |

**YAML fields per item:**

| Field | Description |
| --- | --- |
| `src` | Image path. |
| `match` | Glob pattern to batch-load images. See [`Match`](https://gohugo.io/functions/resources/match/) for more details. |
| `caption` | **Optional.** Caption text displayed below the main image. |
| `alt` | **Optional.** Alt text for accessibility. Falls back to `caption` if omitted. |

**Example 1: fit="cover" arrows=false**

```yaml
{{</* carousel ratio="32/9" fit="cover" arrows=false >}}

- match: /img/*[5-7]* # 05, 06, 07
- src: /img/drop.svg
  caption: carousel caption
  alt: carousel sample image

{{< /carousel */>}}
```

{{< carousel ratio="32/9" fit="cover" arrows=false >}}

- match: /img/*[5-7]* # 05, 06, 07
- src: /img/drop.svg
  caption: carousel caption
  alt: carousel sample image

{{< /carousel >}}

**Example 2: thumbs=false counter=false**

```yaml
{{</* carousel ratio="32/9" thumbs=false counter=false >}}

- match: /img/*[5-7]* # 05, 06, 07
- src: /img/drop.svg
  caption: carousel caption
  alt: carousel sample image

{{< /carousel */>}}
```

{{< carousel ratio="32/9" thumbs=false counter=false >}}

- match: /img/*[5-7]* # 05, 06, 07
- src: /img/drop.svg
  caption: carousel caption
  alt: carousel sample image

{{< /carousel >}}

## Masonry

`masonry` shortcode allows you to create a fluid, masonry-style image wall where items are arranged in columns with varying heights. The inner content uses YAML format to define images.

| Parameter | Description |
| --- | --- |
| `src` | **Optional.** YAML path to the image configuration file. Takes precedence over the shortcode's inner content. |
| `maxCols` | **Optional.** The maximum number of columns to display. **Default:** `3` |

Images can be specified individually with `src`, or batch-loaded with `match`.

**YAML fields per item:**

| Field | Description |
| --- | --- |
| `src` | Image path. |
| `match` | Glob pattern to batch-load images. See [`Match`](https://gohugo.io/functions/resources/match/) for more details. |
| `caption` | **Optional.** Caption text displayed below the image. |
| `alt` | **Optional.** Alt text for accessibility. Falls back to `caption` if omitted. |
| `width` | **Optional.** Image width to prevent layout shift |
| `height` | **Optional.** Image height to prevent layout shift |

**Example**

```yaml
{{</* masonry maxCols="3" >}}

- src: /img/02.webp
  alt: Fly high
  caption: Hello world!
- src: /img/03.webp
  alt: Contrails
- src: /img/04.webp
  alt: Parapet
- src: /img/05.webp
  alt: Wing
- src: /img/06.webp
  alt: Eaves
- src: /img/07.webp
  alt: Biplane sunset
- src: /img/drop.svg
  alt: SVG sample

{{< /masonry */>}}
```

{{< masonry maxCols="3" >}}

- src: /img/02.webp
  alt: Fly high
  caption: Hello world!
- src: /img/03.webp
  alt: Contrails
- src: /img/04.webp
  alt: Parapet
- src: /img/05.webp
  alt: Wing
- src: /img/06.webp
  alt: Eaves
- src: /img/07.webp
  alt: Biplane sunset
- src: /img/drop.svg
  alt: SVG sample

{{< /masonry >}}

## Card

The `card` shortcode renders a general-purpose preview card with a title, description, optional image or icon, and metadata.

| Parameter | Description |
| --- | --- |
| `title` | **Optional.** Card heading text, rendered as `<h3>`. Supports HTML. |
| `url` | **Optional.** Link target for the whole card. |
| `icon` | **Optional.** Icon name shown inline before the title. |
| `media` | **Optional.** Image, video or embed page shown at the top of the card. Accepts a page resource, an assets file, a static path or an external URL. No media is shown when omitted. |
| `mediaType` | **Optional.** `image`, `video` or `iframe`. Default: resources use their own type, URLs are guessed from the extension (`.mp4`, `.webm`, `.ogv`, `.mov` mean video, anything else means image). Set it for URLs without extension, e.g. `iframe` for a YouTube embed. |
| `width` | **Optional.** Media width to prevent layout shift. |
| `height` | **Optional.** Media height to prevent layout shift. |
| `fit` | **Optional.** `cover` or `contain`. Default: no cropping, full width, height follows the media. |
| `ratio` | **Optional.** Display aspect ratio of the media, e.g. `16/9` or `4/2`. Implies `fit="cover"` when `fit` is not set. `iframe` defaults to `16/9`. |
| `desc` | **Optional.** Description text shown below the title. Supports HTML. |
| `metaText` | **Optional.** Metadata content shown below the description. Supports HTML. |
| `compact` | **Optional.** Set compact mode. Only takes effect within cards shortcode. |
| `attrs` | **Optional.** Attributes for card wrapper. Default is `data-component=yr-card`. |
| `fUrl` | **Optional.** Footer action: URL option. |
| `fId` | **Optional.** Footer action: HTML `id` attribute. |
| `fIcon` | **Optional.** Footer action: Icon name shown inline before `fText`. |
| `fText` | **Optional.** Footer action: text content. Supports HTML. |
| `fDownload` | **Optional.** Footer action: Enables the link's `download` attribute when `fUrl` is set. A string value specifies the downloaded filename; a non-string truthy value downloads the `fUrl`. |

```md
{{</* cards cols=3 align=false >}}
  {{< card
    title="Title Only"
    icon="cube"
  >}}

  {{< card
    title="Title with link"
    icon="cube"
    url="#cards-demo"
  >}}

  {{< card
    desc="Description with link"
    url="#cards-demo"
  >}}
{{< /cards >}}

{{< cards align=true >}}
  {{< card
    title="Example.com"
    url="#cards-demo"
    desc="Sample image"
    media="/img/01.webp"
    icon="steam"
    ratio="16/9"
  >}}

  {{< card
    title="Video Wave"
    url="#cards-demo"
    desc="Video by <a href='https://pixabay.com/users/mario_krimer-34815979/?utm_source=link-attribution&utm_medium=referral&utm_campaign=video&utm_content=353078'>Mario_Krimer</a> from <a href='https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=video&utm_content=353078'>Pixabay</a>"
    media="https://cdn.zsl0621.cc/2026/docs/wave-rock-splash-sunset-sea-shore-353078.mp4"
    width=16
    height=9
    icon="xbox"
  >}}
{{< /cards >}}

{{< cards >}}
{{< card
  title="With footer button"
  desc="Download <code>01.webp</code> and set a custom downloaded file name"
  fUrl="/img/01.webp"
  fIcon="download"
  fText="Download image"
  fDownload="cocoparisienne-pixabay.webp"
>}}
{{< /cards */>}}
```

**Examples**

{{< anchor id="card-demo" content="" >}}

{{< cards cols=3 align=false >}}
  {{< card
    title="Title Only"
    icon="cube"
  >}}

  {{< card
    title="Title with link"
    icon="cube"
    url="#card-demo"
  >}}

  {{< card
    desc="Description with link"
    url="#card-demo"
  >}}
{{< /cards >}}

{{< cards align=true >}}
  {{< card
    title="Example.com"
    url="#card-demo"
    desc="Sample image"
    media="/img/01.webp"
    icon="steam"
    ratio="16/9"
  >}}

  {{< card
    title="Video Wave"
    url="#card-demo"
    desc="Video by <a href='https://pixabay.com/users/mario_krimer-34815979/?utm_source=link-attribution&utm_medium=referral&utm_campaign=video&utm_content=353078'>Mario_Krimer</a> from <a href='https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=video&utm_content=353078'>Pixabay</a>"
    media="https://cdn.zsl0621.cc/2026/docs/wave-rock-splash-sunset-sea-shore-353078.mp4"
    width=16
    height=9
    icon="xbox"
  >}}
{{< /cards >}}

{{< cards >}}
{{< card
  title="With footer button"
  desc="Download <code>01.webp</code> and set a custom downloaded file name"
  fUrl="/img/01.webp"
  fIcon="download"
  fText="Download image"
  fDownload="cocoparisienne-pixabay.webp"
>}}
{{< /cards >}}

## Cards

The `cards` shortcode arranges multiple `card` shortcodes in a responsive grid. Cards inside it always fill the width of their grid cell.

| Parameter | Description |
| --- | --- |
| `cols` | **Optional.** Number of columns on large screens. Accepts `1`, `2`, `3` or `4`. **Default:** `3`. |
| `gap` | **Optional.** Spacing between cards, `s`, `m`, or `l`. **Default:** `m` |
| `align` | **Optional.** Align cells across cards. Works when `compact=false` in `card`. **Default:** true. |

**Example: align=false**

{{< cards cols=3 align=false >}}
  {{< card
    title="Lorem ipsum dolor sit amet"
    desc="Deserunt proident accusamus fugiat, ad vero culpa anim excepteur quis proident magna fugiat."
    fUrl="#cards"
    fText="Card footer action"
  >}}

  {{< card
    title="Culpa labore"
    desc="Culpa labore sed est occaecat irure qui dignissimos, exercitation adipiscing."
    fUrl="#cards"
    fText="Card footer action"
  >}}
{{< /cards >}}

**Example: align=true**

{{< cards cols=3 align=true >}}
  {{< card
    title="Lorem ipsum dolor sit amet"
    desc="Deserunt proident accusamus fugiat, ad vero culpa anim excepteur quis proident magna fugiat."
    fUrl="#cards"
    fText="Card footer action"
  >}}

  {{< card
    title="Culpa labore"
    desc="Culpa labore sed est occaecat irure qui dignissimos, exercitation adipiscing."
    fUrl="#cards"
    fText="Card footer action"
  >}}
{{< /cards >}}

**Example: compact=true**

{{< cards cols=3 >}}
  {{< card
    title="Lorem ipsum dolor sit amet"
    desc="Deserunt proident accusamus fugiat, ad vero culpa anim excepteur quis proident magna fugiat."
    compact=true
    fUrl="#cards"
    fText="Card footer action"
  >}}

  {{< card
    title="Culpa labore"
    desc="Culpa labore sed est occaecat irure qui dignissimos, exercitation adipiscing."
    compact=true
    fUrl="#cards"
    fText="Card footer action"
  >}}
{{< /cards >}}

## Article Card

The `article` shortcode generates a visual preview card for a specified internal page.

| Parameter | Description |
| --- | --- |
| `path` | **Required.** The logical path of the target internal page. |
| `desc` | **Optional.** Whether the page description is displayed. |
| `meta` | **Optional.** Whether the page metadata is displayed. |
| `lang` | **Optional.** Get page from another language of your site. |

**Example**

```md
{{</* article path="/docs/80-getting-started" desc=true meta=false */>}}
```

{{< article path="/docs/80-getting-started" desc=true meta=false >}}

## GitHub Card

The `github` shortcode creates a dynamic preview card for a GitHub repository.

| Parameter | Description |
| --- | --- |
| `repo` | **Required.** Format `owner/repo`. |

**Example: Repository preview with thumbnail**

```md
{{</* github repo="gohugoio/hugo" */>}}
```

{{< github repo="gohugoio/hugo" show-thumbnail=false >}}

## Icon

The `icon` shortcode renders an inline SVG icon from the theme's icon library.

| Parameter | Description |
| --- | --- |
| `0` / `name` | **Required.** Icon name, with or without the `.svg` extension. Positional `0` and named `name` are interchangeable. |
| `label` | **Optional.** Accessible label. When set, the icon is exposed as `role="img"`. Otherwise it is hidden from assistive technology. |
| `class` | **Optional.** Extra CSS classes. |
| `rotate` | **Optional.** Rotation in degrees, such as `90`. |
| `flip` | **Optional.** Flip direction: `x`, `y`, or `both`. |
| `animation` | **Optional.** Animation: `spin`, `pulse`, or `bounce`. |

**Example: Positional name**

```md
{{</* icon "google" >}}
{{< icon name="google" flip="x" >}}
{{< icon name="google" rotate=315 >}}
{{< icon name="google" animation="spin" >}}
{{< icon name="google" animation="pulse" >}}
{{< icon name="google" animation="bounce" class="text-success" */>}}
```

{{< icon "google" >}}
{{< icon name="google" flip="x" >}}
{{< icon name="google" rotate=315 >}}
{{< icon name="google" animation="spin" >}}
{{< icon name="google" animation="pulse" >}}
{{< icon name="google" animation="bounce" class="text-success" >}}

See all available icons in [reference page](../../1000-reference-icon/index.md).

## Audio

The `audio` shortcode embeds a HTML5 audio player.

| Parameter | Description |
| --- | --- |
| `src` | **Required.** Audio path. |
| `poster` | **Optional.** Poster path. If omitted, the shortcode attempts a same-name image in the page bundle. |
| `alt` | **Optional.** Alt text for the cover image. |
| `caption` | **Optional.** Markdown caption shown below the player. |
| `autoplay` | **Optional.** Enables autoplay when `true`. **Default:** `false` |
| `loop` | **Optional.** Loops when `true`. **Default:** `false` |
| `muted` | **Optional.** Mutes when `true`. **Default:** `false` |
| `controls` | **Optional.** Shows the browser's default playback controls when `true`. **Default:** `true` |
| `preload` | **Optional.** `metadata` (load info), `none` (save bandwidth), or `auto` (preload more). **Default:** `metadata` |
| `start` | **Optional.** Start time in seconds. |
| `end` | **Optional.** End time in seconds. |
| `ratio` | **Optional.** Reserved aspect ratio for the cover image, only applied when `poster` is set. Supports `16/9`, `4/3`, `1/1`, or custom `W/H`. **Default:** `1/1` |
| `fit` | **Optional.** How the cover image fits the ratio: `contain` (no crop), `cover` (crop to fill), `fill` (stretch). **Default:** `contain` |

**Example: Looped muted audio**

```md
{{</* audio
  src="/audio/beep.mp3"
  caption="*beep*"
  loop=true
*/>}}
```

{{< audio
  src="/audio/beep.mp3"
  caption="*beep*"
  loop=true
>}}

## Video

The `video` shortcode embeds a HTML5 video player.

| Parameter | Description |
| --- | --- |
| `src` | **Required.** Video path. |
| `poster` | **Optional.** Poster path. If omitted, the shortcode attempts a same-name image in the page bundle. |
| `caption` | **Optional.** Markdown caption shown below the video. |
| `autoplay` | **Optional.** Enables autoplay when `true`. **Default:** `false` |
| `loop` | **Optional.** Loops when `true`. **Default:** `false` |
| `muted` | **Optional.** Mutes when `true`. **Default:** `false` |
| `controls` | **Optional.** Shows the browser's default playback controls when `true`. **Default:** `true` |
| `playsinline` | **Optional.** Inline playback on mobile when `true`. **Default:** `true` |
| `preload` | **Optional.** `metadata` (load info), `none` (save bandwidth), or `auto` (preload more). **Default:** `metadata` |
| `start` | **Optional.** Start time in seconds. |
| `end` | **Optional.** End time in seconds. |
| `ratio` | **Optional.** Reserved aspect ratio for the player. Supports `16/9`, `4/3`, `1/1`, or custom `W/H`. **Default:** `16/9` |
| `fit` | **Optional.** How the video fits the ratio: `contain` (no crop), `cover` (crop to fill), `fill` (stretch). **Default:** `contain` |

**Example: Autoplay muted video**

```md
{{</* video
    src="https://cdn.zsl0621.cc/2026/docs/wave-rock-splash-sunset-sea-shore-353078.mp4"
    caption="Video by <a href='https://pixabay.com/users/mario_krimer-34815979/?utm_source=link-attribution&utm_medium=referral&utm_campaign=video&utm_content=353078'>Mario_Krimer</a> from <a href='https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=video&utm_content=353078'>Pixabay</a>"
    loop=true
*/>}}
```

{{< video
  src="https://cdn.zsl0621.cc/2026/docs/wave-rock-splash-sunset-sea-shore-353078.mp4"
  caption="Video by <a href='https://pixabay.com/users/mario_krimer-34815979/?utm_source=link-attribution&utm_medium=referral&utm_campaign=video&utm_content=353078'>Mario_Krimer</a> from <a href='https://pixabay.com//?utm_source=link-attribution&utm_medium=referral&utm_campaign=video&utm_content=353078'>Pixabay</a>"
  loop=true
>}}

## PDF

The `pdf` shortcode embeds a PDF file using an inline iframe viewer.

| Parameter | Description |
| --- | --- |
| `src` | **Required.** PDF URL or local path. Resolves as page resource first, then global resource, then relative URL. |
| `title` | **Optional.** PDF title for screen readers. |
| `page` | **Optional.** Jumps to a specific page number on load. |
| `height` | **Optional.** Height of the viewer frame. **Default:** `800px` |

## YouTube

The `youtube` shortcode embeds an optimized YouTube video player.

| Parameter | Description |
| --- | --- |
| `id` | **Optional.** YouTube video ID. |
| `params` | **Optional.** URL parameters. |

**Example: Specific video with start time**

```md
{{</* youtube id="ldX1Ii0MofQ" params="start=30" */>}}
```

{{< youtube id="ldX1Ii0MofQ" params="start=30" >}}

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
