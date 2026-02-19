<script setup lang="ts">
import MapView from '../components/MapView.vue'
import Search from '@/components/Search.vue'
</script>

<template>
  <div class="home">
    <div>
      <div class="sidebar">
        <Search />
      </div>
    </div>
    <main class="map-area">
      <MapView />
    </main>
  </div>
</template>

<style scoped>
.home {
  --sidebar-width: 320px;
  display: flex; height: 100vh; overflow: hidden;
}
.sidebar {
  width: var(--sidebar-width); flex-shrink: 0; display: flex; flex-direction: column;
  background: white; box-shadow: 2px 0 12px rgba(0,0,0,0.08); z-index: 10;
}
.map-area { flex: 1; }
</style>