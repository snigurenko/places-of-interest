import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

export function useMap(container: Ref<HTMLElement | null>) {
  const map = ref<mapboxgl.Map | null>(null)
  const markers = ref<mapboxgl.Marker[]>([])

  onMounted(() => {
    if (!container.value) return
    map.value = new mapboxgl.Map({
      container: container.value,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [4.9, 52.37],
      zoom: 11
    })
  })
 
  onUnmounted(() => map.value?.remove())

  return { map }
}