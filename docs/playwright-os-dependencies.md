# Playwright OS dependencies (apt-get)

Some environments (CI runners, minimal containers) do not include the OS libraries Playwright needs to launch its browsers. This repo includes a script to install a minimal set of Debian/Ubuntu packages.

## Install

From the repository workspace root:

```bash
sudo bash ./scripts/install-playwright-os-deps.sh
```

## What gets installed

The script installs the following packages:

- `libatk1.0-0`
- `libatk-bridge2.0-0`
- `libcups2`
- `libatspi2.0-0`
- `libxdamage1`
- `libgbm1`
- `libxkbcommon0`
- `libasound2`

## Notes

- The script uses `apt-get install -y --no-install-recommends` for automation and smaller installs.
- This only installs OS libraries. You still need Playwright (and browser downloads) in your Node.js project when you actually run Playwright tests.
