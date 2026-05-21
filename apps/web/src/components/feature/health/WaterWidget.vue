<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { Droplet, Plus } from 'lucide-vue-next'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import { useHealthStore } from '@/stores/health'
import { useToast } from '@/composables/useToast'

const store = useHealthStore()
const toast = useToast()

const DAILY_GOAL_ML = 2000
const GLASS_SIZE_ML = 250

onMounted(async () => {
  try {
    await store.loadWaterForToday()
  } catch {
    toast.error('Error cargando agua del día')
  }
})

const progressPct = computed(() => {
  const pct = (store.todayWaterTotal / DAILY_GOAL_ML) * 100
  return Math.min(100, Math.max(0, pct))
})

const remainingGlasses = computed(() => {
  const remaining = DAILY_GOAL_ML - store.todayWaterTotal
  if (remaining <= 0) return 0
  return Math.ceil(remaining / GLASS_SIZE_ML)
})

async function addGlass(): Promise<void> {
  try {
    await store.addWater({ amountMl: GLASS_SIZE_ML })
    toast.success('Vaso registrado')
  } catch {
    toast.error('No se pudo registrar el vaso')
  }
}
</script>

<template>
  <Card>
    <div class="flex items-center gap-2 mb-4">
      <Droplet :size="18" class="text-moss-500" />
      <h2 class="heading-sm text-ink-faint">AGUA</h2>
    </div>

    <div class="flex items-baseline gap-2 mb-3">
      <span class="numeric-lg text-ink">{{ store.todayWaterTotal }}</span>
      <span class="body-md text-ink-soft">ml de {{ DAILY_GOAL_ML }}ml</span>
    </div>

    <div class="h-2 bg-paper-deep rounded-full overflow-hidden mb-4">
      <div
        class="h-full bg-moss-500 transition-[width] duration-slow ease-out-soft"
        :style="{ width: `${progressPct}%` }"
      />
    </div>

    <p v-if="remainingGlasses > 0" class="body-sm text-ink-soft mb-4">
      Te quedan {{ remainingGlasses }} vasos para tu objetivo
    </p>
    <p v-else class="body-sm text-moss-700 mb-4 font-medium">
      ¡Objetivo cumplido!
    </p>

    <Button variant="primary" size="md" @click="addGlass">
      <Plus :size="16" />
      Vaso ({{ GLASS_SIZE_ML }}ml)
    </Button>
  </Card>
</template>
