import { ref, onMounted, onUnmounted, type Ref } from 'vue'
import mapboxgl from 'mapbox-gl'
import type { Place } from '@/types'

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
      zoom: 14
    })
    map.value.addControl(new mapboxgl.NavigationControl(), 'top-right')
  })

  function flyTo(lon: number, lat: number): void {
    map.value?.flyTo({ center: [lon, lat], zoom: 13, duration: 1500 })
  }

  function setMarkers(places: Place[], onClickCallback: (xid: string) => void): void {
    markers.value.forEach((m) => m.remove())
    markers.value = []

    places.forEach((place) => {
      if (!place.point) return

      const el = document.createElement('div')
      el.className = 'map-marker'

      const popup = new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(`
        <div class="map-popup">
          <strong>${place.name || 'Unnamed place'}</strong>
          <span>${place.kinds?.split(',')[0].replace(/_/g, ' ') || ''}</span>
        </div>
      `)

      const marker = new mapboxgl.Marker(el)
        .setLngLat([place.point.lon, place.point.lat])
        .setPopup(popup)
        .addTo(map.value!)

      el.addEventListener('click', () => onClickCallback(place.xid))
      markers.value.push(marker)
    })
  }

  onUnmounted(() => map.value?.remove())

  return { map, flyTo, setMarkers }
}