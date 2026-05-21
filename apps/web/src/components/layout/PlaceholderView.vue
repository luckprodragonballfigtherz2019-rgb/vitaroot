<script setup lang="ts">
defineProps<{
  module: string
  title: string
  description?: string
}>()
</script>

<template>
  <div class="p-12">
    <p class="heading-sm text-ink-faint mb-2">{{ module }}</p>
    <h1 class="display-xl text-ink">{{ title }}</h1>
    <p v-if="description" class="body-lg text-ink-soft mt-4">
      {{ description }}
    </p>
    <p class="body-sm text-ink-faint mt-8">
      Esta pantalla se implementará en un sprint futuro.
    </p>
  </div>
</template>
