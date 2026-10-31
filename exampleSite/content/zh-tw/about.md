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

Yore 是一款以內容與閱讀流暢度為核心打造的極簡風格 Hugo 主題。

## 內容為主的設計

想了很久怎麼樣的設計才算是一個內容為主的部落格，我的答案是這樣：

1. 閱讀心流：沒有其他元素干擾的內文區域
2. 文字清晰：WCAG-AA 要求文字和背景對比度 7:1，Yore 直接做到 17:1
3. 最少設定：重點是文章內容而不是花時間調整外觀

## 絕對置中的主文

多方研究後我認為內容為主的部落格佈局仍然是文章置中，因此文章置中從一開始就是 Yore 的設計根基。

## Grid 佈局

主文置中最常見的方案就是限制寬度並且使用 `margin: 0 auto` 讓內文自動置中，但是這會讓左右兩側無法放其他東西，比如說文章目錄就只能用 fixed/absolute 佈局固定在畫面上。

Yore 採用 Grid 佈局解決此問題，因此你可以放任何內容在左右 sidebar，比如 sticky 佈局的文章目錄。使用 Grid 佈局額外的好處是不用複雜的 JS 介入佈局，你可以輕鬆的可以在頭尾放置任何元素也不必擔心 fixed/absolute 的定位問題，比如內建放了文章目錄，或者你也可以放個人頭像、網站資訊、廣告等等。

## 易於自訂

第一次使用這個主題可能會覺得 CSS 怎麼有這麼多，既有 Tailwind，又有 plain CSS，這主要目的是讓你可以使用 Hugo override 功能覆蓋某一 CSS 檔案，因為如果把所有東西東寫進 Tailwind 編譯成大檔案，想要取消一個設定就比 override 複雜的多。

Yore 對 CSS 的分類只有兩條規則：

1. 除非無法直接指定元素，否則一律使用 Tailwind utilities
2. 需要用獨立 CSS 檔案的，除非需要很多 Tailwind syntax，否則一律使用 plain CSS

這代表絕大多數的設定都是 Tailwind 預設，而不喜歡的設定可以在 plain CSS 中找到，可以選擇用 `custom.css` 自定義喜歡的設定，或者用 override 功能覆蓋整個檔案。

你可能也會覺得為什麼每個檔案都用 Grid 而不是統一在 baseof 設定 grid，這樣設計的原因是你可以 override 任何檔案都不受到 grid 限制，而繁複的 grid 設定都在主題端完成。

## 三層 CSS 架構

直接在 HTML 使用 Tailwind colors 會造成兩個問題：開發者在類似元素上需要一一複製之前的 class name，用戶則無法修改指定元素的顏色。

Yore 採用三層 CSS 架構並且使用自訂的 Tailwind tokens，因此允許修改第一層的 CSS 變數以自訂網站色彩主題，或是修改第二層的 semantic tokens 修改指定元素的顏色，完整的 CSS 架構介紹請見文檔的[自定義說明](./docs/80-advanced/950-customization/#customize-css)。

這個架構的缺點是色調較為單一，不過 Yore 是內容為主的主題，色調本來就該單一，而且高級用戶仍然可以直接在 HTML 直接使用第一層的顏色甚至是 Tailwind 內建的顏色。

## 相關文章

Hugo 的相關文章很大程度受到分類學（也就是標籤）影響，而作者本人很懶的為文章想標籤，因此整合了 [jmooring/hugo-module-backlinks](https://github.com/jmooring/hugo-module-backlinks) 作為替代。

對於相關文章文檔也有[基礎介紹](./docs/80-advanced/140-related-article/index.md)。

## 致謝

Yore 最初 fork 自 [Blowfish](https://github.com/nunocoracao/blowfish/)，並在開發過程中參考、重製或改編了以下專案的程式碼，在此致謝：

- [Docusaurus](https://github.com/facebook/docusaurus/)
- [Font Awesome](https://github.com/fortawesome/font-awesome)
- [hugo-module-backlinks](https://github.com/jmooring/hugo-module-backlinks)
- [Iconoir](https://github.com/iconoir-icons/iconoir)
- [Starlight](https://github.com/withastro/starlight)

感謝以上專案的作者與貢獻者，各專案授權條款請見專案內對應的 LICENSE 檔案。
