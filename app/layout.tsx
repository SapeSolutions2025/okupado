import Adsense from '@/components/Adsense/ScriptAdSense'
import { CookieConsent } from '@/components/cookie-consent'
import { Navbar } from '@/components/navbar'
import { Toaster } from '@/components/ui/sonner'
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
        <Adsense pId={'ca-pub-9478860631244349'} />
        <meta
          name="google-adsense-account"
          content={'ca-pub-9478860631244349'}
        ></meta>
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
