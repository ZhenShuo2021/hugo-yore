---
title: "About"
date: 2026-01-15T14:45:00+08:00
Description: Yore is a minimalist Hugo theme focused on reading flow, high contrast, and flexible Grid layouts.
params:
  pageShowRelated: false
  pageShowNext: false
  pageShowMeta: false
---

Yore is a minimalist, content-centric fork of the Blowfish theme.

I once considered contributing these changes back to Blowfish, but as you can see, this fork has been modified to the point where only the shortcodes remain identical to Blowfish; everything else has been rebuilt.

## Content-Centric Design

I spent a long time thinking about what design defines a content-centric blog. My answer is as follows:

1. Reading Flow: A content area free from distracting elements.
2. Text Clarity: While WCAG-AA requires a 7:1 contrast ratio, Yore achieves 17:1.
3. Homepage Design: The homepage should not simply list recent articles, as quality does not always equate to recency. Recent articles are already provided on the archive page.
4. Minimal Configuration: Focus on content rather than spending time tweaking appearance.

## Absolute Centered Main Content

After extensive research, I believe the ideal layout for a content-centric blog remains centered text. Therefore, centered content has been the foundation of Yore's design from the start.

## Grid Layout

The most common solution for centering content is limiting the width and using `margin: 0 auto`, but this prevents placing elements on the sides. Consequently, tables of contents (TOC) are often forced into fixed/absolute layouts.

Yore uses a Grid layout to solve this, allowing you to place any content in the left or right sidebars, such as a sticky TOC. An additional benefit of the Grid layout is that it requires no complex JS for positioning. You can easily place elements at the header or footer without worrying about fixed/absolute positioning issues. Built-in features include a TOC, but you can also add avatars, site info, ads, etc.

## Multiple Variations

Yore includes several built-in layout styles. For instance, the example site uses a wide header + sidebar TOC design. If you need a documentation-style sidebar TOC to track reading progress, the default settings support this.

If you prefer no sidebars at all, simply set:

```yaml
params:
  headerCentered: false
  pageTOCStyle: top
```

This clears both sides of your site completely. Using Yore's pre-established grid structure, you can modify the main article layout directly within `main-grid__main`. The development workflow is identical to common centered-layout sites, with the outer container changing from `margin: 0 auto` to a grid.

## Simplified Configuration

While Blowfish is actually quite lightweight, its extensive configuration files can take time for new users to understand.

Because Yore focuses on content, it has fewer settings. The configuration files are intentionally designed to be clear and easy to adjust. No sub-keys will be established before the stable version to avoid future design conflicts.

Items deemed too detailed by the author will not have parameter settings. Settings can never satisfy every user's specific needs. The site architecture is explained in plain language in the documentation; a language model combined with the docs should handle most customization scenarios.

## Easy to Customize

At first glance, you might wonder why there is so much CSS, mixing Tailwind with plain CSS. The primary goal is to allow the use of Hugo's override feature for specific CSS files. If everything were compiled into a single large Tailwind file, disabling a single setting would be far more complex than a simple override.

Yore follows only two rules for CSS classification:

1. Use Tailwind utilities unless elements cannot be directly targeted.
2. Use plain CSS for standalone files unless significant Tailwind syntax is required.

This means most settings rely on Tailwind defaults, while undesirable settings can be found and modified in plain CSS. You can use `custom.css` for customizations or override entire files.

Every file uses its own Grid definition rather than a global grid in `baseof`. This ensures you can override any file without being constrained by the global grid, while the complex grid math remains handled by the theme.

## Three-Layered CSS Architecture

Using Tailwind colors directly in HTML causes two issues: developers must repeatedly copy class names for similar elements, and users cannot easily modify specific element colors.

Yore employs a three-layered CSS architecture with custom Tailwind tokens. This allows users to modify first-layer CSS variables to customize the color theme, or second-layer semantic tokens to change specific element colors. For a full introduction, see the [Customization Guide](./docs/950-customization/#customize-css).

The downside is a more monochromatic tone, but as a content-centric theme, Yore's palette should be simple. Advanced users can still use first-layer or default Tailwind colors directly in HTML.

## JS Optimization

Despite containing over 10 JS modules, Yore achieves perfect scores in Lighthouse Mobile and Desktop tests.

Yore follows ESM standards, utilizing `type="module"` for deferred loading. External dependencies are bundled via Hugo's `js.Build` into a single Main Bundle to reduce HTTP requests. Libraries deemed non-essential to the core theme (e.g., TypeIt, Mermaid) are loaded via CDN to avoid the overhead of local resource management.

Yore also uses the Speculation Rules API for prefetching and prerendering, achieving near-instantaneous page transitions.

Regarding packages, MathJax and echarts are used instead of KaTeX and chart.js. I don't believe most users care about the slight difference in traffic, which is cached by the browser anyway. Real traffic issues stem from unoptimized images. Speed-wise, the difference between MathJax and KaTeX is now negligible without benchmark tools.

## Taxonomy

Yore uses tags but excludes categories based on these ideas:

1. If you need categories, why not use subdirectories?
2. Both are classification functions that require intentional management; otherwise, they are useless.
3. If tags are already functional, why add categories? If tags aren't managed well, categories will suffer the same fate.

Yore simplifies this by using only tags for taxonomy. For broader categorization, using directories is recommended.

## Related Articles

Hugo's related articles feature relies heavily on taxonomy (tags). Since I am often too lazy to tag articles, I have integrated [jmooring/hugo-module-backlinks](https://github.com/jmooring/hugo-module-backlinks) as an alternative.

Basic information is available in the [Related Articles documentation](./docs/140-related-article/index.md).
