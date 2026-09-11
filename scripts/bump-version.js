#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const pkgPath = path.join(rootDir, 'package.json');
const themePath = path.join(rootDir, 'data/theme.yaml');

function bumpVersion(version, type) {
	const [major, minor, patch] = version.split('.').map(Number);
	if (type === 'major') return `${major + 1}.0.0`;
	if (type === 'minor') return `${major}.${minor + 1}.0`;
	return `${major}.${minor}.${patch + 1}`;
}

function updatePackageJson(newVersion) {
	const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
	pkg.version = newVersion;
	writeFileSync(pkgPath, JSON.stringify(pkg, null, '\t') + '\n');
}

function updateThemeYaml(newVersion) {
	const raw = readFileSync(themePath, 'utf8');
	const updated = raw.replace(/^yoreVersion:\s*.*$/m, `yoreVersion: ${newVersion}`);
	writeFileSync(themePath, updated);
}

function commitAndTag(version) {
	execSync(`git add ${pkgPath} ${themePath}`, { cwd: rootDir, stdio: 'inherit' });
	execSync(`git commit -m "chore: bump version to ${version}"`, { cwd: rootDir, stdio: 'inherit' });
	execSync(`git tag -a v${version} -m v${version}`, { cwd: rootDir, stdio: 'inherit' });
}

function main() {
	const type = process.argv[2];
	const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
	const newVersion = bumpVersion(pkg.version, type);

	updatePackageJson(newVersion);
	updateThemeYaml(newVersion);
	commitAndTag(newVersion);

	console.log(`${pkg.version} -> ${newVersion}`);
}

main();
