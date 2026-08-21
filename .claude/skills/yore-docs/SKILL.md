---
name: yore-docs
description: Documentation writing rules for hugo-theme-yore exampleSite. Use when writing or reviewing any file under exampleSite/content/. Triggers for new doc pages, doc edits, or any prose written for the theme's documentation site.
---

## Structure

Order sections from concept to action:

1. One-sentence intro — what the feature is, no "this guide will show you"
2. Concept or principle (if non-obvious)
3. Configuration
4. Usage / examples
5. Edge cases or advanced

Section headings: short nouns or gerunds. No full sentences as headings.

## Language Rules

- One fact per sentence.
- Use imperative or declarative. Never "you can": write "Place the file" not "You can place the file."
- No em dashes, en dashes, or semicolons.
- Do not state obvious consequences. Do not explain what the reader can already infer.
- No passive-voice filler: "This ensures that..." / "Note that..." / "It is worth mentioning..."
- No closing summary sentences.

## Code Blocks

- Always add `{title="path/to/file"}` for file-specific blocks.
- Shell commands use `` ```sh `` with no title unless a specific filename is relevant.
- Content inside code blocks must be complete enough to copy-paste without modification.

## Links

- Inline links only. No footnote-style references unless the same URL appears three or more times.

## Admonitions

Use `> [!NOTE]`, `> [!CAUTION]`, `> [!INFO]`, `> [!IMPORTANT]` sparingly — only for genuine warnings or
non-obvious gotchas that would cause real problems if missed.

## Prohibited Patterns

| Pattern                                 | Replace with                                    |
| --------------------------------------- | ----------------------------------------------- |
| `You can do X by...`                    | `Do X by...` or `X is done by...`               |
| `This ensures that X`                   | State X directly                                |
| `Note that X`                           | State X directly, or use admonition if critical |
| `In order to X`                         | `To X`                                          |
| `It is possible to X`                   | `X is supported` or just show the example       |
| Closing paragraph restating the section | Delete it                                       |

## Calibration

Before writing a new doc page, read two existing pages to calibrate tone and density:

- Short feature page: `exampleSite/content/en/docs/70-features/90-favicons/index.md`
- Long reference page: `exampleSite/content/en/docs/80-advanced/950-customization/index.md`
