---
name: vuln patching workflow notes for cyberheroes
description: Patterns and gotchas learned while patching this specific repo
type: feedback
---

npm audit fix --force must never be used. The react-scripts 5.0.1 pin is load-bearing; --force would install react-scripts@0.0.0 (a placeholder/broken version) and destroy the build.

**Why:** The CRA toolchain is brittle; react-scripts@0.0.0 is not a real release, it is what npm resolves to when the semver constraint is broken by force-installing incompatible peers.

**How to apply:** Always check whether npm audit's "fix available" note says "--force" before acting. If it does, treat it as unfixable in place.

npm audit sometimes reports "fix available via npm audit fix" (without --force) for packages that are actually blocked by react-scripts' internal peer dependency constraints. Running npm audit fix a second time will say "up to date" and change nothing. This is a known npm false-positive. The @tootallnate/once and underscore/bfj chains exhibit this behavior in this repo.

**How to apply:** If npm audit fix says "up to date" on the second run but vulns remain, they are effectively in the same category as --force items — do not attempt manual overrides.
