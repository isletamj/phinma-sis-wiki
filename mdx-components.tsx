import { Callout, Steps } from 'nextra/components'
import { useMDXComponents as getNextraComponents } from 'nextra-theme-docs'
import { Section } from './app/_components/section'
import { YouTube } from './app/_components/youtube'

// Registered here so MDX files can use these without importing them per file.
// `Section`/`YouTube` are ours; `Callout`/`Steps` are Nextra's built-ins, used
// by the docs pages for admonitions and numbered procedures.
const themeComponents = getNextraComponents({
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
