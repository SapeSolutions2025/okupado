'use client'

import { Ads } from '@/components/anuncio'
import { BusquedaForm } from '@/components/busqueda-form'
import { FiltroUbicacion } from '@/components/filtro-ubicacion'
import { ResultadosBusqueda } from '@/components/resultados-busqueda'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { VistaMapaCompleto } from '@/components/vista-mapa-completo'
import type { Address } from '@/types/address'
import type { Report } from '@/types/report'
import { FileText, MapPin } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

interface BusquedaPageClientProps {
  initialQuery: string
  initialCity: string | null
  initialReports: Report[]
}

function ResultadosSuspense({
  filteredResults,
  onViewOnMap,
  isLoading,
  reports,
}: {
  filteredResults: Address[]
  onViewOnMap: (address: Address) => void
  isLoading: boolean
  reports: Report[]
}) {
  return (
    <Suspense fallback={null}>
      <ResultadosBusqueda
        results={filteredResults}
        onViewOnMap={onViewOnMap}
        isLoading={isLoading}
        reports={reports}
      />
    </Suspense>
  )
}

function MapaSuspense({
  selectedLocation,
  allLocations,
  reports,
}: {
  selectedLocation: Address | null
  allLocations: Address[]
  reports: Report[]
}) {
  return (
    <Suspense fallback={null}>
      <div className="h-[600px] rounded-lg overflow-hidden border shadow-xs">
        <VistaMapaCompleto
          selectedLocation={selectedLocation}
          allLocations={allLocations}
          reports={reports}
        />
      </div>
    </Suspense>
  )
}

export function BusquedaPageClient({
  initialQuery,
  initialCity,
  initialReports,
}: BusquedaPageClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchResults, setSearchResults] = useState<Address[]>([])
  const [filteredResults, setFilteredResults] = useState<Address[]>([])
  const [selectedLocation, setSelectedLocation] = useState<Address | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCity, setSelectedCity] = useState<string | null>(initialCity)
  const [activeTab, setActiveTab] = useState('resultados')
  const [reports] = useState<Report[]>(initialReports)

  // Caché de búsquedas
  const searchCache = useRef<Record<string, Address[]>>({})
  // Última consulta realizada
  const lastQuery = useRef<string>('')

  useEffect(() => {
    if (initialQuery && initialQuery !== lastQuery.current) {
      handleSearch(initialQuery)
    }
  }, [initialQuery])

  const handleSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) return

      // Normalizar la consulta para la caché
      const normalizedQuery = query.toLowerCase().trim()

      // Si la consulta es la misma que la última, no hacer nada
      if (normalizedQuery === lastQuery.current) {
        return
      }

      // Actualizar la última consulta
      lastQuery.current = normalizedQuery

      // Verificar si hay resultados en caché
      if (searchCache.current[normalizedQuery]) {
        console.log('Usando resultados en caché para:', normalizedQuery)
        setSearchResults(searchCache.current[normalizedQuery])

        // Aplicar filtro de ciudad si está seleccionada
        if (selectedCity) {
          setFilteredResults(
            searchCache.current[normalizedQuery].filter((address) =>
              address.city.toLowerCase().includes(selectedCity.toLowerCase()),
            ),
          )
        } else {
          setFilteredResults(searchCache.current[normalizedQuery])
        }

        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(
          `/api/geocode?address=${encodeURIComponent(query)}&country=es`,
        )
        const data = await response.json()

        if (data.success) {
          // Guardar en caché
          searchCache.current[normalizedQuery] = data.results

          setSearchResults(data.results)

          // Aplicar filtro de ciudad si está seleccionada
          if (selectedCity) {
            setFilteredResults(
              data.results.filter((address: any) =>
                address.city.toLowerCase().includes(selectedCity.toLowerCase()),
              ),
            )
          } else {
            setFilteredResults(data.results)
          }
        } else {
          setSearchResults([])
          setFilteredResults([])
        }
      } catch (error) {
        console.error('Error de búsqueda:', error)
        toast.error('Error de búsqueda', {
          description:
            'No se pudieron obtener los resultados. Inténtalo de nuevo más tarde.',
        })
        setSearchResults([])
        setFilteredResults([])
      } finally {
        setIsLoading(false)
      }
    },
    [selectedCity],
  )

  const handleFilter = useCallback(
    (city: string | null) => {
      setSelectedCity(city)

      // Actualizar la URL con el parámetro de ciudad
      const params = new URLSearchParams(searchParams.toString())
      if (city) {
        params.set('city', city)
      } else {
        params.delete('city')
      }

      // Mantener el parámetro de búsqueda si existe
      if (initialQuery) {
        params.set('q', initialQuery)
      }

      // Actualizar la URL sin recargar la página
      router.push(`/busqueda?${params.toString()}`)

      if (!city) {
        setFilteredResults(searchResults)
        return
      }

      // Filtrar resultados por ciudad (usando coincidencia parcial e insensible a mayúsculas/minúsculas)
      const filtered = searchResults.filter((address) =>
        address.city.toLowerCase().includes(city.toLowerCase()),
      )
      setFilteredResults(filtered)
    },
    [searchResults, initialQuery, searchParams, router],
  )

  const handleViewOnMap = useCallback((address: Address) => {
    setSelectedLocation(address)
    setActiveTab('mapa')
  }, [])

  return (
    <div className="grid grid-cols-1 gap-6">
      <BusquedaForm
        initialQuery={initialQuery}
        onSearch={handleSearch}
        isLoading={isLoading}
      />

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <FiltroUbicacion
            addresses={searchResults}
            selectedCity={selectedCity}
            onSelectCity={handleFilter}
            disabled={!searchResults.length}
          />

          <div className="text-sm text-muted-foreground">
            <span>Se encontraron {filteredResults.length} resultados</span>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="resultados" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Resultados
          </TabsTrigger>
          <TabsTrigger value="mapa" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Mapa
          </TabsTrigger>
        </TabsList>
        {searchResults.length ? (
          <>
            <TabsContent value="resultados" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[800px]">
               {/*  <div className="lg:col-span-1">
                  <Ads fullHeight className="h-full" dataSlot='4405346533'/>
                </div> */}

                <div className="lg:col-span-3">
                  <ResultadosSuspense
                    filteredResults={filteredResults}
                    onViewOnMap={handleViewOnMap}
                    isLoading={isLoading}
                    reports={reports}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="mapa">
              <MapaSuspense
                selectedLocation={selectedLocation}
                allLocations={filteredResults}
                reports={reports}
              />
            </TabsContent>
          </>
        ) : (
          lastQuery.current && (
            <div className="min-h-[800px]">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-[800px]">
              {/*   <div className="lg:col-span-1">
                  <Ads fullHeight className="h-full" dataSlot='9731160560'/>
                </div> */}

                <div className="lg:col-span-3">
                  <ResultadosBusqueda
                    results={[]}
                    onViewOnMap={() => {}}
                    isLoading={isLoading}
                    reports={reports}
                  />
                </div>
              </div>
            </div>
          )
        )}
      </Tabs>
    </div>
  )
}
