// The changelog index already lists every entry, so the whole section runs
// without a sidebar; the index keeps a toc, which `page.tsx` fills with one
// link per entry date. (Nextra 4.6.1 note: `display: 'hidden'` would be the
// obvious way to keep entries out of the nav, but it makes their own
// permalinks throw — the page gets dropped from the tree it renders against.)
export default {
  index: {
    title: 'Changelog',
    theme: {
      sidebar: false,
      toc: true,
      breadcrumb: false,
      pagination: false
    }
  },
  // Entries run without a sidebar, so the breadcrumb is the only thing telling
  // you which release you're on and how to get back to the feed. `type: 'page'`
  // on `changelog` in the parent `_meta.ts` doesn't reach here — `normalizePages`
  // re-reads this file for the children and they resolve to `type: 'doc'`, which
  // is what lets the breadcrumb render at all (it's skipped on `page` types).
  '*': {
    theme: {
      sidebar: false,
      breadcrumb: true,
      pagination: false
    }
  }
}
