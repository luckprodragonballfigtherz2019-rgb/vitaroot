<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { Plus, Trash2, Trophy, History } from 'lucide-vue-next'
import type { ExerciseInstanceDetail, Set } from '@vitaroot/shared'
import Card from '@/components/ui/Card.vue'
import SetRow from './SetRow.vue'
import { useGymStore } from '@/stores/gym'
import { useToast } from '@/composables/useToast'

const props = defineProps<{
  instance: ExerciseInstanceDetail
}>()

const store = useGymStore()
const toast = useToast()

const lastSet = ref<Set | null>(null)
const pr = ref<Set | null>(null)
const loadingMeta = ref(true)
const addingSet = ref(false)

onMounted(async () => {
  try {
    const [last, prSet] = await Promise.all([
      store.fetchLastSet(props.instance.exerciseId),
      store.fetchPr(props.instance.exerciseId),
    ])
    lastSet.value = last
    pr.value = prSet
  } catch {
    // silenciamos: no crítico
  } finally {
    loadingMeta.value = false
  }
})

const lastSetDisplay = computed(() => {
  if (!lastSet.value) return null
  const s = lastSet.value
  if (s.weightKg !== null && s.reps !== null) {
    return `${s.weightKg}kg × ${s.reps}`
  }
  if (s.durationSec !== null) {
    return `${s.durationSec}s`
  }
  return null
})

const prDisplay = computed(() => {
  if (!pr.value) return null
  const s = pr.value
  if (s.weightKg !== null && s.reps !== null) {
    return `${s.weightKg}kg × ${s.reps}`
  }
  return null
})

async function addNewSet(): Promise<void> {
  addingSet.value = true
  try {
    // Si hay sets previos, duplica el último (peso y reps); si no, vacío
    const previousSet = props.instance.sets[props.instance.sets.length - 1]
    await store.addSetToInstance({
      exerciseInstanceId: props.instance.id,
      weightKg: previousSet?.weightKg ?? undefined,
      reps: previousSet?.reps ?? undefined,
      completed: false,
    })
  } catch {
    toast.error('No se pudo añadir el set')
  } finally {
    addingSet.value = false
  }
}

async function removeExercise(): Promise<void> {
  if (!confirm(`¿Eliminar ${props.instance.exercise.name} del workout?`)) return
  try {
    await store.removeExerciseInstance(props.instance.id)
    toast.success('Ejercicio eliminado')
  } catch {
    toast.error('No se pudo eliminar')
  }
}
</script>

<template>
  <Card>
    <!-- Header -->
    <div class="flex items-start justify-between gap-3 mb-4">
      <div class="flex-1 min-w-0">
        <h3 class="heading-md text-ink truncate">{{ instance.exercise.name }}</h3>
        <p v-if="instance.exercise.equipment" class="body-sm text-ink-faint mt-1">
          {{ instance.exercise.equipment }}
        </p>
      </div>

      <button
        type="button"
        class="p-2 rounded-md text-ink-faint hover:text-garnet hover:bg-paper-soft transition-colors duration-fast"
        aria-label="Eliminar ejercicio"
        @click="removeExercise"
      >
        <Trash2 :size="16" />
      </button>
    </div>

    <!-- Metadatos: última vez + PR -->
    <div v-if="!loadingMeta && (lastSetDisplay || prDisplay)" class="flex flex-wrap gap-3 mb-4 body-xs">
      <div v-if="lastSetDisplay" class="flex items-center gap-1 text-ink-soft">
        <History :size="12" />
        <span>Última vez: <span class="font-mono text-ink">{{ lastSetDisplay }}</span></span>
      </div>
      <div v-if="prDisplay" class="flex items-center gap-1 text-ochre">
        <Trophy :size="12" />
        <span>PR: <span class="font-mono">{{ prDisplay }}</span></span>
      </div>
    </div>

    <!-- Cabecera de la tabla de sets -->
    <div class="flex items-center gap-2 px-2 py-1 mb-1 body-xs text-ink-faint font-medium uppercase tracking-wider">
      <span class="w-8 text-center">#</span>
      <span class="flex-1">Peso</span>
      <span class="flex-1">Reps</span>
      <span class="w-8"></span>
      <span class="w-8"></span>
    </div>

    <!-- Sets -->
    <div v-if="instance.sets.length === 0" class="body-sm text-ink-faint italic py-3 text-center">
      Aún no hay sets. Añade el primero ↓
    </div>
    <div v-else class="flex flex-col gap-0.5">
      <SetRow
        v-for="(set, idx) in instance.sets"
        :key="set.id"
        :set="set"
        :index="idx"
      />
    </div>

    <!-- Botón añadir set -->
    <button
      type="button"
      class="mt-3 w-full py-2 rounded-md border border-dashed border-line text-ink-soft hover:border-moss-500 hover:text-moss-700 transition-colors duration-fast flex items-center justify-center gap-2 body-sm"
      :disabled="addingSet"
      @click="addNewSet"
    >
      <Plus :size="14" />
      Añadir set
    </button>
  </Card>
</template>
