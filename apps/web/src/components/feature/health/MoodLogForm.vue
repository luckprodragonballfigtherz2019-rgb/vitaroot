<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Input from '@/components/ui/Input.vue'
import StarRating from '@/components/ui/StarRating.vue'
import Button from '@/components/ui/Button.vue'
import { useHealthStore } from '@/stores/health'
import { useToast } from '@/composables/useToast'

const emit = defineEmits<{
  close: []
  saved: []
}>()

const store = useHealthStore()
const toast = useToast()

function todayISODate(): string {
  return new Date().toISOString().split('T')[0] ?? ''
}

const score = ref<number | null>(null)
const notes = ref('')
const submitting = ref(false)
const scoreError = ref<string | null>(null)

onMounted(() => {
  // Pre-rellena con el ánimo de hoy si existe
  const existing = store.todayMood
  if (existing) {
    score.value = existing.score
    notes.value = existing.notes ?? ''
  }
})

function validate(): boolean {
  scoreError.value = null

  if (score.value === null) {
    scoreError.value = 'Selecciona cómo te sientes'
    return false
  }
  return true
}

async function onSubmit(): Promise<void> {
  if (!validate()) return

  submitting.value = true
  try {
    await store.saveMood({
      date: todayISODate(),
      score: score.value as number,
      notes: notes.value || undefined,
    })
    toast.success('Ánimo guardado')
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
    <StarRating v-model="score" label="¿Cómo te sientes hoy?" :size="32" />

    <p v-if="scoreError" class="body-xs text-garnet">{{ scoreError }}</p>

    <Input
      v-model="notes"
      label="Notas (opcional)"
      placeholder="¿Algo destacable del día?"
      :maxlength="140"
      :hint="`${notes.length}/140`"
    />

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
