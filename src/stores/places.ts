import { defineStore } from 'pinia'
import { geocodeLocation, fetchPlaces, fetchPlaceDetails } from '@/services/mapService'
import type { PlacesState } from '@/types'

const DEFAULT_LOCATION = 'Alicante'

export const usePlacesStore = defineStore('places', {
  state: (): PlacesState => ({
    searchQuery: DEFAULT_LOCATION,
    location: null,
    places: [],
    selectedPlace: null,
    loading: false,
    error: null,
  }),

  getters: {
    hasResults: (state): boolean => state.places.length > 0,
    totalPlaces: (state): number => state.places.length,
  },

  actions: {
    async searchLocation(locationName: string): Promise<void> {
      this.loading = true
      this.error = null
      this.places = []
      this.selectedPlace = null
      try {
        const geo = await geocodeLocation(locationName)
        this.location = geo
        const allPlaces = await fetchPlaces(geo.lat, geo.lon)

        const seen = new Set<string>()

        this.places = allPlaces.filter((place) => {
          // remove places without valid coordinates
          if (!place.point?.lat || !place.point?.lon) return false

          // remove places that are essentially the city center (same coordinates as geocoded location)
          const isCityCenter =
            Math.abs(place.point.lat - geo.lat) < 0.0001 &&
            Math.abs(place.point.lon - geo.lon) < 0.0001
          if (isCityCenter) return false

          // remove duplicates based on rounded coordinates (4 decimal places ≈ 10 meters)
          const key = `${place.point.lat.toFixed(4)},${place.point.lon.toFixed(4)}`
          if (seen.has(key)) return false
          seen.add(key)

          return true
        })
      } catch {
        this.error = 'Location not found. Please try a different name.'
      } finally {
        this.loading = false
      }
    },

    async selectPlace(xid: string): Promise<void> {
      try {
        this.selectedPlace = await fetchPlaceDetails(xid)
      } catch {
        this.error = 'Could not load place details.'
      }
    },

    clearSelectedPlace(): void {
      this.selectedPlace = null
    },
  },
})
