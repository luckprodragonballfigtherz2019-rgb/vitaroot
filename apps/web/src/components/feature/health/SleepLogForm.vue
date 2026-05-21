<script setup lang="ts">
import { ref, computed } from 'vue'
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

// Valores por defecto: anoche 23:30 -> hoy 07:30
function defaultBedtime(): string {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  yesterday.setHours(23, 30, 0, 0)
  return toDatetimeLocal(yesterday)
}

function defaultWakeTime(): string {
  const today = new Date()
  today.setHours(7, 30, 0, 0)
  return toDatetimeLocal(today)
}

function toDatetimeLocal(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const bedtime = ref(defaultBedtime())
const wakeTime = ref(defaultWakeTime())
const quality = ref<number | null>(null)
const notes = ref('')
const submitting = ref(false)

const bedtimeError = ref<string | null>(null)
const wakeTimeError = ref<string | null>(null)

const durationMin = computed(() => {
  if (!bedtime.value || !wakeTime.value) return null
  const b = new Date(bedtime.value)
  const w = new Date(wakeTime.value)
  if (w <= b) return null
  return Math.round((w.getTime() - b.getTime()) / 60000)
})

const durationDisplay = computed(() => {
  if (!durationMin.value) return null
  const h = Math.floor(durationMin.value / 60)
  const m = durationMin.value % 60
  return m === 0 ? `${h}h` : `${h}h ${m}min`
})

function validate(): boolean {
  bedtimeError.value = null
  wakeTimeError.value = null

  if (!bedtime.value) {
    bedtimeError.value = 'Indica cuándo te acostaste'
    return false
  }
  if (!wakeTime.value) {
    wakeTimeError.value = 'Indica cuándo te despertaste'
    return false
  }

  const b = new Date(bedtime.value)
  const w = new Date(wakeTime.value)
  if (w <= b) {
    wakeTimeError.value = 'Debe ser posterior a la hora de acostarse'
    return false
  }

  return true
}

async function onSubmit(): Promise<void> {
  if (!validate()) return

  submitting.value = true
  try {
    await store.addSleep({
      bedtime: new Date(bedtime.value),
      wakeTime: new Date(wakeTime.value),
      quality: quality.value ?? undefined,
      notes: notes.value || undefined,
    })
    toast.success('Noche registrada')
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
    <Input
      v-model="bedtime"
      type="datetime-local"
      label="Me acosté"
      :error="bedtimeError ?? undefined"
      required
    />

    <Input
      v-model="wakeTime"
      type="datetime-local"
      label="Me desperté"
      :error="wakeTimeError ?? undefined"
      required
    />

    <p v-if="durationDisplay" class="body-sm text-ink-soft">
      Duración: <span class="font-mono text-ink">{{ durationDisplay }}</span>
    </p>

    <StarRating v-model="quality" label="Calidad" />

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
