"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

interface BusquedaFormProps {
  initialQuery?: string
  onSearch: (query: string) => void
  isLoading: boolean
}

export function BusquedaForm({ initialQuery = "", onSearch, isLoading }: BusquedaFormProps) {
  const [query, setQuery] = useState(initialQuery)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    setQuery(initialQuery)
  }, [initialQuery])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) return

    // Actualizar la URL con el parámetro de búsqueda
    const params = new URLSearchParams(searchParams.toString())
    params.set("q", query)

    // Mantener el parámetro de ciudad si existe
    const city = searchParams.get("city")
    if (city) {
      params.set("city", city)
    }

    // Actualizar la URL y ejecutar la búsqueda
    router.push(`/busqueda?${params.toString()}`)
    onSearch(query)
  }

  return (
    <Card>
      <CardContent >
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="Introduce una dirección en España..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !query.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            <span className="ml-2 hidden sm:inline">Buscar</span>
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

