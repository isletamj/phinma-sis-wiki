import Link from 'next/link'
import { importPage } from 'nextra/pages'
import type { FC } from 'react'
import { formatDate, getEntries } from './get-entries'

/**
 * Renders every changelog entry inline, newest first — each entry's MDX is
 * imported and rendered here, while still living at its own permalink.
 */
export const ChangelogFeed: FC = async () => {
  const entries = await getEntries()

  // Each entry has to be awaited, so resolve them all before rendering.
  const rendered = await Promise.all(
    entries.map(async entry => {
      const { default: MDXContent } = await importPage(['changelog', entry.name])
      return { ...entry, MDXContent }
    })
  )

  return (
    <div className="mt-8 flex flex-col gap-16">
      {rendered.map(({ name, route, title, date, MDXContent }) => (
        <article key={name}>
          <time
            dateTime={date}
            className="text-sm text-gray-500 dark:text-neutral-400"
          >
            {formatDate(date)}
          </time>
          <h2 className="mt-1 mb-4 text-2xl font-bold tracking-tight">
            <Link href={route} className="hover:underline">
              {title}
            </Link>
          </h2>
          <MDXContent />
        </article>
      ))}
    </div>
  )
}
