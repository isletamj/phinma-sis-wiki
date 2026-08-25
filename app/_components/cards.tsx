import Link from 'next/link'
import type { FC, ReactNode } from 'react'

/**
 * A grid of link cards, used for the index pages (`/` and `/docs`) where a
 * bulleted list of links reads as an afterthought.
 *
 * Nextra ships its own `<Cards>` in `nextra/components`, deliberately not used
 * here: it renders a card's children *above* its title (they're meant to be
 * images), so there's nowhere for a description to sit, and it colours hover
 * with `slate`, which we avoid — see CLAUDE.md, "Text colour".
 */
export const Cards: FC<{ children: ReactNode }> = ({ children }) => (
  // `mt-6` matches the top margin Nextra gives a <p>, so the grid keeps the
  // page's vertical rhythm when it follows a paragraph in MDX.
  //
  // `max-w-3xl` is doing real work: Nextra's <article> is `w-full` with no
  // content-width cap, so on `/` — which has no sidebar — two cards would
  // stretch to ~535px each on a 1440px screen and read as empty boxes. The cap
  // holds a card near 376px on both pages. On `/docs` the sidebar already
  // narrows the column to roughly this, so it barely bites there.
  <div className="mt-6 grid max-w-3xl gap-4 sm:grid-cols-2">{children}</div>
)

/**
 * One card. The whole card is the link.
 *
 * `description` is a prop rather than children on purpose: MDX parses the body
 * of a block-level JSX element as markdown, so children would arrive wrapped in
 * Nextra's <p> — bringing its `mt-6` and prose line-height inside the card.
 */
export const Card: FC<{
  title: string
  description?: string
  href: string
}> = ({ title, description, href }) => (
  // Palette matches <Section> (app/_components/section.tsx) so the two read as
  // the same family. `no-underline`/`text-current` aren't needed: this is
  // `next/link` directly, not the MDX `a` Nextra styles blue and underlined.
  <Link
    href={href}
    className="group flex flex-col rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:border-gray-300 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700 dark:hover:bg-neutral-800 dark:focus-visible:outline-neutral-500"
  >
    {/* Set explicitly — our own elements would otherwise inherit the muted
        body-copy colour that globals.css puts on prose. */}
    <span className="flex items-center gap-2 font-medium text-neutral-900 dark:text-neutral-100">
      {title}
      {/* `inline-block` is load-bearing: transforms don't apply to a plain
          inline element, so the hover nudge would silently do nothing. */}
      <span
        aria-hidden="true"
        className="ms-auto inline-block text-neutral-400 transition-transform group-hover:translate-x-0.5 dark:text-neutral-500"
      >
        &rarr;
      </span>
    </span>
    {description && (
      // A <span>, not a <p>: globals.css colours `main p` unlayered, which
      // would outrank any utility class set here.
      <span className="mt-1.5 block text-sm text-neutral-600 dark:text-neutral-400">
        {description}
      </span>
    )}
  </Link>
)
