<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import TopBar from './TopBar.vue'
import ToastContainer from '@/components/ui/ToastContainer.vue'
</script>

<template>
  <div class="min-h-screen bg-paper">
    <Sidebar />

    <div class="ml-60 flex flex-col min-h-screen">
      <TopBar />

      <main class="flex-1">
        <slot />
      </main>
    </div>

    <ToastContainer />
  </div>
</template>
