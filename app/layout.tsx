import Adsense from '@/components/Adsense/ScriptAdSense'
import { CookieConsent } from '@/components/cookie-consent'
import { Navbar } from '@/components/navbar'
import { Toaster } from '@/components/ui/sonner'
import { config } from '@/lib/config'
import { ThemeProvider } from 'next-themes'
import type React from 'react'
import './globals.css'

export const metadata = {
  title: 'Okupado - Comunidad contra la okupación ilegal',
  description:
    'Plataforma comunitaria para reportar y visualizar edificios con inquiokupas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <Adsense pId={config.GOOGLE_PID} />
        <meta name="google-adsense-account" content={config.GOOGLE_PID}></meta>
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
          <CookieConsent />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
