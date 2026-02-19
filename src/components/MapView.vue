<script setup lang="ts">
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlacesStore } from '../stores/places'
import { useMap } from '../composables/useMap'

const mapContainer = ref<HTMLElement | null>(null)
const store = usePlacesStore()
const { places, location } = storeToRefs(store)
const { flyTo, setMarkers } = useMap(mapContainer)

watch(location, (loc) => { if (loc) flyTo(loc.lon, loc.lat) })
watch(places, (newPlaces) => {
  setMarkers(newPlaces, (xid: string) => store.selectPlace(xid))
})
</script>

<template>
  <div ref="mapContainer" class="map-container" />
</template>

<style scoped>
  .map-container { width: 100%; height: 100%; }
</style>

<!-- Unscoped: Mapbox injects markers/popups outside Vue's scoped DOM -->
<style>
  .map-marker {
    width: 24px; height: 24px; background: #3b82f6;
    border: 3px solid white; border-radius: 50%; cursor: pointer;
    box-shadow: 0 2px 8px rgba(59,130,246,0.5); transition: transform 0.15s;
  }
  .map-marker:hover { transform: scale(1.3); }
  .map-popup strong { display: block; font-size: 13px; color: #1a1a2e; margin-bottom: 2px; }
  .map-popup span { font-size: 11px; color: #6b7280; text-transform: capitalize; }
  .mapboxgl-popup-content {
    border-radius: 10px !important;
    padding: 10px 14px !important;
  }
</style>