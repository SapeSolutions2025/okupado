'use client'

import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '@/components/ui/button'
import { Building, FileText } from 'lucide-react'
import Link from 'next/link'

export function Navbar() {
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
        </div>
      </div>
    </header>
  )
}
