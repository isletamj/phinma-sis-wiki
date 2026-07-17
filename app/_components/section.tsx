import type { FC, ReactNode } from 'react'

/**
 * A collapsible section for changelog entries ("New", "Improvements", ...).
 *
 * Built on native <details>/<summary>, which gives us collapsed-by-default
 * state, keyboard support and open-on-find-in-page for free.
 */
export const Section: FC<{ title: string; children: ReactNode }> = ({
  title,
  children
}) => (
  <details className="group my-3 rounded-lg border border-gray-200 bg-gray-50 dark:border-neutral-800 dark:bg-neutral-900">
    <summary className="cursor-pointer list-none rounded-lg px-4 py-2.5 font-medium select-none hover:bg-gray-100 dark:hover:bg-neutral-800">
      <span className="mr-2 inline-block transition-transform group-open:rotate-90">
        &rsaquo;
      </span>
      {title}
    </summary>
    <div className="border-t border-gray-200 px-4 py-1 dark:border-neutral-800">
      {children}
    </div>
  </details>
)
