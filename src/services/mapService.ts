import axios from 'axios'
import type { GeoLocation, Place, PlaceDetail } from '@/types'

const BASE_URL = 'https://opentripmap-places-v1.p.rapidapi.com/en'

const headers = {
  'X-RapidAPI-Key': import.meta.env.VITE_RAPIDAPI_KEY,
  'X-RapidAPI-Host': 'opentripmap-places-v1.p.rapidapi.com'
}

export async function geocodeLocation(name: string): Promise<GeoLocation> {
  const { data } = await axios.get(`${BASE_URL}/places/geoname`, {
    params: { name },
    headers
  })
  if (!data.lat || !data.lon) throw new Error('Location not found')
  return data
}

export async function fetchPlaces(lat: number, lon: number): Promise<Place[]> {
  const { data } = await axios.get(`${BASE_URL}/places/radius`, {
    params: {
      radius: 10000,
      lon,
      lat,
      limit: 50,
      rate: 2,  
      format: 'json'
    },
    headers
  })
  return data
}

export async function fetchPlaceDetails(xid: string): Promise<PlaceDetail> {
  const { data } = await axios.get(`${BASE_URL}/places/xid/${xid}`, {
    headers
  })
  return data
}