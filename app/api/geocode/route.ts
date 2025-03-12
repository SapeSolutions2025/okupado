import { type NextRequest, NextResponse } from "next/server"
import { searchAddresses } from "@/services/supabase-service"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const address = searchParams.get("address")

  if (!address) {
    return NextResponse.json({ success: false, error: "Dirección no proporcionada" }, { status: 400 })
  }

  try {
    const results = await searchAddresses(address)
    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error("Error en geocodificación:", error)
    return NextResponse.json({ success: false, error: "Error al procesar la solicitud" }, { status: 500 })
  }
}

