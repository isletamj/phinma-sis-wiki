import nextra from 'nextra'

const withNextra = nextra({})

/** @type {import('next').NextConfig} */
export default withNextra({
  output: 'export',
  experimental: {
    // The documented switch for React's <ViewTransition>, which morphs a
    // changelog entry's title from the feed into its permalink. Measured as a
    // no-op in Next 16.2.10 — the morph works without it — but kept because
    // it's the supported contract and a future version gating this would fail
    // silently, as a cut rather than an error. See the note in CLAUDE.md.
    viewTransition: true
  },
  images: {
    // Required: the export fails without this, since there is no
    // server around to run Next's image optimizer.
    unoptimized: true
  },
  turbopack: {
    resolveAlias: {
      'next-mdx-import-source-file': './mdx-components.tsx'
    }
  }
})
