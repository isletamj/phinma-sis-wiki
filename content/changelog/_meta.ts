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
  '*': {
    theme: {
      sidebar: false,
      breadcrumb: false,
      pagination: false
    }
  }
}
