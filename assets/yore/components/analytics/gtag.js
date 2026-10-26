window.dataLayer = window.dataLayer || [];
function gtag() {
	dataLayer.push(arguments);
}
gtag('js', new Date());

const gtagDataset = document.currentScript.dataset;
const gtagId = gtagDataset.id;
const gtagSendPageView = gtagDataset.sendPageView;
const gtagConfig = gtagSendPageView === 'false' ? { send_page_view: false } : {};
gtag('config', gtagId, gtagConfig);
