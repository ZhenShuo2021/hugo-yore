import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, cpSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';

const THEME_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FIXTURES_DIR = join(THEME_ROOT, 'tests/fixtures');
const WORK_DIR = join(process.env.RUNNER_TEMP ?? tmpdir(), 'yore-build-tests');

console.log('Working directory:' + WORK_DIR + '\n');

let passed = 0;
let failed = 0;

function setupSite(fixtureName) {
	const siteDir = join(WORK_DIR, fixtureName);
	rmSync(siteDir, { recursive: true, force: true });
	execSync(`hugo new site "${siteDir}" --quiet`);
	execSync(`rm -f "${join(siteDir, 'hugo.toml')}"`);

	const themeDir = join(siteDir, 'themes/hugo-yore');
	mkdirSync(themeDir, { recursive: true });
	cpSync(THEME_ROOT, themeDir, {
		recursive: true,
		filter: (src) => {
			const rel = src.slice(THEME_ROOT.length + 1);
			return !rel.startsWith('node_modules') && !rel.startsWith('.git') && !rel.startsWith('exampleSite');
		},
	});

	execSync(
		`git clone https://github.com/ZhenShuo2021/hugo-knowledge-graph "${join(siteDir, 'themes/hugo-knowledge-graph')}" --depth=1`,
		{ stdio: 'inherit' },
	);

	const fixtureDir = join(FIXTURES_DIR, fixtureName);
	cpSync(join(fixtureDir, 'hugo.yaml'), join(siteDir, 'hugo.yaml'));
	cpSync(join(fixtureDir, 'content'), join(siteDir, 'content'), { recursive: true });

	return siteDir;
}

function buildSite(siteDir) {
	execSync(`hugo --source "${siteDir}" --quiet`, { stdio: 'pipe' });
}

function assert(siteDir, urlPath, absent = false) {
	const exists = existsSync(join(siteDir, 'public', urlPath));
	const ok = absent ? !exists : exists;
	if (ok) {
		console.log(`  PASS  ${absent ? '(absent) ' : ''}${urlPath}`);
		passed++;
	} else {
		console.log(`  FAIL  ${absent ? '(should be absent) ' : ''}${urlPath}`);
		failed++;
	}
}

function runTest(fixtureName, assertions) {
	console.log(`\n[TEST] ${fixtureName}`);
	const siteDir = setupSite(fixtureName);
	buildSite(siteDir);
	for (const { path, absent } of assertions) {
		assert(siteDir, path, absent ?? false);
	}
}

rmSync(WORK_DIR, { recursive: true, force: true });
mkdirSync(WORK_DIR, { recursive: true });

console.log(`Hugo: ${execSync('hugo version').toString().trim()}`);

runTest('versioning-only', [
	{ path: 'docs/feature-a/index.html' }, // v2.0.0 default, shared with v1
	{ path: 'docs/feature-b/index.html' }, // v2.0.0 default, v2 only
	{ path: 'v1.0.0/docs/feature-a/index.html' }, // v1.0.0, shared with v2
	{ path: 'v1.0.0/docs/feature-b/index.html', absent: true }, // v2-only page absent in v1 (version switcher hidden)
	{ path: 'v2.0.0/docs/feature-b/index.html', absent: true }, // default must not appear under own prefix
]);

runTest('multilingual-dir-version', [
	{ path: 'docs/feature-a/index.html' }, // v2.0.0 en, shared with v1
	{ path: 'docs/feature-b/index.html' }, // v2.0.0 en, v2 only
	{ path: 'zh-cn/docs/feature-a/index.html' }, // v2.0.0 zh-cn, shared with v1
	{ path: 'zh-cn/docs/feature-b/index.html' }, // v2.0.0 zh-cn, v2 only
	{ path: 'v1.0.0/docs/feature-a/index.html' }, // v1.0.0 en, shared with v2
	{ path: 'v1.0.0/zh-cn/docs/feature-a/index.html' }, // v1.0.0 zh-cn, shared with v2
	{ path: 'v1.0.0/docs/feature-b/index.html', absent: true }, // v2-only page absent in v1 en
	{ path: 'v1.0.0/zh-cn/docs/feature-b/index.html', absent: true }, // v2-only page absent in v1 zh-cn
	{ path: 'blog/post-en/index.html' }, // non-versioned blog, en
	{ path: 'v1.0.0/blog/post-en/index.html' }, // non-versioned blog in v1.0.0
	{ path: 'zh-cn/blog/post-en/index.html' }, // en fallback under zh-cn
	{ path: 'v1.0.0/zh-cn/blog/post-en/index.html' }, // en fallback under v1.0.0 zh-cn
	{ path: 'zh-cn/blog/post-zh/index.html' }, // zh-cn native post
	{ path: 'blog/post-zh/index.html', absent: true }, // zh-cn post must not appear under en
	{ path: 'v2.0.0/docs/feature-b/index.html', absent: true }, // default must not appear under own prefix
]);

runTest('filename-version', [
	{ path: 'docs/feature-a/index.html' }, // v2.0.0 en, shared with v1
	{ path: 'docs/feature-b/index.html' }, // v2.0.0 en, v2 only
	{ path: 'fr/docs/feature-a/index.html' }, // v2.0.0 fr, shared with v1
	{ path: 'fr/docs/feature-b/index.html' }, // v2.0.0 fr, v2 only
	{ path: 'v1.0.0/docs/feature-a/index.html' }, // v1.0.0 en, shared with v2
	{ path: 'v1.0.0/fr/docs/feature-a/index.html' }, // v1.0.0 fr, shared with v2
	{ path: 'v1.0.0/docs/feature-b/index.html', absent: true }, // v2-only page absent in v1 en
	{ path: 'v1.0.0/fr/docs/feature-b/index.html', absent: true }, // v2-only page absent in v1 fr
	{ path: 'v2.0.0/docs/feature-b/index.html', absent: true }, // default must not appear under own prefix
]);

console.log('');
if (failed === 0) {
	console.log(`All ${passed} assertions passed.`);
	process.exit(0);
} else {
	console.log(`${failed} assertion(s) failed, ${passed} passed.`);
	process.exit(1);
}
