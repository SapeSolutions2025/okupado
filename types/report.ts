export interface Report {
  id: string
  address: string
  postalCode: string
  city: string
  floor: string | null
  incidentType: string
  description: string
  location: {
    lat: number
    lng: number
  } | null
  photoUrl: string | null
  reporterName: string | null
  reporterEmail: string | null
  createdAt: string
  updatedAt?: string | null
  status?: string
}

