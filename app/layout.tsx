import type { Metadata } from 'next'
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import type { FC, ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'PHINMA SIS Changelog',
    template: '%s – PHINMA SIS'
  },
  description: 'Changes and updates to the PHINMA SIS platform.'
}

const navbar = <Navbar logo={<b>PHINMA SIS</b>} />

const footer = <Footer>{new Date().getFullYear()} © PHINMA SIS.</Footer>

const RootLayout: FC<{ children: ReactNode }> = async ({ children }) => (
  <html lang="en" dir="ltr" suppressHydrationWarning>
    <Head />
    <body>
      <Layout
        navbar={navbar}
        footer={footer}
        pageMap={await getPageMap()}
        docsRepositoryBase="https://github.com/isletamj/msph-phinma-changelog/tree/main"
        editLink="Edit this page on GitHub"
      >
        {children}
      </Layout>
    </body>
  </html>
)

export default RootLayout
