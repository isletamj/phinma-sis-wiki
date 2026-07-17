import type { Heading } from 'nextra'
import { normalizePages } from 'nextra/normalize-pages'
import { getPageMap } from 'nextra/page-map'

export type ChangelogEntry = {
  name: string
  route: string
  title: string
  date: string
}

/** Every changelog entry, newest first. */
export async function getEntries(): Promise<ChangelogEntry[]> {
  const { directories } = normalizePages({
    list: await getPageMap('/changelog'),
    route: '/changelog'
  })

  return directories
    .flatMap(entry => {
      const { title, date } = entry.frontMatter ?? {}
      // Skips the index page and anything missing the frontmatter we sort on.
      if (entry.name === 'index' || typeof date !== 'string') return []
      return [
        {
          name: entry.name,
          route: entry.route,
          title: typeof title === 'string' ? title : entry.name,
          date
        }
      ]
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/** Anchor id for an entry's heading in the inlined feed. */
export const entrySlug = (name: string): string => `entry-${name}`

/**
 * Pairs an entry's title in the feed with the same title on its permalink, so
 * the browser morphs one into the other on navigation. Unique per entry: the
 * feed renders every title at once, and duplicate names abort the transition.
 */
export const entryTitleTransition = (name: string): string =>
  `entry-title-${name}`

/**
 * The feed's headings, as Nextra's table of contents expects them. The entries
 * are rendered at runtime, so Nextra can't extract these from the MDX itself.
 */
export async function getEntriesToc(): Promise<Heading[]> {
  const entries = await getEntries()

  return entries.map(({ name, date }) => ({
    id: entrySlug(name),
    value: formatDate(date),
    depth: 2
  }))
}

/** "2026-07-15" -> "July 15, 2026" */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  })
}
