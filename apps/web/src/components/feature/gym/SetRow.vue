<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Check, Trash2 } from 'lucide-vue-next'
import type { Set } from '@vitaroot/shared'
import { useGymStore } from '@/stores/gym'
import { useToast } from '@/composables/useToast'

const props = defineProps<{
  set: Set
  index: number
}>()

const store = useGymStore()
const toast = useToast()

// Copias locales para edición sin lag (commit al backend en blur)
const weight = ref<number | null>(props.set.weightKg)
const reps = ref<number | null>(props.set.reps)
const saving = ref(false)

// Si el set cambia desde fuera (otro componente lo modifica), sincronizamos
watch(
  () => [props.set.weightKg, props.set.reps],
  ([newWeight, newReps]) => {
    weight.value = newWeight ?? null
    reps.value = newReps ?? null
  },
)

const isCompleted = computed(() => props.set.completed)

const rowClasses = computed(() => [
  'flex items-center gap-2 py-2 px-2 rounded-md transition-colors duration-fast',
  isCompleted.value ? 'bg-moss-50' : 'hover:bg-paper-soft',
])

async function commitWeight(): Promise<void> {
  if (weight.value === props.set.weightKg) return
  saving.value = true
  try {
    await store.patchSet(props.set.id, { weightKg: weight.value ?? undefined })
  } catch {
    toast.error('No se pudo guardar el peso')
    weight.value = props.set.weightKg
  } finally {
    saving.value = false
  }
}

async function commitReps(): Promise<void> {
  if (reps.value === props.set.reps) return
  saving.value = true
  try {
    await store.patchSet(props.set.id, { reps: reps.value ?? undefined })
  } catch {
    toast.error('No se pudo guardar las reps')
    reps.value = props.set.reps
  } finally {
    saving.value = false
  }
}

async function toggleCompleted(): Promise<void> {
  try {
    await store.patchSet(props.set.id, { completed: !props.set.completed })
  } catch {
    toast.error('No se pudo actualizar el set')
  }
}

async function remove(): Promise<void> {
  try {
    await store.removeSet(props.set.id)
    toast.success('Set eliminado')
  } catch {
    toast.error('No se pudo eliminar el set')
  }
}

function onWeightInput(event: Event): void {
  const target = event.target as HTMLInputElement
  const raw = target.value.trim().replace(',', '.')
  if (raw === '') {
    weight.value = null
    return
  }
  const parsed = parseFloat(raw)
  if (!Number.isNaN(parsed)) weight.value = parsed
}

function onRepsInput(event: Event): void {
  const target = event.target as HTMLInputElement
  const raw = target.value.trim()
  if (raw === '') {
    reps.value = null
    return
  }
  const parsed = parseInt(raw, 10)
  if (!Number.isNaN(parsed)) reps.value = parsed
}
</script>

<template>
  <div :class="rowClasses">
    <!-- Número del set -->
    <span class="w-8 text-center body-sm font-mono text-ink-faint">
      {{ index + 1 }}
    </span>

    <!-- Peso -->
    <div class="flex-1 flex items-center gap-1">
      <input
        type="text"
        inputmode="decimal"
        :value="weight ?? ''"
        placeholder="0"
        class="w-16 px-2 py-1 rounded-md border border-line bg-paper text-right body-md font-mono focus:outline-none focus:ring-1 focus:ring-moss-500"
        @input="onWeightInput"
        @blur="commitWeight"
      />
      <span class="body-xs text-ink-faint">kg</span>
    </div>

    <!-- Reps -->
    <div class="flex-1 flex items-center gap-1">
      <input
        type="text"
        inputmode="numeric"
        :value="reps ?? ''"
        placeholder="0"
        class="w-14 px-2 py-1 rounded-md border border-line bg-paper text-right body-md font-mono focus:outline-none focus:ring-1 focus:ring-moss-500"
        @input="onRepsInput"
        @blur="commitReps"
      />
      <span class="body-xs text-ink-faint">reps</span>
    </div>

    <!-- Botón completar -->
    <button
      type="button"
      :class="[
        'h-8 w-8 flex items-center justify-center rounded-md transition-colors duration-fast',
        isCompleted
          ? 'bg-moss-500 text-paper hover:bg-moss-700'
          : 'border border-line text-ink-faint hover:bg-paper-soft',
      ]"
      :aria-label="isCompleted ? 'Marcar como no completado' : 'Marcar como completado'"
      @click="toggleCompleted"
    >
      <Check :size="14" />
    </button>

    <!-- Botón borrar -->
    <button
      type="button"
      class="h-8 w-8 flex items-center justify-center rounded-md text-ink-faint hover:text-garnet hover:bg-paper-soft transition-colors duration-fast"
      aria-label="Eliminar set"
      @click="remove"
    >
      <Trash2 :size="14" />
    </button>
  </div>
</template>
