export interface GeoLocation {
  lat: number
  lon: number
  name: string
  country: string
}

export interface Place {
  xid: string
  name: string
  dist: number
  rate: number
  kinds: string
  point: {
    lon: number
    lat: number
  }
}

export interface PlaceDetail {
  xid: string
  name: string
  kinds: string
  address?: {
    city?: string
    road?: string
    house_number?: string
    postcode?: string
    country?: string
  }
  preview?: {
    source: string
    height: number
    width: number
  }
  wikipedia_extracts?: {
    text: string
  }
  url?: string
  point: {
    lon: number
    lat: number
  }
}

export interface PlacesState {
  searchQuery: string
  location: GeoLocation | null
  places: Place[]
  selectedPlace: PlaceDetail | null
  loading: boolean
  error: string | null
}
