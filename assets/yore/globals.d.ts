declare const process: {
	env: {
		NODE_ENV: string;
		ACCESSIBILITY_ENABLED: boolean;
		SCROLL_TO_TOP: boolean;
		SEARCH_ENABLED: boolean;
		EXTERNAL_LINK_WARNING: boolean;
		HIDE_ON_SCROLL_HEADER: boolean;
		CODE_COPY: boolean;
		TOC_HIGHLIGHT: boolean;
		IMAGE_LIGHTBOX: boolean;
		FOOTNOTE_TOOLTIP: boolean;
		GTAG_PAGE_VIEW: boolean;
	};
};

declare const GPUBufferUsage: Record<
	'COPY_DST' | 'UNIFORM' | 'VERTEX' | 'INDEX' | 'STORAGE' | 'COPY_SRC',
	number
>;

declare module '@params' {
	export const enabledCategories: string[] | undefined;
	export const hasSwitcher: boolean;
	export const autoCollapseCategories: boolean;
	export const readingProgress: boolean;
	export const headerLayout: string;
	export const searchJS: string;
	export const searchCSS: string;
	export const photoswipeJS: string;
	export const mathConfig: string;
	export const texSvgJS: string;
	export const mermaidSrc: string;
	export const openccUrl: string;
	export const echartsJS: string;
	export const typeitSrc: string;
	export const youtubeSrc: string;
	export const swURL: string;
	export const scope: string;
	export const swVersion: string;
	export const swCdnDomains: string[];
	export const swPrecacheHtml: boolean;
	export const swPrecacheAssets: string[] | undefined;
	export const swPages: string[];
}

declare module 'yore-cookie' {
	export const consent: {
		onReady(callback: () => void): void;
		isGranted(category: string): boolean;
	};
}

interface Window {
	gtag?: (...args: unknown[]) => void;
	swup?: unknown;
}
