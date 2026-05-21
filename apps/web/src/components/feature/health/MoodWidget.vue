<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Sparkles, Plus } from 'lucide-vue-next'
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
    await store.loadMoodForToday()
  } catch {
    toast.error('Error cargando ánimo del día')
  } finally {
    loading.value = false
  }
})

const today = computed(() => store.todayMood)

const moodLabel = computed(() => {
  if (!today.value) return null
  const labels: Record<number, string> = {
    1: 'Difícil',
    2: 'Bajo',
    3: 'Normal',
    4: 'Bien',
    5: 'Excelente',
  }
  return labels[today.value.score] ?? null
})

const buttonLabel = computed(() =>
  today.value ? 'Editar ánimo' : 'Registrar ánimo',
)
</script>

<template>
  <Card>
    <div class="flex items-center gap-2 mb-4">
      <Sparkles :size="18" class="text-moss-500" />
      <h2 class="heading-sm text-ink-faint">ÁNIMO</h2>
    </div>

    <div v-if="loading" class="body-md text-ink-soft mb-4">Cargando...</div>

    <div v-else-if="today">
      <div class="flex items-baseline gap-2 mb-1">
        <span class="numeric-lg text-ink">{{ today.score }}</span>
        <span class="body-md text-ink-soft">/ 5</span>
      </div>
      <p class="body-sm text-ink-soft mb-4">{{ moodLabel }}</p>
      <p v-if="today.notes" class="body-sm text-ink-faint italic mb-4 line-clamp-2">
        "{{ today.notes }}"
      </p>
    </div>

    <div v-else class="body-md text-ink-soft mb-4">
      ¿Cómo te sientes hoy?
    </div>

    <Button variant="secondary" size="md" @click="props.openForm()">
      <Plus v-if="!today" :size="16" />
      {{ buttonLabel }}
    </Button>
  </Card>
</template>
