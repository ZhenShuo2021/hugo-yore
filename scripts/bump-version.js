#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const pkgPath = path.join(rootDir, 'package.json');
const themePath = path.join(rootDir, 'data/theme.yaml');
const pdfPkgPath = path.join(rootDir, 'scripts/pdf/package.json');
const pdfDocPath = path.join(rootDir, 'exampleSite/content/en/docs/200-features/300-pdf-export/index.md');

function bumpVersion(version, type) {
	const [major, minor, patch] = version.split('.').map(Number);
	if (type === 'major') return `${major + 1}.0.0`;
	if (type === 'minor') return `${major}.${minor + 1}.0`;
	return `${major}.${minor}.${patch + 1}`;
}

function updatePackageJson(filePath, newVersion) {
	const pkg = JSON.parse(readFileSync(filePath, 'utf8'));
	pkg.version = newVersion;
	writeFileSync(filePath, JSON.stringify(pkg, null, '\t') + '\n');
}

function updateThemeYaml(newVersion) {
	const raw = readFileSync(themePath, 'utf8');
	const updated = raw.replace(/^yoreVersion:\s*.*$/m, `yoreVersion: ${newVersion}`);
	writeFileSync(themePath, updated);
}

function updatePdfDoc(newVersion) {
	const raw = readFileSync(pdfDocPath, 'utf8');
	const pattern = /releases\/download\/v[\d.]+\/hugo-yore-pdf-[\d.]+\.tgz/;
	if (!pattern.test(raw)) throw new Error(`PDF install URL not found in ${pdfDocPath}`);
	writeFileSync(pdfDocPath, raw.replace(pattern, `releases/download/v${newVersion}/hugo-yore-pdf-${newVersion}.tgz`));
}

function commitAndTag(version) {
	execSync(`git add ${pkgPath} ${themePath} ${pdfPkgPath} ${pdfDocPath}`, { cwd: rootDir, stdio: 'inherit' });
	execSync(`git commit -m "chore: bump version to ${version}"`, { cwd: rootDir, stdio: 'inherit' });
	execSync(`git tag -a v${version} -m v${version}`, { cwd: rootDir, stdio: 'inherit' });
}

function main() {
	const type = process.argv[2];
	const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
	const newVersion = bumpVersion(pkg.version, type);

	updatePackageJson(pkgPath, newVersion);
	updatePackageJson(pdfPkgPath, newVersion);
	updateThemeYaml(newVersion);
	updatePdfDoc(newVersion);
	commitAndTag(newVersion);

	console.log(`${pkg.version} -> ${newVersion}`);
}

main();
