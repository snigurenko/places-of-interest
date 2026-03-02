<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import { usePlacesStore } from '@/stores/places'

const store = usePlacesStore()
const modalRef = ref<HTMLElement | null>(null)

const categories = computed(
  () =>
    store.selectedPlace?.kinds
      ?.split(',')
      .slice(0, 3)
      .map((k) => k.replace(/_/g, ' ')) ?? [],
)
const address = computed(() => {
  const a = store.selectedPlace?.address
  if (!a) return ''
  return [a.road, a.house_number, a.city, a.country].filter(Boolean).join(', ')
})
const imgStyle = computed(() => {
  const src = store.selectedPlace?.preview?.source
  return src
    ? { backgroundImage: `url(${src})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: 'linear-gradient(135deg, #667eea, #764ba2)' }
})

function handleKeydown(e: KeyboardEvent): void {
  if (e.key === 'Escape') store.clearSelectedPlace()
}

watch(
  () => store.selectedPlace,
  async (place) => {
    if (place) {
      await nextTick()
      modalRef.value?.focus()
    }
  },
)
</script>

<template>
  <Transition name="slide">
    <div
      v-if="store.selectedPlace"
      class="overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Place details"
      @click.self="store.clearSelectedPlace"
      @keydown="handleKeydown"
    >
      <div ref="modalRef" class="modal" tabindex="-1">
        <button class="close" aria-label="Close" @click="store.clearSelectedPlace">✕</button>
        <div class="img" :style="imgStyle" />
        <div class="content">
          <p v-if="store.detailError" class="detail-error">{{ store.detailError }}</p>
          <div class="badges">
            <span v-for="cat in categories" :key="cat" class="badge">{{ cat }}</span>
          </div>
          <h2>{{ store.selectedPlace.name || 'Unnamed place' }}</h2>
          <p v-if="address" class="address">{{ address }}</p>
          <p v-if="store.selectedPlace.wikipedia_extracts?.text" class="desc">
            {{ store.selectedPlace.wikipedia_extracts.text }}
          </p>
          <a
            v-if="store.selectedPlace.url"
            :href="store.selectedPlace.url"
            target="_blank"
            rel="noopener noreferrer"
            class="link"
          >
            Learn more:
          </a>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  padding-left: var(--sidebar-width);
}
.modal {
  background: white;
  border-radius: 16px 16px 0 0;
  width: 380px;
  max-height: 70vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.2);
}
.close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  font-size: 14px;
}
.img {
  height: 160px;
  border-radius: 16px 16px 0 0;
}
.content {
  padding: 16px 20px 24px;
}
.badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
}
.badge {
  font-size: 11px;
  text-transform: uppercase;
  color: #3b82f6;
  background: #eff6ff;
  padding: 3px 10px;
  border-radius: 20px;
  font-weight: 600;
}
h2 {
  font-size: 20px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 8px;
}
.address {
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 12px;
}
.desc {
  font-size: 14px;
  line-height: 1.6;
  color: #374151;
  margin: 0 0 16px;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.detail-error {
  margin: 0 0 12px;
  font-size: 13px;
  color: #ef4444;
}
.link {
  font-size: 14px;
  font-weight: 600;
  color: #3b82f6;
  text-decoration: none;
}
.slide-enter-active,
.slide-leave-active {
  transition:
    opacity 0.25s,
    transform 0.25s;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(40px);
}
</style>
