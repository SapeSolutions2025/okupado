import { NextResponse } from "next/server"
import { getReports } from "@/services/supabase-service"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const city = searchParams.get("city")

  try {
    const reports = await getReports(city || undefined)
    return NextResponse.json(reports)
  } catch (error) {
    console.error("Error en la API de reportes:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

// Nota: El POST ahora se maneja a través de Server Actions

