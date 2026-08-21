---
title: "Versioning"
slug: versioning
weight: 520
date: 2026-04-17T00:00:00+08:00
description: "Serve multiple versions of your documentation from a single Hugo site."
tags: ["guide", "hugo-core", "versioning", "docs-type"]
params:
  sourceLinks:
    - path: "layouts/_partials/components/version-switcher.html"
---

Versioning serves multiple doc versions. Each version maps to a content directory and gets its own URL prefix.

## How It Works

Hugo builds one independent site per version declared in `versions`. Each site receives only the content directories that match its `sites.matrix.versions` constraint, controlled through Hugo's module mount system, which maps source directories to the `content` target at build time.

## Configuration

### Declare versions

Add a `versions` block to `hugo.yaml`. Each key is a version name.

```yaml {title="hugo.yaml"}
defaultContentVersion: v2.0.0
defaultContentVersionInSubdir: false

versions:
  v1.0.0: {}
  v2.0.0: {}
```

- `defaultContentVersion`: the default project version
- `defaultContentVersionInSubdir`: `false` serves default at `/docs/`, `true` at `/v2.0.0/docs/`
- `versions`: declares all available versions; each key must match a content directory name

### Mount content directories

Each `module.mounts` entry maps a versioned source directory to the shared `content` target.

```yaml {title="hugo.yaml"}
module:
  mounts:
    - source: content/v2.0.0
      target: content
      sites:
        matrix:
          versions: [v2.0.0]

    - source: content/v1.0.0
      target: content
      sites:
        matrix:
          versions: [v1.0.0]
```

- `source`: local directory containing that version's content
- `target`: always `content`. Hugo merges all mounts into one virtual content tree
- `sites.matrix.versions`: semver constraint selecting which version sites receive this mount
  - `**`: all versions
  - `>= v2.0.0`: v2.0.0 and above
  - `< v2.0.0`: below v2.0.0

When two files share the same path, the first mount takes precedence.

### Enable the switcher

```yaml {title="hugo.yaml"}
params:
  versionSwitcher: true
```

### Per-page version scoping

Restrict a page to specific versions using `sites.matrix.versions` in its front matter.

```yaml {title="content/v2.0.0/docs/new-feature.md"}
---
title: New Feature
sites:
  matrix:
    versions: '>= v2.0.0'
---
```

- `sites.matrix.versions`: semver constraint scoping this page to matching version sites
- omitting this key makes the page visible on every version site that receives its mount

## Full Example

The [official Hugo example](https://github.com/jmooring/hugo-testing/tree/hugo-forum-topic-56516) demonstrates a working multi-version site with four versions and cascading mount overrides.

## With Multiple Languages

With multiple languages, Hugo generates one site per language × version combination. The mounts must specify both dimensions.

The example below demonstrates a multilingual versioned site with:

- only `docs` is versioned
- `docs` and `blog` fallback to English when translations are missing
- `author` is language-specific

### Directory structure

Versioned docs are nested inside each language directory.

```text
content/
├── en/
│   ├── v1.0.0/
│   │   └── docs/
│   ├── v2.0.0/
│   │   └── docs/
│   ├── blog/              # not versioned
│   └── authors/           # not versioned, en-only
└── zh-cn/
    ├── v1.0.0/
    │   └── docs/          # partial translation, fallback to English docs
    ├── v2.0.0/
    │   └── docs/
    └── (other non-versioned content)
```

### Module mounts

```yaml {title="hugo.yaml"}
module:
  mounts:
    # versioned docs: zh-cn translation (must come before en fallback)
    - source: content/zh-cn/v2.0.0
      target: content
      sites:
        matrix:
          languages: [zh-cn]
          versions: [v2.0.0]

    - source: content/zh-cn/v1.0.0
      target: content
      sites:
        matrix:
          languages: [zh-cn]
          versions: [v1.0.0]

    # versioned docs: en as fallback for all languages
    - source: content/en/v2.0.0
      target: content
      sites:
        matrix:
          languages: ['**']  # configure fallback
          versions: [v2.0.0]

    - source: content/en/v1.0.0
      target: content
      sites:
        matrix:
          languages: ['**']
          versions: [v1.0.0]

    # non-versioned content: zh-cn first (wins on path collision)
    - source: content/zh-cn
      target: content
      files:
        - '! v1.0.0/**'
        - '! v2.0.0/**'
      sites:
        matrix:
          languages: [zh-cn]
          versions: ['**']

    # non-versioned content: en shared across all languages
    - source: content/en
      target: content
      files:
        - '! authors/**'
        - '! v1.0.0/**'
        - '! v2.0.0/**'
      sites:
        matrix:
          languages: ['**']
          versions: ['**']

    # en-only authors
    - source: content/en/authors
      target: content/authors
      sites:
        matrix:
          languages: [en]
          versions: ['**']
```

**Notes:**

- `languages` and `versions` in `sites.matrix` are AND conditions.
- zh-cn mounts come before their en equivalents. The first mount wins on path collision, so zh-cn translations take precedence over the en fallback.
- Non-versioned mounts use `versions: ['**']` so blog, authors, and other pages appear in every version site.
- The `files` exclusion list prevents non-versioned mounts from double-mounting versioned subdirectories. Add `! vX.Y.Z/**` for every new version.

### Adding a version

To add `v3.0.0`:

1. Create `content/en/v3.0.0/docs/` and optionally `content/zh-cn/v3.0.0/docs/`.
2. Add `v3.0.0: {}` under `versions`.
3. Add two mount entries (zh-cn and en) with `versions: [v3.0.0]`.
4. Add `- '! v3.0.0/**'` to the `files` list in both non-versioned mounts.
