"use client"

import { Check, ChevronsUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Address } from "@/types/address"
import { cn } from "@/lib/utils"

interface LocationFilterProps {
  addresses: Address[]
  selectedCity: string | null
  onSelectCity: (city: string | null) => void
}

export function LocationFilter({ addresses, selectedCity, onSelectCity }: LocationFilterProps) {
  // Extract unique cities from addresses
  const cities = Array.from(new Set(addresses.map((address) => address.city)))
    .filter(Boolean)
    .sort()

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Filter by City</CardTitle>
      </CardHeader>
      <CardContent>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" className="w-full justify-between">
              {selectedCity || "Select a city..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder="Search city..." />
              <CommandList>
                <CommandEmpty>No city found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem onSelect={() => onSelectCity(null)} className="text-muted-foreground">
                    <Check className={cn("mr-2 h-4 w-4", !selectedCity ? "opacity-100" : "opacity-0")} />
                    Show all cities
                  </CommandItem>
                  {cities.map((city) => (
                    <CommandItem key={city} onSelect={() => onSelectCity(city)}>
                      <Check className={cn("mr-2 h-4 w-4", selectedCity === city ? "opacity-100" : "opacity-0")} />
                      {city}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </CardContent>
    </Card>
  )
}

