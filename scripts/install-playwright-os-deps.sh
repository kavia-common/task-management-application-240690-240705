#!/usr/bin/env bash
set -euo pipefail

# Installs OS libraries commonly required by Playwright browsers on Debian/Ubuntu images.
# This script is intended for CI runners / ephemeral dev environments.
#
# Non-interactive usage:
#   ./scripts/install-playwright-os-deps.sh
#
# Notes:
# - Uses --no-install-recommends to keep images small and installs deterministic.
# - Does not install Playwright itself; it only installs OS-level libraries.

export DEBIAN_FRONTEND=noninteractive

PACKAGES=(
  libatk1.0-0
  libatk-bridge2.0-0
  libcups2
  libatspi2.0-0
  libxdamage1
  libgbm1
  libxkbcommon0
  libasound2
)

# Update apt metadata (required in fresh containers) then install libs
apt-get update -y
apt-get install -y --no-install-recommends "${PACKAGES[@]}"

# Reduce layer size when used in images/CI (safe no-op if dirs absent)
rm -rf /var/lib/apt/lists/*
