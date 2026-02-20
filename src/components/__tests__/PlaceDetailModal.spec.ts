import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import PlaceDetailModal from '../PlaceDetailModal.vue'
import { usePlacesStore } from '@/stores/places'
import type { PlaceDetail } from '@/types'

const fullPlace: PlaceDetail = {
  xid: 'abc',
  name: 'Santa Barbara Castle',
  kinds: 'historic,fortifications,architecture',
  address: {
    road: 'Calle Mayor',
    house_number: '10',
    city: 'Alicante',
    country: 'Spain',
  },
  preview: {
    source: 'https://example.com/photo.jpg',
    height: 300,
    width: 400,
  },
  wikipedia_extracts: { text: 'A beautiful medieval castle.' },
  url: 'https://example.com',
  point: { lon: -0.48, lat: 38.34 },
}

describe('PlaceDetailModal', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  function mountWithPlace(place: PlaceDetail | null = null) {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = usePlacesStore()
    if (place) store.$patch({ selectedPlace: place })
    return { wrapper: mount(PlaceDetailModal, { global: { plugins: [pinia] } }), store }
  }

  it('is hidden when no place is selected', () => {
    const { wrapper } = mountWithPlace(null)
    expect(wrapper.find('.overlay').exists()).toBe(false)
  })

  it('renders modal when a place is selected', () => {
    const { wrapper } = mountWithPlace(fullPlace)
    expect(wrapper.find('.overlay').exists()).toBe(true)
    expect(wrapper.find('.modal').exists()).toBe(true)
  })

  it('displays place name', () => {
    const { wrapper } = mountWithPlace(fullPlace)
    expect(wrapper.find('h2').text()).toBe('Santa Barbara Castle')
  })

  it('shows "Unnamed place" for empty name', () => {
    const { wrapper } = mountWithPlace({ ...fullPlace, name: '' })
    expect(wrapper.find('h2').text()).toBe('Unnamed place')
  })

  it('displays up to 3 category badges', () => {
    const { wrapper } = mountWithPlace(fullPlace)
    const badges = wrapper.findAll('.badge')
    expect(badges).toHaveLength(3)
    expect(badges[0]?.text()).toBe('historic')
    expect(badges[1]?.text()).toBe('fortifications')
    expect(badges[2]?.text()).toBe('architecture')
  })

  it('displays formatted address', () => {
    const { wrapper } = mountWithPlace(fullPlace)
    expect(wrapper.find('.address').text()).toContain('Calle Mayor')
    expect(wrapper.find('.address').text()).toContain('Alicante')
  })

  it('hides address when not available', () => {
    const { wrapper } = mountWithPlace({ ...fullPlace, address: undefined })
    expect(wrapper.find('.address').exists()).toBe(false)
  })

  it('displays wikipedia extract', () => {
    const { wrapper } = mountWithPlace(fullPlace)
    expect(wrapper.find('.desc').text()).toBe('A beautiful medieval castle.')
  })

  it('hides description when no wikipedia extracts', () => {
    const { wrapper } = mountWithPlace({ ...fullPlace, wikipedia_extracts: undefined })
    expect(wrapper.find('.desc').exists()).toBe(false)
  })

  it('renders "Learn more" link when url is present', () => {
    const { wrapper } = mountWithPlace(fullPlace)
    const link = wrapper.find('.link')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('https://example.com')
    expect(link.attributes('target')).toBe('_blank')
  })

  it('hides link when url is not present', () => {
    const { wrapper } = mountWithPlace({ ...fullPlace, url: undefined })
    expect(wrapper.find('.link').exists()).toBe(false)
  })

  it('sets background image style when preview is available', () => {
    const { wrapper } = mountWithPlace(fullPlace)
    const img = wrapper.find('.img')
    expect(img.attributes('style')).toContain('example.com/photo.jpg')
  })

  it('uses gradient fallback when no preview', () => {
    const { wrapper } = mountWithPlace({ ...fullPlace, preview: undefined })
    const img = wrapper.find('.img')
    expect(img.attributes('style')).toContain('linear-gradient')
  })

  it('calls clearSelectedPlace on close button click', async () => {
    const { wrapper, store } = mountWithPlace(fullPlace)
    store.clearSelectedPlace = vi.fn()

    await wrapper.find('.close').trigger('click')

    expect(store.clearSelectedPlace).toHaveBeenCalled()
  })

  it('calls clearSelectedPlace on overlay click', async () => {
    const { wrapper, store } = mountWithPlace(fullPlace)
    store.clearSelectedPlace = vi.fn()

    await wrapper.find('.overlay').trigger('click')

    expect(store.clearSelectedPlace).toHaveBeenCalled()
  })
})
