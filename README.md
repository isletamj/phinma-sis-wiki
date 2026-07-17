# msph-phinma-changelog

Changelog and docs site for the PHINMA SIS platform.

Built with [Nextra 4](https://nextra.site) (Next.js App Router) + Tailwind CSS,
exported as a static site and hosted on Cloudflare Pages.

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export into out/, then builds the search index
```

Search only works against a real build, never in `dev`:

```bash
npm run build && npx serve out
```

## Adding a changelog entry

Create one MDX file per release in `content/changelog/`, named by date:

```
content/changelog/2026-07-15.mdx
```

```mdx
---
title: Batch enrollment processing
date: 2026-07-15
---

Short description of the headline change.

<Section title="New">
- What got added
</Section>
```

The changelog page picks it up automatically and sorts it newest-first —
there is nothing to register. The file is also its own permalink at
`/changelog/2026-07-15`.

`<Section>` renders a collapsed-by-default panel. `<YouTube id="..." />`
embeds a video. Both are available in any MDX file without importing.

## Images and video

Put images in `public/images/changelog/`, compressed to WebP
([squoosh.app](https://squoosh.app)) before committing, and reference them as
`/images/changelog/....`

Video is **not** self-hosted — upload to YouTube as Unlisted and embed with
`<YouTube id="..." />`, so video bandwidth never touches our hosting.

## Deployment

Pushes to `main` deploy automatically via Cloudflare Pages:

| Setting          | Value           |
| ---------------- | --------------- |
| Build command    | `npm run build` |
| Output directory | `out`           |
| Node version     | `22`            |

Pull requests get preview URLs.
