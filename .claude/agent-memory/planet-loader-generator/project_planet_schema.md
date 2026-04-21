---
name: Planet manifest schema
description: Actual fields in planet manifest.json files differ from initial assumptions — uses name/slug/order, not planet_id/display_name
type: project
---

The planet manifest.json schema uses `name` (not `display_name`) and `slug` (not `planet_id`). Key fields: slug, name, title, order, active, theme (object with primary/secondary/background/accent), icon, intro (object), parts (array). Privacy Moon additionally has `parent_planet_slug`.

**Why:** The user's initial prompt mentioned `planet_id` and `display_name` but the actual files use different field names. The loader validates against the real schema.

**How to apply:** When generating or modifying code that references manifest fields, always check the actual file content rather than relying on the prompt's field name assumptions.
