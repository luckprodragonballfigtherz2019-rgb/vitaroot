<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import Card from '@/components/ui/Card.vue'
import Input from '@/components/ui/Input.vue'
import NumericInput from '@/components/ui/NumericInput.vue'
import Button from '@/components/ui/Button.vue'
import { useProfile } from '@/composables/useProfile'
import { useToast } from '@/composables/useToast'

const { profile, load, update } = useProfile()
const toast = useToast()

const name = ref('')
const birthdate = ref('')
const heightCm = ref<number | null>(null)
const units = ref<'metric' | 'imperial'>('metric')
const theme = ref<'auto' | 'light' | 'dark'>('auto')
const glassSizeMl = ref<number | null>(250)
const dailyGoalMl = ref<number | null>(2000)

const saving = ref(false)
const initialized = ref(false)

function dateToInput(d: Date | null): string {
  if (!d) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

onMounted(async () => {
  try {
    await load()
    if (profile.value) {
      name.value = profile.value.name
      birthdate.value = dateToInput(profile.value.birthdate)
      heightCm.value = profile.value.heightCm
      units.value = profile.value.units
      theme.value = profile.value.theme
      glassSizeMl.value = profile.value.waterSettings.glassSizeMl
      dailyGoalMl.value = profile.value.waterSettings.dailyGoalMl
    }
    initialized.value = true
  } catch {
    toast.error('Error cargando perfil')
  }
})

const isDirty = computed(() => {
  if (!profile.value || !initialized.value) return false
  return (
    name.value !== profile.value.name ||
    birthdate.value !== dateToInput(profile.value.birthdate) ||
    heightCm.value !== profile.value.heightCm ||
    units.value !== profile.value.units ||
    theme.value !== profile.value.theme ||
    glassSizeMl.value !== profile.value.waterSettings.glassSizeMl ||
    dailyGoalMl.value !== profile.value.waterSettings.dailyGoalMl
  )
})

async function onSave(): Promise<void> {
  if (!name.value.trim()) {
    toast.error('El nombre no puede estar vacío')
    return
  }

  saving.value = true
  try {
    await update({
      name: name.value.trim(),
      birthdate: birthdate.value ? new Date(birthdate.value) : null,
      heightCm: heightCm.value,
      units: units.value,
      theme: theme.value,
      waterSettings: {
        glassSizeMl: glassSizeMl.value ?? 250,
        dailyGoalMl: dailyGoalMl.value ?? 2000,
      },
    })
    toast.success('Perfil actualizado')
  } catch (err) {
    toast.error(err instanceof Error ? err.message : 'Error al guardar')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="p-8 max-w-2xl">
    <header class="mb-8">
      <p class="heading-sm text-ink-faint mb-2">PERFIL</p>
      <h1 class="display-xl text-ink">Tus datos</h1>
      <p class="body-md text-ink-soft mt-2">
        Configura tu información personal y preferencias.
      </p>
    </header>

    <div v-if="!initialized" class="body-md text-ink-soft">Cargando...</div>

    <div v-else class="flex flex-col gap-6">
      <Card>
        <h2 class="heading-md text-ink mb-4">Información personal</h2>
        <div class="flex flex-col gap-4">
          <Input v-model="name" label="Nombre" required :maxlength="60" />
          <Input v-model="birthdate" type="date" label="Fecha de nacimiento" />
          <NumericInput
            v-model="heightCm"
            label="Altura"
            suffix="cm"
            :min="1"
            :max="299"
            :step="1"
          />
        </div>
      </Card>

      <Card>
        <h2 class="heading-md text-ink mb-4">Preferencias</h2>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-1">
            <label class="body-sm text-ink font-medium">Unidades</label>
            <div class="flex gap-2">
              <Button
                type="button"
                :variant="units === 'metric' ? 'primary' : 'secondary'"
                size="sm"
                @click="units = 'metric'"
              >
                Métrico (kg, cm)
              </Button>
              <Button
                type="button"
                :variant="units === 'imperial' ? 'primary' : 'secondary'"
                size="sm"
                @click="units = 'imperial'"
              >
                Imperial (lb, in)
              </Button>
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label class="body-sm text-ink font-medium">Tema</label>
            <div class="flex gap-2">
              <Button
                type="button"
                :variant="theme === 'auto' ? 'primary' : 'secondary'"
                size="sm"
                @click="theme = 'auto'"
              >
                Auto
              </Button>
              <Button
                type="button"
                :variant="theme === 'light' ? 'primary' : 'secondary'"
                size="sm"
                @click="theme = 'light'"
              >
                Claro
              </Button>
              <Button
                type="button"
                :variant="theme === 'dark' ? 'primary' : 'secondary'"
                size="sm"
                @click="theme = 'dark'"
              >
                Oscuro
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h2 class="heading-md text-ink mb-4">Objetivo de agua</h2>
        <div class="grid grid-cols-2 gap-4">
          <NumericInput
            v-model="glassSizeMl"
            label="Tamaño de vaso"
            suffix="ml"
            :min="50"
            :max="2000"
            :step="50"
          />
          <NumericInput
            v-model="dailyGoalMl"
            label="Objetivo diario"
            suffix="ml"
            :min="500"
            :max="10000"
            :step="100"
          />
        </div>
      </Card>

      <div class="flex justify-end gap-2">
        <Button
          variant="primary"
          size="lg"
          :loading="saving"
          :disabled="!isDirty"
          @click="onSave"
        >
          Guardar cambios
        </Button>
      </div>
    </div>
  </div>
</template>
