<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { Plus, Trash2, History, Trophy } from 'lucide-vue-next'
import type { Exercise, Set } from '@vitaroot/shared'
import Card from '@/components/ui/Card.vue'
import LogSetRow, { type LogSetDraft } from './LogSetRow.vue'
import { useGymStore } from '@/stores/gym'

const props = defineProps<{
  exercise: Exercise
  sets: LogSetDraft[]
}>()

const emit = defineEmits<{
  'update:sets': [value: LogSetDraft[]]
  remove: []
}>()

const store = useGymStore()

const lastSet = ref<Set | null>(null)
const pr = ref<Set | null>(null)
const loadingMeta = ref(true)

onMounted(async () => {
  try {
    const [last, prSet] = await Promise.all([
      store.fetchLastSet(props.exercise.id),
      store.fetchPr(props.exercise.id),
    ])
    lastSet.value = last
    pr.value = prSet
  } catch {
    // ignorar
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

function addSet(): void {
  // Duplica el último set como sugerencia, o usa valores del PR/last, o vacío
  const last = props.sets[props.sets.length - 1]
  const newSet: LogSetDraft = last
    ? { weightKg: last.weightKg, reps: last.reps }
    : {
        weightKg: lastSet.value?.weightKg ?? null,
        reps: lastSet.value?.reps ?? null,
      }
  emit('update:sets', [...props.sets, newSet])
}

function updateSet(index: number, value: LogSetDraft): void {
  const updated = [...props.sets]
  updated[index] = value
  emit('update:sets', updated)
}

function removeSet(index: number): void {
  emit('update:sets', props.sets.filter((_, i) => i !== index))
}
</script>

<template>
  <Card>
    <!-- Header -->
    <div class="flex items-start justify-between gap-3 mb-4">
      <div class="flex-1 min-w-0">
        <h3 class="heading-md text-ink truncate">{{ exercise.name }}</h3>
        <p v-if="exercise.equipment" class="body-sm text-ink-faint mt-1">
          {{ exercise.equipment }}
        </p>
      </div>

      <button
        type="button"
        class="p-2 rounded-md text-ink-faint hover:text-garnet hover:bg-paper-soft transition-colors duration-fast"
        aria-label="Eliminar ejercicio"
        @click="emit('remove')"
      >
        <Trash2 :size="16" />
      </button>
    </div>

    <!-- Última vez + PR -->
    <div
      v-if="!loadingMeta && (lastSetDisplay || prDisplay)"
      class="flex flex-wrap gap-3 mb-4 body-xs"
    >
      <div v-if="lastSetDisplay" class="flex items-center gap-1 text-ink-soft">
        <History :size="12" />
        <span>Última vez: <span class="font-mono text-ink">{{ lastSetDisplay }}</span></span>
      </div>
      <div v-if="prDisplay" class="flex items-center gap-1 text-ochre">
        <Trophy :size="12" />
        <span>PR: <span class="font-mono">{{ prDisplay }}</span></span>
      </div>
    </div>

    <!-- Cabecera de tabla -->
    <div class="flex items-center gap-2 px-2 py-1 mb-1 body-xs text-ink-faint font-medium uppercase tracking-wider">
      <span class="w-8 text-center">#</span>
      <span class="flex-1">Peso</span>
      <span class="flex-1">Reps</span>
      <span class="w-8"></span>
    </div>

    <!-- Sets -->
    <div v-if="sets.length === 0" class="body-sm text-ink-faint italic py-3 text-center">
      Aún no hay sets. Añade el primero ↓
    </div>
    <div v-else class="flex flex-col gap-0.5">
      <LogSetRow
        v-for="(set, idx) in sets"
        :key="idx"
        :set="set"
        :index="idx"
        @update="(value) => updateSet(idx, value)"
        @remove="removeSet(idx)"
      />
    </div>

    <button
      type="button"
      class="mt-3 w-full py-2 rounded-md border border-dashed border-line text-ink-soft hover:border-moss-500 hover:text-moss-700 transition-colors duration-fast flex items-center justify-center gap-2 body-sm"
      @click="addSet"
    >
      <Plus :size="14" />
      Añadir set
    </button>
  </Card>
</template>
