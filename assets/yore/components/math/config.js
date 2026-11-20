window.MathJax = {
	loader: {
		paths: {
			fonts: '/yore/lib/mathjax-fonts',
			'mathjax-mhchem-extension': '/yore/lib/mathjax-fonts/mathjax-mhchem-font-extension',
		},
		load: [
			'input/tex',
			'output/svg',
			'[tex]/physics',
			'[tex]/upgreek',
			'[tex]/noerrors',
			'[tex]/mhchem',
			'[tex]/cancel',
			'[tex]/color',
			'[tex]/boldsymbol',
			'[tex]/amscd',
			'[tex]/unicode',
		],
	},
	output: {
		font: 'mathjax-tex',
		fontPath: '/yore/lib/mathjax-tex-font',
	},
	options: {
		skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
	},
	tex: {
		packages: {
			'[+]': ['ams', 'mhchem', 'physics', 'upgreek', 'cancel', 'color', 'boldsymbol', 'amscd', 'unicode'],
		},
		tags: 'ams',
		tagSide: 'right',
		tagIndent: '0.8em',
		displayMath: [
			['\\[', '\\]'],
			['$$', '$$'],
		],
		inlineMath: [
			['$', '$'],
			['\\(', '\\)'],
		],
	},
	startup: {
		typeset: false,
	},
};
