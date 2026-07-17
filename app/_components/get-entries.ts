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

/** "2026-07-15" -> "July 15, 2026" */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  })
}
