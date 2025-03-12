import { CookieConsent } from "@/components/cookie-consent"
import { Navbar } from "@/components/navbar"
import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/sonner"
import type React from "react"
import "./globals.css"


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

