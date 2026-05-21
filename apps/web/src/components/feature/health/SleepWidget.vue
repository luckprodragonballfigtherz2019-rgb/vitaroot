<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Moon, Plus } from 'lucide-vue-next'
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
    await store.loadSleepLast(1)
  } catch {
    toast.error('Error cargando sueño')
  } finally {
    loading.value = false
  }
})

const lastSleep = computed(() => store.lastSleep)

const hoursDisplay = computed(() => {
  if (!lastSleep.value) return null
  const h = Math.floor(lastSleep.value.durationMin / 60)
  const m = lastSleep.value.durationMin % 60
  return m === 0 ? `${h}h` : `${h}h ${m}min`
})

const dateDisplay = computed(() => {
  if (!lastSleep.value) return null
  const d = lastSleep.value.bedtime
  return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })
})
</script>

<template>
  <Card>
    <div class="flex items-center gap-2 mb-4">
      <Moon :size="18" class="text-moss-500" />
      <h2 class="heading-sm text-ink-faint">SUEÑO</h2>
    </div>

    <div v-if="loading" class="body-md text-ink-soft mb-4">Cargando...</div>

    <div v-else-if="lastSleep">
      <div class="flex items-baseline gap-2 mb-1">
        <span class="numeric-lg text-ink">{{ hoursDisplay }}</span>
      </div>
      <p class="body-sm text-ink-soft mb-4 capitalize">
        {{ dateDisplay }}
      </p>
      <div v-if="lastSleep.quality" class="body-sm text-ink-faint mb-4">
        Calidad: {{ lastSleep.quality }}/5
      </div>
    </div>

    <div v-else class="body-md text-ink-soft mb-4">
      Aún no has registrado ninguna noche
    </div>

    <Button variant="secondary" size="md" @click="props.openForm()">
      <Plus :size="16" />
      Registrar noche
    </Button>
  </Card>
</template>
