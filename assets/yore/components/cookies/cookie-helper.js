// The state is derived from the same source
// (meta flag, window.CookieConsent, cc:* events), so copies stay in sync.

const consentRequired = () => document.documentElement.getAttribute('data-cookie-enabled') === 'true';
const consentCallbacks = [];
let consentCategories = null;
let consentInited = false;

function setCategories(categories) {
	consentCategories = categories;
	consentCallbacks.splice(0).forEach((fn) => fn());
}

function initConsent() {
	if (consentInited) return;
	consentInited = true;

	if (!consentRequired()) {
		setCategories(
			new Proxy([], {
				has: () => true,
				get: (t, p) => (p === 'includes' ? () => true : t[p]),
			}),
		);
		return;
	}

	// bundle loaded after consent was already resolved
	try {
		const cc = window.CookieConsent;
		if (cc?.validConsent?.()) setCategories(cc.getCookie('categories'));
	} catch {}

	window.addEventListener('cc:onConsent', ({ detail }) => setCategories(detail.cookie.categories));
	window.addEventListener('cc:onChange', ({ detail }) => {
		consentCategories = detail.cookie.categories;
	});
}

export const consent = {
	isGranted: (category = 'functional') => {
		initConsent();
		return consentCategories?.includes(category) ?? false;
	},
	onReady: (fn) => {
		initConsent();
		if (consentCategories !== null) {
			fn();
			return;
		}
		consentCallbacks.push(fn);
	},
};
