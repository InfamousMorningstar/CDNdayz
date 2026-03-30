import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { cn } from '@/lib/utils'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { EasterEggs } from '@/components/layout/EasterEggs'
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CDN - Premium DayZ PvE Network',
  description: 'Join the ultimate PvE survival experience. Custom events, thriving community, and zero toxic behavior.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body 
        className={cn(
          "min-h-screen bg-background font-sans antialiased text-foreground selection:bg-red-500/20",
          inter.variable
        )}
        suppressHydrationWarning
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-black focus:text-white focus:px-4 focus:py-2 focus:rounded focus:ring-2 focus:ring-red-500"
        >
          Skip to main content
        </a>
        <div className="relative flex min-h-screen flex-col">
          <Navbar />
          <main id="main-content" className="flex-1 relative z-10">{children}</main>
          <Footer />
          <EasterEggs />
          <div className="fixed inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
        </div>
        <Analytics />
      </body>
    </html>
  )
}
