{{- .Title | replaceRE "\n" " " | printf "# %s\n" -}}
{{- .RawContent -}}

{{ if .IsSection }}

## Contents of This Section (Auto Generated)

{{ range .RegularPages }}
{{- with .OutputFormats.Get "markdown" }}
- {{ .Permalink }}
{{- end -}}
{{- end }}
{{- else }}

{{ if not .IsHome }}

## Ancestors of This Page (Auto Generated)

{{ range .Ancestors }}
{{ if not .IsHome }}
{{- with .OutputFormats.Get "markdown" }}
- {{ .Permalink }}
{{- end -}}
{{- end -}}
{{- end }}
{{- end -}}
{{- end -}}
