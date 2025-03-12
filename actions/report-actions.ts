"use server"

import { createReport, uploadPhoto } from "@/services/supabase-service"
import { z } from "zod"

const reportSchema = z.object({
  address: z.string().min(5, {
    message: "La dirección debe tener al menos 5 caracteres.",
  }),
  postalCode: z.string().min(3, {
    message: "El código postal es obligatorio.",
  }),
  city: z.string().min(2, {
    message: "La ciudad es obligatoria.",
  }),
  incidentType: z.string({
    required_error: "Selecciona el tipo de incidencia.",
  }),
  description: z.string().min(10, {
    message: "La descripción debe tener al menos 10 caracteres.",
  }),
  floor: z.string().optional().nullable(),
  reporterName: z.string().optional(),
  reporterEmail: z
    .string()
    .email({
      message: "Introduce un email válido.",
    })
    .optional()
    .or(z.literal("")),
  photoUrl: z.string().optional().nullable(),
  photoDescription: z.string().optional(),
})

export type ReportFormData = z.infer<typeof reportSchema>

export async function submitReport(formData: ReportFormData, photoFile: File | null) {
  try {
    // Validar los datos del formulario
    const validatedData = reportSchema.parse(formData)

    let photoUrl = null

    // Si hay una foto, subirla a Supabase Storage
    if (photoFile) {
      photoUrl = await uploadPhoto(photoFile)

      if (!photoUrl) {
        return {
          success: false,
          message: "Error al subir la foto",
        }
      }
    }

    // Crear el reporte
    // Eliminar campos que no existen en la tabla
    const { photoDescription, ...reportData } = validatedData

    const report = await createReport({
      ...reportData,
      photoUrl,
    })

    if (!report) {
      return {
        success: false,
        message: "Error al crear el reporte",
      }
    }

    return {
      success: true,
      message: "Reporte creado con éxito",
      report,
    }
  } catch (error) {
    console.error("Error al enviar reporte:", error)

    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => `${err.path}: ${err.message}`).join(", ")
      return {
        success: false,
        message: `Error de validación: ${errorMessages}`,
      }
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido al enviar el reporte",
    }
  }
}

