const toggle = document.getElementById('mobile-menu-toggle');
const overlay = document.getElementById('mobile-menu-overlay');
const close = document.getElementById('mobile-menu-close');

if (toggle && overlay && close) {
	function openMenu() {
		overlay.showModal();
		toggle.setAttribute('aria-expanded', 'true');
	}

	function closeMenu() {
		overlay.close();
		toggle.setAttribute('aria-expanded', 'false');
	}

	toggle.addEventListener('click', openMenu);
	close.addEventListener('click', closeMenu);

	// dialog 原生支援 Esc 關閉，但那是瀏覽器內部觸發的 close()，不會經過 closeMenu()
	// 用 'close' 事件同步 aria-expanded，涵蓋 Esc 關閉與任何其他觸發 close() 的路徑
	overlay.addEventListener('close', () => {
		toggle.setAttribute('aria-expanded', 'false');
	});

	// 點擊背景關閉：用 mousedown 座標判斷是否落在 dialog 內容框之外
	// 不用 e.target === overlay 比對，避免內部元素點擊事件冒泡誤判成點了背景
	// （這個判斷法在另一支 a11y 面板的 dialog 上曾經誤攔截內部點擊，導致 checkbox 失效）
	overlay.addEventListener('mousedown', (e) => {
		const rect = overlay.getBoundingClientRect();
		const clickedOutside =
			e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom;

		if (clickedOutside && overlay.open) {
			closeMenu();
		}
	});
}

export {};
