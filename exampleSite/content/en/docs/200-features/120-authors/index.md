---
title: Authors
slug: authors
weight: 120
date: 2026-04-18T09:01:00+08:00
description: "Define authors as taxonomy terms and assign them to posts."
authors: ["yore", "alice", "bob"]
tags: ["guide", "taxonomy-system", "authors"]
params:
  sourceLinks:
    - path: "layouts/_partials/lib/get-site-author.html"
    - path: "layouts/authors/term.html"
---

Authors are modeled as a [taxonomy](https://gohugo.io/content-management/taxonomies/). Each author has a dedicated content directory with a profile page, and posts reference authors by slug.

## Configuration

Register the `author` taxonomy in `hugo.yaml`:

```yaml {title="hugo.yaml"}
taxonomies:
  author: authors
```

## Author Profiles

Create a directory for each author under `content/authors/`. The directory name becomes the author's slug.

```text
content/
└── authors/
    ├── _index.md
    └── alice/
        └── _index.md
```

Each author's `_index.md` supports the following front matter:

```yaml {title="content/authors/alice/_index.md"}
---
title: Alice Chen
params:
  description: "A short bio shown on the author profile page."
  siteAuthor: true
  portrait: /img/alice.jpg
  links:
    - github: https://github.com/alice
    - x-twitter: https://example.com
---

Extended bio written in Markdown appears below the banner on the author page.
```

| Field | Description |
| --- | --- |
| `title` | Display name |
| `params.description` | Short bio shown in the profile banner |
| `params.siteAuthor` | Marks this author as the site's default author |
| `params.portrait` | Path to portrait image |
| `params.links` | List of social links, each a single-key map of platform to URL |

Social link platform names map to icons in the [theme's icon set](../../1000-reference-icon/index.md).

## Assigning Authors to Posts

Reference authors by their directory name in the `authors` front matter field.

```yaml {title="content/blog/my-post/index.md"}
---
title: My Post
authors: ["alice", "bob"]
---
```

Multiple authors are supported. Each identifier must match a directory name under `content/authors/`.

To show the author list in the post metadata, enable `pageShowAuthors`:

```yaml {title="hugo.yaml"}
params:
  pageShowAuthors: true
```
