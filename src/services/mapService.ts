import axios from 'axios'
import type { GeoLocation, Place, PlaceDetail } from '@/types'

const BASE_URL = 'https://opentripmap-places-v1.p.rapidapi.com/en'

const headers = {
  'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
  'X-RapidAPI-Host': 'opentripmap-places-v1.p.rapidapi.com',
}

let searchController: AbortController | null = null

export async function geocodeLocation(name: string): Promise<GeoLocation> {
  searchController?.abort()
  searchController = new AbortController()

  const { data } = await axios.get(`${BASE_URL}/places/geoname`, {
    params: { name },
    headers,
    signal: searchController.signal,
  })
  if (data.lat == null || data.lon == null) throw new Error('Location not found')
  return data
}

export async function fetchPlaces(lat: number, lon: number): Promise<Place[]> {
  if (import.meta.env.DEV) {
    console.log('🔍 Fetching places for:', { lat, lon, radius: 10000 })
  }

  const { data } = await axios.get(`${BASE_URL}/places/radius`, {
    params: {
      radius: 10000,
      lon,
      lat,
      // Maximum limit by default is 500 (free subscription cap).
      // limit: 500,
      // rate: 2,
      format: 'json',
    },
    headers,
    signal: searchController?.signal,
  })

  if (import.meta.env.DEV && data.length > 0) {
    const distances = data.map((p: Place) => p.dist)
    console.log('📦 Total places returned:', data.length)
    console.log(
      '📍 Distance range:',
      Math.min(...distances).toFixed(0) + 'm',
      '—',
      Math.max(...distances).toFixed(0) + 'm',
    )
  }

  return data
}

export async function fetchPlaceDetails(xid: string): Promise<PlaceDetail> {
  const { data } = await axios.get(`${BASE_URL}/places/xid/${xid}`, {
    headers,
  })
  return data
}
