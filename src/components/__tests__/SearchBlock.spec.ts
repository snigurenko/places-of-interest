import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import SearchBlock from '../SearchBlock.vue'
import { usePlacesStore } from '@/stores/places'

describe('SearchBlock', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  function mountComponent() {
    return mount(SearchBlock, {
      global: { plugins: [createPinia()] },
    })
  }

  it('renders the title', () => {
    const wrapper = mountComponent()
    expect(wrapper.find('.search-title').text()).toBe('Places of Interest')
  })

  it('shows the default search query in the input', () => {
    const wrapper = mountComponent()
    const input = wrapper.find('input')
    expect(input.element.value).toBe('Alicante')
  })

  it('disables input and button while loading', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = usePlacesStore()
    store.$patch({ loading: true })

    const wrapper = mount(SearchBlock, { global: { plugins: [pinia] } })

    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('disables button when query is empty', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = usePlacesStore()
    store.$patch({ searchQuery: '   ' })

    const wrapper = mount(SearchBlock, { global: { plugins: [pinia] } })

    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
  })

  it('calls searchLocation on button click', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = usePlacesStore()
    store.searchLocation = vi.fn()
    store.$patch({ searchQuery: 'Madrid' })

    const wrapper = mount(SearchBlock, { global: { plugins: [pinia] } })
    await wrapper.find('button').trigger('click')

    expect(store.searchLocation).toHaveBeenCalledWith('Madrid')
  })

  it('calls searchLocation on Enter key', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = usePlacesStore()
    store.searchLocation = vi.fn()
    store.$patch({ searchQuery: 'Barcelona' })

    const wrapper = mount(SearchBlock, { global: { plugins: [pinia] } })
    await wrapper.find('input').trigger('keyup.enter')

    expect(store.searchLocation).toHaveBeenCalledWith('Barcelona')
  })

  it('does not call searchLocation when query is blank', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = usePlacesStore()
    store.searchLocation = vi.fn()
    store.$patch({ searchQuery: '  ' })

    const wrapper = mount(SearchBlock, { global: { plugins: [pinia] } })
    await wrapper.find('button').trigger('click')

    expect(store.searchLocation).not.toHaveBeenCalled()
  })

  it('shows error message when store has error', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = usePlacesStore()
    store.$patch({ error: 'Location not found.' })

    const wrapper = mount(SearchBlock, { global: { plugins: [pinia] } })

    expect(wrapper.find('.error').text()).toBe('Location not found.')
  })

  it('shows result info when location is set', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = usePlacesStore()
    store.$patch({
      location: { lat: 38.34, lon: -0.48, name: 'Alicante', country: 'ES' },
      places: [
        { xid: '1', name: 'A', dist: 100, rate: 3, kinds: 'art', point: { lon: 1, lat: 1 } },
        { xid: '2', name: 'B', dist: 200, rate: 2, kinds: 'park', point: { lon: 2, lat: 2 } },
      ],
    })

    const wrapper = mount(SearchBlock, { global: { plugins: [pinia] } })
    const info = wrapper.find('.info')

    expect(info.exists()).toBe(true)
    expect(info.text()).toContain('2')
    expect(info.text()).toContain('Alicante')
  })

  it('hides info while loading', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = usePlacesStore()
    store.$patch({
      loading: true,
      location: { lat: 38.34, lon: -0.48, name: 'Alicante', country: 'ES' },
    })

    const wrapper = mount(SearchBlock, { global: { plugins: [pinia] } })

    expect(wrapper.find('.info').exists()).toBe(false)
  })

  it('shows loader spinner when loading', () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const store = usePlacesStore()
    store.$patch({ loading: true, searchQuery: 'test' })

    const wrapper = mount(SearchBlock, { global: { plugins: [pinia] } })

    expect(wrapper.find('.loader').exists()).toBe(true)
  })
})
