<script setup lang="ts">
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Clock, Zap, Check, X, Search } from 'lucide-vue-next'
import Card from '@/components/ui/Card.vue'
import Button from '@/components/ui/Button.vue'
import Modal from '@/components/ui/Modal.vue'
import Input from '@/components/ui/Input.vue'
import ExerciseInstanceCard from '@/components/feature/gym/ExerciseInstanceCard.vue'
import { useGymStore } from '@/stores/gym'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const store = useGymStore()
const toast = useToast()

const elapsedSec = ref(0)
let elapsedTimer: ReturnType<typeof setInterval> | null = null

const exerciseModalOpen = ref(false)
const searchQuery = ref('')
const finishModalOpen = ref(false)
const finishNotes = ref('')
const finishing = ref(false)

onMounted(async () => {
  try {
    await store.loadActiveWorkout()
    if (!store.activeWorkout) {
      toast.error('No hay workout activo')
      router.replace('/gym')
      return
    }
    if (!store.catalogLoaded) await store.loadCatalog()
    startTimer()
  } catch {
    toast.error('Error cargando workout')
    router.replace('/gym')
  }
})

onUnmounted(() => {
  stopTimer()
})

function startTimer(): void {
  if (!store.activeWorkout) return
  updateElapsed()
  elapsedTimer = setInterval(updateElapsed, 1000)
}

function stopTimer(): void {
  if (elapsedTimer) {
    clearInterval(elapsedTimer)
    elapsedTimer = null
  }
}

function updateElapsed(): void {
  if (!store.activeWorkout) return
  elapsedSec.value = Math.floor((Date.now() - store.activeWorkout.startedAt.getTime()) / 1000)
}

const elapsedDisplay = computed(() => {
  const s = elapsedSec.value
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const pad = (n: number) => String(n).padStart(2, '0')
  if (h > 0) return `${h}:${pad(m)}:${pad(sec)}`
  return `${pad(m)}:${pad(sec)}`
})

const filteredCatalog = computed(() => {
  if (!searchQuery.value.trim()) return store.catalog
  const q = searchQuery.value.toLowerCase()
  return store.catalog.filter(
    (ex) =>
      ex.name.toLowerCase().includes(q) ||
      ex.equipment?.toLowerCase().includes(q) ||
      ex.primaryMuscle.toLowerCase().includes(q),
  )
})

async function pickExercise(id: string): Promise<void> {
  try {
    await store.addExercise(id)
    exerciseModalOpen.value = false
    searchQuery.value = ''
    toast.success('Ejercicio añadido')
  } catch {
    toast.error('No se pudo añadir el ejercicio')
  }
}

async function onFinish(): Promise<void> {
  finishing.value = true
  try {
    const finished = await store.finishCurrentWorkout({ notes: finishNotes.value || undefined })
    toast.success('Workout finalizado')
    finishModalOpen.value = false
    router.push(`/gym/${finished.id}`)
  } catch {
    toast.error('No se pudo finalizar')
  } finally {
    finishing.value = false
  }
}

async function onDiscard(): Promise<void> {
  if (!confirm('¿Descartar este workout? Se perderán los datos.')) return
  try {
    await store.discardCurrentWorkout()
    toast.success('Workout descartado')
    router.push('/gym')
  } catch {
    toast.error('No se pudo descartar')
  }
}
</script>

