export * as utils from './utils.js';
import { themeManager } from '../../components/appearance/appearance.js';

{{ if site.Params.accessibilityEnabled }}
import { a11yPanel } from '../../components/a11y/a11y.js';
{{ end }}

{{ if site.Params.scrollToTop }}
import '../../components/scroll-to-top/scroll-to-top.js';
{{ end }}

{{ if site.Params.codeCopy }}
import '../../components/code/code.js';
{{ end }}

{{ if site.Params.tocHighlight }}
import '../../components/toc/toc.js';
{{ end }}

{{ if site.Params.imageLightbox }}
import '../../components/photoswipe/lazy-load-photoswipe.js'
{{ end }}

{{ if site.Params.searchEnabled }}
import '../../components/search/search.js'
{{ end }}

{{ if site.Params.footnoteTooltip }}
import '../../components/footnote-tooltip/footnote-tooltip.js';
{{ end }}

import '../../components/email/email.js';
import '../../components/header/mobile-menu.js';
import '../../components/header/nested-menu.js';
import '../../components/print/print.js';
import '../../components/page-actions/page-actions.js';
import './patch-tabindex.js';
import '../../shortcodes/tabs/tabs.js';
import '../../shortcodes/accordion/accordion.js';

{{ if eq site.Params.headerLayout "hideOnScroll" }}
import '../../components/header/hide-header.js';
{{ end }}

window.themeManager = themeManager;
{{ if site.Params.accessibilityEnabled }}
window.a11yPanel = a11yPanel;
{{ end }}
