"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, Filter, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Address } from "@/types/address"

interface FiltroUbicacionProps {
  addresses: Address[]
  selectedCity: string | null
  onSelectCity: (city: string | null) => void
}

export function FiltroUbicacion({ addresses, selectedCity, onSelectCity }: FiltroUbicacionProps) {
  const [open, setOpen] = useState(false)

  // Extraer ciudades únicas de las direcciones
  const cities = Array.from(new Set(addresses.map((address) => address.city)))
    .filter(Boolean)
    .sort()

  const handleCitySelect = (city: string | null) => {
    onSelectCity(city)
    setOpen(false)
  }

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtrar por ciudad
            {selectedCity && (
              <Badge variant="secondary" className="ml-2">
                {selectedCity}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-0" align="start">
          <div className="p-2 border-b flex justify-between items-center">
            <h3 className="font-medium">Filtrar por ciudad</h3>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="h-60">
            <div className="p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCitySelect(null)}
                className="w-full justify-start mb-1"
              >
                <Check className={`mr-2 h-4 w-4 ${!selectedCity ? "opacity-100" : "opacity-0"}`} />
                Todas las ciudades
              </Button>

              {cities.map((city) => (
                <Button
                  key={city}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCitySelect(city)}
                  className="w-full justify-start mb-1"
                >
                  <Check className={`mr-2 h-4 w-4 ${selectedCity === city ? "opacity-100" : "opacity-0"}`} />
                  {city}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </PopoverContent>
      </Popover>

      {selectedCity && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSelectCity(null)}
          className="text-muted-foreground hover:text-foreground"
        >
          Limpiar filtro
        </Button>
      )}
    </div>
  )
}

