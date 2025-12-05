---
title: Obsidian Wiki-Links Test
date: 2025-12-04
tags: [obsidian, demo]
excerpt: Testing Obsidian-style wiki-link syntax for internal references
readTime: 2 min read
---

# Obsidian Wiki-Links Test

This post tests **Obsidian-style wiki-link** syntax, which is the standard way to link between notes in Obsidian.

## Wiki-Link Formats

### 1. Basic Wiki-Link
```markdown
[[Welcome to My Technical Journal]]
```
**Example**: [[Welcome to My Technical Journal]]

### 2. Wiki-Link with Alias
```markdown
[[Links and References|here]]
```
**Example**: Check out the [[Internal Links Demo|internal links demo]] for more examples.

### 3. Wiki-Link with Heading
```markdown
[[Debugging MeCab#The Problem]]
```
**Example**: See [[Debugging MeCab#The Problem|the problem section]].

## How It Works

The app automatically:
1. Detects `[[...]]` syntax
2. Extracts the page name and optional alias
3. Converts spaces to dashes for the slug
4. Navigates to the matching post

## Examples
---
title: Obsidian Wiki-Links Test
date: 2025-12-04
tags: [obsidian, demo]
excerpt: Testing Obsidian-style wiki-link syntax for internal references
readTime: 2 min read
---

# Obsidian Wiki-Links Test

This post tests **Obsidian-style wiki-link** syntax, which is the standard way to link between notes in Obsidian.

## Wiki-Link Formats

<h3>1. Basic Wiki-Link</h3>
```markdown
[[Welcome to My Technical Journal]]
```
**Example**: [[Welcome to My Technical Journal]]

<h3>2. Wiki-Link with Alias</h3>
```markdown
[[Links and References|here]]
```
**Example**: Check out the [[Internal Links Demo|internal links demo]] for more examples.

<h3>3. Wiki-Link with Heading</h3>
```markdown
[[Debugging MeCab#The Problem]]
```
**Example**: See [[Debugging MeCab Tagger Initialization in Android#The Problem|the problem section]].

<h2>How It Works</h2>

The app automatically:
1. Detects `[[...]]` syntax
2. Extracts the page name and optional alias
3. Converts spaces to dashes for the slug
4. Navigates to the matching post

<h2>Examples</h2>

Try these links:

- [[Welcome to My Technical Journal]] - Basic link
- [[Debugging MeCab Tagger Initialization in Android|MeCab debugging guide]] - With alias
- [[Building a Portfolio Journal with Vite and TailwindCSS|How this site was built]] - Another alias example
- [[Debugging MeCab Tagger Initialization in Android#The Problem|The Problem Section]] - Link to heading with alias
- [[#Examples]] - Same page heading link
- [[https://google.com|External Link]] - External link in wiki syntax

<h2>Mixed Syntax Support</h2>

You can also still use regular markdown links:

- [Internal Links Demo](./internal-links-demo.md) - Regular `.md` link
- [Welcome](./welcome.md) - Link to another post
- [Jump to Examples](#examples) - Hash link (same page)

All formats work seamlessly! 🎉
