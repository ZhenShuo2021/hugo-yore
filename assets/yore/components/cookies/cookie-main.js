{{- $cc := site.Params.cookieConsent | default dict -}}
{{- if $cc.enable -}}
import './cookie-consent.js';
{{- end -}}
export { consent } from './cookie-helper.js';
