import { consent } from 'yore-cookie';

type Platform = 'github' | 'gitlab' | 'gitea' | 'codeberg' | 'forgejo' | 'huggingface';

type FieldMap = Record<string, string>;

const formatMetric = (n: unknown): unknown => {
	if (typeof n !== 'number') return n;
	if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
	if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
	return n;
};

const platforms: Record<Platform, FieldMap> = {
	github: {
		full_name: 'full_name',
		description: 'description',
		stargazers_count: 'stargazers',
		forks: 'forks',
		language: 'language',
	},
	gitlab: {
		name_with_namespace: 'name_with_namespace',
		description: 'description',
		star_count: 'star_count',
		forks_count: 'forks_count',
	},
	gitea: {
		full_name: 'full_name',
		description: 'description',
		stars_count: 'stars_count',
		forks_count: 'forks_count',
	},
	codeberg: {
		full_name: 'full_name',
		description: 'description',
		stars_count: 'stars_count',
		forks_count: 'forks_count',
	},
	forgejo: {
		full_name: 'full_name',
		description: 'description',
		stars_count: 'stars_count',
		forks_count: 'forks_count',
	},
	huggingface: { description: 'description', likes: 'likes', downloads: 'downloads' },
};

const processors: Partial<Record<Platform, Record<string, (value: unknown) => unknown>>> = {
	huggingface: {
		description: (value) => {
			const text = typeof value === 'string' ? value : '';
			return text.replace(/Dataset Card for .+?\s+Dataset Summary\s+/, '').trim() || value;
		},
	},
};

const pendingRequests = new Map<string, Promise<unknown>>();

const fetchRepoData = async (repoURL: string, ENABLE_CACHE: boolean): Promise<Record<string, unknown>> => {
	const cacheKey = `yore-repo-cache-${repoURL}`;
	const cached = (ENABLE_CACHE ? JSON.parse(localStorage.getItem(cacheKey) ?? 'null') : null) as {
		time: number;
		data: Record<string, unknown>;
	} | null;

	if (cached && Date.now() - cached.time < 3600000) {
		return cached.data;
	}

	if (pendingRequests.has(repoURL)) {
		return pendingRequests.get(repoURL) as Promise<Record<string, unknown>>;
	}

	const requestPromise = (async (): Promise<Record<string, unknown>> => {
		const response = await fetch(repoURL, {
			headers: { 'User-agent': 'Mozilla/4.0 Custom User Agent' },
		});
		const data = (await response.json()) as Record<string, unknown>;
		if (ENABLE_CACHE) localStorage.setItem(cacheKey, JSON.stringify({ data, time: Date.now() }));
		return data;
	})();

	pendingRequests.set(repoURL, requestPromise);
	try {
		return await requestPromise;
	} finally {
		pendingRequests.delete(repoURL);
	}
};

const updateCard = async (script: HTMLElement, ENABLE_CACHE: boolean): Promise<void> => {
	const repoURL = script.getAttribute('data-repo-url');
	const repoId = script.getAttribute('data-repo-id');
	if (!repoURL || !repoId) return;

	const platform = (Object.keys(platforms) as Platform[]).find((p) => repoId.startsWith(p)) || 'github';
	const mapping = platforms[platform];

	Object.values(mapping).forEach((elementSuffix) => {
		const element = document.getElementById(`${repoId}-${elementSuffix}`);
		if (element && element.innerHTML.trim() !== '') {
			const formatted = formatMetric(element.innerHTML.trim());
			if (formatted !== element.innerHTML.trim()) {
				element.innerHTML = String(formatted);
			}
		}
	});

	if (repoId.startsWith('forgejo')) {
		console.log('fetch-repo.js: Forgejo server blocks cross-origin requests.');
		return;
	}

	try {
		const data = await fetchRepoData(repoURL, ENABLE_CACHE);

		Object.entries(mapping).forEach(([dataField, elementSuffix]) => {
			const element = document.getElementById(`${repoId}-${elementSuffix}`);
			if (element) {
				let value: unknown = data[dataField];
				const processor = processors[platform]?.[dataField];
				if (processor) value = processor(value);
				value = formatMetric(value);
				if (value != null && value !== '' && (typeof value === 'string' || typeof value === 'number'))
					element.innerHTML = String(value);
			}
		});
	} catch (error) {
		console.error('fetch-repo.js:', error);
	}
};

export default function (el: HTMLElement): void {
	consent.onReady(() => {
		void updateCard(el, consent.isGranted('functional'));
	});
}
