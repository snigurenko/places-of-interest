import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import MapView from '../MapView.vue'

vi.mock('mapbox-gl', () => {
  const NavigationControl = vi.fn()
  const Popup = vi.fn(function (this: Record<string, unknown>) {
    this.setHTML = vi.fn().mockReturnValue(this)
    this.setDOMContent = vi.fn().mockReturnValue(this)
  })
  const Marker = vi.fn(function (this: Record<string, unknown>) {
    this.setLngLat = vi.fn().mockReturnValue(this)
    this.setPopup = vi.fn().mockReturnValue(this)
    this.addTo = vi.fn().mockReturnValue(this)
    this.remove = vi.fn()
  })
  const Map = vi.fn(function (this: Record<string, unknown>) {
    this.addControl = vi.fn()
    this.flyTo = vi.fn()
    this.remove = vi.fn()
    this.on = vi.fn()
  })

  return {
    default: {
      accessToken: '',
      Map,
      Marker,
      Popup,
      NavigationControl,
    },
  }
})

describe('MapView', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renders the map container element', () => {
    const wrapper = mount(MapView, {
      global: { plugins: [createPinia()] },
    })
    expect(wrapper.find('.map-container').exists()).toBe(true)
  })

  it('initializes mapbox Map on mount', async () => {
    const mapboxgl = await import('mapbox-gl')
    const MapConstructor = mapboxgl.default.Map as unknown as ReturnType<typeof vi.fn>
    MapConstructor.mockClear()

    mount(MapView, {
      global: { plugins: [createPinia()] },
      attachTo: document.body,
    })

    expect(MapConstructor).toHaveBeenCalledTimes(1)
  })
})
