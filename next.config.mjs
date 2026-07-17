import nextra from 'nextra'

const withNextra = nextra({})

/** @type {import('next').NextConfig} */
export default withNextra({
  output: 'export',
  images: {
    // Required: the export fails without this, since there is no
    // server around to run Next's image optimizer.
    unoptimized: true
  },
  turbopack: {
    resolveAlias: {
      'next-mdx-import-source-file': './mdx-components.tsx'
    }
  }
})
