import { Callout, Steps } from 'nextra/components'
import { useMDXComponents as getNextraComponents } from 'nextra-theme-docs'
import { Card, Cards } from './app/_components/cards'
import { Section } from './app/_components/section'
import { YouTube } from './app/_components/youtube'

// Registered here so MDX files can use these without importing them per file.
// `Cards`/`Card`/`Section`/`YouTube` are ours; `Callout`/`Steps` are Nextra's
// built-ins, used by the docs pages for admonitions and numbered procedures.
// Note `Cards` shadows an unused Nextra export of the same name — ours is the
// one registered here, see app/_components/cards.tsx for why.
const themeComponents = getNextraComponents({
  Cards,
  Card,
  Section,
  YouTube,
  Callout,
  Steps
})

export function useMDXComponents(components?: Record<string, unknown>) {
  return {
    ...themeComponents,
    ...components
  }
}
