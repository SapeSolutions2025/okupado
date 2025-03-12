"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function HeroBanner() {
  const [query, setQuery] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/busqueda?q=${encodeURIComponent(query)}`)
    }
  }

  return (
    <div className="relative bg-gradient-to-r from-primary/10 to-primary/5 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Comunidad contra la okupación ilegal</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Busca, reporta y visualiza edificios con inquiokupas en toda España
          </p>

          <form onSubmit={handleSearch} className="flex w-full max-w-xl mx-auto mb-8 relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              <Building size={18} />
            </div>
            <Input
              type="text"
              placeholder="Introduce una dirección o calle..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 pl-10 pr-24 py-6 text-base rounded-full"
            />
            <Button
              type="submit"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full px-4"
              disabled={!query.trim()}
            >
              <Search className="mr-2 h-4 w-4" />
              Buscar
            </Button>
          </form>

          <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
            <span>Búsquedas populares:</span>
            <button onClick={() => setQuery("Gran Vía, Madrid")} className="hover:text-primary hover:underline">
              Gran Vía, Madrid
            </button>
            <span>•</span>
            <button
              onClick={() => setQuery("Sagrada Familia, Barcelona")}
              className="hover:text-primary hover:underline"
            >
              Sagrada Familia, Barcelona
            </button>
            <span>•</span>
            <button
              onClick={() => setQuery("Plaza del Ayuntamiento, Valencia")}
              className="hover:text-primary hover:underline"
            >
              Plaza del Ayuntamiento, Valencia
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

