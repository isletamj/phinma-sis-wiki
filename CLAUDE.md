# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev                  # dev server on :3000
npm run build                # static export to out/ + pagefind index (postbuild)
npm run build && npx serve out   # the only way to test search
```

There is no test suite or linter configured. `next build` runs `tsc`, so a
type error fails the build.

## Architecture

Nextra 4 docs theme on Next.js App Router, statically exported (`output: 'export'`)
for Cloudflare Pages. There is no server at runtime — everything is HTML/CSS/JS
on a CDN, which is what keeps hosting free.

**Content lives in `content/`, not `app/`.** `app/[[...mdxPath]]/page.tsx` is a
catch-all that maps every `content/**/*.mdx` file to a route via Nextra's
`importPage`. Adding an MDX file is all it takes to add a page; `_meta.ts` files
control titles and nav placement.

**The changelog feed** is the only non-obvious piece. Each release is one file
(`content/changelog/2026-07-15.mdx`) with `title` + `date` frontmatter, and is
both a standalone permalink *and* an inlined section of `/changelog`:

- `app/_components/get-entries.ts` — reads the page map for `/changelog` via
  `getPageMap` + `normalizePages`, drops the index, sorts by frontmatter `date`.
- `app/_components/changelog-feed.tsx` — async server component that
  `importPage`s each entry's MDX and renders it inline, newest-first.
  Entries must be resolved with `Promise.all`; an async `.map` callback returns
  promises, not elements.

**Custom MDX components** (`Section`, `YouTube`) are registered globally in
`mdx-components.tsx`, so MDX files use them without importing. `Section` is the
collapsible accordion, built on native `<details>`/`<summary>` — that's where
collapsed-by-default and keyboard support come from, so don't reach for a JS
accordion library.

## Constraints that drove the setup

Keep it free and zero-egress-cost. Video is never self-hosted (YouTube Unlisted
via `<YouTube>`); images are hand-compressed WebP in `public/images/`.

MJ is learning web dev — prefer conventional, boring patterns over clever ones.

## Version landmines

These are load-bearing; changing them breaks the build in non-obvious ways.

- **`zod` is pinned to `~4.3.6` via `overrides`.** zod 4.4.0 made required
  `z.custom()` keys reject `undefined`, which breaks `nextra-theme-docs`'
  `<Layout>`: it destructures `children` out of props, then validates the rest
  against a schema that still requires `children`. Nextra 4.6.1 asks for
  `^4.1.12`, so npm otherwise resolves 4.4.x and *every page 500s* with
  `Invalid input: expected nonoptional, received undefined`. Remove the override
  only after verifying upstream fixed the schema.
- **Do not use `display: 'hidden'` in `content/changelog/_meta.ts`.** It hides
  entries from the sidebar but makes their own permalinks throw
  `Cannot read properties of undefined (reading 'route')` — the page gets
  dropped from the tree it renders against. The section uses
  `theme: { sidebar: false }` instead.
- **`next.config.mjs` needs `nextra({})`**, not `nextra()` — the config
  validator rejects `undefined`.
- **`turbopack.resolveAlias['next-mdx-import-source-file']`** must point at
  `./mdx-components.tsx`. Next 16 defaults to Turbopack, and MDX rendering
  breaks without it.
- **`images.unoptimized: true`** is mandatory or the static export fails.
- **Pagefind** indexes `out/` (`--site out`), despite Nextra's static-export
  docs showing `.next/server/app`.

Nextra 4 is App Router only — Pages Router would mean Nextra 3.3.1, which is
unmaintained. Don't "restore" the Pages Router.
