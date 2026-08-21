function cookieConsentConfig(tools) {
	// Custom category example
	// ========== Marketing ==========
	tools.addCategory({
		name: 'example_marketing',
		categoryConfig: {
			enabled: false,
			readOnly: false,
			autoClear: {
				cookies: [
					{
						name: /^_fbp|_fb/,
						domain: '.example.com',
					},
					{
						name: 'marketing_consent',
						path: '/shop',
					},
				],
				reloadPage: true,
			},
			services: {
				'Facebook Pixel': {
					onAccept: () => {
						console.log('FB Pixel accepted');
					},
					onReject: () => {
						console.log('FB Pixel disabled');
					},
					cookies: [{ name: /^_fbp/ }],
				},
				'Google Ads': {
					onAccept: () => {},
					onReject: () => {},
				},
			},
		},
	});

	// ========== Social Media ==========
	tools.addCategory({
		name: 'example_social_media',
		categoryConfig: {
			enabled: false,
			autoClear: {
				cookies: [{ name: /^__twitter_/ }, { name: /^__ytplayer_/ }, { name: /^__linkedin_/ }],
			},
		},
	});
}

export default cookieConsentConfig;
