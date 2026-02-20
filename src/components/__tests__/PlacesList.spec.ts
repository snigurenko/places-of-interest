import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import PlacesList from '../PlacesList.vue'
import { usePlacesStore } from '@/stores/places'
import type { Place } from '@/types'

const samplePlaces: Place[] = [
  { xid: '1', name: 'Castle', dist: 500, rate: 3, kinds: 'historic', point: { lon: 1, lat: 1 } },
  { xid: '2', name: 'Museum', dist: 800, rate: 2, kinds: 'museums', point: { lon: 2, lat: 2 } },
]

describe('PlacesList', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  function mountWithState(stateOverrides: Record<string, unknown> = {}) {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = usePlacesStore()
    store.$patch(stateOverrides)
    return { wrapper: mount(PlacesList, { global: { plugins: [pinia] } }), store }
  }

  it('shows empty state when there are no results and not loading', () => {
    const { wrapper } = mountWithState({ places: [], loading: false })
    expect(wrapper.find('.empty').exists()).toBe(true)
    expect(wrapper.find('.empty').text()).toContain('Search for a location')
  })

  it('shows skeleton loading cards while loading', () => {
    const { wrapper } = mountWithState({ loading: true })

    expect(wrapper.find('.skeleton-list').exists()).toBe(true)
    expect(wrapper.findAll('.skeleton-card')).toHaveLength(6)
  })

  it('does not show empty state while loading', () => {
    const { wrapper } = mountWithState({ loading: true, places: [] })
    expect(wrapper.find('.empty').exists()).toBe(false)
  })

  it('renders PlaceCard for each place', () => {
    const { wrapper } = mountWithState({ places: samplePlaces })

    expect(wrapper.find('.list-header').text()).toBe('Results')
    const cards = wrapper.findAll('.place-card')
    expect(cards).toHaveLength(2)
  })

  it('marks the selected place card as active', () => {
    const { wrapper } = mountWithState({
      places: samplePlaces,
      selectedPlace: {
        xid: '2',
        name: 'Museum',
        kinds: 'museums',
        point: { lon: 2, lat: 2 },
      },
    })

    const cards = wrapper.findAll('.place-card')
    expect(cards[0]?.classes()).not.toContain('active')
    expect(cards[1]?.classes()).toContain('active')
  })

  it('calls selectPlace when a card is clicked', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = usePlacesStore()
    store.selectPlace = vi.fn()
    store.$patch({ places: samplePlaces })

    const wrapper = mount(PlacesList, { global: { plugins: [pinia] } })
    await wrapper.findAll('.place-card')[0]?.trigger('click')

    expect(store.selectPlace).toHaveBeenCalledWith('1')
  })
})
