(() => {
	{{- /* light dark */ -}}
	{{ if site.Params.themeLightDarkSwitcher }}
	const theme =
		localStorage.getItem('yore-appearance') ||
		document.documentElement.getAttribute('data-default-appearance');
	document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
	{{ end }}

	{{- /* a11y */ -}}
	{{- if site.Params.accessibilityEnabled -}}
	const fontSize = localStorage.getItem('yore-a11yFontSize');
	if (fontSize) document.documentElement.style.fontSize = fontSize;
	['high-contrast','reduce-motion','reduce-transparency','link-underline'].forEach(k => {
		if (localStorage.getItem('yore-' + k) === 'true') document.documentElement.setAttribute('data-a11y-' + k, 'true');
	});
	{{- end -}}
})();
