import cpy from 'cpy';

// dest: Destination **directory**.
const tasks = [
	{ src: 'node_modules/photoswipe/dist/photoswipe-lightbox.esm.min.js', dest: 'assets/yore/lib/photoswipe' },
	{ src: 'node_modules/photoswipe/dist/photoswipe.esm.min.js', dest: 'assets/yore/lib/photoswipe' },
	{ src: 'node_modules/photoswipe/dist/photoswipe.css', dest: 'assets/yore/lib/photoswipe' },
	{ src: 'node_modules/mermaid/dist/mermaid.min.js', dest: 'assets/yore/lib/mermaid' },
	{
		src: 'node_modules/@mermaid-js/layout-elk/dist/mermaid-layout-elk.esm.min.mjs',
		dest: 'assets/yore/lib/mermaid',
	},
	{
		src: 'node_modules/@mermaid-js/layout-elk/dist/chunks/mermaid-layout-elk.esm.min/*',
		dest: 'assets/yore/lib/mermaid/chunks/mermaid-layout-elk.esm.min',
	},
	{ src: 'node_modules/svg-toolbelt/dist/svg-toolbelt.esm.js', dest: 'assets/yore/lib/svg-toolbelt' },
	{ src: 'node_modules/svg-toolbelt/dist/svg-toolbelt.css', dest: 'assets/yore/lib/svg-toolbelt' },
	{ src: 'node_modules/echarts/dist/echarts.min.js', dest: 'assets/yore/lib/echarts' },
	{
		src: 'node_modules/vanilla-cookieconsent/dist/cookieconsent.esm.js',
		dest: 'assets/yore/lib/cookieconsent',
	},
	{ src: 'node_modules/vanilla-cookieconsent/dist/cookieconsent.css', dest: 'assets/yore/lib/cookieconsent' },
	{ src: 'node_modules/iconoir/icons/regular', dest: 'assets/yore/icons/iconoir/regular' },
	{ src: 'node_modules/iconoir/icons/solid', dest: 'assets/yore/icons/iconoir/solid' },
	{ src: 'node_modules/@fortawesome/fontawesome-free/svgs/brands', dest: 'assets/yore/icons/fa/brands' },
];

await Promise.all(tasks.map(({ src, dest }) => cpy([src, '!**/*.map'], dest, { flat: true })));

// mathjax: preserve directory structure for dynamic module loading
await cpy(['node_modules/mathjax/**', '!**/*.map', '!**/*.md'], 'assets/yore/lib/mathjax');

// mathjax-tex-font: chtml + svg entries + woff2 fonts
await cpy(
	[
		'node_modules/@mathjax/mathjax-tex-font/chtml.js',
		'node_modules/@mathjax/mathjax-tex-font/svg.js',
		'!**/*.map',
		'!**/*.md',
	],
	'assets/yore/lib/mathjax-tex-font',
	{ flat: true },
);
await cpy(
	['node_modules/@mathjax/mathjax-tex-font/chtml/**', '!**/*.map', '!**/*.md'],
	'assets/yore/lib/mathjax-tex-font/chtml',
);

// mathjax-mhchem-font-extension: chtml + svg entries + woff2 fonts
await cpy(
	[
		'node_modules/@mathjax/mathjax-mhchem-font-extension/chtml.js',
		'node_modules/@mathjax/mathjax-mhchem-font-extension/svg.js',
		'!**/*.map',
		'!**/*.md',
	],
	'assets/yore/lib/mathjax-fonts/mathjax-mhchem-font-extension',
	{ flat: true },
);
await cpy(
	['node_modules/@mathjax/mathjax-mhchem-font-extension/chtml/**', '!**/*.map', '!**/*.md'],
	'assets/yore/lib/mathjax-fonts/mathjax-mhchem-font-extension/chtml',
);
