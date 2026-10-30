---
name: sandbox-env
description: Sandbox-only setup for Hugo, Tailwind, and the i18n script. Use only when running inside the sandboxed environment.
---

All commands below are sandbox-only.

```sh
# Install Hugo
HUGO_VERSION=$(grep HUGO_VERSION ./build.sh | head -1 | grep -oP '[\d.]+')
mkdir -p ~/bin && curl -sL "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz" | tar xz -C ~/bin hugo
export PATH=~/bin:$PATH

# Install Tailwind and tools
mkdir -p ~/tw && cd ~/tw && npm init -y && npm i tailwindcss@4 @tailwindcss/cli@4 @tailwindcss/typography @tailwindcss/forms js-yaml lodash prettier@3.9
ln -s ~/tw/node_modules ~/hugo-yore/node_modules

# Build a test site (replaces exampleSite)
mkdir -p /tmp/testsite/content && cd /tmp/testsite
printf 'baseURL: http://localhost/\ntitle: test\ntheme: hugo-yore\nthemesDir: /home/claude\n' > hugo.yaml
printf -- '---\ntitle: home\n---\n' > content/_index.md
hugo -d /tmp/pub

# Rebuild CSS
cd ~/hugo-yore && ~/tw/node_modules/.bin/tailwindcss -i assets/yore/core/tailwind/main.css -o assets/yore/core/tailwind/compiled.css

# i18n (the script's final pnpm step will error, ignore it, run prettier manually)
node scripts/manage-i18n.js
~/tw/node_modules/.bin/prettier --no-config --single-quote --tab-width 2 --print-width 112 --prose-wrap always --write i18n/*.yaml
git checkout scripts/i18n_input.txt
```
