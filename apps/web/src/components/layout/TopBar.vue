<script setup lang="ts">
import { Search, Settings } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()

function goToSettings(): void {
  router.push('/settings')
}
</script>

<template>
  <header
    class="h-14 border-b border-line-soft bg-paper flex items-center justify-between px-6 sticky top-0 z-10"
  >
    <div class="flex items-center gap-2 text-ink-faint">
      <Search :size="16" />
      <span class="body-sm">Buscar...</span>
      <kbd
        class="ml-2 px-1.5 py-0.5 text-xs font-mono bg-paper-soft border border-line-soft rounded"
      >
        ⌘K
      </kbd>
    </div>

    <button
      type="button"
      class="p-2 rounded-md text-ink-soft hover:text-ink hover:bg-paper-soft transition-colors duration-base ease-out-soft"
      aria-label="Ajustes"
      @click="goToSettings"
    >
      <Settings :size="18" />
    </button>
  </header>
</template>
