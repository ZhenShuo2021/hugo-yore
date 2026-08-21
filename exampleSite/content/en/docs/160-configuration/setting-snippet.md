---
title: setting-snippet
build: 
  render: never
  list: never
---

```yaml {id="main-setting"}
# =============================================================================
# See full options in https://gohugo.io/configuration/all/
# 1. [advanced] = Advanced setting, safe to ignore
# 2. Note on language: all language keys are lowercased by Hugo internally,
#    so keeping every language-related setting in lowercase is the most
#    consistent approach. The only place that should use uppercase (en-US, zh-CN)
#    is the "locale" setting, which is used directly in templates.
# =============================================================================
baseURL: https://yore.zsl0621.cc/
defaultContentLanguage: en

# pluralizeListTitles: true  # Auto-pluralize list page titles (e.g., "Post" to "Posts")
capitalizeListTitles: false

summaryLength: 30
enableRobotsTXT: true
hasCJKLanguage: false # Enable for Chinese, Japanese, or Korean content to improve word count accuracy. Can be overridden in each language config.
enableEmoji: true

# =============================================================================
# Last modification date
# =============================================================================
# Automatically set the front matter lastmod field to the Git modification date.
# enableGitInfo: true
# frontmatter:
#   lastmod: ['lastmod', ':git', ':fileModTime', ':default']

# =============================================================================
# Pagination
# =============================================================================
pagination:
  pagerSize: 20
  path: 'p'

# =============================================================================
# Taxonomies
# =============================================================================
taxonomies:
  tag: tags
  category: categories
  series: series
  author: authors

# =============================================================================
# Sitemap
# =============================================================================
sitemap:
  changefreq: weekly
  filename: sitemap.xml
  priority: 0.5

# =============================================================================
# Outputs
# =============================================================================
outputs: # Custom output formats per page type
  home:
    - HTML
    - RSS
    - backlinks
    - markdown
  section:
    - HTML
    - RSS
    - markdown
  page:
    - HTML
    - markdown

# =============================================================================
# Page Configuration
# =============================================================================
# Correct page order on blog pages
page:
  nextPrevInSectionSortOrder: asc
  nextPrevSortOrder: asc

# =============================================================================
# Permalinks
# =============================================================================
# https://gohugo.io/configuration/permalinks/
# The default is good for a personal blog

# =============================================================================
# Cascade
# =============================================================================
# Front matter settings
# Only index homepage and regular article pages for a clean SEO result
# cascade:
#   - params:
#       metaRobots: ""
#     target:
#       path: '{/blog,/blog/**,/docs,/docs/**}'
#       kind: section
#   - params:
#       metaRobots: noindex
#     target:
#       kind: '{taxonomy,term,section}'

# =============================================================================
# Markup Configuration
# =============================================================================
# Rules for converting Markdown to HTML
# [advanced] Pre-tuned defaults, no changes needed for most users.
markup:
  highlight:
    noClasses: false
  tableOfContents:
    startLevel: 2
    endLevel: 4
  goldmark:
    parser:
      wrapStandAloneImageWithinParagraph: false
      attribute:
        block: true
    renderer:
      unsafe: true # Allow raw HTML in Markdown. Required for some shortcodes (e.g. nested) to render.
    extensions:
      passthrough:
        enable: true
        delimiters:
          block:
            - ['\[', '\]']
            - ['$$', '$$']
          inline:
            - ['\(', '\)']
      typographer: # Customizes typographic quote characters. Removing this reverts to default curly quotes
        apostrophe: "'"
        leftDoubleQuote: '"'
        leftSingleQuote: "'"
        rightDoubleQuote: '"'
        rightSingleQuote: "'"

# =============================================================================
# Theme Parameters
# =============================================================================
params:
  logo: /img/logo.svg # Path to the site logo image (assets/img/logo.svg -> /img/logo.svg)
  blogLayout: 3-col # Overall site column layout. [2-col | 3-col]

  # Theme
  themeColorScheme: latex # Color palette for the theme. [avocado | blowfish | congo | fire | latex | one-light | wood]
  themeLightDarkMode: light # Default color mode on first visit. [light | dark]
  themeLightDarkSwitcher: true # Show a button letting visitors toggle light/dark mode

  # Author
  # See https://yore.zsl0621.cc/docs/features/authors/

  # Image
  imageFeatured: /img/07.webp # Default featured image used when a page doesn't set its own
  imageSocial: /img/07.webp # Default image used for social share previews (OpenGraph/Twitter card)
  # imagePosition: 50% 50% # Default CSS object-position for images, same syntax as Mozilla object-position
  imageOptimization: true # Automatically resize/optimize images referenced via Hugo image processing
  imageOptimizationMD: true # Also apply image optimization to images embedded in Markdown content
  imageLightbox: true # Clicking an image opens it in a fullscreen lightbox
  imageHotlink: false # Hotlink images from external sources instead download it at build time

  # search
  searchEnabled: true # Enable the site search feature

  # Homepage
  homepageLayout: classic # Homepage layout style. [card | classic | void]
  homepageTitle: Hugo Theme Yore # Title text shown on the homepage
  homepageImage: /img/07.webp # Hero/banner image shown on the homepage
  homepageShowMoreLink: docs # Where the homepage "more" link points to
  homepageTagline: | # Short tagline shown under the homepage title, supports multiple lines
    A feature rich yet clean theme  
    focus on reading

  # Header
  headerLayout: hideOnScroll # Header behavior on scroll. [sticky | static | hideOnScroll]
  headerShowTitle: false # Show the site title text in the header

  # Page
  pageHeroStyle: disable # Hero banner style on regular pages. [background | big | disable]
  pageTOCStyle: top # Table of contents placement. [top | sidebar | disable]
  pageKgStyle: disable # Knowledge graph / backlink panel placement. [bottom | sidebar | disable]
  pageSeriesStyle: both # Where to show the series navigation on a page. [top | bottom | both | disable]
  pageShowMeta: true # Show page metadata (e.g. date, author)
  pageShowTags: true # Show the page's tags
  pageShowCategories: true # Show the page's categories
  pageShowNext: true # Show a link to the next page
  pageShowAuthors: true # Show the page's author(s)
  pageShowActions: true # Show page action buttons (e.g. source link, copy link)
  pageShowBacklinks: true # Show backlink tracking/display between pages
  pageShowStaleWarning: false # Show a warning when an article has not been updated in pageStaleDays
  pageStaleDays: 365 # Number of days before an article is considered stale
  pageShowRelated: true # Show a "related articles" section
  pageRelatedLimit: 3 # Maximum number of related articles to show

  # Docs
  # docsIcon: "xmark" # Icon shown in the docs nav bar
  # docsNavClass: "bg-success" # Extra classes applied to the docs nav
  docsAutoCollapseCategories: true # Automatically collapse other categories in the docs nav when one is expanded

  # These are parameters in https://gohugo.io/methods/pages/
  # sectionSortBy: Weight # Field used to sort pages within a section. [Date | ExpiryDate | Lastmod | Length | LinkTitle | PublishDate | Title | Weight | Param.[FRONT_MATTER_KEY]]
  # sectionSortOrder: asc # Sort direction for sectionSortBy. [asc | desc]
  # sectionGroupBy: Date # Field used to group pages within a section. [Date | ExpiryDate | Lastmod | PublishDate | Param.[FRONT_MATTER_KEY]]
  # sectionGroupLayout: January 2006 # Go time-layout string used to format group headings, e.g. "2006年1月" for zh-cn. See https://gohugo.io/methods/time/format/#layout-string
  # sectionGroupOrder: desc # Sort direction for the groups themselves. [asc | desc]

  # Footer
  footerShowCredit: true # Show a "powered by" Yore credit line in the footer
  footerCopyrightText: Copyright © 2025 Yore. All rights reserved. # Copyright text shown in the footer

  # Misc
  accessibilityEnabled: true # Enable accessibility enhancement toggles
  breadcrumb: true # Show breadcrumb navigation
  breadcrumbSchema: true # Emit breadcrumb structured data (schema.org) for SEO
  codeCopy: true # Show a "copy" button on code blocks
  mathEnabled: false # Load the math rendering library on every page
  menuHighlight: true # Highlight the current page's entry in the navigation menu
  scrollToTop: true # Show a "scroll to top" button
  tocHighlight: true # Highlight the current section in the table of contents while scrolling
  footnoteTooltip: true # Show footnote content in a hover tooltip instead of only jumping to it
  hugoTailwind: false # Use Hugo's built-in Tailwind CSS pipeline
  versionSwitcher: false # Show a version switcher for versioned docs
  repoURL: https://github.com/ZhenShuo2021/hugo-yore/blob/main # Page actions: Base URL to the repository's branch root, used to build "edit this page" / source links
  repoSubdir: exampleSite # Page actions: Path from the repository root to the Hugo project directory. Leave empty if the site is in the repo root
  sourceBaseURL: https://github.com/ZhenShuo2021/hugo-yore/blob/main/ # Page actions: Base URL used to link a docs page to its source file. See http://yore.zsl0621.cc/docs/features/docs-layout/#options
  cookieConsent:
    enable: true # Show a cookie consent dialog
    categories: # Cookie categories offered in the consent banner
      - necessary
      - functional
      - analytics
      - example_basic
      - example_social_media
      - example_marketing
      # - advertising
  # metaRobots: index, follow # Default value for the meta robots tag

  sw: # Service Worker
    enable: false # Enable the service worker (offline support, caching)
    precache:
      # Proactively precache all HTML pages in the background. Pages are fetched idly
      # to avoid competing with user-initiated requests.
      html: true
      # Precache the selected JS/CSS resources
      assets: true

# =============================================================================
# Languages Configuration
# =============================================================================
languages:
  # Language-specific configuration
  en:
    locale: en # the region subtag MUST be uppercase, e.g. en-US
    label: English
    direction: ltr
    weight: 1
    title: Yore
    params:
      description: A powerful, lightweight theme for Hugo.
    menus:
      # Header navigation links ordered by weight (lowest first).
      main:
        - name: Blog
          pageRef: /blog
          weight: 20

        - name: Docs
          pageRef: /docs
          weight: 40
          params:
            # icon: code # Icon to display, named "code"
            collapsed: true # Whether the nested menu is collapsed by default on mobile

        # Nested menu
        - name: Getting Started
          parent: Docs
          pageRef: /docs/80-getting-started
          weight: 20
        - name: Configuration
          parent: Docs
          pageRef: /docs/160-configuration
          weight: 40

        # Icon links, no pageRef, must use an identifier
        - identifier: foo
          url: https://github.com/ZhenShuo2021/hugo-yore
          weight: 1000
          params:
            icon: github

      # Bottom navigation links displayed before copyright.
      footer:
        - name: About
          pageRef: /about
          weight: 1
        - name: Archive
          pageRef: /archive
          weight: 5
        - name: Authors
          pageRef: /authors
          weight: 7
        - name: Tags
          pageRef: /tags
          weight: 10
        - name: Privacy
          pageRef: /privacy
          weight: 15
        - name: RSS
          url: /index.xml
          weight: 20

  # Multilingual site
  # zh-cn:
  #   locale: zh-CN # the region subtag MUST be uppercase
  #   label: 简体中文
  #   direction: ltr
  #   weight: 2
  #   title: Yore
  #   hasCJKLanguage: true
  #   params:
  #     description: 一个强大、轻量级的 Hugo 主题。
  # 
  # .... and more settings

module:
  imports:
    - path: github.com/ZhenShuo2021/hugo-yore
```
