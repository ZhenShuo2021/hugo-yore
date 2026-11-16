---
title: Benchmark
slug: benchmark
weight: 960
date: 2026-11-15T22:23:00+08:00
description: "Build time benchmarks of Yore against Docusaurus, Hextra, Doks, Starlight and Docsy on a 4000-page documentation site."
tags: ["benchmark", "performance"]
---

Tests the most common three-column documentation layout: left navigation, main content, and a right-side TOC. Uses [zachleat/bench-framework-markdown](https://github.com/zachleat/bench-framework-markdown) with a dataset of 4000 pages.

| Framework | Version | Build time |
| --- | --- | --- |
| Hugo Yore | 0.13.0 | 16s |
| Hugo Hextra | 0.13.0 | 209s |
| Hugo Doks[^doks-nav] | 0.9.6 | 95s |
| Astro Starlight[^astro] | 0.43.1 | 63s |
| Docusaurus | 3.10.1 | 283s |
{center="true"}

[^doks-nav]: Doks does not render the `nav` element in its mobile navigation bar.
[^astro]: Tested with latest astro `v7.3.6`.
