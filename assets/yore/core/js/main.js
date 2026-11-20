export * as utils from './utils.js';
import { startModules } from './modules.js';
import { runRouteHooks, runRouteCleanups } from './route.js';
import { init as initSwup } from './swup.js';

// Public API for site scripts
export { default as delegateEvent } from 'delegate-it';
export { defineModule } from './modules.js';
export { registerRouteHook } from './route.js';

// Every feature file registers itself when imported, this file only decides which ones are bundled.
// Mechanism 1 (runs once): the file's top level, event delegation included.
// Mechanism 2 (every navigation): registerRouteHook() at the top level.
// Mechanism 3 (per element): defineModule() at the top level, used as data-module="name".
import '../../components/appearance/appearance.js';
{{ if site.Params.accessibilityEnabled }}
import '../../components/a11y/a11y.js';
{{ end }}
{{ if site.Params.scrollToTop }}
import '../../components/scroll-to-top/scroll-to-top.js';
{{ end }}
{{ if site.Params.searchEnabled }}
import '../../components/search/search.js';
{{ end }}
{{ if site.Params.externalLinkWarning }}
import '../../components/external-link-warning/external-link-warning.js';
{{ end }}
{{ if eq site.Params.headerLayout "hideOnScroll" }}
import '../../components/header/hide-header.js';
{{ end }}
import '../../components/header/mobile-menu.js';
import '../../components/header/nested-menu.js';
import '../../components/print/print.js';

{{ if site.Params.codeCopy }}
import '../../components/code/code.js';
{{ end }}
{{ if site.Params.tocHighlight }}
import '../../components/toc/toc.js';
{{ end }}
{{ if site.Params.imageLightbox }}
import '../../components/photoswipe/lazy-load-photoswipe.js';
{{ end }}
{{ if site.Params.footnoteTooltip }}
import '../../components/footnote-tooltip/footnote-tooltip.js';
{{ end }}
import './patch-tabindex.js';
import '../../components/email/email.js';
import '../../components/page-actions/page-actions.js';
import '../../components/translate-chinese/translate.js';
import '../../components/docs-nav/docs-nav.js';
import '../../components/stale-warning/stale-warning.js';
import '../../components/math/math.js';
import '../../components/knowledge-graph/knowledge-graph.js';
import '../../shortcodes/tabs/tabs.js';
import '../../shortcodes/carousel/carousel.js';
import '../../shortcodes/masonry/masonry.js';
import '../../shortcodes/mermaid/mermaid.js';
import '../../shortcodes/typeit/typeit.js';
import '../../shortcodes/charts/chart.js';
import '../../shortcodes/youtube/youtube.js';

export const swup = initSwup();

// Priority must exceed Head Plugin's awaitAssets: clean up only after assets load, right before replacement,
// otherwise the old view is torn down early and flickers
swup.hooks.before('content:replace', runRouteCleanups, { priority: 10 });
// Modules need no hook here, the observer in modules.js mounts and unmounts them with the DOM
swup.hooks.on('content:replace', runRouteHooks);

{{ if site.Params.searchEnabled }}
swup.hooks.on('visit:start', () => document.querySelector('pagefind-modal')?.close?.());
{{ end }}

{{ with site.Params.analytics.gtag }}{{ if and hugo.IsProduction (ne .sendPageView false) }}
// gtag.js loads only after consent, without it window.gtag is undefined and the call is skipped
swup.hooks.on('page:view', () => {
	window.gtag?.('event', 'page_view', { page_title: document.title, page_location: location.href });
});
{{ end }}{{ end }}

startModules();
runRouteHooks();
