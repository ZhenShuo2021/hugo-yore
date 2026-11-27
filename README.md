## Yore

Yore is a minimalist Hugo theme focused on reading. See [demo site](https://yore.zsl0621.cc/) here.

## Features

- 17:1 ultra high text contrast ratios, far exceeding WCAG-AA 4.5:1
- Prioritizes information delivery
- Perfect Google Lighthouse scores on desktop and mobile
- A+ score on [HTTP Observatory](https://developer.mozilla.org/en-US/observatory/analyze?host=yore.zsl0621.cc)
- Accessibility-first components built to authoritative guidelines, plus a standalone accessibility control panel
- Modern browser APIs behind every component, so less JavaScript and better accessibility by default
- Wide compatibility, even a 10-year-old iPhone 8 browses the site without a hitch
- Smooth page navigation with [swup.js](https://swup.js.org/) client-side routing, no distracting transition animations
- Blog, documentation, and gallery layout support
- Multilingual support
- Multi-version content support
- Article series support
- RTL support
- Export documentation as a single PDF file with [Playwright](https://playwright.dev/)
- Automated responsive image
- 3 distinct header options
- 2 page hero styles
- 3-layered CSS structure for flexible styling
- Semantic CSS layer for consistent visual customization
- GDPR cookie consent banner
- [TailwindCSS v4](https://tailwindcss.com/) lightweight CSS framework
- [PhotoSwipe](https://photoswipe.com/) image galleries
- [ECharts](https://echarts.apache.org/) interactive charts
- [MathJax](https://www.mathjax.org/) LaTeX notation
- [Pagefind](https://pagefind.app/) site search
- [Mermaid](https://mermaid.ai/open-source/) diagram using [Pele](https://pele.run/)
- [iconoir](https://iconoir.com/) and [fontawesome](https://fontawesome.com/icons/packs/brands) SVG icon set
- [Hugo Knowledge Graph](https://github.com/ZhenShuo2021/hugo-knowledge-graph) article relationship graph

## Installation

> [!NOTE]
> On Windows, use PowerShell instead of CMD.

Create a new site if you haven't already:

```sh
hugo new site my-site --format yaml
cd my-site
```

Install Yore:

```sh
git init
git submodule add https://github.com/ZhenShuo2021/hugo-yore themes/hugo-yore
echo "theme: hugo-yore" >> hugo.yaml
```

Create contents:

```sh
hugo new content/blog/_index.md
hugo new content/blog/first/index.md
hugo new content/blog/second/index.md
```

Start development:

```sh
hugo server -D
```

It's recommended to start your project with our preconfigured [hugo.yaml](https://yore.zsl0621.cc/docs/configuration/preconfigured-setting/).
