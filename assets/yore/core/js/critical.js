(() => {
	{{- /* light dark */ -}}
	{{- $appearanceSwitcherEnabled := site.Store.Get "appearanceSwitcherEnabled" }}
	{{- $defaultMode := site.Params.themeLightDarkMode | default `light` }}
	{{- if not (in (slice `light` `dark` `device`) $defaultMode) }}{{ $defaultMode = `light` }}{{ end }}
	{{ if $appearanceSwitcherEnabled }}
	const saved = localStorage.getItem('yore-appearance');
	const mode = ['light', 'dark', 'device'].includes(saved) ? saved : {{ $defaultMode | jsonify }};
	document.documentElement.setAttribute('data-appearance', mode);
	document.documentElement.setAttribute(
		'data-theme',
		mode === 'device' ? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : mode,
	);
	{{ else if eq $defaultMode `device` }}
	document.documentElement.setAttribute(
		'data-theme',
		matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
	);
	{{ end }}

	{{- /* a11y */ -}}
	{{- if site.Params.accessibilityEnabled -}}
	const fontSize = localStorage.getItem('yore-a11yFontSize');
	if (fontSize) document.documentElement.style.fontSize = fontSize;
	['high-contrast','reduce-motion','reduce-transparency','link-underline', 'line-height'].forEach(k => {
		if (localStorage.getItem('yore-' + k) === 'true') document.documentElement.setAttribute('data-a11y-' + k, 'true');
	});
	{{- end -}}
})();
