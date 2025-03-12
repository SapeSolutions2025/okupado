'use client'

import { config } from '@/lib/config'
import type { Address } from '@/types/address'
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader,
} from '@react-google-maps/api'
import { Loader2 } from 'lucide-react'
import { useCallback, useState } from 'react'

// Declare the google variable
declare global {
  interface Window {
    google: any
  }
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
}

// Madrid coordinates (default center)
const defaultCenter = {
  lat: 40.4168,
  lng: -3.7038,
}

interface MapViewProps {
  selectedLocation: Address | null
}

export function MapView({ selectedLocation }: MapViewProps) {
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [infoWindowOpen, setInfoWindowOpen] = useState(false)

  // Load the Google Maps script using the library's loader
  console.log(map)
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: config.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  })

  // Store a reference to the map when it loads
  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map)
  }, [])

  // Clean up the map reference when the component unmounts
  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  // Handle marker click
  const handleMarkerClick = () => {
    setInfoWindowOpen(true)
  }

  // If there's an error loading the script
  if (loadError) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-muted/20">
        <p className="text-destructive">Error loading Google Maps</p>
      </div>
    )
  }

  // Show loading indicator while the script is loading
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center w-full h-full bg-muted/20">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

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
          streetViewControl: false,
        }}
      >
        {/* Render marker if a location is selected */}
        {selectedLocation && (
          <Marker
            position={selectedLocation.location}
            title={selectedLocation.formattedAddress}
            animation={window.google.maps.Animation.DROP}
            onClick={handleMarkerClick}
          >
            {/* Show info window when marker is clicked or by default */}
            {(infoWindowOpen || true) && (
              <InfoWindow onCloseClick={() => setInfoWindowOpen(false)}>
                <div className="p-1">
                  <h3 className="font-medium text-sm mb-1">
                    {selectedLocation.formattedAddress}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {selectedLocation.city}, {selectedLocation.postalCode}
                  </p>
                </div>
              </InfoWindow>
            )}
          </Marker>
        )}
      </GoogleMap>
    </div>
  )
}
