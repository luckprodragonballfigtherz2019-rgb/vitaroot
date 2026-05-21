<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Droplet, Moon, Scale, Sparkles, ArrowRight } from 'lucide-vue-next'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import { useHealthStore } from '@/stores/health'
import { useProfile } from '@/composables/useProfile'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const store = useHealthStore()
const { profile, load: loadProfile } = useProfile()
const toast = useToast()

onMounted(async () => {
  try {
    await Promise.all([
      loadProfile(),
      store.loadWaterForToday(),
      store.loadSleepLast(1),
      store.loadWeightLatest(),
      store.loadMoodForToday(),
    ])
  } catch {
    toast.error('Error cargando datos del día')
  }
})

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 6) return 'Buenas noches'
  if (hour < 12) return 'Buenos días'
  if (hour < 21) return 'Buenas tardes'
  return 'Buenas noches'
})

const todayDateLabel = computed(() => {
  return new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
})

const waterGoalMl = computed(() => profile.value?.waterSettings.dailyGoalMl ?? 2000)
const waterPct = computed(() => {
  const pct = (store.todayWaterTotal / waterGoalMl.value) * 100
  return Math.min(100, Math.max(0, Math.round(pct)))
})

const sleepHours = computed(() => {
  if (!store.lastSleep) return null
  return (store.lastSleep.durationMin / 60).toFixed(1)
})

const moodLabel = computed(() => {
  const m = store.todayMood
  if (!m) return null
  const labels: Record<number, string> = {
    1: 'Difícil',
    2: 'Bajo',
    3: 'Normal',
    4: 'Bien',
    5: 'Excelente',
  }
  return labels[m.score] ?? null
})

function goToHealth(): void {
  router.push('/health')
}
</script>

<template>
  <div class="p-8 max-w-4xl">
    <header class="mb-10">
      <p class="heading-sm text-ink-faint mb-2 capitalize">{{ todayDateLabel }}</p>
      <h1 class="display-xl text-ink">
        {{ greeting }}<span v-if="profile">, {{ profile.name }}</span>.
      </h1>
    </header>

    <section class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h2 class="heading-md text-ink">Tu salud hoy</h2>
        <button
          type="button"
          class="flex items-center gap-1 body-sm text-moss-700 hover:text-moss-900 transition-colors"
          @click="goToHealth"
        >
          Ver detalle
          <ArrowRight :size="14" />
        </button>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card padding="sm" interactive @click="goToHealth">
          <div class="flex items-center gap-2 mb-2">
            <Droplet :size="14" class="text-moss-500" />
            <p class="body-xs text-ink-faint uppercase tracking-wider">Agua</p>
          </div>
          <p class="numeric-md text-ink">{{ waterPct }}%</p>
          <p class="body-xs text-ink-soft mt-1">
            {{ store.todayWaterTotal }}/{{ waterGoalMl }}ml
          </p>
        </Card>

        <Card padding="sm" interactive @click="goToHealth">
          <div class="flex items-center gap-2 mb-2">
            <Moon :size="14" class="text-moss-500" />
            <p class="body-xs text-ink-faint uppercase tracking-wider">Sueño</p>
          </div>
          <p v-if="sleepHours" class="numeric-md text-ink">{{ sleepHours }}h</p>
          <p v-else class="body-md text-ink-faint">—</p>
          <p v-if="store.lastSleep?.quality" class="body-xs text-ink-soft mt-1">
            Calidad {{ store.lastSleep.quality }}/5
          </p>
        </Card>

        <Card padding="sm" interactive @click="goToHealth">
          <div class="flex items-center gap-2 mb-2">
            <Scale :size="14" class="text-moss-500" />
            <p class="body-xs text-ink-faint uppercase tracking-wider">Peso</p>
          </div>
          <p v-if="store.latestWeight" class="numeric-md text-ink">
            {{ store.latestWeight.weightKg.toFixed(1) }}
            <span class="body-sm text-ink-soft">kg</span>
          </p>
          <p v-else class="body-md text-ink-faint">—</p>
        </Card>

        <Card padding="sm" interactive @click="goToHealth">
          <div class="flex items-center gap-2 mb-2">
            <Sparkles :size="14" class="text-moss-500" />
            <p class="body-xs text-ink-faint uppercase tracking-wider">Ánimo</p>
          </div>
          <p v-if="store.todayMood" class="numeric-md text-ink">
            {{ store.todayMood.score }}<span class="body-sm text-ink-soft">/5</span>
          </p>
          <p v-else class="body-md text-ink-faint">—</p>
          <p v-if="moodLabel" class="body-xs text-ink-soft mt-1">{{ moodLabel }}</p>
        </Card>
      </div>
    </section>

    <section>
      <h2 class="heading-md text-ink mb-4">Acceso rápido</h2>
      <div class="flex flex-wrap gap-2">
        <Button variant="secondary" size="md" @click="router.push('/health')">
          Registrar salud
        </Button>
        <Button variant="ghost" size="md" @click="router.push('/profile')">
          Mi perfil
        </Button>
      </div>
    </section>
  </div>
</template>
