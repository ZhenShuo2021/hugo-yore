const fetchRepo = async () => {
	const ENABLE_CACHE = true;
	const script = document.querySelector('script[data-repo-id]');
	const repoURL = script?.getAttribute('data-repo-url');
	const repoId = script?.getAttribute('data-repo-id');

	if (!repoURL || !repoId) return;

	const formatMetric = (n) => {
		if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
		if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K';
		return n;
	};

	const platforms = {
		github: {
			full_name: 'full_name',
			description: 'description',
			stargazers_count: 'stargazers',
			forks: 'forks',
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

	const platform = Object.keys(platforms).find((p) => repoId.startsWith(p)) || 'github';
	const mapping = platforms[platform];

	Object.values(mapping).forEach((elementSuffix) => {
		const element = document.getElementById(`${repoId}-${elementSuffix}`);
		if (element && element.innerHTML.trim() !== '') {
			const formatted = formatMetric(element.innerHTML.trim());
			if (formatted !== element.innerHTML.trim()) {
				element.innerHTML = formatted;
			}
		}
	});

	if (repoId.startsWith('forgejo')) {
		console.log('fetch-repo.js: Forgejo server blocks cross-origin requests.');
		return;
	}

	const processors = {
		huggingface: {
			description: (value) => value?.replace(/Dataset Card for .+?\s+Dataset Summary\s+/, '').trim() || value,
		},
	};

	try {
		const cacheKey = `repo-cache-${repoId}`;
		const cached = ENABLE_CACHE ? JSON.parse(localStorage.getItem(cacheKey)) : null;
		let data;

		// cache 1 hour
		if (cached && Date.now() - cached.time < 3600000) {
			data = cached.data;
		} else {
			const response = await fetch(repoURL, {
				headers: { 'User-agent': 'Mozilla/4.0 Custom User Agent' },
			});
			data = await response.json();
			if (ENABLE_CACHE) localStorage.setItem(cacheKey, JSON.stringify({ data, time: Date.now() }));
		}

		Object.entries(mapping).forEach(([dataField, elementSuffix]) => {
			const element = document.getElementById(`${repoId}-${elementSuffix}`);
			if (element) {
				let value = data[dataField];
				if (processors[platform]?.[dataField]) value = processors[platform][dataField](value);
				value = formatMetric(value);
				if (value != null && value !== '') element.innerHTML = value;
			}
		});
	} catch (error) {
		console.error(`fetch-repo.js: ${error}`);
	}
};

fetchRepo();
