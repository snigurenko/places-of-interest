import axios from 'axios'
import type { GeoLocation, Place, PlaceDetail } from '@/types'

const BASE_URL = 'https://opentripmap-places-v1.p.rapidapi.com/en'

const headers = {
  'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
  'X-RapidAPI-Host': 'opentripmap-places-v1.p.rapidapi.com',
}

export async function geocodeLocation(name: string): Promise<GeoLocation> {
  const { data } = await axios.get(`${BASE_URL}/places/geoname`, {
    params: { name },
    headers,
  })
  if (!data.lat || !data.lon) throw new Error('Location not found')
  return data
}

export async function fetchPlaces(lat: number, lon: number): Promise<Place[]> {
  console.log('🔍 Fetching places for:', { lat, lon, radius: 10000 })

  const { data } = await axios.get(`${BASE_URL}/places/radius`, {
    params: {
      radius: 10000,
      lon,
      lat,
      // maximum limits be default is 500, I suppose because of free subscripion.
      // limit: 500, // use it to see more places in larges cities, but beware of rate limits
      // rate: 2,
      format: 'json',
    },
    headers,
  })
  // I am gonna put this logs to be shure that API returns reasonable data
  // and to get a sense of distance distribution, because it returns 0 places
  // in case of often requests. (as I use free subscription I supuse)
  console.log('📦 Total places returned:', data.length)
  console.log(
    '📍 Distance range:',
    Math.min(...data.map((p: Place) => p.dist)).toFixed(0) + 'm',
    '—',
    Math.max(...data.map((p: Place) => p.dist)).toFixed(0) + 'm',
  )

  return data
}

export async function fetchPlaceDetails(xid: string): Promise<PlaceDetail> {
  const { data } = await axios.get(`${BASE_URL}/places/xid/${xid}`, {
    headers,
  })
  return data
}
