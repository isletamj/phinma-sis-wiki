import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { ViewTransition } from 'react'
import { useMDXComponents as getMDXComponents } from '../../mdx-components'
import {
  entryTitleTransition,
  formatDate,
  getEntriesToc
} from '../_components/get-entries'

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

  // Entries are written as body-only fragments so the feed can supply their
  // heading without rendering it twice — which leaves their own permalinks with
  // nothing to title them. Nextra's `metadata` is the parsed frontmatter, so the
  // title and date come back from the same place the feed sorts on.
  const isChangelogEntry =
    params.mdxPath?.length === 2 && params.mdxPath[0] === 'changelog'

  // `$NextraMetadata` is a fixed shape, but at runtime `metadata` is the whole
  // parsed frontmatter — `date` is our own field and Nextra can't know about it.
  const { date } = metadata as typeof metadata & { date: string }

  const content = <MDXContent {...props} params={params} />

  return (
    <Wrapper
      toc={isChangelogIndex ? await getEntriesToc() : toc}
      metadata={metadata}
      sourceCode={sourceCode}
    >
      {isChangelogEntry ? (
        <>
          {/* Pushed well clear of the breadcrumb: it and the date are both small
              muted text, so close together they read as one block. */}
          <header className="mt-8 mb-8">
            <time
              dateTime={date}
              className="text-sm text-neutral-500 dark:text-neutral-400"
            >
              {formatDate(date)}
            </time>
            {/* Morphs from the matching <h2> in the feed. Colour is set
                explicitly: our own elements would otherwise inherit the muted
                body copy colour. */}
            <ViewTransition
              name={entryTitleTransition(params.mdxPath[1])}
              share="morph"
              default="none"
            >
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                {metadata.title}
              </h1>
            </ViewTransition>
          </header>
          {content}
        </>
      ) : (
        content
      )}
    </Wrapper>
  )
}
