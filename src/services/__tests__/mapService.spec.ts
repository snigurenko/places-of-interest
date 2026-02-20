import { describe, it, expect, vi, beforeEach } from 'vitest'
import axios from 'axios'
import { geocodeLocation, fetchPlaces, fetchPlaceDetails } from '../mapService'

vi.mock('axios')
const mockedAxios = vi.mocked(axios, { deep: true })

beforeEach(() => {
  vi.clearAllMocks()
})

describe('geocodeLocation', () => {
  it('returns geo data when API responds with valid coordinates', async () => {
    const geoData = { lat: 38.34, lon: -0.48, name: 'Alicante', country: 'ES' }
    mockedAxios.get.mockResolvedValue({ data: geoData })

    const result = await geocodeLocation('Alicante')

    expect(result).toEqual(geoData)
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/places/geoname'),
      expect.objectContaining({ params: { name: 'Alicante' } }),
    )
  })

  it('throws when API returns no lat', async () => {
    mockedAxios.get.mockResolvedValue({ data: { lat: 0, lon: -0.48 } })
    await expect(geocodeLocation('Unknown')).rejects.toThrow('Location not found')
  })

  it('throws when API returns no lon', async () => {
    mockedAxios.get.mockResolvedValue({ data: { lat: 38.34, lon: 0 } })
    await expect(geocodeLocation('Unknown')).rejects.toThrow('Location not found')
  })

  it('propagates network errors', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network Error'))
    await expect(geocodeLocation('Anywhere')).rejects.toThrow('Network Error')
  })
})

describe('fetchPlaces', () => {
  const samplePlaces = [
    { xid: '1', name: 'Castle', dist: 500, rate: 3, kinds: 'historic', point: { lon: 1, lat: 1 } },
    { xid: '2', name: 'Museum', dist: 800, rate: 2, kinds: 'museums', point: { lon: 2, lat: 2 } },
  ]

  it('returns list of places from API', async () => {
    mockedAxios.get.mockResolvedValue({ data: samplePlaces })

    const result = await fetchPlaces(38.34, -0.48)

    expect(result).toEqual(samplePlaces)
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/places/radius'),
      expect.objectContaining({
        params: expect.objectContaining({
          lat: 38.34,
          lon: -0.48,
          radius: 10000,
          format: 'json',
        }),
      }),
    )
  })

  it('passes correct headers', async () => {
    mockedAxios.get.mockResolvedValue({ data: [] })

    await fetchPlaces(0, 0)

    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-RapidAPI-Host': 'opentripmap-places-v1.p.rapidapi.com',
        }),
      }),
    )
  })

  it('propagates network errors', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Timeout'))
    await expect(fetchPlaces(0, 0)).rejects.toThrow('Timeout')
  })
})

describe('fetchPlaceDetails', () => {
  const detailData = {
    xid: 'abc',
    name: 'Alicante Castle',
    kinds: 'historic,fortifications',
    address: { city: 'Alicante', country: 'Spain' },
    point: { lon: -0.48, lat: 38.34 },
  }

  it('returns place details from API', async () => {
    mockedAxios.get.mockResolvedValue({ data: detailData })

    const result = await fetchPlaceDetails('abc')

    expect(result).toEqual(detailData)
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining('/places/xid/abc'),
      expect.objectContaining({ headers: expect.any(Object) }),
    )
  })

  it('propagates network errors', async () => {
    mockedAxios.get.mockRejectedValue(new Error('500 Internal Server Error'))
    await expect(fetchPlaceDetails('xyz')).rejects.toThrow('500 Internal Server Error')
  })
})
