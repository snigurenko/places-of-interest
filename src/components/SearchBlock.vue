<script setup lang="ts">
import { usePlacesStore } from '../stores/places'

const store = usePlacesStore()

function handleSearch(): void {
  const trimmed = store.searchQuery.trim()
  if (!trimmed || store.loading) return
  store.searchLocation(trimmed)
}
</script>

<template>
  <div class="search-bar">
    <h1 class="search-title">Places of Interest</h1>
    <div class="search-input-wrapper">
      <input
        v-model="store.searchQuery"
        type="text"
        placeholder="Enter a location"
        :disabled="store.loading"
        @keyup.enter="handleSearch"
      />
      <button :disabled="store.loading || !store.searchQuery.trim()" @click="handleSearch">
        <span v-if="store.loading" class="loader" />
        <span v-else>🔍</span>
      </button>
    </div>
    <p v-if="store.error" class="error">{{ store.error }}</p>
    <p v-if="store.location && !store.loading" class="info">
      Found <strong>{{ store.totalPlaces }}</strong> places near
      <strong>{{ store.location.name }}</strong>
    </p>
  </div>
</template>

<style scoped>
.search-bar {
  padding: 24px 20px 16px;
}
.search-title {
  font-size: 20px;
  font-weight: 700;
  margin: 0 0 16px;
  color: #1a1a2e;
}
.search-input-wrapper {
  display: flex;
  gap: 8px;
}
input {
  flex: 1;
  padding: 10px 14px;
  border: 1.5px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}
input:focus {
  border-color: #3b82f6;
}
input:disabled {
  background: #f9fafb;
}
button {
  width: 42px;
  height: 42px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}
button:hover:not(:disabled) {
  background: #2563eb;
}
button:disabled {
  background: #93c5fd;
  cursor: not-allowed;
}
.error {
  margin-top: 8px;
  font-size: 13px;
  color: #ef4444;
}
.info {
  margin-top: 8px;
  font-size: 13px;
  color: #6b7280;
}
.loader {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.4);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  display: block;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
