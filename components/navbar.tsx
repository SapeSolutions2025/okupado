"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, FileText, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <Building className="h-5 w-5 text-primary" />
            <span>Okupado</span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <Button asChild>
            <Link href="/reportar" className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">Reportar incidencia</span>
              <span className="sm:hidden">Reportar</span>
            </Link>
          </Button>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-4">
            <Link
              href="/reportar"
              className="flex items-center gap-2 py-2 text-sm font-medium hover:text-primary"
              onClick={() => setIsMenuOpen(false)}
            >
              <FileText className="h-4 w-4" />
              Reportar incidencia
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

