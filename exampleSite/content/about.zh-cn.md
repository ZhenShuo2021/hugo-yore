---
title: "About"
date: 2026-01-15T14:45:00+08:00
Description: Yore is a minimalist Hugo theme focused on reading flow, high contrast, and flexible Grid layouts.
params:
  pageShowRelated: false
  pageShowNext: false
  pageShowMeta: false
---

Yore is a minimalist, content-centric fork of the Blowfish theme.

曾經想過把這些改動放到 Blowfish 上，但是如你所見這個 fork 已經修改到只剩下 shortcode 和 Blowfish 相同，其餘所有東西都被重做了。

## 內容為主的設計

想了很久怎麼樣的設計才算是一個內容為主的部落格？我的答案是這樣：

1. 閱讀心流：沒有其他元素干擾的內文區域
2. 文字清晰：WCAG-AA 要求文字和背景對比度 7:1，Yore 直接做到 17:1
3. 主頁設計：主頁不應該放最近的文章，因為優質文章不等於最近的文章，而且在文章列表頁面就提供最近文章功能
4. 最少設定：重點是文章內容而不是花時間調整外觀

## 絕對置中的主文

多方研究後我認為內容為主的部落格佈局仍然是文章置中，因此文章置中從一開始就是 Yore 的設計根基。

## Grid 佈局

主文置中最常見的方案就是限制寬度並且使用 `margin: 0 auto` 讓內文自動置中，但是這會讓左右兩側無法放其他東西，比如說文章目錄就只能用 fixed/absolute 佈局固定在畫面上。

Yore 採用 Grid 佈局解決此問題，因此你可以放任何內容在左右 sidebar，比如 sticky 佈局的文章目錄。使用 Grid 佈局額外的好處是不用複雜的 JS 介入佈局，你可以輕鬆的可以在頭尾放置任何元素也不必擔心 fixed/absolute 的定位問題，比如內建放了文章目錄，或者你也可以放個人頭像、網站資訊、廣告等等。

## 多種變化

Yore 內建幾種不同的佈局樣式，比如範例網站就使用寬 header + sidebar 目錄設計，如果你需要像文檔網站這種即時知道閱讀進度的 sidebar 目錄，預設設定即可使用。

即使你不需要左右兩側有任何東西，只要設定

```yaml
params:
  headerCentered: false
  pageTOCStyle: top
```

這樣你的網站左右就完全乾淨清空光。透過 Yore 預先建立好的 grid 架構，你可以直接在 `main-grid__main` 裡面修改主要文章佈局，開發流程和常見的 center 佈局網站完全相同，只是外層容器從 `margin: 0 auto` 變成 grid。

## 簡化設定

Blowfish 雖然實際上非常輕量，但是豐富的設定檔對於初次使用的用戶需要花一點時間理解。

Yore 注重文章內容因此設定本來就少，設定檔也刻意調整成一目了然容易調整的形式，在穩定版本前不建立任何 sub key，避免發生 sub key 不符合未來專案設計的問題。

只要是作者主觀認定過於細節的項目就不會建立參數設定，因為每個用戶都有自己的需求，設定永遠滿足不了所有用戶，網站架構也已經用白話文在文檔說明了，語言模型加上文檔應該就能完成大多數自訂情境。

## 易於自訂

第一次使用這個主題可能會覺得 CSS 怎麼有這麼多，既有 Tailwind，又有 plain CSS，這主要目的是讓你可以使用 Hugo override 功能覆蓋某一 CSS 檔案，因為如果把所有東西東寫進 Tailwind 編譯成大檔案，想要取消一個設定就比 override 複雜的多。

Yore 對 CSS 的分類只有兩條規則：

1. 除非無法直接指定元素，否則一律使用 Tailwind utilities
2. 需要用獨立 CSS 檔案的，除非需要很多 Tailwind syntax，否則一律使用 plain CSS

這代表絕大多數的設定都是 Tailwind 預設，而不喜歡的設定可以在 plain CSS 中找到，可以選擇用 `custom.css` 自定義喜歡的設定，或者用 override 功能覆蓋整個檔案。

你可能也會覺得為什麼每個檔案都用 Grid 而不是統一在 baseof 設定 grid，這樣設計的原因是你可以 override 任何檔案都不受到 grid 限制，而繁複的 grid 設定都在主題端完成。

## 三層 CSS 架構

直接在 HTML 使用 Tailwind colors 會造成兩個問題：開發者在類似元素上需要一一複製之前的 class name，用戶則無法修改指定元素的顏色。

Yore 採用三層 CSS 架構並且使用自訂的 Tailwind tokens，因此允許修改第一層的 CSS 變數以自訂網站色彩主題，或是修改第二層的 semantic tokens 修改指定元素的顏色，完整的 CSS 架構介紹請見文檔的[自定義說明](./docs/950-customization/#customize-css)。

這個架構的缺點是色調較為單一，不過 Yore 是內容為主的主題，色調本來就該單一，而且高級用戶仍然可以直接在 HTML 直接使用第一層的顏色甚至是 Tailwind 內建的顏色。

## JS 優化

Yore 雖然包含 10 多個 JS 模組，但在 Lighthouse 的 Mobile 與 Desktop 測試中都達到滿分成績。

Yore 採用 ESM 規範，利用 `type="module"` 實現延遲加載，外部依賴也透過 Hugo 的 `js.Build` 一起打包，將核心邏輯封裝至單一的 Main Bundle 中以減少 HTTP Requests。至於其餘由作者主觀認定非主題主要內容的 lib（如 TypeIt, Mermaid）就以 CDN 方式載入，不再浪費精力在本地管理這些資源。

Yore 也使用 Speculation Rules API 進行預取和預渲染，達到近乎瞬時的頁面切換。

套件方面，數學和圖表使用更強大的 MathJax 和 echarts 而不是 katex 和 chart.js，原因是我不認為有多少人在乎那點流量，而且這些流量都會被瀏覽器快取只會消耗一次，真的會消耗流量的是沒有處理過就直接上傳的圖片。至於速度問題，MathJax 和 Katex 差異已經小到需要用 benchmark 工具才能感知了。

## 分類學

Yore 只使用標籤 (tags) 不使用種類 (categories)，主要想法有：

1. 既然都要用種類了，為什麼不用子目錄區分種類
2. 這兩個都是文章分類功能，都需要有意識的管理，否則等同虛設
3. 承 1, 2，如果標籤功能已經有用了，那為什麼還需要種類額外分類？如果標籤本身就不怎麼統一管理，那分類自然也會出現一樣問題

因此簡化到只使用標籤作為文章分類學，不使用種類，種類的分類方式在 Yore 更建議用目錄區分。

## 相關文章

Hugo 的相關文章很大程度受到分類學（也就是標籤）影響，而作者本人很懶的為文章想標籤，因此整合了 [jmooring/hugo-module-backlinks](https://github.com/jmooring/hugo-module-backlinks) 作為替代。

對於相關文章文檔也有[基礎介紹](./docs/140-related-article/index.md)。
