export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      reports: {
        Row: {
          id: string
          address: string
          postalCode: string
          city: string
          floor: string | null
          incidentType: string
          description: string
          location: { lat: number; lng: number } | null
          photoUrl: string | null
          reporterName: string | null
          reporterEmail: string | null
          createdAt: string
          updatedAt: string | null
          status: string
        }
        Insert: {
          id?: string
          address: string
          postalCode: string
          city: string
          floor?: string | null
          incidentType: string
          description: string
          location?: { lat: number; lng: number } | null
          photoUrl?: string | null
          reporterName?: string | null
          reporterEmail?: string | null
          createdAt?: string
          updatedAt?: string | null
          status?: string
        }
        Update: {
          id?: string
          address?: string
          postalCode?: string
          city?: string
          floor?: string | null
          incidentType?: string
          description?: string
          location?: { lat: number; lng: number } | null
          photoUrl?: string | null
          reporterName?: string | null
          reporterEmail?: string | null
          createdAt?: string
          updatedAt?: string | null
          status?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

