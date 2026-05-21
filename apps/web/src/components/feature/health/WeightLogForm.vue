<script setup lang="ts">
import { ref, onMounted } from 'vue'
import NumericInput from '@/components/ui/NumericInput.vue'
import Input from '@/components/ui/Input.vue'
import Button from '@/components/ui/Button.vue'
import { useHealthStore } from '@/stores/health'
import { useToast } from '@/composables/useToast'

const emit = defineEmits<{
  close: []
  saved: []
}>()

const store = useHealthStore()
const toast = useToast()

const weightKg = ref<number | null>(null)
const notes = ref('')
const submitting = ref(false)

const weightError = ref<string | null>(null)

onMounted(async () => {
  // Pre-rellena con el último peso registrado (AC3)
  if (!store.latestWeight) {
    try {
      await store.loadWeightLatest()
    } catch {
      // ignoramos: si falla, el campo queda vacío
    }
  }
  if (store.latestWeight) {
    weightKg.value = store.latestWeight.weightKg
  }
})

function validate(): boolean {
  weightError.value = null

  if (weightKg.value === null) {
    weightError.value = 'Indica tu peso'
    return false
  }
  if (weightKg.value <= 0 || weightKg.value >= 1000) {
    weightError.value = 'Peso fuera de rango (0–999 kg)'
    return false
  }
  return true
}

async function onSubmit(): Promise<void> {
  if (!validate()) return

  submitting.value = true
  try {
    await store.addWeight({
      weightKg: weightKg.value as number,
      notes: notes.value || undefined,
    })
    toast.success('Peso registrado')
    emit('saved')
    emit('close')
  } catch (err) {
    toast.error(err instanceof Error ? err.message : 'Error al guardar')
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <form class="flex flex-col gap-4" @submit.prevent="onSubmit">
    <NumericInput
      v-model="weightKg"
      label="Peso"
      placeholder="74,5"
      suffix="kg"
      :step="0.1"
      :min="0"
      :max="999"
      :error="weightError ?? undefined"
      hint="En kg. Acepta decimales con coma o punto."
      required
    />

<Input v-model="notes" label="Notas (opcional)" :maxlength="500" />

    <div class="flex justify-end gap-2 mt-2">
      <Button variant="ghost" size="md" type="button" @click="emit('close')">
        Cancelar
      </Button>
      <Button variant="primary" size="md" type="submit" :loading="submitting">
        Guardar
      </Button>
    </div>
  </form>
</template>
