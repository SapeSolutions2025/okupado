import { ReportarForm } from "@/components/reportar-form"
import { Anuncio } from "@/components/anuncio"
import { AlertTriangle } from "lucide-react"

export default function ReportarPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-center">Reportar inquiokupa</h1>
      <p className="text-muted-foreground mb-8 text-center">
        Utiliza este formulario para reportar un caso de okupación ilegal en un edificio.
      </p>

      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-8 w-full">
        <div className="flex gap-3">
          <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-amber-800 dark:text-amber-400">Información importante</h3>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              Esta plataforma es meramente informativa. Ante cualquier situación de okupación ilegal, contacta siempre
              con las autoridades competentes. Los datos proporcionados serán verificados antes de hacerse públicos.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Columna izquierda para publicidad */}
        <div className="lg:col-span-2 lg:min-h-[800px] flex">
          <Anuncio fullHeight className="w-full" />
        </div>

        {/* Columna central para el formulario */}
        <div className="lg:col-span-8">
          <ReportarForm />
        </div>

        {/* Columna derecha para publicidad */}
        <div className="lg:col-span-2 lg:min-h-[800px] flex">
          <Anuncio fullHeight className="w-full" />
        </div>
      </div>
    </div>
  )
}

