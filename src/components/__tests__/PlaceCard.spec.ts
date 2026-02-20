import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PlaceCard from '../PlaceCard.vue'
import type { Place } from '@/types'

function makePlace(overrides: Partial<Place> = {}): Place {
  return {
    xid: 'abc123',
    name: 'Test Place',
    dist: 1500,
    rate: 3,
    kinds: 'historic_architecture,museums',
    point: { lon: -0.48, lat: 38.34 },
    ...overrides,
  }
}

describe('PlaceCard', () => {
  it('renders place name', () => {
    const wrapper = mount(PlaceCard, { props: { place: makePlace() } })
    expect(wrapper.find('.name').text()).toBe('Test Place')
  })

  it('shows "Unnamed place" when name is empty', () => {
    const wrapper = mount(PlaceCard, { props: { place: makePlace({ name: '' }) } })
    expect(wrapper.find('.name').text()).toBe('Unnamed place')
  })

  it('displays the primary category from kinds', () => {
    const wrapper = mount(PlaceCard, { props: { place: makePlace() } })
    expect(wrapper.find('.category').text()).toBe('historic architecture')
  })

  it('falls back to "Point of interest" when kinds is empty', () => {
    const wrapper = mount(PlaceCard, {
      props: { place: makePlace({ kinds: '' }) },
    })
    expect(wrapper.find('.category').text()).toBe('Point of interest')
  })

  it('formats distance in meters when under 1000', () => {
    const wrapper = mount(PlaceCard, { props: { place: makePlace({ dist: 450 }) } })
    expect(wrapper.find('.distance').text()).toBe('450 m')
  })

  it('formats distance in km when 1000 or above', () => {
    const wrapper = mount(PlaceCard, { props: { place: makePlace({ dist: 2500 }) } })
    expect(wrapper.find('.distance').text()).toBe('2.5 km')
  })

  it('shows empty string for distance when dist is null', () => {
    const wrapper = mount(PlaceCard, {
      props: { place: makePlace({ dist: undefined as unknown as number }) },
    })
    expect(wrapper.find('.distance').text()).toBe('')
  })

  it('applies active class when isSelected is true', () => {
    const wrapper = mount(PlaceCard, {
      props: { place: makePlace(), isSelected: true },
    })
    expect(wrapper.find('.place-card').classes()).toContain('active')
  })

  it('does not apply active class by default', () => {
    const wrapper = mount(PlaceCard, { props: { place: makePlace() } })
    expect(wrapper.find('.place-card').classes()).not.toContain('active')
  })

  it('emits select event with xid on click', async () => {
    const wrapper = mount(PlaceCard, { props: { place: makePlace({ xid: 'xyz' }) } })
    await wrapper.find('.place-card').trigger('click')

    expect(wrapper.emitted('select')).toHaveLength(1)
    expect(wrapper.emitted('select')![0]).toEqual(['xyz'])
  })
})
