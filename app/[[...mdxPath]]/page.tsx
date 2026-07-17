import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../mdx-components'
import { getEntriesToc } from '../_components/get-entries'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

type PageProps = Readonly<{
  params: Promise<{ mdxPath: string[] }>
}>

export async function generateMetadata(props: PageProps) {
  const params = await props.params
  const { metadata } = await importPage(params.mdxPath)
  return metadata
}

const Wrapper = getMDXComponents().wrapper

export default async function Page(props: PageProps) {
  const params = await props.params
  const {
    default: MDXContent,
    toc,
    metadata,
    sourceCode
  } = await importPage(params.mdxPath)

  // The changelog index renders its entries at runtime via <ChangelogFeed />, so
  // the compiled MDX has no headings to build a table of contents from.
  const isChangelogIndex =
    params.mdxPath?.length === 1 && params.mdxPath[0] === 'changelog'

  return (
    <Wrapper
      toc={isChangelogIndex ? await getEntriesToc() : toc}
      metadata={metadata}
      sourceCode={sourceCode}
    >
      <MDXContent {...props} params={params} />
    </Wrapper>
  )
}
