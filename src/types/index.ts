export interface GeoLocation {
  lat: number
  lon: number
  name: string
  country: string
}

export interface PlacesState {
  location: GeoLocation | null
}