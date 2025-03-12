import { HeroBanner } from "@/components/hero-banner"
import { Anuncio } from "@/components/anuncio"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FileText, MapPin, Shield } from "lucide-react"

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen">
      <HeroBanner />

      <section className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 text-center">¿Qué es Okupado?</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card rounded-lg p-6 shadow-xs border flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Busca Información</h3>
            <p className="text-muted-foreground mb-4">
              Consulta si hay inquiokupas reportados en cualquier dirección de España.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-xs border flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Reporta Incidencias</h3>
            <p className="text-muted-foreground mb-4">
              Contribuye a la comunidad reportando nuevos casos de okupación ilegal.
            </p>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-xs border flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-medium mb-2">Protege tu Comunidad</h3>
            <p className="text-muted-foreground mb-4">
              Ayuda a crear un entorno más seguro compartiendo información verificada.
            </p>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <Button asChild size="lg">
            <Link href="/reportar" className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Reportar una incidencia
            </Link>
          </Button>
        </div>
      </section>

      <Anuncio className="container mx-auto px-4 py-6" />

      <section className="container mx-auto px-4 py-12 bg-muted/30 rounded-lg my-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">¿Cómo funciona?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl mb-4">
                1
              </div>
              <h3 className="font-medium mb-2">Busca una dirección</h3>
              <p className="text-sm text-muted-foreground">
                Introduce la dirección que quieres consultar en el buscador.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl mb-4">
                2
              </div>
              <h3 className="font-medium mb-2">Revisa los resultados</h3>
              <p className="text-sm text-muted-foreground">Consulta si hay reportes de inquiokupas en esa ubicación.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl mb-4">
                3
              </div>
              <h3 className="font-medium mb-2">Reporta o visualiza</h3>
              <p className="text-sm text-muted-foreground">
                Añade nuevos reportes o visualiza los existentes en el mapa.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Anuncio className="container mx-auto px-4 py-6" />

      <Footer />
    </main>
  )
}

