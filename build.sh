#!/usr/bin/env bash

set -euo pipefail

build_temp_dir=""

cleanup() {
  if [[ -n "${build_temp_dir}" && -d "${build_temp_dir}" ]]; then
    rm -rf "${build_temp_dir}"
  fi
}

trap cleanup EXIT SIGINT SIGTERM

HUGO_DEPLOY_ENV="${HUGO_DEPLOY_ENV:-staging}"
HUGO_CACHEDIR="${PWD}/.cache/hugo"

HUGO_VERSION=0.166.0
GO_VERSION=1.25.0
MINIMAL_CONFIG=false
SKIP_PAGEFIND=false
SKIP_PDF=false
BASE_URL=""

CUSTOM_CACHE_DIR="${HUGO_CACHEDIR}/__custom__"

export HUGO_CACHEDIR
export GOPATH="${CUSTOM_CACHE_DIR}/go-pkg"
export GOMODCACHE="${GOPATH}/pkg/mod"
export PLAYWRIGHT_BROWSERS_PATH="${CUSTOM_CACHE_DIR}/playwright"
export TZ=Asia/Taipei
export HUGO_DEPLOY_ENV
echo "Deploy environment: ${HUGO_DEPLOY_ENV}"

main() {
  # Parse arguments
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --base-url)
        if [[ -z "${2:-}" ]]; then
          echo "--base-url requires a value" >&2
          exit 1
        fi
        BASE_URL="$2"
        shift 2
        ;;
      --minimal-config)
        MINIMAL_CONFIG=true
        shift
        ;;
      --skip-pagefind)
        SKIP_PAGEFIND=true
        shift
        ;;
      --skip-pdf)
        SKIP_PDF=true
        shift
        ;;
      *)
        echo "Unknown argument: $1" >&2
        exit 1
        ;;
    esac
  done

  mkdir -p "${CUSTOM_CACHE_DIR}"

  # Install Go
  if [[ -x "${CUSTOM_CACHE_DIR}/go-${GO_VERSION}/go/bin/go" ]]; then
    echo "Using cached Go ${GO_VERSION}..."
  else
    echo "Installing Go ${GO_VERSION}..."
    build_temp_dir=$(mktemp -d)
    pushd "${build_temp_dir}" > /dev/null
    curl -sLJO "https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz"
    mkdir -p "${CUSTOM_CACHE_DIR}/go-${GO_VERSION}"
    tar -C "${CUSTOM_CACHE_DIR}/go-${GO_VERSION}" -xf "go${GO_VERSION}.linux-amd64.tar.gz"
    popd > /dev/null
    rm -rf "${build_temp_dir}"
    build_temp_dir=""
  fi
  export PATH="${CUSTOM_CACHE_DIR}/go-${GO_VERSION}/go/bin:${PATH}"

  # Install Hugo
  if [[ -x "${CUSTOM_CACHE_DIR}/hugo-${HUGO_VERSION}/hugo" ]]; then
    echo "Using cached Hugo ${HUGO_VERSION}..."
  else
    echo "Installing Hugo ${HUGO_VERSION}..."
    build_temp_dir=$(mktemp -d)
    pushd "${build_temp_dir}" > /dev/null
    curl -sLJO "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz"
    mkdir -p "${CUSTOM_CACHE_DIR}/hugo-${HUGO_VERSION}"
    tar -C "${CUSTOM_CACHE_DIR}/hugo-${HUGO_VERSION}" -xf "hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz"
    popd > /dev/null
    rm -rf "${build_temp_dir}"
    build_temp_dir=""
  fi
  export PATH="${CUSTOM_CACHE_DIR}/hugo-${HUGO_VERSION}:${PATH}"

  # Install Node.js dependencies
  # should set SKIP_DEPENDENCY_INSTALL=1 in cloudflare "Variables and secrets"
  if [[ "${SKIP_PAGEFIND}" == "true" ]]; then
    echo "Skip PageFind."
  else
    pnpm install --prod --frozen-lockfile --ignore-scripts
  fi

  # Install PDF dependencies and Playwright browser
  if [[ "${SKIP_PDF}" == "true" ]]; then
    echo "Skipping PDF dependencies (--skip-pdf set)."
  else
    pnpm install --dir scripts/pdf --ignore-workspace --frozen-lockfile --ignore-scripts
    if compgen -G "${PLAYWRIGHT_BROWSERS_PATH}/chromium-*" > /dev/null; then
      echo "Using cached Playwright Chromium..."
    else
      echo "Installing Playwright Chromium..."
      pnpm --dir scripts/pdf --ignore-workspace exec playwright install --with-deps chromium
    fi
  fi

  # Verify installations
  echo "Verifying installations..."
  echo Go: "$(go version)"
  echo Hugo: "$(hugo version)"

  # Configure Git
  echo "Configuring Git..."
  git config core.quotepath false
  # not using .GitInfo anymore
  # if [ "$(git rev-parse --is-shallow-repository)" = "true" ]; then
  #   git fetch --unshallow
  # fi

  # Apply minimal config if requested
  if [[ "${MINIMAL_CONFIG}" == "true" ]]; then
    echo "Applying minimal config for build testing..."
    cat > exampleSite/hugo.yaml << 'EOF'
baseURL: https://example.org/
title: My New Hugo Project

module:
  workspace: hugo-yore-doc.work
  imports:
    - path: github.com/ZhenShuo2021/hugo-yore
    - path: github.com/ZhenShuo2021/hugo-knowledge-graph

# Below are used to suppress unnecessary warnings
ignoreLogs: ["warning-goldmark-raw-html", "fetch-fail"]
languages:
  en:
    contentDir: content/en
    locale: en
  zh-tw:
    contentDir: content/zh-tw
    locale: zh-tw
EOF
  fi

  # Build the site
  # MUST use `-d` for the cache to work
  echo "Building the site..."
  cd exampleSite
  hugo mod get
  if [[ -n "${BASE_URL}" ]]; then
    hugo -d ../public --gc --minify --baseURL "${BASE_URL}"
  else
    hugo -d ../public --gc --minify
  fi
  cd ..

  # Run Pagefind indexing
  if [[ "${SKIP_PAGEFIND}" == "true" ]]; then
    echo "Skipping Pagefind indexing (--skip-pagefind set)."
  else
    echo "Running Pagefind indexing..."
    pnpm pagefind --site public
    echo "Pagefind indexing complete."
  fi

  # Build PDF
  # Must run after Pagefind so the PDF is written into the finished site
  if [[ "${SKIP_PDF}" == "true" ]]; then
    echo "Skipping PDF build (--skip-pdf set)."
  else
    echo "Building PDF..."
    if [[ -n "${BASE_URL}" ]]; then
      node scripts/pdf/build-pdf.js --site public --start /docs/ --out public/docs.pdf --base "${BASE_URL}"
    else
      node scripts/pdf/build-pdf.js --site public --start /docs/ --out public/docs.pdf
    fi
    echo "PDF build complete."
  fi
}

main "$@"
