---
title: "About"
date: 2026-01-15T14:45:00+08:00
Description: Yore is a minimalist Hugo theme focused on reading flow, high contrast, and flexible Grid layouts.
series: ["blog"]
params:
  pageTOCStyle: disable
  pageSeriesStyle: disable
  pageShowRelated: false
  pageShowNext: false
  pageShowMeta: false
  pageShowBacklinks: false
---

Yore is a minimalist Hugo theme built around content and reading flow.

## Content-Centric Design

I spent a long time thinking about what design defines a content-centric blog. My answer is as follows:

1. Reading Flow: A content area free from distracting elements.
2. Text Clarity: While WCAG-AA requires a 7:1 contrast ratio, Yore achieves 17:1.
3. Minimal Configuration: Focus on content rather than spending time tweaking appearance.

## Absolute Centered Main Content

After extensive research, I believe the ideal layout for a content-centric blog remains centered text. Therefore, centered content has been the foundation of Yore's design from the start.

## Grid Layout

The most common solution for centering content is limiting the width and using `margin: 0 auto`, but this prevents placing elements on the sides. Consequently, tables of contents (TOC) are often forced into fixed/absolute layouts.

Yore uses a Grid layout to solve this, allowing you to place any content in the left or right sidebars, such as a sticky TOC. An additional benefit of the Grid layout is that it requires no complex JS for positioning. You can easily place elements at the header or footer without worrying about fixed/absolute positioning issues. Built-in features include a TOC, but you can also add avatars, site info, ads, etc.

## Easy to Customize

At first glance, you might wonder why there is so much CSS, mixing Tailwind with plain CSS. The primary goal is to allow the use of Hugo's override feature for specific CSS files. If everything were compiled into a single large Tailwind file, disabling a single setting would be far more complex than a simple override.

Yore follows only two rules for CSS classification:

1. Use Tailwind utilities unless elements cannot be directly targeted.
2. Use plain CSS for standalone files unless significant Tailwind syntax is required.

This means most settings rely on Tailwind defaults, while undesirable settings can be found and modified in plain CSS. You can use `custom.css` for customizations or override entire files.

Every file uses its own Grid definition rather than a global grid in `baseof`. This ensures you can override any file without being constrained by the global grid, while the complex grid math remains handled by the theme.

## Three-Layered CSS Architecture

Using Tailwind colors directly in HTML causes two issues: developers must repeatedly copy class names for similar elements, and users cannot easily modify specific element colors.

Yore employs a three-layered CSS architecture with custom Tailwind tokens. This allows users to modify first-layer CSS variables to customize the color theme, or second-layer semantic tokens to change specific element colors. For a full introduction, see the [Customization Guide](docs/320-advanced/120-customization/index.md#customize-css).

The downside is a more monochromatic tone, but as a content-centric theme, Yore's palette should be simple. Advanced users can still use first-layer or default Tailwind colors directly in HTML.

## Related Articles

Hugo's related articles feature relies heavily on taxonomy (tags). Since I am often too lazy to tag articles, I have integrated [jmooring/hugo-module-backlinks](https://github.com/jmooring/hugo-module-backlinks) as an alternative.

Basic information is available in the [Related Articles documentation](docs/320-advanced/40-related-article/index.md).

## Acknowledgements

Yore was originally forked from [Blowfish](https://github.com/nunocoracao/blowfish/), and reproduces, adapts, or references code from the following projects during development. Our thanks go out to them:

- [Docusaurus](https://github.com/facebook/docusaurus/)
- [Font Awesome](https://github.com/fortawesome/font-awesome)
- [hugo-module-backlinks](https://github.com/jmooring/hugo-module-backlinks)
- [Iconoir](https://github.com/iconoir-icons/iconoir)
- [Starlight](https://github.com/withastro/starlight)

Thanks to the authors and contributors of these projects. See the corresponding LICENSE files within this project for their respective license terms.
