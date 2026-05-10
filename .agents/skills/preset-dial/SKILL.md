---
name: preset-dial
description: Add or update Easy Speed Dial site presets and preset SVG thumbnails. Use when adding a new preset entry in src/lib/sitePresets.ts, importing a thumbnail from src/assets/thumbnails, normalizing a preset thumbnail SVG viewBox, or stripping unnecessary SVG metadata from a thumbnail.
metadata:
  short-description: Add Easy Speed Dial presets
---

# Preset Dial

Use this skill when adding a new preset site to Easy Speed Dial.

## Workflow

1. Inspect nearby presets in `src/lib/sitePresets.ts` and choose the closest existing pattern for naming, category, color, hostname aliases, and `showInPopularSitesModal`.
2. Add the thumbnail asset in `src/assets/thumbnails`. Prefer SVG unless the source asset is inherently raster.
   - When reusing an existing thumbnail asset, do not assume it is already normalized. Inspect its `viewBox` and visual bounds against a similar existing preset before adding or wiring the preset.
3. Clean SVG thumbnails before committing:

   ```bash
   python3 .agents/skills/preset-dial/scripts/clean_svg.py src/assets/thumbnails/example.svg
   ```

4. Normalize thumbnail sizing in the SVG `viewBox`, not dial CSS. Use a centered square canvas with enough padding for the mark to visually match existing thumbnails of the same type.
5. Add the thumbnail import in `src/lib/sitePresets.ts`, keeping imports alphabetized by file/source name.
6. Add the preset entry in `sitePresets`, keeping the existing object order and style. Use a stable camelCase key matching the import name.
7. Run validation:

   ```bash
   npm run tsc
   npm run lint
   ```

## Preset Entry Rules

- `url`: canonical public URL, including `https://`.
- `title`: display name users should see.
- `color`: choose a brand-appropriate tile background. Existing preset colors are literal brand values; do not invent CSS variables for this data unless the project changes the preset schema.
- `image`: the imported thumbnail identifier.
- `category`: reuse an existing category when it fits: `AI`, `Developer`, `Entertainment`, `Food`, `Games`, `News`, `Photos`, `Productivity`, `Reference`, `Search`, `Shopping`, `Smart Home`, `Social`, or `Travel`.
- `hostnames`: add only when useful for matching alternate domains, app subdomains, regional domains, or legacy hostnames.
- `showInPopularSitesModal: false`: use for long-tail, niche, duplicate, regional, or less broadly popular presets. Omit it for presets that should appear in the popular sites modal.

## SVG Cleanup

The cleaner removes common editor/export metadata while preserving rendering-critical nodes and attributes.

Remove or avoid:

- XML declarations, doctypes, comments, and generator comments.
- `<metadata>`, `<title>`, `<desc>`, and editor-specific nodes such as named views.
- Editor namespaces and attributes: Inkscape, Sodipodi, Adobe, Sketch, Figma metadata attributes, `data-name`, `version`, root `width`, and root `height`.
- Unused root `class` values only when they are clearly editor metadata. Do not remove `class` attributes that are used by SVG-internal `<style>` rules or otherwise affect rendering.

Preserve:

- `xmlns`, `viewBox`, `fill`, paths, shapes, masks, clips, gradients, filters, class attributes used for styling, and IDs referenced by `url(#...)`, `href`, `clip-path`, `mask`, `filter`, or similar functional attributes.
- Brand colors inside the SVG artwork.

## ViewBox Sizing

- Use a centered square canvas.
- For icon-style marks, match the existing dial icon visual size.
- For full-square icons, use Instagram as the reference treatment: `viewBox="-333.33 -333.33 1200 1200"`.
- For wordmarks, wide marks, or tall marks, keep a centered square canvas but size the artwork to match the existing non-icon thumbnail group, not the smaller icon group.
- Do not compensate for bad SVG sizing with component CSS.

## Verification

Before finishing, compare the new thumbnail against a similar existing thumbnail by opening the SVG text and, when practical, viewing it in the running app or generated browser preview. Confirm the mark is centered, not clipped, and visually consistent with its group.
