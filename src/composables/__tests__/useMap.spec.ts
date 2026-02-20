import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ref, defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import type { Place } from '@/types'

const { mapInstance, markerInstance, popupInstance, MapConstructor, MarkerConstructor, PopupConstructor } =
  vi.hoisted(() => {
    const mapInstance = {
      addControl: vi.fn(),
      flyTo: vi.fn(),
      remove: vi.fn(),
      on: vi.fn(),
    }
    const markerInstance = {
      setLngLat: vi.fn().mockReturnThis(),
      setPopup: vi.fn().mockReturnThis(),
      addTo: vi.fn().mockReturnThis(),
      remove: vi.fn(),
    }
    const popupInstance = {
      setHTML: vi.fn().mockReturnThis(),
    }
    const MapConstructor = vi.fn(function (this: typeof mapInstance) {
      Object.assign(this, mapInstance)
    })
    const MarkerConstructor = vi.fn(function (this: typeof markerInstance) {
      Object.assign(this, markerInstance)
    })
    const PopupConstructor = vi.fn(function (this: typeof popupInstance) {
      Object.assign(this, popupInstance)
    })

    return { mapInstance, markerInstance, popupInstance, MapConstructor, MarkerConstructor, PopupConstructor }
  })

vi.mock('mapbox-gl', () => ({
  default: {
    accessToken: '',
    Map: MapConstructor,
    Marker: MarkerConstructor,
    Popup: PopupConstructor,
    NavigationControl: vi.fn(),
  },
}))

import { useMap } from '../useMap'

function makePlace(overrides: Partial<Place> = {}): Place {
  return {
    xid: 'p1',
    name: 'Test Place',
    dist: 500,
    rate: 3,
    kinds: 'historic_architecture,museums',
    point: { lon: -0.48, lat: 38.34 },
    ...overrides,
  }
}

function mountComposable() {
  let result!: ReturnType<typeof useMap>

  const Wrapper = defineComponent({
    setup() {
      const container = ref<HTMLElement | null>(null)
      result = useMap(container)
      return { container }
    },
    template: '<div ref="container"></div>',
  })

  const wrapper = mount(Wrapper, { attachTo: document.body })
  return { wrapper, result }
}

beforeEach(() => {
  vi.clearAllMocks()
  markerInstance.setLngLat.mockReturnThis()
  markerInstance.setPopup.mockReturnThis()
  markerInstance.addTo.mockReturnThis()
  popupInstance.setHTML.mockReturnThis()
})

describe('useMap', () => {
  describe('initialization', () => {
    it('creates a Mapbox Map on mount', () => {
      mountComposable()

      expect(MapConstructor).toHaveBeenCalledTimes(1)
      expect(MapConstructor).toHaveBeenCalledWith(
        expect.objectContaining({
          style: 'mapbox://styles/mapbox/streets-v12',
          zoom: 17,
        }),
      )
    })

    it('adds NavigationControl', () => {
      mountComposable()
      expect(mapInstance.addControl).toHaveBeenCalledWith(expect.any(Object), 'top-right')
    })

    it('does not create map when container ref is not bound to DOM', () => {
      let result!: ReturnType<typeof useMap>

      const Wrapper = defineComponent({
        setup() {
          const container = ref<HTMLElement | null>(null)
          result = useMap(container)
          return {}
        },
        template: '<div></div>',
      })

      mount(Wrapper)
      expect(result.map.value).toBeNull()
    })
  })

  describe('flyTo', () => {
    it('calls map.flyTo with correct parameters', () => {
      const { result } = mountComposable()
      result.flyTo(2.17, 41.38)

      expect(mapInstance.flyTo).toHaveBeenCalledWith({
        center: [2.17, 41.38],
        zoom: 15,
        duration: 1500,
      })
    })

    it('does not throw when map is null', () => {
      let result!: ReturnType<typeof useMap>

      const Wrapper = defineComponent({
        setup() {
          const container = ref<HTMLElement | null>(null)
          result = useMap(container)
          return {}
        },
        template: '<div></div>',
      })

      mount(Wrapper)
      expect(() => result.flyTo(0, 0)).not.toThrow()
    })
  })

  describe('setMarkers', () => {
    it('creates markers for each place with a valid point', () => {
      const { result } = mountComposable()
      const places = [makePlace({ xid: 'a' }), makePlace({ xid: 'b' })]

      result.setMarkers(places, vi.fn())

      expect(MarkerConstructor).toHaveBeenCalledTimes(2)
      expect(markerInstance.addTo).toHaveBeenCalledTimes(2)
    })

    it('sets correct coordinates on each marker', () => {
      const { result } = mountComposable()

      result.setMarkers([makePlace({ point: { lon: 10, lat: 20 } })], vi.fn())

      expect(markerInstance.setLngLat).toHaveBeenCalledWith([10, 20])
    })

    it('creates popup with place name', () => {
      const { result } = mountComposable()

      result.setMarkers([makePlace({ name: 'My Castle' })], vi.fn())

      expect(PopupConstructor).toHaveBeenCalledWith({ offset: 25, closeButton: false })
      const htmlArg = popupInstance.setHTML.mock.calls[0]![0] as string
      expect(htmlArg).toContain('My Castle')
    })

    it('uses "Unnamed place" when name is empty', () => {
      const { result } = mountComposable()

      result.setMarkers([makePlace({ name: '' })], vi.fn())

      const htmlArg = popupInstance.setHTML.mock.calls[0]![0] as string
      expect(htmlArg).toContain('Unnamed place')
    })

    it('formats kind by replacing underscores with spaces', () => {
      const { result } = mountComposable()

      result.setMarkers([makePlace({ kinds: 'historic_architecture,museums' })], vi.fn())

      const htmlArg = popupInstance.setHTML.mock.calls[0]![0] as string
      expect(htmlArg).toContain('historic architecture')
    })

    it('skips places without a point', () => {
      const { result } = mountComposable()
      const noPoint = { ...makePlace(), point: undefined } as unknown as Place

      result.setMarkers([noPoint], vi.fn())

      expect(MarkerConstructor).not.toHaveBeenCalled()
    })

    it('removes old markers before adding new ones', () => {
      const { result } = mountComposable()
      result.setMarkers([makePlace()], vi.fn())

      markerInstance.remove.mockClear()
      result.setMarkers([makePlace()], vi.fn())

      expect(markerInstance.remove).toHaveBeenCalled()
    })

    it('invokes callback with xid on marker element click', () => {
      const { result } = mountComposable()
      const callback = vi.fn()

      result.setMarkers([makePlace({ xid: 'clicked-id' })], callback)

      const calls = MarkerConstructor.mock.calls as unknown as HTMLElement[][]
      const createdEl = calls[0]![0]!
      createdEl.click()

      expect(callback).toHaveBeenCalledWith('clicked-id')
    })
  })

  describe('cleanup', () => {
    it('removes map on unmount', () => {
      const { wrapper } = mountComposable()
      wrapper.unmount()
      expect(mapInstance.remove).toHaveBeenCalled()
    })
  })
})