<template>
  <div class="p-8 max-w-4xl pb-32">
    <!-- Header con info del workout -->
    <header class="mb-6">
      <p class="heading-sm text-moss-700 mb-2">WORKOUT EN CURSO</p>
      <h1 class="display-lg text-ink">
        {{ store.activeWorkout?.name ?? 'Sin título' }}
      </h1>

      <div class="flex flex-wrap gap-4 mt-3 text-ink-soft">
        <div class="flex items-center gap-1">
          <Clock :size="16" />
          <span class="body-md font-mono">{{ elapsedDisplay }}</span>
        </div>
        <div class="flex items-center gap-1">
          <Zap :size="16" />
          <span class="body-md">{{ Math.round(store.currentVolumeKg) }}kg</span>
        </div>
        <div class="flex items-center gap-1">
          <Check :size="16" />
          <span class="body-md">{{ store.totalSetsCompleted }} sets</span>
        </div>
      </div>
    </header>

    <!-- Lista de ejercicios -->
    <section class="flex flex-col gap-4">
      <ExerciseInstanceCard
        v-for="inst in store.activeWorkout?.exercises ?? []"
        :key="inst.id"
        :instance="inst"
      />

      <!-- Botón añadir ejercicio -->
      <button
        type="button"
        class="py-4 rounded-lg border border-dashed border-line hover:border-moss-500 hover:bg-paper-soft transition-colors duration-fast flex items-center justify-center gap-2 body-md text-ink-soft hover:text-moss-700"
        @click="exerciseModalOpen = true"
      >
        <Plus :size="18" />
        Añadir ejercicio
      </button>
    </section>

    <!-- Footer fijo: acciones -->
    <div class="fixed bottom-0 left-0 right-0 bg-paper border-t border-line-soft p-4 z-30 lg:left-[240px]">
      <div class="max-w-4xl mx-auto flex justify-between gap-2">
        <Button variant="ghost" size="md" @click="onDiscard">
          <X :size="16" />
          Descartar
        </Button>
        <Button variant="primary" size="lg" @click="finishModalOpen = true">
          <Check :size="16" />
          Finalizar
        </Button>
      </div>
    </div>

    <!-- Modal de selección de ejercicio -->
    <Modal v-model="exerciseModalOpen" title="Añadir ejercicio">
      <div class="flex flex-col gap-3">
        <Input
          v-model="searchQuery"
          placeholder="Buscar por nombre, equipo o músculo..."
          :maxlength="80"
        />

        <div class="max-h-96 overflow-y-auto flex flex-col gap-1">
          <button
            v-for="ex in filteredCatalog"
            :key="ex.id"
            type="button"
            class="text-left px-3 py-2 rounded-md hover:bg-paper-soft transition-colors duration-fast"
            @click="pickExercise(ex.id)"
          >
            <p class="body-md text-ink">{{ ex.name }}</p>
            <p class="body-xs text-ink-faint">
              {{ ex.primaryMuscle }}{{ ex.equipment ? ` · ${ex.equipment}` : '' }}
            </p>
          </button>

          <p v-if="filteredCatalog.length === 0" class="body-sm text-ink-faint italic py-3 text-center">
            Sin resultados
          </p>
        </div>
      </div>
    </Modal>

    <!-- Modal de finalizar -->
    <Modal v-model="finishModalOpen" title="Finalizar workout">
      <div class="flex flex-col gap-4">
        <div class="grid grid-cols-3 gap-3 text-center">
          <div>
            <p class="body-xs text-ink-faint uppercase tracking-wider">Duración</p>
            <p class="numeric-md text-ink font-mono">{{ elapsedDisplay }}</p>
          </div>
          <div>
            <p class="body-xs text-ink-faint uppercase tracking-wider">Volumen</p>
            <p class="numeric-md text-ink">{{ Math.round(store.currentVolumeKg) }}kg</p>
          </div>
          <div>
            <p class="body-xs text-ink-faint uppercase tracking-wider">Sets</p>
            <p class="numeric-md text-ink">{{ store.totalSetsCompleted }}</p>
          </div>
        </div>

        <Input
          v-model="finishNotes"
          label="Notas (opcional)"
          placeholder="¿Cómo te has sentido?"
          :maxlength="1000"
        />

        <div class="flex justify-end gap-2 mt-2">
          <Button variant="ghost" size="md" @click="finishModalOpen = false">
            Cancelar
          </Button>
          <Button variant="primary" size="md" :loading="finishing" @click="onFinish">
            Finalizar workout
          </Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
