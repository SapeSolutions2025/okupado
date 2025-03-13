import { supabase } from "@/lib/supabase"
import type { Address } from "@/types/address"
import type { Report } from "@/types/report"
import { toast } from "sonner"
import { v4 as uuidv4 } from "uuid"

// Coordenadas aproximadas de ciudades españolas
const cityCoordinates: Record<string, { lat: number; lng: number }> = {
  Madrid: { lat: 40.4168, lng: -3.7038 },
  Barcelona: { lat: 41.3851, lng: 2.1734 },
  Valencia: { lat: 39.4699, lng: -0.3763 },
  Sevilla: { lat: 37.3891, lng: -5.9845 },
  Zaragoza: { lat: 41.6488, lng: -0.8891 },
  Málaga: { lat: 36.7213, lng: -4.4214 },
}

// Caché para reportes
const reportsCache: Record<string, { data: Report[]; timestamp: number }> = {}
// Tiempo de expiración de la caché en milisegundos (5 minutos)
const CACHE_EXPIRATION = 5 * 60 * 1000

export async function getReports(city?: string): Promise<Report[]> {
  try {
    // Clave de caché
    const cacheKey = city ? `city:${city.toLowerCase()}` : "all"

    // Verificar si hay datos en caché y si no han expirado
    const cachedData = reportsCache[cacheKey]
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRATION) {
      console.log("Usando datos en caché para reportes")
      return cachedData.data
    }

    // Si no hay caché o ha expirado, obtener datos de Supabase
    let query = supabase.from("reports").select("*").order("createdAt", { ascending: false })

    // Filtrar por ciudad si se proporciona
    if (city) {
      // Usar ilike para búsqueda insensible a mayúsculas/minúsculas y parcial
      query = query.ilike("city", `%${city}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error al obtener reportes:", error)
      return []
    }

    // Guardar en caché
    reportsCache[cacheKey] = {
      data: data || [],
      timestamp: Date.now(),
    }

    return data || []
  } catch (error) {
    console.error("Error en el servicio de reportes:", error)
    toast.error("Error al cargar reportes", {
      description: "No se pudieron obtener los reportes. Inténtalo de nuevo más tarde.",
    })
    return []
  }
}

export async function createReport(reportData: Omit<Report, "id" | "createdAt" | "status" | "location">): Promise<Report | null> {
  try {
    // Generar coordenadas a partir de la ciudad
    let lat = 0
    let lng = 0

    // Usar coordenadas de la ciudad si está en nuestro registro, o Madrid por defecto
    const baseCoords = cityCoordinates[reportData.city] || cityCoordinates["Madrid"]

    // Añadir una pequeña variación aleatoria
    lat = baseCoords.lat + (Math.random() - 0.5) * 0.02
    lng = baseCoords.lng + (Math.random() - 0.5) * 0.02

    // Preparar el objeto para insertar en Supabase
    const newReport = {
      id: uuidv4(),
      ...reportData,
      location: { lat, lng },
      createdAt: new Date().toISOString(),
      status: "pending", // Los nuevos reportes comienzan como pendientes de verificación
    }

    // Insertar en Supabase
    const { data, error } = await supabase.from("reports").insert(newReport).select().single()

    if (error) {
      console.error("Error al insertar reporte:", error)
      return null
    }

    // Invalidar la caché después de crear un nuevo reporte
    Object.keys(reportsCache).forEach((key) => {
      delete reportsCache[key]
    })

    return data
  } catch (error) {
    console.error("Error al crear reporte:", error)
    toast.error("Error al crear reporte", {
      description: "No se pudo crear el reporte. Inténtalo de nuevo más tarde.",
    })
    return null
  }
}

// Caché para búsquedas de direcciones
const addressCache: Record<string, { data: Address[]; timestamp: number }> = {}

export async function searchAddresses(query: string): Promise<Address[]> {
  try {
    // Normalizar la consulta para la caché
    const normalizedQuery = query.toLowerCase().trim()

    // Verificar si hay datos en caché y si no han expirado
    const cachedData = addressCache[normalizedQuery]
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_EXPIRATION) {
      console.log("Usando datos en caché para direcciones")
      return cachedData.data
    }

    // En una implementación real, aquí se haría una llamada a la API de Google Maps Geocoding
    // Por ahora, usamos datos simulados

    // Simulación simple de resultados de geocodificación
    const lowercaseQuery = normalizedQuery

    // Determinar la ciudad base
    let baseCity = "madrid" // Default
    let cityName = "Madrid"

    for (const city of Object.keys(cityCoordinates)) {
      if (lowercaseQuery.includes(city.toLowerCase())) {
        baseCity = city.toLowerCase()
        cityName = city.charAt(0).toUpperCase() + city.slice(1)
        break
      }
    }

    let results: Address[] = []

    // Intentar obtener direcciones reales de la base de datos
    const { data: reportAddresses, error: reportError } = await supabase
      .from("reports")
      .select("address, city, postalCode, location")
      .or(`address.ilike.%${lowercaseQuery}%,city.ilike.%${lowercaseQuery}%`)
      .limit(10)

    if (!reportError && reportAddresses && reportAddresses.length > 0) {
      // Convertir los resultados de la base de datos al formato Address
      results = reportAddresses.map((report) => ({
        formattedAddress: report.address,
        city: report.city,
        postalCode: report.postalCode,
        location: report.location || {
          lat: cityCoordinates[report.city]?.lat || 40.4168,
          lng: cityCoordinates[report.city]?.lng || -3.7038,
        },
      }))
    } 

    // Guardar en caché
    addressCache[normalizedQuery] = {
      data: results,
      timestamp: Date.now(),
    }

    return results
  } catch (error) {
    console.error("Error en la búsqueda de direcciones:", error)
    toast.error("Error de búsqueda", {
      description: "No se pudieron obtener las direcciones. Inténtalo de nuevo más tarde.",
    })
    return []
  }
}

export async function uploadPhoto(file: File): Promise<string | null> {
  try {
    const fileExt = file.name.split(".").pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
    const filePath = `reports/${fileName}`

    const { error: uploadError } = await supabase.storage.from("photos").upload(filePath, file)

    if (uploadError) {
      throw new Error(`Error al subir la foto: ${uploadError.message}`)
    }

    // Obtener la URL pública de la foto
    const {
      data: { publicUrl },
    } = supabase.storage.from("photos").getPublicUrl(filePath)

    return publicUrl
  } catch (error) {
    console.error("Error al subir foto:", error)
    toast.error("Error al subir foto", {
      description: "No se pudo subir la foto. Inténtalo de nuevo más tarde.",
    })
    return null
  }
}

