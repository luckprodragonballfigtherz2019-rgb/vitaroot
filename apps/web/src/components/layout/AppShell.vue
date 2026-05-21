<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from './Sidebar.vue'
import TopBar from './TopBar.vue'
import ToastContainer from '@/components/ui/ToastContainer.vue'
import { useSidebar } from '@/composables/useSidebar'
import { useShortcuts } from '@/composables/useShortcuts'

const router = useRouter()
const { collapsed, toggle } = useSidebar()

const contentClasses = computed(() => [
  'flex flex-col min-h-screen',
  'transition-[margin] duration-slow ease-out-soft',
  collapsed.value ? 'ml-16' : 'ml-60',
])

useShortcuts({
  modifier: {
    'mod+b': () => toggle(),
  },
  sequence: {
    'g h': () => router.push('/'),
    'g g': () => router.push('/gym'),
    'g c': () => router.push('/meals'),
    'g s': () => router.push('/health'),
  },
})
</script>

<template>
  <div class="min-h-screen bg-paper">
    <Sidebar />

    <div :class="contentClasses">
      <TopBar />

      <main class="flex-1">
        <slot />
      </main>
    </div>

    <ToastContainer />
  </div>
</template>
