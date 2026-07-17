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

Most UI work is not type-checkable and needs to be looked at in a browser, not
inferred from the diff — see the font landmine below for a change that builds
clean while doing nothing.

## Branches

MJ develops on `dev` — branch from it and merge back into it. `main` is the
repo's default branch but is not where work lands.

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

## Moving the theme switch (deferred, but already investigated)

Putting the light/dark control in the header was scoped out once, on cost. If it
comes back, these are the traps — all found by reading compiled
`node_modules/nextra-theme-docs@4.6.1`, so they are expensive to re-derive and
none of them are in the docs:

- **`<Layout darkMode={false}>` is a visibility flag, not a feature flag.** It
  does not disable dark mode; `ThemeProvider` renders regardless. But it makes
  *every* `ThemeSwitch` return null — **including one you add yourself** — so
  "disable the built-in, add my own" cannot work with the theme's own export.
  Write a custom switch composing `Select` (`nextra/components`), `useMounted`
  (`nextra/hooks`), and `useTheme` (re-exported from `nextra-theme-docs` — do
  not import `next-themes` directly, it is not in our `package.json`).
- **The switch renders in three places**, not one: the desktop sidebar footer,
  the mobile drawer footer, and — easy to miss — the *page* footer, which only
  appears when the sidebar is hidden, i.e. exactly on `/changelog`.
  `darkMode: false` clears all three at once, which is why it beats CSS.
- **Nextra's `ThemeSwitch` opens its dropdown upward.** It calls `Select`
  without an `anchor`, inheriting the `{ to: 'top start' }` default that suits a
  switch pinned to the sidebar's *bottom*. From the navbar, pass
  `anchor={{ to: 'bottom end' }}`.
- **Hiding the top-level nav links must be done in CSS**, not `display: 'hidden'`
  in `content/_meta.ts` — see the landmine below. Note the cost: `type: 'page'`
  entries are excluded from the desktop sidebar by `normalizePages`, so hiding
  them strands `/docs` on desktop (the logo still reaches Home). Mobile is fine;
  the drawer renders the full tree.

Stable, unprefixed hooks for CSS: `.nextra-navbar`, `.nextra-search`,
`.nextra-sidebar-footer`, `.nextra-scrollbar`. Everything else in that markup is
a compiled `x:` utility and unsafe to target.

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
- **To change the font, override `--x-font-sans`, not just `--font-sans`.**
  Nextra ships its *own* `x:`-prefixed Tailwind build alongside ours, and its
  font resolves `html { font-family: var(--x-default-font-family) }` →
  `--x-default-font-family: var(--x-font-sans)`. Setting only `--font-sans`
  touches our utilities and nothing else. This one fails *silently* — the build
  passes and the page renders, just in the system stack. The override in
  `app/globals.css` must also stay **after** the `@import`s: it beats Nextra's
  own `:root` on source order, not specificity. Verify with a computed style
  check (`getComputedStyle(document.body).fontFamily`), never by eye — Inter and
  the default system stack are near-identical at a glance.

Nextra 4 is App Router only — Pages Router would mean Nextra 3.3.1, which is
unmaintained. Don't "restore" the Pages Router.
