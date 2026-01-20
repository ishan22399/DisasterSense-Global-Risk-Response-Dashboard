import type { Metadata } from 'next'
import { Inter, Geist } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist'
})

export const metadata: Metadata = {
  title: 'DisasterSense | Global Risk & Response Dashboard',
  description: 'A real-time disaster intelligence platform with live alerts, predictive analytics, and actionable insights — built for resilience and readiness.',
  generator: 'DisasterSense by Ishan Shivankar',
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="https://cdn-icons-png.flaticon.com/128/17235/17235414.png" type="image/png" />
      </head>
      <body className={`${inter.variable} ${geist.variable} font-sans`}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
