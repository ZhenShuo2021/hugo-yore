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
	const params: Record<string, unknown>;
	export = params;
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
