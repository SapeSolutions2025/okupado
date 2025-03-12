import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">Okupado</h3>
            <p className="text-muted-foreground text-sm">
              Plataforma comunitaria para reportar y visualizar edificios con inquiokupas en España.
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-4">Enlaces</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/reportar" className="text-muted-foreground hover:text-primary">
                  Reportar incidencia
                </Link>
              </li>
              <li>
                <Link href="/busqueda" className="text-muted-foreground hover:text-primary">
                  Buscar dirección
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terminos" className="text-muted-foreground hover:text-primary">
                  Términos de uso
                </Link>
              </li>
              <li>
                <Link href="/privacidad" className="text-muted-foreground hover:text-primary">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link href="/aviso-legal" className="text-muted-foreground hover:text-primary">
                  Aviso legal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Okupado. Esta plataforma es informativa y no sustituye a las autoridades
            competentes.
          </p>
        </div>
      </div>
    </footer>
  )
}

