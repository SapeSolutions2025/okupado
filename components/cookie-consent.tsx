"use client"

import { useState, useEffect } from "react"
import { Check, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true, // Siempre activado
    analytics: true,
    marketing: false,
  })

  useEffect(() => {
    // Comprobar si el usuario ya ha dado su consentimiento
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      // Mostrar el banner después de un pequeño retraso para mejorar la experiencia de usuario
      const timer = setTimeout(() => {
        setShowBanner(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const acceptAll = () => {
    setCookiePreferences({
      necessary: true,
      analytics: true,
      marketing: true,
    })
    savePreferences({
      necessary: true,
      analytics: true,
      marketing: true,
    })
  }

  const savePreferences = (preferences = cookiePreferences) => {
    localStorage.setItem("cookie-consent", JSON.stringify(preferences))
    setShowBanner(false)
    setShowSettings(false)
  }

  const openSettings = () => {
    setShowSettings(true)
  }

  if (!showBanner) return null

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t shadow-lg">
        <div className="container mx-auto max-w-4xl">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-medium mb-2">Uso de cookies</h3>
              <p className="text-sm text-muted-foreground">
                Utilizamos cookies para mejorar tu experiencia en nuestra web, personalizar contenido y analizar el
                tráfico. Puedes aceptar todas las cookies o personalizar tus preferencias.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={openSettings}>
                <Settings className="h-4 w-4 mr-2" />
                Personalizar
              </Button>
              <Button size="sm" onClick={acceptAll}>
                <Check className="h-4 w-4 mr-2" />
                Aceptar todas
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Preferencias de cookies</DialogTitle>
            <DialogDescription>
              Personaliza qué tipos de cookies deseas aceptar. Las cookies necesarias son imprescindibles para el
              funcionamiento del sitio.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="necessary" className="font-medium">
                  Cookies necesarias
                </Label>
                <p className="text-sm text-muted-foreground">
                  Imprescindibles para el funcionamiento básico del sitio.
                </p>
              </div>
              <Switch id="necessary" checked disabled />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="analytics" className="font-medium">
                  Cookies analíticas
                </Label>
                <p className="text-sm text-muted-foreground">Nos ayudan a entender cómo utilizas el sitio.</p>
              </div>
              <Switch
                id="analytics"
                checked={cookiePreferences.analytics}
                onCheckedChange={(checked) => setCookiePreferences({ ...cookiePreferences, analytics: checked })}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="marketing" className="font-medium">
                  Cookies de marketing
                </Label>
                <p className="text-sm text-muted-foreground">Utilizadas para mostrarte anuncios relevantes.</p>
              </div>
              <Switch
                id="marketing"
                checked={cookiePreferences.marketing}
                onCheckedChange={(checked) => setCookiePreferences({ ...cookiePreferences, marketing: checked })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettings(false)}>
              Cancelar
            </Button>
            <Button onClick={() => savePreferences()}>Guardar preferencias</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

