import { cn } from "@/lib/utils"

interface AnuncioProps {
  className?: string
  fullHeight?: boolean
}

export function Ads({ className, fullHeight = false }: AnuncioProps) {
  return (
    <div className={cn("w-full", fullHeight ? "h-full" : "", className)}>
      <div
        className={cn(
          "bg-muted/30 border border-dashed border-muted-foreground/20 rounded-lg p-4 text-center",
          fullHeight ? "h-full flex flex-col" : "",
        )}
      >
        <p className="text-xs text-muted-foreground mb-2">ESPACIO PUBLICITARIO</p>
        <div
          className={cn("flex items-center justify-center bg-muted/50 rounded", fullHeight ? "flex-1" : "h-20 md:h-32")}
        >
          <span className="text-muted-foreground">Anuncio</span>
        </div>
      </div>
    </div>
  )
}

