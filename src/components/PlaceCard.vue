<script setup lang="ts">
import { computed } from 'vue'
import type { Place } from '@/types'

const props = withDefaults(defineProps<{ place: Place; isSelected?: boolean }>(), {
  isSelected: false
})
defineEmits<{ select: [xid: string] }>()

const primaryCategory = computed(() =>
  props.place.kinds?.split(',')[0].replace(/_/g, ' ') || 'Point of interest'
)
const formattedDistance = computed(() => {
  const d = props.place.dist
  if (!d) return ''
  return d >= 1000 ? `${(d / 1000).toFixed(1)} km` : `${Math.round(d)} m`
})
</script>

<template>
  <div
    class="place-card"
    :class="{ active: isSelected }"
    @click="$emit('select', place.xid)"
  >
    <div class="place-card-header">
      <span class="category">{{ primaryCategory }}</span>
      <span class="distance">{{ formattedDistance }}</span>
    </div>
    <h3 class="name">{{ place.name || 'Unnamed place' }}</h3>
  </div>
</template>

<style scoped>
.place-card {
  padding: 12px 16px; border-radius: 10px; cursor: pointer;
  transition: background 0.15s; border: 1.5px solid transparent;
}
.place-card:hover { background: #f0f7ff; }
.place-card.active { background: #eff6ff; border-color: #3b82f6; }
.place-card-header { display: flex; justify-content: space-between; margin-bottom: 4px; }
.category {
  font-size: 11px; text-transform: uppercase; color: #3b82f6;
  background: #eff6ff; padding: 2px 8px; border-radius: 20px; font-weight: 600;
}
.distance { font-size: 11px; color: #9ca3af; }
.name {
  font-size: 14px; font-weight: 500; color: #1a1a2e; margin: 0;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
</style>