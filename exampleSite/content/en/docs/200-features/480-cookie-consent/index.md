---
title: "Cookie Consent"
slug: "cookie-consent"
description:
weight: 480
date: 2026-03-28T18:00:00+08:00
tags: ["guide", "scripting", "privacy-compliance"]
params:
  sourceLinks:
    - path: "assets/js/cookies/cookie-consent.js"
    - path: "assets/js/cookies/config.js"
    - path: "assets/js/cookies/translations"
    - path: "layouts/_partials/components/cookie-consent.html"
---

Yore integrates [vanilla-cookieconsent][lib] for GDPR-compliant cookie management. Built-in categories are `necessary`, `functional`, `analytics`, and `advertising`.

> [!IMPORTANT]
> 1. Google Ads related products are [not compatible](https://github.com/orestbida/cookieconsent/issues/562) with vanilla-cookieconsent.
> 2. Most libraries exclude functional cookies from consent handling and [do not use the consent modal](https://github.com/themesberg/flowbite-react/issues/546#issuecomment-1385626284). Yore follows the same behavior and does not manage them.
> 3. Provide a cookie settings entry accessible from all pages to meet GDPR requirements.

## Configuration

Set `enable: true` and list the categories you want to expose to visitors.

```yaml {title="hugo.yaml"}
params:
  cookieConsent:
    enable: true
    categories:
      - necessary
      - functional
      - analytics
      - advertising
```

## Preferences Button

The `cookie-settings` shortcode renders a button that opens the preferences modal.

```go-html-template
{{</* cookie-settings */>}}
{{</* cookie-settings title="Cookie Settings" */>}}
```

{{< cookie-settings >}}
{{< cookie-settings title="Cookie Settings" >}}

## Examples

Once your categories are configured, you need to put your scripts under consent management. There are two ways to do this:

1. Script Management: manage inline scripts.
2. Event listeners: listen for consent events to run or tear down code programmatically.

These examples are simplified from [How to manage scripts](https://cookieconsent.orestbida.com/advanced/manage-scripts.html).

### Scripts Management

Add `type="text/plain"` and `data-category` to any `<script>` tag to gate its execution behind consent.

Before:

```html {title="layouts/_partials/extend-head.html"}
<!-- Google tag, always executed -->
<script async src="https://www.googletagmanager.com/gtag/js?id=TAG_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'TAG_ID');
</script>
```

After:

```html {title="layouts/_partials/extend-head.html", hl_lines=["2-4", 6]}
<script
  type="text/plain"
  data-category="analytics"
  data-src="https://www.googletagmanager.com/gtag/js?id=TAG_ID"
></script>
<script type="text/plain" data-category="analytics">
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'TAG_ID');
</script>
```

### Execute code on consent

Use event listeners when you need more control. `cc:onConsent` fires on every page load once consent has been given. `cc:onChange` fires when the user updates their preferences after consent was already expressed.

```js
window.addEventListener('cc:onConsent', () => {
  if (window.CookieConsent.acceptedCategory('analytics')) {
    // initialize analytics
  }
});
```

See [Callbacks and Events](https://cookieconsent.orestbida.com/advanced/callbacks-events.html) for all available events.

## Advanced

Category creation falls into three types: a simple category defined in configuration, a category registered with detailed control using Yore's `addCategory` API, or a full JS override for complete control.

`hugo.yaml` determines which categories are enabled and in what order; the JSON translation files define the display text. Both are required. JS configuration files are optional and intended for advanced use.

## Create a Simple Category

To create a new category called `foo`, follow these steps:

{{% steps number=true %}}

  {{< step >}}

  Append `foo` to the `categories` field in `hugo.yaml`.

  ```yaml {title="hugo.yaml"}
  params:
    cookieConsent:
      enable: true
      categories:
        - necessary
        - functional
        - analytics
        - foo
  ```

  {{< /step >}}

  {{< step >}}

  [Override][override] the theme's `assets/cookies/translations/[LANG].json` and add a new entry to the `sections` array.

  ```json {title="assets/cookies/translations/[LANG].json"}
  {
    // ...
    "preferencesModal": {
      "sections": [
        // new "foo" category
        {
          "title": "Category Foo",
          "description": "A custom category. Provides a minimal entry point for adding categories beyond the defaults.",
          "linkedCategory": "foo"
        }
      ]
    }
    // ...
  }
  ```

  {{< /step >}}

  {{< step >}}

  Use the category in your JS, for example:

  ```js
  if (window.CookieConsent.acceptedCategory('foo')) {
    // ...
  }
  ```

  Or use an inline script:

  ```html
  <script type="text/plain" data-category="foo">
    // ...
  </script>
  ```

  {{< /step >}}

{{% /steps %}}

### API

This API is provided by Yore for advanced control. You still need to set up `hugo.yaml` and `[LANG].json` to create a new category.

#### addCategory

vanilla-cookieconsent's `CookieConsent.run()` accepts a single config object. `addCategory` is a helper provided by Yore that registers a category and its corresponding preferences modal section into that config object before `CookieConsent.run()` is called.

| Parameter | Description |
|-----------|-------------|
| `name` | Category identifier. |
| `categoryConfig` | See the [category config reference](https://cookieconsent.orestbida.com/reference/configuration-reference.html#categories) for all available fields (`enabled`, `readOnly`, `autoClear`, `services`). |
| `section` | Accepts `title` and `description`. See the [section reference](https://cookieconsent.orestbida.com/reference/configuration-reference.html#translation-preferencesmodal-sections). If omitted, the entry must exist in the translation JSON instead. |

**Example: Register a custom category**

```js {title="assets/js/cookies/config.js"}
export default function ({ addCategory }) {
  addCategory({
    name: 'analytics',

    categoryConfig: {
      autoClear: {
        cookies: [
          { name: /^_ga/ },  // matches _ga, _ga_XXXXXXX, etc.
          { name: '_gid' },
        ],
      },
    },

    section: {
      title: 'Analytics Cookies',
      description: 'Help us understand how visitors interact with the site. All data is anonymous.',
    },
  });
}
```

[lib]: https://cookieconsent.orestbida.com/
[override]: ../../320-advanced/120-customization/index.md#override-templates
