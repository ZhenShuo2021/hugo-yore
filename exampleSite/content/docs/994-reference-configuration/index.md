---
title: "Reference - Configuration"
weight: 994
date: 2026-01-15T14:45:00+08:00
description: "Detailed reference for theme-specific configuration and front matter variables."
tags: ["configuration", "hugo.yaml", "settings", "reference", "documentation"]
series: ["Documentation"]
series_weight: 994
---

<style>
  .lntable {max-height: 75vh; overflow: auto;}
  .highlight-wrapper:not(:has(table)) pre.chroma {max-height: 75vh; overflow: auto;}
</style>

The preconfigured `hugo.yaml`.

```yaml
# See full options in https://gohugo.io/configuration/all/
theme: hugo-yore
baseURL: https://yore.zsl0621.cc
defaultContentLanguage: en

# pluralizeListTitles: true  # Auto-pluralize list page titles (e.g., "Post" to "Posts")
capitalizeListTitles: false

summaryLength: 30
enableRobotsTXT: true
hasCJKLanguage: false
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
  series: series

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
outputs:
  home:
    - HTML
    - RSS
    - fuse-search
    - backlinks

outputFormats:
  fuse-search:
    mediaType: application/json
    baseName: fuse-search
    isPlainText: true
    notAlternative: true
    weight: 10
  backlinks:
    mediaType: application/json
    baseName: backlinks
    isPlainText: true
    notAlternative: true
    weight: 1

# =============================================================================
# Page Configuration
# =============================================================================
# Correct page order
page:
  nextPrevInSectionSortOrder: asc
  nextPrevSortOrder: asc

# =============================================================================
# Permalinks
# =============================================================================
# Changing an article title changes the URL when the sectionslugs setting is used.
# Make sure that the slug is set in each article.
#
# Personal blog users should avoid using the sectionslugs option unless plan to manually set a slug for every post.
# Without a fixed slug, any change to a page's title will automatically change its URL, leading to broken links.
# Either remove this section (use Hugo defaults) or set '/posts/:slugorcontentbasename/'.
# See https://gohugo.io/configuration/permalinks/
# ============================================================================
permalinks:
  page:
    docs: /:sectionslugs/:slug/
    shortcodes: /:sectionslugs/:slug/
  section:
    docs: /:sectionslugs/

# =============================================================================
# Markup Configuration
# =============================================================================
# Rules for converting Markdown to HTML
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
      unsafe: true
    extensions:
      passthrough:
        enable: true
        delimiters:
          block:
            - ['\[', '\]']
            - ['$$', '$$']
          inline:
            - ['\(', '\)']
      typographer:
        apostrophe: "'"
        leftDoubleQuote: '"'
        leftSingleQuote: "'"
        rightDoubleQuote: '"'
        rightSingleQuote: "'"

# =============================================================================
# Theme Parameters
# =============================================================================
params:
  # Theme
  themeColorScheme: latex # avocado | blowfish | congo | fire | latex | one-light | wood
  themeLightDarkMode: light # light | dark
  themeLightDarkSwitcher: true

  # Image
  imageFeatured: /img/07.webp
  imageSocial: /img/07.webp
  # imagePosition: 50% 50% # same as mozilla object-position
  imageOptimization: true
  imageOptimizationMD: true
  imageLightbox: true
  imageHotlink: false

  # search
  searchEnabled: true
  searchPreload: true

  # Homepage
  homepageLayout: custom # background | card | classic | editorial | matrix | mono | monument | plain | split | void
  homepageTitle: Hugo Theme Yore
  homepageImage: /img/07.webp
  homepageShowMoreLink: docs
  homepageTagline: |
    A feature rich yet clean theme  
    focus on reading
  homepageSubTagline: |
    Between Text and Thought  
    Exploring the Possibilities of Deep Reading

  # Header
  headerLayout: hideOnScroll # sticky | static | hideOnScroll
  headerCentered: false
  headerShowTitle: false

  # Page
  pageHeroStyle: disable # background | big | disable
  pageShowSeries: both # top | bottom | both | disable
  pageShowMeta: true
  pageShowTags: true
  pageShowNext: true
  pageShowRelated: true
  pageTOCStyle: sidebar # top | sidebar | disable
  pageRelatedLimit: 3 # Maximum number of related articles

  # Section
  sectionQuickReference: false

  # Footer
  footerShowMenu: true
  footerShowCopyright: true
  footerShowCredit: true
  footerCopyrightText: Copyright © 2025 Yore. All rights reserved.

  # Misc
  accessibilityEnabled: true
  backlinkEnabled: true
  breadcrumb: true
  breadcrumbSchema: true
  codeCopy: true
  mathEnabled: false
  menuHighlight: true
  scrollToTop: true
  tocHighlight: true
  # metaRobots: index, follow

# =============================================================================
# Languages Configuration
# =============================================================================
languages:
  # Language-specific configuration
  en:
    languageCode: en
    languageName: 🇺🇸 English
    languageDirection: ltr
    weight: 1
    title: Yore
    params:
      isoCode: en
      logo: img/logo.svg
      description: A powerful, lightweight theme for Hugo.
      author:
        name: Yore
        email: 98386542+ZhenShuo2021@users.noreply.github.com
        image: img/yore.jpg
        tagline: A powerful, lightweight theme for Hugo.
        links:
          - x-twitter: https://example.com
          - reddit: https://example.com
          - discord: https://example.com
          - github: https://github.com/ZhenShuo2021/hugo-yore
    menus:
      # Header navigation links ordered by weight (lowest first).
      main:
        - name: Docs
          pageRef: docs
          weight: 10
          # pre: code  # add an icon named "code"

        # Nested menu example
        # - name: Introduction
        #   parent: Docs
        #   pageRef: docs/20-introduction
        #   weight: 10
        # - name: Reference
        #   parent: Docs
        #   pageRef: docs/994-reference-configuration
        #   weight: 20

        - name: Shortcodes
          pageRef: /shortcodes
          weight: 15

        # Icon links, no pageRef, must use an identifier
        - identifier: foo
          pre: github
          url: https://github.com/ZhenShuo2021/hugo-yore
          weight: 224

      # Bottom navigation links displayed before copyright.
      footer:
        - name: About
          pageRef: about
          weight: 1
        - name: Archive
          pageRef: archive
          weight: 5
        - name: Tags
          pageRef: tags
          weight: 10
        - name: RSS
          url: /index.xml
          weight: 20
        - name: Sitemap
          url: /sitemap.xml
          weight: 20

  # 各種語言獨立的設定
  zh-cn:
    languageCode: zh-cn
    languageName: 🇨🇳 简体中文
    languageDirection: ltr
    weight: 2
    title: Yore
    hasCJKLanguage: true
    params:
      displayName: 简体中文
      isoCode: zh-cn
      logo: img/logo.svg
      description: 一个强大、轻量级的 Hugo 主题。
      tagline: |
        A feature rich yet clean theme
        focus on reading
      author:
        name: Yore
        logo: img/logo.svg
        tagline: 一个强大、轻量级的 Hugo 主题。
        links:
          - x-twitter: https://example.com
          - reddit: https://example.com
          - discord: https://example.com
          - github: https://github.com/ZhenShuo2021/hugo-yore
    menus:
      # 顶部导航链接按权重排序（最小值优先）。
      main:
        - name: 文档
          pageRef: docs
          weight: 10
          # pre: code  # 加入 "code" 圖標

        # 子菜單範例
        # - name: Introduction
        #   parent: Docs
        #   pageRef: docs/20-introduction
        #   weight: 10
        # - name: Reference
        #   parent: Docs
        #   pageRef: docs/994-reference-configuration
        #   weight: 20

        - name: 短代码
          pageRef: /shortcodes
          weight: 15

        # 图标链接，无 pageRef，必须使用 identifier
        - identifier: foo
          pre: github
          url: https://github.com/ZhenShuo2021/hugo-yore
          weight: 224

      # 显示在版权信息前的底部导航链接。
      footer:
        - name: 关于
          pageRef: about
          weight: 1
        - name: 归档
          pageRef: archive
          weight: 5
        - name: 标签
          pageRef: tags
          weight: 10
        - name: RSS
          url: /index.xml
          weight: 20
        - name: 站点地图
          url: /sitemap.xml
          weight: 20
```
