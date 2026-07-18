'use client'

import { Button, Select } from 'nextra/components'
import { useCopy } from 'nextra/hooks'
import {
  ArrowRightIcon,
  ChatGPTIcon,
  CheckIcon,
  ClaudeIcon,
  CopyIcon,
  FileIcon,
  LinkArrowIcon
} from 'nextra/icons'
import type { FC, SVGProps } from 'react'

// A drop-in clone of nextra-theme-docs' built-in <CopyPage> (see
// node_modules/nextra-theme-docs/dist/components/copy-page.js), reproduced here
// so we can add a fourth "Export to PDF" option — the original hardcodes its
// three options with no way to extend them. The built-in is disabled via
// `copyPageButton={false}` on <Layout> in app/layout.tsx. Markup and `x:`
// utility classes are kept identical so it looks the same as the theme's.
// PDF export is the browser's own print-to-PDF (window.print()), which keeps
// the site fully static; app/globals.css has the @media print rules.

type ItemProps = {
  icon: FC<SVGProps<SVGSVGElement>>
  title: string
  description: string
  isExternal?: boolean
}

const Item: FC<ItemProps> = ({ icon: Icon, title, description, isExternal }) => (
  <div className="x:flex x:gap-3 x:items-center">
    <Icon width="16" />
    <div className="x:flex x:flex-col">
      <span className="x:font-medium x:flex x:gap-1">
        {title}
        {isExternal && <LinkArrowIcon height="1em" />}
      </span>
      <span className="x:text-xs">{description}</span>
    </div>
  </div>
)

export const CopyPage: FC<{ sourceCode: string }> = ({ sourceCode }) => {
  // `isCopied` flips true when the Copy-page option runs and auto-resets after
  // 2s (nextra's useCopy), driving the primary button's "Copied" feedback.
  const { copy, isCopied } = useCopy()

  // Shared by the desktop dropdown and the mobile FAB. The primary desktop
  // button prints directly; everything else routes through here.
  const handleSelect = (value: string) => {
    if (value === 'copy') {
      copy(sourceCode)
      return
    }
    if (value === 'pdf') {
      // Defer so the dropdown closes before the print dialog captures the page —
      // otherwise the open popover shows up in the PDF. The print CSS in
      // globals.css hides it too, as a belt-and-suspenders.
      setTimeout(() => window.print(), 0)
      return
    }
    const url =
      value === 'chatgpt'
        ? 'chatgpt.com/?hints=search&prompt'
        : 'claude.ai/new?q'
    const query = `Read from ${location.href} so I can ask questions about it.`
    window.open(`https://${url}=${encodeURIComponent(query)}`, '_blank')
  }

  const options = [
    {
      id: 'copy',
      name: (
        <Item
          icon={CopyIcon}
          title="Copy page"
          description="Copy page as Markdown for LLMs"
        />
      )
    },
    {
      id: 'chatgpt',
      name: (
        <Item
          icon={ChatGPTIcon}
          title="Open in ChatGPT"
          description="Ask questions about this page"
          isExternal
        />
      )
    },
    {
      id: 'claude',
      name: (
        <Item
          icon={ClaudeIcon}
          title="Open in Claude"
          description="Ask questions about this page"
          isExternal
        />
      )
    },
    {
      id: 'pdf',
      name: (
        <Item
          icon={FileIcon}
          title="Export to PDF"
          description="Save this page as a PDF"
        />
      )
    }
  ]

  return (
    <>
      {/* Desktop (md+): split button. Primary action is Export to PDF; the
          dropdown carries all four options. `max-md:hidden` + `inline-flex` are
          our own Tailwind build (unprefixed) and MUST both be ours: Nextra's
          `x:inline-flex` is emitted later in the cascade, so it would beat our
          `max-md:hidden` (equal specificity) and the button would stay visible
          on mobile — showing beside the FAB. The remaining `x:` classes don't
          set `display`, so they're safe to keep from the original. */}
      <div className="phinma-copy-page max-md:hidden inline-flex x:border x:rounded-md x:items-stretch nextra-border x:float-end x:overflow-hidden">
        <Button
          className={({ hover }) =>
            [
              'x:ps-2 x:pe-1 x:flex x:gap-2 x:text-sm x:font-medium x:items-center',
              isCopied && 'x:opacity-70',
              hover &&
                'x:bg-gray-200 x:text-gray-900 x:dark:bg-primary-100/5 x:dark:text-gray-50'
            ]
              .filter(Boolean)
              .join(' ')
          }
          onClick={() => window.print()}
        >
          {isCopied ? (
            <CheckIcon width="16" className="text-green-500" />
          ) : (
            <FileIcon width="16" />
          )}
          {isCopied ? 'Copied' : 'Export to PDF'}
        </Button>
        <Select
          anchor={{ to: 'bottom end', gap: 10 }}
          className="x:rounded-none"
          options={options}
          value=""
          selectedOption={<ArrowRightIcon width="12" className="x:rotate-90" />}
          onChange={handleSelect}
        />
      </div>

      {/* Mobile (< md): a single floating icon button (bottom-right FAB). Out of
          flow, so it never forces the page title to wrap; tapping it opens the
          same four options upward. All-unprefixed utilities: our Tailwind build
          generates them (Nextra's `x:` build would silently drop invented ones).
          `nextra-border` is a plain always-present class for the border colour. */}
      <div className="phinma-copy-page md:hidden fixed bottom-6 right-6 z-30 flex rounded-md border nextra-border bg-white/70 dark:bg-neutral-900/70 backdrop-blur-md shadow-lg p-1.5">
        {/* `rounded-md` on the container matches both the dropdown popover and
            the Select button's own `x:rounded-md`, so the open/focus highlight
            fills the button instead of poking out of a circle. The translucent
            bg + backdrop-blur mirror the header nav's frosted look. Copying from
            the FAB menu swaps the icon to a subtle green check for feedback. */}
        <Select
          anchor={{ to: 'top end', gap: 10 }}
          className="rounded-md"
          options={options}
          value=""
          selectedOption={
            isCopied ? (
              <CheckIcon width="20" className="text-green-500" />
            ) : (
              <FileIcon width="20" />
            )
          }
          onChange={handleSelect}
        />
      </div>
    </>
  )
}
