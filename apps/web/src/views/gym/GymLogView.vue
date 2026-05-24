<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Plus, Check, Search } from 'lucide-vue-next'
import type { Exercise } from '@vitaroot/shared'
import Button from '@/components/ui/Button.vue'
import Input from '@/components/ui/Input.vue'
import NumericInput from '@/components/ui/NumericInput.vue'
import Modal from '@/components/ui/Modal.vue'
import LogExerciseBlock from '@/components/feature/gym/LogExerciseBlock.vue'
import type { LogSetDraft } from '@/components/feature/gym/LogSetRow.vue'
import { useGymStore } from '@/stores/gym'
import { useToast } from '@/composables/useToast'

interface ExerciseDraft {
  exercise: Exercise
  sets: LogSetDraft[]
}

const router = useRouter()
const store = useGymStore()
const toast = useToast()

// Defaults: hoy a las 18:00
function defaultStartedAt(): string {
  const now = new Date()
  now.setHours(18, 0, 0, 0)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`
}

const startedAt = ref(defaultStartedAt())
const durationMin = ref<number | null>(60)
const name = ref('')
const notes = ref('')

const exercises = ref<ExerciseDraft[]>([])

const saving = ref(false)
const exerciseModalOpen = ref(false)
const searchQuery = ref('')

onMounted(async () => {
  try {
    await store.loadCatalog()
  } catch {
    toast.error('Error cargando catálogo')
  }
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

function pickExercise(ex: Exercise): void {
  exercises.value.push({
    exercise: ex,
    sets: [],
  })
  exerciseModalOpen.value = false
  searchQuery.value = ''
}

function updateSets(index: number, sets: LogSetDraft[]): void {
  if (exercises.value[index]) {
    exercises.value[index] = { ...exercises.value[index], sets }
  }
}

function removeExercise(index: number): void {
  exercises.value = exercises.value.filter((_, i) => i !== index)
}

const totalVolume = computed(() => {
  let total = 0
  for (const ex of exercises.value) {
    for (const s of ex.sets) {
      if (s.weightKg !== null && s.reps !== null) {
        total += s.weightKg * s.reps
      }
    }
  }
  return total
})

const totalSets = computed(() =>
  exercises.value.reduce((sum, ex) => sum + ex.sets.length, 0),
)

const canSave = computed(() => {
  if (exercises.value.length === 0) return false
  // Cada ejercicio debe tener al menos 1 set
  return exercises.value.every((ex) => ex.sets.length > 0)
})

async function onSave(): Promise<void> {
  if (!canSave.value) {
    toast.error('Añade al menos un ejercicio con un set')
    return
  }

  saving.value = true
  try {
    const created = await store.logNewWorkout({
      startedAt: new Date(startedAt.value),
      durationMin: durationMin.value ?? undefined,
      name: name.value || undefined,
      notes: notes.value || undefined,
      exercises: exercises.value.map((ex) => ({
        exerciseId: ex.exercise.id,
        sets: ex.sets.map((s) => ({
          weightKg: s.weightKg ?? undefined,
          reps: s.reps ?? undefined,
        })),
      })),
    })
    toast.success('Workout registrado')
    router.push(`/gym/${created.id}`)
  } catch (err) {
    toast.error(err instanceof Error ? err.message : 'Error al guardar')
  } finally {
    saving.value = false
  }
}

function onCancel(): void {
  if (exercises.value.length > 0) {
    if (!confirm('¿Descartar este workout? Se perderán los datos.')) return
  }
  router.push('/gym')
}
</script>

<template>
  <div class="p-8 max-w-4xl pb-32">
    <!-- Header -->
    <header class="mb-6">
      <p class="heading-sm text-moss-700 mb-2">REGISTRAR WORKOUT</p>
      <h1 class="display-lg text-ink">Nuevo entrenamiento</h1>
    </header>

    <!-- Metadatos -->
    <section class="mb-6 grid grid-cols-1 md:grid-cols-2 gap-3">
      <Input
        v-model="startedAt"
        type="datetime-local"
        label="Fecha y hora"
        required
      />
      <NumericInput
        v-model="durationMin"
        label="Duración"
        suffix="min"
        :min="1"
        :max="600"
        :step="5"
      />
      <Input
        v-model="name"
        label="Nombre (opcional)"
        placeholder="Push day, Pierna, etc."
        :maxlength="100"
      />
      <Input
        v-model="notes"
        label="Notas (opcional)"
        :maxlength="1000"
      />
    </section>

    <!-- Resumen actual -->
    <section v-if="exercises.length > 0" class="mb-4 flex flex-wrap gap-4 text-ink-soft body-sm">
      <span>{{ exercises.length }} ejercicios</span>
      <span>·</span>
      <span>{{ totalSets }} sets</span>
      <span>·</span>
      <span>{{ Math.round(totalVolume) }}kg volumen</span>
    </section>

    <!-- Ejercicios -->
    <section class="flex flex-col gap-4">
      <LogExerciseBlock
        v-for="(ex, idx) in exercises"
        :key="`${ex.exercise.id}-${idx}`"
        :exercise="ex.exercise"
        :sets="ex.sets"
        @update:sets="(value) => updateSets(idx, value)"
        @remove="removeExercise(idx)"
      />

      <button
        type="button"
        class="py-4 rounded-lg border border-dashed border-line hover:border-moss-500 hover:bg-paper-soft transition-colors duration-fast flex items-center justify-center gap-2 body-md text-ink-soft hover:text-moss-700"
        @click="exerciseModalOpen = true"
      >
        <Plus :size="18" />
        Añadir ejercicio
      </button>
    </section>

    <!-- Footer fijo -->
    <div class="fixed bottom-0 left-0 right-0 bg-paper border-t border-line-soft p-4 z-30 lg:left-[240px]">
      <div class="max-w-4xl mx-auto flex justify-between gap-2">
        <Button variant="ghost" size="md" @click="onCancel">
          Cancelar
        </Button>
        <Button
          variant="primary"
          size="lg"
          :loading="saving"
          :disabled="!canSave"
          @click="onSave"
        >
          <Check :size="16" />
          Guardar workout
        </Button>
      </div>
    </div>

    <!-- Modal de selección -->
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
            @click="pickExercise(ex)"
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
  </div>
</template>
