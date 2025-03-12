import { CookieConsent } from "@/components/cookie-consent"
import { Navbar } from "@/components/navbar"
import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/sonner"
import type React from "react"
import "./globals.css"
import Adsense from "@/components/Adsense/ScriptAdSense"
import { config } from "@/lib/config"


export const metadata = {
  title: "Okupado - Comunidad contra la okupación ilegal",
  description: "Plataforma comunitaria para reportar y visualizar edificios con inquiokupas",
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
      </head>
      <body >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Navbar />
          {children}
          <CookieConsent />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}

