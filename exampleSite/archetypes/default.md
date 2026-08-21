---
title: {{ replace .File.ContentBaseName "-" " " | title }}
date: {{ .Date }}
lastmod: {{ .Date }}
description: ""
tags:
  # Content form (pick one)
  - reference
  - guide
  - concept
  - troubleshooting
  # Technical implementation (multiple allowed)
  - hugo-core
  - shortcodes
  - scripting
  - styling
  - taxonomy-system
  # Broader topic tags (keep if applicable)
  - content-organization
  - visualization
  # Assets / getting-started related (keep if applicable)
  - assets
  - icons
  - getting-started
  - docs-type
  # Content-type specific (only for content-type configuration pages)
  - blog-type
  - gallery-type
---
