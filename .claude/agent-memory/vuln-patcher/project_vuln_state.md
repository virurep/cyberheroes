---
name: cyberheroes vulnerability state as of 2026-04-09
description: Current vuln count, what was fixed, and what remains unfixable without react-scripts migration
type: project
---

**Baseline (before 2026-04-09 session):** 33 vulnerabilities (0 critical, 19 high, 5 moderate, 9 low). Build was also broken due to missing react-router-dom.

**After session:** 26 vulnerabilities (0 critical, 14 high, 3 moderate, 9 low). Build passes.

**What was done:**
- Removed `bootstrap` ^5.3.5 (dead dependency, never imported)
- Removed `web-vitals` ^2.1.4 (dead dependency, never imported; reportWebVitals.js was empty)
- Added `react-router-dom` ^6.30.3 (was imported throughout src/ but missing from package.json — pre-existing broken build)
- `npm audit fix` bumped 10 transitive packages (brace-expansion, flatted, lodash, node-forge, path-to-regexp, picomatch, underscore chain, yaml, etc.)

**Commit:** 9e1721e

**Remaining 26 vulns — all unfixable without react-scripts migration:**
- nth-check (high) GHSA-rp65-9cf3-cjxr — via svgo → @svgr/plugin-svgo → @svgr/webpack → react-scripts
- serialize-javascript (high) GHSA-5c6j-r48x-rmvq, GHSA-qj8w-gfj5-8c6v — via rollup-plugin-terser / css-minimizer-webpack-plugin → react-scripts
- webpack-dev-server (moderate) GHSA-9jgg-88mc-972h, GHSA-4v9v-hfq4-rm2v — directly in react-scripts
- postcss (moderate) GHSA-7fh5-64p2-3v2j — via resolve-url-loader → react-scripts
- @tootallnate/once (low) GHSA-vpq2-c234-7xj6 — via jsdom → jest-environment-jsdom → react-scripts (npm misleadingly says "fix available via npm audit fix" but it is actually blocked by react-scripts jest pin)
- underscore (high) GHSA-qpx9-hpmf-5gmw — via jsonpath → bfj → react-scripts (same npm false-positive issue)
- workbox-build / workbox-webpack-plugin (high) — via react-scripts
- @svgr/webpack, @svgr/plugin-svgo, css-minimizer-webpack-plugin, svgo, css-select (high) — all via react-scripts
- jest chain (low): @jest/core, jest, jest-cli, jest-config, jest-environment-jsdom, jest-runner, jsdom, http-proxy-agent — all pinned by react-scripts

**Resolution path:** Migrate from CRA (react-scripts) to Vite. This will eliminate all 26 remaining vulnerabilities.
