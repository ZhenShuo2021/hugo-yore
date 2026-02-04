// Usage example
//
// scripts/i18n_input.txt

// en:
// + menu.home Home
// + menu.login Login
// - old.key
//
// zh-TW:
// + menu.home 首頁
// + menu.login 登入
// - old.key
//
// ja:
// + menu.home ホーム
// + menu.login ログイン
// - old.key

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const _ = require('lodash');

const I18N_DIR = path.join(__dirname, '../i18n');
const INPUT_FILE = path.join(__dirname, 'i18n_input.txt');

function manageI18n() {
	if (!fs.existsSync(INPUT_FILE)) {
		console.error(`Input file not found: ${INPUT_FILE}`);
		return;
	}

	const input = fs.readFileSync(INPUT_FILE, 'utf8');
	const sections = input.split(/^[a-z-A-Z]+:\s*$/m);
	const langs = input.match(/^[a-z-A-Z]+(?=:\s*$)/gm);

	if (!langs) {
		console.error("No language sections found (e.g., 'en:', 'zh-TW:').");
		return;
	}

	langs.forEach((lang, index) => {
		const filePath = path.join(I18N_DIR, `${lang}.yaml`);
		let content = {};

		if (fs.existsSync(filePath)) {
			content = yaml.load(fs.readFileSync(filePath, 'utf8')) || {};
		}

		const lines = sections[index + 1]
			.split('\n')
			.map((l) => l.trim())
			.filter(Boolean);

		lines.forEach((line) => {
			const action = line[0];
			const contentPart = line.slice(1).trim();

			if (action === '+') {
				const firstSpace = contentPart.indexOf(' ');
				if (firstSpace === -1) return;
				const key = contentPart.slice(0, firstSpace).trim();
				const value = contentPart.slice(firstSpace).trim();
				_.set(content, key, value);
			} else if (action === '-') {
				_.unset(content, contentPart);
			}
		});

		if (!fs.existsSync(I18N_DIR)) fs.mkdirSync(I18N_DIR, { recursive: true });

		fs.writeFileSync(
			filePath,
			yaml.dump(content, {
				indent: 2,
				sortKeys: true,
				lineWidth: -1,
			}),
		);

		console.log(`Successfully updated: ${lang}.yaml`);
	});
}

manageI18n();
