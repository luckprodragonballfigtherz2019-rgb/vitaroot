<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Scale, Plus, TrendingDown, TrendingUp, Minus } from 'lucide-vue-next'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import { useHealthStore } from '@/stores/health'
import { useToast } from '@/composables/useToast'

const props = defineProps<{
  openForm: () => void
}>()

const store = useHealthStore()
const toast = useToast()

const loading = ref(true)

onMounted(async () => {
  try {
    await Promise.all([store.loadWeightLatest(), store.loadWeightLast(2)])
  } catch {
    toast.error('Error cargando peso')
  } finally {
    loading.value = false
  }
})

const latest = computed(() => store.latestWeight)

const trend = computed<{ delta: number; direction: 'up' | 'down' | 'flat' } | null>(() => {
  const logs = store.weightLogs
  if (logs.length < 2) return null
  const current = logs[0]
  const previous = logs[1]
  if (!current || !previous) return null

  const delta = current.weightKg - previous.weightKg
  if (Math.abs(delta) < 0.05) return { delta: 0, direction: 'flat' }
  return {
    delta,
    direction: delta > 0 ? 'up' : 'down',
  }
})

const trendDisplay = computed(() => {
  if (!trend.value) return null
  const abs = Math.abs(trend.value.delta).toFixed(1)
  if (trend.value.direction === 'flat') return 'Sin cambios'
  if (trend.value.direction === 'up') return `+${abs} kg vs anterior`
  return `−${abs} kg vs anterior`
})

const dateDisplay = computed(() => {
  if (!latest.value) return null
  return latest.value.occurredAt.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
  })
})
</script>

<template>
  <Card>
    <div class="flex items-center gap-2 mb-4">
      <Scale :size="18" class="text-moss-500" />
      <h2 class="heading-sm text-ink-faint">PESO</h2>
    </div>

    <div v-if="loading" class="body-md text-ink-soft mb-4">Cargando...</div>

    <div v-else-if="latest">
      <div class="flex items-baseline gap-2 mb-1">
        <span class="numeric-lg text-ink">{{ latest.weightKg.toFixed(1) }}</span>
        <span class="body-md text-ink-soft">kg</span>
      </div>
      <p class="body-sm text-ink-soft mb-2">{{ dateDisplay }}</p>

      <div v-if="trend" class="flex items-center gap-1 mb-4 body-sm">
        <TrendingDown v-if="trend.direction === 'down'" :size="14" class="text-moss-500" />
        <TrendingUp v-else-if="trend.direction === 'up'" :size="14" class="text-clay" />
        <Minus v-else :size="14" class="text-ink-faint" />
        <span
          :class="
            trend.direction === 'down'
              ? 'text-moss-500'
              : trend.direction === 'up'
                ? 'text-clay'
                : 'text-ink-faint'
          "
        >
          {{ trendDisplay }}
        </span>
      </div>
    </div>

    <div v-else class="body-md text-ink-soft mb-4">
      Aún no has registrado tu peso
    </div>

    <Button variant="secondary" size="md" @click="props.openForm()">
      <Plus :size="16" />
      Registrar peso
    </Button>
  </Card>
</template>
