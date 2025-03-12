"use client"

import { MapPin, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Address } from "@/types/address"

interface SearchResultsProps {
  results: Address[]
  onViewOnMap: (address: Address) => void
  isLoading: boolean
}

export function SearchResults({ results, onViewOnMap, isLoading }: SearchResultsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Search Results</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (results.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Search Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-4">No results found. Try a different search term.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Search Results</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y">
          {results.map((address, index) => (
            <li key={index} className="p-4 hover:bg-muted/50">
              <div className="flex flex-col gap-1">
                <h3 className="font-medium">{address.formattedAddress}</h3>
                <p className="text-sm text-muted-foreground">
                  {address.city}, {address.postalCode}
                </p>
                <div className="flex justify-end mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewOnMap(address)}
                    className="flex items-center gap-1"
                  >
                    <MapPin className="h-4 w-4" />
                    View on Map
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

