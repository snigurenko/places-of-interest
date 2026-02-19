import { defineStore } from 'pinia'
import { geocodeLocation, fetchPlaces, fetchPlaceDetails } from '@/services/mapService'
import type { PlacesState } from '@/types'

export const usePlacesStore = defineStore('places', {
  state: (): PlacesState => ({
    location: null,
  }),

})