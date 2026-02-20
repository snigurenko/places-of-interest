<script setup lang="ts">
import { usePlacesStore } from '@/stores/places'
import PlaceCard from './PlaceCard.vue'

const store = usePlacesStore()
</script>

<template>
  <div class="places-list">
    <div v-if="store.loading" class="skeleton-list">
      <div v-for="i in 6" :key="i" class="skeleton-card">
        <div class="skeleton short" />
        <div class="skeleton" />
      </div>
    </div>

    <div v-else-if="!store.hasResults" class="empty">
      <p>Search for a location to discover nearby places</p>
    </div>

    <template v-else>
      <p class="list-header">Results</p>
      <div class="scroll">
        <PlaceCard
          v-for="place in store.places"
          :key="place.xid"
          :place="place"
          :is-selected="store.selectedPlace?.xid === place.xid"
          @select="store.selectPlace"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.places-list {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 0 12px;
}
.list-header {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #9ca3af;
  padding: 0 4px 8px;
}
.scroll {
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-bottom: 16px;
}
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #9ca3af;
  font-size: 14px;
  gap: 12px;
  text-align: center;
}
.empty span {
  font-size: 36px;
}
.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.skeleton-card {
  padding: 12px 16px;
  border-radius: 10px;
  background: #f9fafb;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.skeleton {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
.skeleton.short {
  width: 40%;
  height: 10px;
}
@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
