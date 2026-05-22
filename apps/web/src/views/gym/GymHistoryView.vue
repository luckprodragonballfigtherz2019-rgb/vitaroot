<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Dumbbell, Plus, ArrowRight, Clock, Zap } from 'lucide-vue-next'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import { useGymStore } from '@/stores/gym'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const store = useGymStore()
const toast = useToast()

onMounted(async () => {
  try {
    await Promise.all([store.loadActiveWorkout(), store.loadHistory()])
  } catch {
    toast.error('Error cargando datos de gym')
  }
})

const recentWorkouts = computed(() => store.history.slice(0, 10))

async function startNew(): Promise<void> {
  try {
    await store.startNewWorkout({})
    toast.success('Workout iniciado')
    router.push('/gym/new')
  } catch (err) {
    if (err instanceof Error && err.message.includes('409')) {
      toast.error('Ya tienes un workout activo')
    } else {
      toast.error('No se pudo iniciar el workout')
    }
  }
}

function continueActive(): void {
  router.push('/gym/new')
}

function viewWorkout(id: string): void {
  router.push(`/gym/${id}`)
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  })
}

function formatDuration(min: number | null): string {
  if (!min) return '—'
  if (min < 60) return `${min}min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m === 0 ? `${h}h` : `${h}h ${m}min`
}
</script>

<template>
  <div class="p-8 max-w-4xl">
    <header class="mb-8">
      <p class="heading-sm text-ink-faint mb-2">GYM</p>
      <h1 class="display-xl text-ink">Tu entrenamiento</h1>
      <p class="body-md text-ink-soft mt-2">
        Registra tus workouts y consulta tu progreso.
      </p>
    </header>

    <!-- Workout activo (si existe) -->
    <section v-if="store.hasActiveWorkout" class="mb-8">
      <Card>
        <div class="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p class="heading-sm text-moss-700 mb-1">WORKOUT EN CURSO</p>
            <p class="display-md text-ink">
              {{ store.activeWorkout?.name ?? 'Sin título' }}
            </p>
            <p class="body-sm text-ink-soft mt-1">
              {{ store.activeWorkout?.exercises.length }} ejercicios · {{ store.totalSetsCompleted }} sets completados
            </p>
          </div>
          <Button variant="primary" size="lg" @click="continueActive">
            Continuar
            <ArrowRight :size="16" />
          </Button>
        </div>
      </Card>
    </section>

    <!-- Botón iniciar workout (si no hay activo) -->
    <section v-else class="mb-8">
      <Button variant="primary" size="xl" @click="startNew">
        <Plus :size="18" />
        Empezar workout
      </Button>
    </section>

    <!-- Historial -->
    <section>
      <h2 class="heading-md text-ink mb-4">Historial reciente</h2>

      <div v-if="!store.historyLoaded" class="body-md text-ink-soft">
        Cargando...
      </div>

      <div v-else-if="recentWorkouts.length === 0" class="body-md text-ink-soft">
        Aún no tienes workouts finalizados.
      </div>

      <div v-else class="flex flex-col gap-2">
        <Card
          v-for="w in recentWorkouts"
          :key="w.id"
          padding="sm"
          interactive
          @click="viewWorkout(w.id)"
        >
          <div class="flex items-center justify-between flex-wrap gap-3">
            <div class="flex items-center gap-3">
              <Dumbbell :size="18" class="text-moss-500 shrink-0" />
              <div>
                <p class="body-md font-medium text-ink">
                  {{ w.name ?? 'Workout' }}
                </p>
                <p class="body-xs text-ink-faint capitalize">
                  {{ formatDate(w.startedAt) }}
                </p>
              </div>
            </div>

            <div class="flex items-center gap-4 text-ink-soft">
              <div class="flex items-center gap-1 body-sm">
                <Clock :size="14" />
                {{ formatDuration(w.durationMin) }}
              </div>
              <div v-if="w.totalVolumeKg" class="flex items-center gap-1 body-sm">
                <Zap :size="14" />
                {{ Math.round(w.totalVolumeKg) }}kg
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  </div>
</template>
