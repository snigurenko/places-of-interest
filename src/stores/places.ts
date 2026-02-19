import { defineStore } from 'pinia'
import { geocodeLocation, fetchPlaces } from '@/services/mapService'
import type { PlacesState } from '@/types'

export const usePlacesStore = defineStore('places', {
  state: (): PlacesState => ({
    location: null,
    places: [],
    selectedPlace: null,
    loading: false,
    error: null
  }),

  getters: {
    totalPlaces: (state): number => state.places.length
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
        this.places = await fetchPlaces(geo.lat, geo.lon)
      } catch {
        this.error = 'Location not found. Please try a different name.'
      } finally {
        this.loading = false
      }
    },
  }

})