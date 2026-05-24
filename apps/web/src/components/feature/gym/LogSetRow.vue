<script setup lang="ts">
import { ref, watch } from 'vue'
import { Trash2 } from 'lucide-vue-next'

export interface LogSetDraft {
  weightKg: number | null
  reps: number | null
}

const props = defineProps<{
  set: LogSetDraft
  index: number
}>()

const emit = defineEmits<{
  update: [value: LogSetDraft]
  remove: []
}>()

const weight = ref<number | null>(props.set.weightKg)
const reps = ref<number | null>(props.set.reps)

watch(
  () => [props.set.weightKg, props.set.reps],
  ([w, r]) => {
    weight.value = w ?? null
    reps.value = r ?? null
  },
)

function onWeightInput(event: Event): void {
  const target = event.target as HTMLInputElement
  const raw = target.value.trim().replace(',', '.')
  if (raw === '') {
    weight.value = null
  } else {
    const parsed = parseFloat(raw)
    if (!Number.isNaN(parsed)) weight.value = parsed
  }
  emit('update', { weightKg: weight.value, reps: reps.value })
}

function onRepsInput(event: Event): void {
  const target = event.target as HTMLInputElement
  const raw = target.value.trim()
  if (raw === '') {
    reps.value = null
  } else {
    const parsed = parseInt(raw, 10)
    if (!Number.isNaN(parsed)) reps.value = parsed
  }
  emit('update', { weightKg: weight.value, reps: reps.value })
}
</script>

<template>
  <div class="flex items-center gap-2 py-2 px-2 rounded-md hover:bg-paper-soft transition-colors duration-fast">
    <span class="w-8 text-center body-sm font-mono text-ink-faint">
      {{ index + 1 }}
    </span>

    <div class="flex-1 flex items-center gap-1">
      <input
        type="text"
        inputmode="decimal"
        :value="weight ?? ''"
        placeholder="0"
        class="w-16 px-2 py-1 rounded-md border border-line bg-paper text-right body-md font-mono focus:outline-none focus:ring-1 focus:ring-moss-500"
        @input="onWeightInput"
      />
      <span class="body-xs text-ink-faint">kg</span>
    </div>

    <div class="flex-1 flex items-center gap-1">
      <input
        type="text"
        inputmode="numeric"
        :value="reps ?? ''"
        placeholder="0"
        class="w-14 px-2 py-1 rounded-md border border-line bg-paper text-right body-md font-mono focus:outline-none focus:ring-1 focus:ring-moss-500"
        @input="onRepsInput"
      />
      <span class="body-xs text-ink-faint">reps</span>
    </div>

    <button
      type="button"
      class="h-8 w-8 flex items-center justify-center rounded-md text-ink-faint hover:text-garnet hover:bg-paper-soft transition-colors duration-fast"
      aria-label="Eliminar set"
      @click="emit('remove')"
    >
      <Trash2 :size="14" />
    </button>
  </div>
</template>
