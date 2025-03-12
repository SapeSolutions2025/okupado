import { Suspense } from "react"
import { BusquedaPageClient } from "@/components/busqueda-page-client"
import { getReports } from "@/services/supabase-service"
import { Loader2 } from "lucide-react"

interface SearchPageProps {
  searchParams: { q?: string; city?: string }
}

export default async function BusquedaPage({ searchParams }: SearchPageProps) {
  // Obtener reportes del servidor
  const reports = await getReports(searchParams.city)

  return (
    <main className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          }
        >
          <BusquedaPageClient
            initialQuery={searchParams.q || ""}
            initialCity={searchParams.city || null}
            initialReports={reports}
          />
        </Suspense>
      </div>
    </main>
  )
}

