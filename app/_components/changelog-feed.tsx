import Link from 'next/link'
import { importPage } from 'nextra/pages'
import { ViewTransition, type FC } from 'react'
import {
  entrySlug,
  entryTitleTransition,
  formatDate,
  getEntries
} from './get-entries'

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
    // No `gap` between entries: the dates below are sticky within their own
    // article, so a gap would leave a stretch of scrolling with no date at all.
    // Each article carries its own `pb-16` instead, and the dates hand off.
    <div className="mt-8 flex flex-col">
      {rendered.map(({ name, route, title, date, MDXContent }) => (
        <article
          key={name}
          className="pb-16 lg:grid lg:grid-cols-[9rem_minmax(0,44rem)] lg:gap-x-10"
        >
          {/* `self-start` is load-bearing: a grid item stretches to its row by
              default, which leaves `sticky` nothing to move within. */}
          <time
            dateTime={date}
            className="text-sm text-neutral-500 lg:sticky lg:top-[calc(var(--nextra-navbar-height)+2rem)] lg:self-start dark:text-neutral-400"
          >
            {formatDate(date)}
          </time>
          {/* MDXContent renders a list of siblings, so the column needs a
              wrapper — otherwise every paragraph becomes its own grid item. */}
          <div>
            {/* Morphs into the <h1> on the entry's own permalink. `default="none"`
                keeps the other entries' titles still: without it every title on
                the page animates, not just the one clicked. */}
            <ViewTransition
              name={entryTitleTransition(name)}
              share="morph"
              default="none"
            >
              <h2
                id={entrySlug(name)}
                className="mt-1 mb-4 scroll-mt-(--nextra-navbar-height) text-2xl font-bold tracking-tight text-neutral-900 lg:mt-0 dark:text-neutral-100"
              >
                <Link href={route} className="hover:underline">
                  {title}
                </Link>
              </h2>
            </ViewTransition>
            <MDXContent />
          </div>
        </article>
      ))}
    </div>
  )
}
