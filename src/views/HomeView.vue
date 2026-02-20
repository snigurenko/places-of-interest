<script setup lang="ts">
import { onMounted } from 'vue'
import Search from '@/components/SearchBlock.vue'
import PlacesList from '@/components/PlacesList.vue'
import MapView from '@/components/MapView.vue'
import PlaceDetailModal from '@/components/PlaceDetailModal.vue'
import { usePlacesStore } from '@/stores/places'

const store = usePlacesStore()

onMounted(() => {
  store.searchLocation(store.searchQuery)
})
</script>

<template>
  <div class="home">
    <aside class="sidebar">
      <Search />
      <PlacesList />
    </aside>
    <main class="map-area">
      <MapView />
    </main>
    <PlaceDetailModal />
  </div>
</template>

<style scoped>
.home {
  display: flex;
  height: 100vh;
  overflow: hidden;
}
.sidebar {
  width: 320px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: white;
  box-shadow: 2px 0 12px rgba(0, 0, 0, 0.08);
  z-index: 10;
}
.map-area {
  flex: 1;
}
</style>
