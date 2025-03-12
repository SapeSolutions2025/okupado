"use client"

import { useState } from "react"
import { MapPin, Navigation, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import type { Address } from "@/types/address"
import type { Report } from "@/types/report"

interface ResultadosBusquedaProps {
  results: Address[]
  onViewOnMap: (address: Address) => void
  isLoading: boolean
  reports: Report[]
}

export function ResultadosBusqueda({ results, onViewOnMap, isLoading, reports }: ResultadosBusquedaProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const resultsPerPage = 5

  // Calcular el número total de páginas
  const totalPages = Math.max(1, Math.ceil(results.length / resultsPerPage))

  // Obtener los resultados para la página actual
  const getCurrentPageResults = () => {
    const startIndex = (currentPage - 1) * resultsPerPage
    const endIndex = startIndex + resultsPerPage
    return results.slice(startIndex, endIndex)
  }

  // Cambiar de página
  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-full">
        <Card className="flex-1">
          <CardContent className="p-0">
            <div className="divide-y">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Skeleton className="h-5 w-2/3" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                    <Skeleton className="h-4 w-1/3" />
                    <Skeleton className="h-10 w-full" />
                    <div className="flex justify-between">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Skeleton para la paginación */}
        <div className="mt-4 bg-card rounded-lg border shadow-xs">
          <div className="flex justify-between items-center px-4 py-3">
            <Skeleton className="h-5 w-40" />
            <div className="flex gap-1">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <Card className="flex-1">
          <CardContent>
            <div className="flex items-center justify-center h-full min-h-[200px]">
              <p className="text-center text-muted-foreground">
                No se encontraron resultados. Intenta con otra búsqueda.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Paginación para "no results" */}
        <div className="mt-4 bg-card rounded-lg border shadow-xs">
          <div className="flex justify-between items-center px-4 py-3">
            <div className="text-sm text-muted-foreground">Mostrando 0 resultados</div>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="default" size="sm" disabled className="w-8 h-8 p-0">
                1
              </Button>
              <Button variant="outline" size="icon" disabled>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Función para verificar si hay reportes en una dirección
  const hasReportsInAddress = (address: Address): boolean => {
    // Verificar si hay reportes en la misma ciudad y código postal
    return reports.some(
      (report) => report.city.toLowerCase() === address.city.toLowerCase() && report.postalCode === address.postalCode,
    )
  }

  // Función para obtener el número de reportes en una dirección
  const getReportCount = (address: Address): number => {
    return reports.filter(
      (report) => report.city.toLowerCase() === address.city.toLowerCase() && report.postalCode === address.postalCode,
    ).length
  }

  const currentResults = getCurrentPageResults()

  return (
    <div className="flex flex-col h-full">
      <Card className="flex-1 flex flex-col">
        <CardContent className="p-0 flex-1">
          <ul className="divide-y h-full">
            {currentResults.map((address, index) => {
              const tieneReportes = hasReportsInAddress(address)
              const numReportes = getReportCount(address)

              return (
                <li key={index} className="p-4 hover:bg-muted/50">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium">{address.formattedAddress}</h3>
                      <Badge variant="outline" className="ml-2">
                        {address.city}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Código postal: {address.postalCode}</p>

                    {tieneReportes && (
                      <div className="flex items-center gap-2 mt-2 text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-md">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span className="text-sm font-medium">
                          {numReportes} {numReportes === 1 ? "reporte" : "reportes"} de inquiokupas en esta zona
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => {
                          // Abrir en Google Maps
                          window.open(
                            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.formattedAddress)}`,
                            "_blank",
                          )
                        }}
                      >
                        <Navigation className="h-4 w-4" />
                        Cómo llegar
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onViewOnMap(address)}
                        className="flex items-center gap-1"
                      >
                        <MapPin className="h-4 w-4" />
                        Ver en mapa
                      </Button>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </CardContent>
      </Card>

      {/* Paginación - siempre visible y al final de la página */}
      <div className="mt-4 bg-card rounded-lg border shadow-xs">
        <div className="flex justify-between items-center px-4 py-3">
          <div className="text-sm text-muted-foreground">
            {results.length > 0 ? (
              <>
                Mostrando {(currentPage - 1) * resultsPerPage + 1}-
                {Math.min(currentPage * resultsPerPage, results.length)} de {results.length}
              </>
            ) : (
              <>Mostrando 0 resultados</>
            )}
          </div>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => goToPage(page)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

