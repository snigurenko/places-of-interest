import { shallowRef, onMounted, onUnmounted, type Ref } from 'vue'
import mapboxgl from 'mapbox-gl'
import type { Place } from '@/types'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN

export function useMap(container: Ref<HTMLElement | null>) {
  const map = shallowRef<mapboxgl.Map | null>(null)
  const markers = shallowRef<mapboxgl.Marker[]>([])

  onMounted(() => {
    if (!container.value) return
    map.value = new mapboxgl.Map({
      container: container.value,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-0.481, 38.3452],
      zoom: 17,
    })
    map.value.addControl(new mapboxgl.NavigationControl(), 'top-right')
  })

  function flyTo(lon: number, lat: number): void {
    map.value?.flyTo({ center: [lon, lat], zoom: 15, duration: 1500 })
  }

  function setMarkers(places: Place[], onClickCallback: (xid: string) => void): void {
    markers.value.forEach((m) => m.remove())
    markers.value = []

    if (!map.value) return

    places.forEach((place) => {
      if (!place.point) return

      const el = document.createElement('div')
      el.className = 'map-marker'

      const popupContent = document.createElement('div')
      popupContent.className = 'map-popup'
      const strong = document.createElement('strong')
      strong.textContent = place.name || 'Unnamed place'
      const span = document.createElement('span')
      span.textContent = place.kinds?.split(',')[0]?.replace(/_/g, ' ') || ''
      popupContent.appendChild(strong)
      popupContent.appendChild(span)

      const popup = new mapboxgl.Popup({ offset: 25, closeButton: false }).setDOMContent(
        popupContent,
      )

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
