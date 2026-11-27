#!/usr/bin/env bash
# Provide the system libraries Playwright's Chromium needs, without root.
#
# Usage: chromium-libs.sh <playwright browsers dir> <private libs dir>
#
# Prints the directory to put on LD_LIBRARY_PATH, or nothing when the host already has every library.
# Everything else goes to stderr. Fails when a library is still missing afterwards.
#
# Build images without root access, such as Cloudflare Workers Builds, cannot run
# `playwright install --with-deps`. The packages are downloaded with the host's apt into a private
# apt state and unpacked into a private folder, so no system file is written.
set -euo pipefail

browsers_dir="${1:?missing playwright browsers dir}"
libs_dir="${2:?missing private libs dir}"

# Ubuntu 24.04 packages that ship the libraries Chromium links against and the build image lacks.
# Re-check with ldd when Playwright's Chromium revision changes.
packages=(
  libatk1.0-0t64
  libatk-bridge2.0-0t64
  libatspi2.0-0t64
  libasound2t64
  libxcomposite1
  libxdamage1
  libxfixes3
  libxi6
  libxrandr2
  libxkbcommon0
)

log() { echo "[chromium-libs] $*" >&2; }

# The binary that chromium.launch() starts by default
chrome="$(find "${browsers_dir}" -type f -name chrome-headless-shell 2>/dev/null | head -n 1)"
if [[ -z "${chrome}" ]]; then
  chrome="$(find "${browsers_dir}" -type f -name chrome 2>/dev/null | head -n 1)"
fi
if [[ -z "${chrome}" ]]; then
  log "No Chromium binary found under ${browsers_dir}"
  exit 1
fi

triplet="$(uname -m)-linux-gnu"
lib_path="${libs_dir}/root/usr/lib/${triplet}"

# Libraries ldd cannot find, one per line. $1 is a directory to search first, may be empty.
missing_libs() {
  local out
  if [[ -n "${1}" ]]; then
    out="$(LD_LIBRARY_PATH="${1}${LD_LIBRARY_PATH:+:${LD_LIBRARY_PATH}}" ldd "${chrome}" 2>&1 || true)"
  else
    out="$(ldd "${chrome}" 2>&1 || true)"
  fi
  awk '/=> not found/ {print $1}' <<< "${out}"
}

missing="$(missing_libs "")"
if [[ -z "${missing}" ]]; then
  log "The host provides every library Chromium needs"
  exit 0
fi
log "Chromium cannot load: $(tr '\n' ' ' <<< "${missing}")"

if [[ -z "$(missing_libs "${lib_path}")" ]]; then
  log "Using libraries fetched earlier in ${lib_path}"
  echo "${lib_path}"
  exit 0
fi

for tool in apt-get dpkg-deb; do
  if ! command -v "${tool}" > /dev/null; then
    log "${tool} is required to fetch the libraries but was not found"
    exit 1
  fi
done

rm -rf "${libs_dir}"
mkdir -p "${libs_dir}/apt/lists/partial" "${libs_dir}/apt/cache/archives/partial" "${libs_dir}/debs" "${libs_dir}/root"
apt_opts=(
  -q
  -o "Dir::State::lists=${libs_dir}/apt/lists"
  -o "Dir::Cache=${libs_dir}/apt/cache"
  -o "Dir::Cache::archives=${libs_dir}/apt/cache/archives"
  -o "APT::Sandbox::User=$(id -un)"
)

log "Fetching ${packages[*]} with apt (private state, no root)"
apt-get "${apt_opts[@]}" update >&2
(cd "${libs_dir}/debs" && apt-get "${apt_opts[@]}" download "${packages[@]}" >&2)
for deb in "${libs_dir}/debs/"*.deb; do
  dpkg-deb --extract "${deb}" "${libs_dir}/root"
done

still_missing="$(missing_libs "${lib_path}")"
if [[ -n "${still_missing}" ]]; then
  log "Still missing after fetching: $(tr '\n' ' ' <<< "${still_missing}")"
  log "Add the package that ships it to the packages list in $0"
  exit 1
fi

log "Libraries ready in ${lib_path}"
echo "${lib_path}"
