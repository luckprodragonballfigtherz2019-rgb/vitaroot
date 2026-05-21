<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    padding?: 'sm' | 'md' | 'lg'
    interactive?: boolean
  }>(),
  {
    padding: 'md',
    interactive: false,
  },
)

const classes = computed(() => [
  'bg-paper border border-line-soft rounded-lg',
  props.padding === 'sm' && 'p-4',
  props.padding === 'md' && 'p-5',
  props.padding === 'lg' && 'p-6',
  props.interactive &&
    'transition-all duration-base ease-out-soft cursor-pointer hover:border-line hover:shadow-sm',
])
</script>

<template>
  <div :class="classes">
    <slot />
  </div>
</template>
