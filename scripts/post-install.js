import cpy from 'cpy';
import { readFile, writeFile } from 'node:fs/promises';
import { glob } from 'glob';

// dest: Destination **directory**.
const tasks = [
	{ src: 'node_modules/photoswipe/dist/photoswipe-lightbox.esm.min.js', dest: 'assets/lib/photoswipe' },
	{ src: 'node_modules/photoswipe/dist/photoswipe.esm.min.js', dest: 'assets/lib/photoswipe' },
	{ src: 'node_modules/photoswipe/dist/photoswipe.css', dest: 'assets/lib/photoswipe' },
	{ src: 'node_modules/mermaid/dist/mermaid.min.js', dest: 'assets/lib/mermaid' },
	{
		src: 'node_modules/@mermaid-js/layout-elk/dist/mermaid-layout-elk.esm.min.mjs',
		dest: 'assets/lib/mermaid',
	},
	{
		src: 'node_modules/@mermaid-js/layout-elk/dist/chunks/mermaid-layout-elk.esm.min/*',
		dest: 'assets/lib/mermaid/chunks/mermaid-layout-elk.esm.min',
	},
	{ src: 'node_modules/svg-toolbelt/dist/svg-toolbelt.esm.js', dest: 'assets/lib/svg-toolbelt' },
	{ src: 'node_modules/svg-toolbelt/dist/svg-toolbelt.css', dest: 'assets/lib/svg-toolbelt' },
	{ src: 'node_modules/echarts/dist/echarts.min.js', dest: 'assets/lib/echarts' },
	{ src: 'node_modules/vanilla-cookieconsent/dist/cookieconsent.esm.js', dest: 'assets/lib/cookieconsent' },
	{ src: 'node_modules/vanilla-cookieconsent/dist/cookieconsent.css', dest: 'assets/lib/cookieconsent' },
	{ src: 'node_modules/iconoir/icons/regular', dest: 'assets/icons/iconoir/regular' },
	{ src: 'node_modules/iconoir/icons/solid', dest: 'assets/icons/iconoir/solid' },
	{ src: 'node_modules/@fortawesome/fontawesome-free/svgs/brands', dest: 'assets/icons/fa/brands' },
];

await Promise.all(tasks.map(({ src, dest }) => cpy([src, '!**/*.map'], dest, { flat: true })));

// patch iconoir stroke width
const iconoirFiles = await glob('assets/icons/iconoir/regular/*.svg');
await Promise.all(
	iconoirFiles.map(async (file) => {
		const content = await readFile(file, 'utf8');
		if (content.includes('stroke-width="1.5"')) {
			await writeFile(file, content.replaceAll('stroke-width="1.5"', 'stroke-width="2"'), 'utf8');
		}
	}),
);

// mathjax: preserve directory structure for dynamic module loading
await cpy(['node_modules/mathjax/**', '!**/*.map', '!**/*.md'], 'assets/lib/mathjax');

// mathjax-tex-font: chtml + svg entries + woff2 fonts
await cpy(
	[
		'node_modules/@mathjax/mathjax-tex-font/chtml.js',
		'node_modules/@mathjax/mathjax-tex-font/svg.js',
		'!**/*.map',
		'!**/*.md',
	],
	'assets/lib/mathjax-tex-font',
	{ flat: true },
);
await cpy(
	['node_modules/@mathjax/mathjax-tex-font/chtml/**', '!**/*.map', '!**/*.md'],
	'assets/lib/mathjax-tex-font/chtml',
);

// mathjax-mhchem-font-extension: chtml + svg entries + woff2 fonts
await cpy(
	[
		'node_modules/@mathjax/mathjax-mhchem-font-extension/chtml.js',
		'node_modules/@mathjax/mathjax-mhchem-font-extension/svg.js',
		'!**/*.map',
		'!**/*.md',
	],
	'assets/lib/mathjax-fonts/mathjax-mhchem-font-extension',
	{ flat: true },
);
await cpy(
	['node_modules/@mathjax/mathjax-mhchem-font-extension/chtml/**', '!**/*.map', '!**/*.md'],
	'assets/lib/mathjax-fonts/mathjax-mhchem-font-extension/chtml',
);
