import { useMDXComponents as getNextraComponents } from 'nextra-theme-docs'
import { Section } from './app/_components/section'
import { YouTube } from './app/_components/youtube'

// Registered here so MDX files can use <Section> and <YouTube> without
// importing them in every entry.
const themeComponents = getNextraComponents({
  Section,
  YouTube
})

export function useMDXComponents(components?: Record<string, unknown>) {
  return {
    ...themeComponents,
    ...components
  }
}
