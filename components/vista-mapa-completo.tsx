"use client"

import { useState, useCallback, useRef } from "react"
import { Loader2, AlertCircle } from "lucide-react"
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api"
import type { Address } from "@/types/address"
import type { Report } from "@/types/report"

declare global {
  interface Window {
    google: any
  }
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
}

// Coordenadas de Madrid (centro predeterminado)
const defaultCenter = {
  lat: 40.4168,
  lng: -3.7038,
}

interface VistaMapaCompletoProps {
  selectedLocation: Address | null
  allLocations: Address[]
  reports: Report[]
}

export function VistaMapaCompleto({ selectedLocation, allLocations, reports }: VistaMapaCompletoProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [activeMarker, setActiveMarker] = useState<string | null>(null)
  const [infoWindowPosition, setInfoWindowPosition] = useState<google.maps.LatLng | null>(null)
  const markersRef = useRef<Record<string, google.maps.Marker>>({})

  // Cargar el script de Google Maps usando el cargador de la biblioteca
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  })

  // Almacenar una referencia al mapa cuando se carga
  const onLoad = useCallback(
    (map: google.maps.Map) => {
      setMap(map)

      // Si hay ubicaciones, ajustar el mapa para mostrarlas todas
      if (allLocations.length > 0) {
        const bounds = new window.google.maps.LatLngBounds()
        allLocations.forEach((location) => {
          bounds.extend(location.location)
        })
        map.fitBounds(bounds)
      }
    },
    [allLocations],
  )

  // Limpiar la referencia del mapa cuando el componente se desmonta
  const onUnmount = useCallback(() => {
    setMap(null)
    markersRef.current = {}
  }, [])

  // Manejar clic en marcador
  const handleMarkerClick = (locationId: string, position: google.maps.LatLng | google.maps.LatLngLiteral) => {
    setActiveMarker(locationId)
    setInfoWindowPosition(position instanceof google.maps.LatLng ? position : new google.maps.LatLng(position))
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

  // Si hay un error al cargar el script
  if (loadError) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-muted/20">
        <p className="text-destructive">Error al cargar Google Maps</p>
      </div>
    )
  }

  // Mostrar indicador de carga mientras se carga el script
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-muted/20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Mostrar también los marcadores de los reportes
  const reportMarkers = reports
    .map((report) => {
      if (!report.location) return null

      return {
        id: report.id,
        position: report.location,
        title: report.address,
        isReport: true,
        report,
      }
    })
    .filter(Boolean)

  return (
    <div className="relative w-full h-full">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={selectedLocation ? selectedLocation.location : defaultCenter}
        zoom={selectedLocation ? 16 : 12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          mapTypeControl: false,
          streetViewControl: true,
          fullscreenControl: true,
        }}
      >
        {/* Crear un mapa para evitar duplicados basados en coordenadas */}
        {(() => {
          // Crear un mapa para rastrear marcadores por coordenadas
          const markerMap = new Map()

          // Procesar primero las ubicaciones generales
          allLocations.forEach((location, index) => {
            const coordKey = `${location.location.lat.toFixed(5)},${location.location.lng.toFixed(5)}`
            const tieneReportes = hasReportsInAddress(location)
            const numReportes = getReportCount(location)
            const markerIcon = tieneReportes
              ? "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
              : "https://maps.google.com/mapfiles/ms/icons/blue-dot.png"

            // Solo agregar si no existe ya un marcador en esas coordenadas
            if (!markerMap.has(coordKey)) {
              markerMap.set(coordKey, {
                id: `${location.formattedAddress}-${index}`,
                position: location.location,
                title: location.formattedAddress,
                icon: markerIcon,
                isReport: false,
                data: location,
              })
            }
          })

          // Luego procesar los reportes específicos
          reportMarkers.forEach((marker: any) => {
            if (!marker) return

            const coordKey = `${marker.position.lat.toFixed(5)},${marker.position.lng.toFixed(5)}`

            // Los reportes específicos tienen prioridad
            markerMap.set(coordKey, {
              id: `report-${marker.id}`,
              position: marker.position,
              title: marker.title,
              icon: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
              isReport: true,
              data: marker.report,
            })
          })

          // Renderizar los marcadores sin duplicados
          return Array.from(markerMap.values()).map((marker) => (
            <Marker
              key={marker.id}
              position={marker.position}
              title={marker.title}
              animation={window.google.maps.Animation.DROP}
              onClick={() => handleMarkerClick(marker.id, marker.position)}
              icon={{
                url: marker.icon,
                scaledSize: new window.google.maps.Size(marker.isReport ? 30 : 40, marker.isReport ? 30 : 40),
              }}
              onLoad={(markerInstance) => {
                markersRef.current[marker.id] = markerInstance
              }}
            />
          ))
        })()}

        {/* Ventana de información para el marcador activo */}
        {activeMarker && infoWindowPosition && (
          <InfoWindow
            position={infoWindowPosition}
            onCloseClick={() => {
              setActiveMarker(null)
              setInfoWindowPosition(null)
            }}
          >
            <div className="p-1 max-w-[250px]">
              {activeMarker.startsWith("report-")
                ? // Contenido para reportes
                  (() => {
                    const reportId = activeMarker.replace("report-", "")
                    const report = reports.find((r) => r.id === reportId)
                    if (!report) return <div>Reporte no encontrado</div>

                    return (
                      <>
                        <h3 className="font-medium text-sm mb-1">{report.address}</h3>
                        <p className="text-xs text-muted-foreground mb-2">
                          {report.city}, {report.postalCode}
                        </p>
                        <p className="text-xs mb-1">
                          <span className="font-medium">Tipo: </span>
                          {report.incidentType === "okupacion_reciente" && "Okupación reciente"}
                          {report.incidentType === "okupacion_establecida" && "Okupación establecida"}
                          {report.incidentType === "okupacion_conflictiva" && "Problemas de convivencia"}
                          {report.incidentType === "okupacion_mafia" && "Red organizada"}
                          {report.incidentType === "otro" && "Otro tipo"}
                        </p>
                        {report.floor && (
                          <p className="text-xs mb-1">
                            <span className="font-medium">Piso: </span>
                            {report.floor}
                          </p>
                        )}
                        <p className="text-xs italic mt-1">
                          Reportado el {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                      </>
                    )
                  })()
                : // Contenido para ubicaciones
                  (() => {
                    const [address, index] = activeMarker.split("-")
                    const location = allLocations[Number(index)]
                    if (!location) return <div>Ubicación no encontrada</div>

                    const tieneReportes = hasReportsInAddress(location)
                    const numReportes = getReportCount(location)

                    return (
                      <>
                        <h3 className="font-medium text-sm mb-1">{location.formattedAddress}</h3>
                        <p className="text-xs text-muted-foreground mb-2">
                          {location.city}, {location.postalCode}
                        </p>
                        {tieneReportes && (
                          <div className="flex items-center gap-1 text-amber-600 bg-amber-50 p-1 rounded-sm text-xs mt-1">
                            <AlertCircle className="h-3 w-3 flex-shrink-0" />
                            <span className="font-medium">
                              {numReportes} {numReportes === 1 ? "reporte" : "reportes"} de inquiokupas
                            </span>
                          </div>
                        )}
                      </>
                    )
                  })()}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Leyenda del mapa */}
      <div className="absolute bottom-4 right-4 bg-white dark:bg-gray-800 p-3 rounded-md shadow-md z-10 text-sm">
        <h4 className="font-medium mb-2">Leyenda</h4>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 rounded-full bg-blue-500"></div>
          <span>Sin reportes</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
          <span>Zona con reportes</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
          <span>Reporte específico</span>
        </div>
      </div>
    </div>
  )
}

