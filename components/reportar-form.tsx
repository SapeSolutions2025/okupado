'use client'

import { submitReport, type ReportFormData } from '@/actions/report-actions'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import { CheckCircle, Loader2, Upload } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import type React from 'react'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

const formSchema = z.object({
  address: z.string().min(5, {
    message: 'La dirección debe tener al menos 5 caracteres.',
  }),
  postalCode: z.string().min(3, {
    message: 'El código postal es obligatorio.',
  }),
  city: z.string().min(2, {
    message: 'La ciudad es obligatoria.',
  }),
  incidentType: z.string({
    required_error: 'Selecciona el tipo de incidencia.',
  }),
  description: z.string().min(10, {
    message: 'La descripción debe tener al menos 10 caracteres.',
  }),
  floor: z.string().optional(),
  reporterName: z.string().optional(),
  reporterEmail: z
    .string()
    .email({
      message: 'Introduce un email válido.',
    })
    .optional()
    .or(z.literal('')),
  photoDescription: z.string().optional(),
})

export function ReportarForm() {
  const [isPending, startTransition] = useTransition()
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [addressValidated, setAddressValidated] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      address: '',
      postalCode: '',
      city: '',
      floor: '',
      incidentType: '',
      description: '',
      reporterName: '',
      reporterEmail: '',
      photoDescription: '',
    },
  })

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      form.setValue('photoDescription', file.name)
    }
  }

  const validateAddressField = async () => {
    const address = form.getValues('address')
    const city = form.getValues('city')
    const postalCode = form.getValues('postalCode')

    if (!address || !city || !postalCode) {
      toast.error('Información incompleta', {
        description:
          'Por favor, completa la dirección, ciudad y código postal antes de validar.',
      })
      return
    }

    startTransition(async () => {
      try {
        // Simulación de validación de dirección
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // En un caso real, aquí se llamaría a la API de Google Maps para validar la dirección
        setAddressValidated(true)
        toast.success('Dirección validada', {
          description: 'La dirección ha sido validada correctamente.',
        })
      } catch (error) {
        console.error('Error al validar dirección:', error)
        toast.error('Hubo un error al validar la dirección.')
      }
    })
  }

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!addressValidated) {
      toast.error('Dirección no validada', {
        description:
          'Por favor, valida la dirección antes de enviar el reporte.',
      })
      return
    }

    startTransition(async () => {
      try {
        // Preparar los datos para el server action
        const formData: ReportFormData = {
          ...values,
          photoUrl: null,
        }

        // Enviar el reporte usando el server action
        const result = await submitReport(formData, photoFile)

        if (result.success) {
          setIsSuccess(true)
          form.reset()
          setPhotoPreview(null)
          setPhotoFile(null)
          setAddressValidated(false)

          toast.success('Reporte enviado', {
            description:
              'Tu reporte ha sido enviado correctamente. Gracias por tu colaboración.',
          })
        } else {
          throw new Error(result.message)
        }
      } catch (error) {
        console.error('Error al enviar reporte:', error)
        toast.error('Error de envío', {
          description:
            error instanceof Error
              ? error.message
              : 'Hubo un error al enviar tu reporte.',
        })
      }
    })
  }

  if (isSuccess) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-center text-2xl">
            ¡Reporte enviado con éxito!
          </CardTitle>
          <CardDescription className="text-center">
            Gracias por tu colaboración. Tu reporte ha sido recibido y será
            revisado por nuestro equipo.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <p className="text-center text-muted-foreground mb-6">
            Te notificaremos por email cuando haya novedades sobre tu reporte.
          </p>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/">Volver al inicio</Link>
            </Button>
            <Button variant="outline" onClick={() => setIsSuccess(false)}>
              Crear otro reporte
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Formulario de reporte</CardTitle>
        <CardDescription>
          Los campos marcados con * son obligatorios.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección*</FormLabel>
                    <FormControl>
                      <Input placeholder="Calle, número, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Código Postal*</FormLabel>
                      <FormControl>
                        <Input placeholder="28001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ciudad*</FormLabel>
                      <FormControl>
                        <Input placeholder="Madrid" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <FormField
              control={form.control}
              name="floor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Piso/Apartamento (Opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: 3º B, Bajo Izquierda" {...field} />
                  </FormControl>
                  <FormDescription>
                    Especifica el piso o apartamento si lo conoces
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={validateAddressField}
                disabled={isPending}
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Validar dirección
              </Button>
            </div>

            <FormField
              control={form.control}
              name="incidentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de incidencia*</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo de incidencia" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="okupacion_reciente">
                        Okupación reciente (menos de 1 mes)
                      </SelectItem>
                      <SelectItem value="okupacion_establecida">
                        Okupación establecida (más de 1 mes)
                      </SelectItem>
                      <SelectItem value="okupacion_conflictiva">
                        Okupación con problemas de convivencia
                      </SelectItem>
                      <SelectItem value="okupacion_mafia">
                        Posible red organizada de okupación
                      </SelectItem>
                      <SelectItem value="otro">
                        Otro tipo de incidencia
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción de la incidencia*</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe la situación de okupación, cuándo comenzó, número aproximado de personas, etc."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="photoDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Foto (Opcional)</FormLabel>
                  <div className="flex items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById('photo-upload')?.click()
                      }
                      className="flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Subir foto
                    </Button>
                    <Input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                    {photoPreview && (
                      <div className="relative h-20 w-20 rounded-md overflow-hidden border">
                        <Image
                          src={photoPreview || '/placeholder.svg'}
                          alt="Vista previa"
                          className="h-full w-full object-cover"
                          layout="fill"
                          objectFit="cover"
                        />
                      </div>
                    )}
                  </div>
                  <FormControl>
                    <Input type="hidden" {...field} />
                  </FormControl>
                  <FormDescription>
                    Sube una foto del edificio o evidencia de la okupación
                    (máximo 5MB)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="reporterName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tu nombre (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre y apellidos" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reporterEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tu email (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="email@ejemplo.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Para recibir actualizaciones sobre tu reporte
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isPending || !addressValidated}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enviar reporte
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
