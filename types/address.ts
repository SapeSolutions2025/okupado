export interface Address {
  formattedAddress: string
  location: {
    lat: number
    lng: number
  }
  city: string
  postalCode: string
}

