<script setup lang="ts">
import { ref } from 'vue'
import WaterWidget from '@/components/feature/health/WaterWidget.vue'
import SleepWidget from '@/components/feature/health/SleepWidget.vue'
import WeightWidget from '@/components/feature/health/WeightWidget.vue'
import MoodWidget from '@/components/feature/health/MoodWidget.vue'
import SleepLogForm from '@/components/feature/health/SleepLogForm.vue'
import WeightLogForm from '@/components/feature/health/WeightLogForm.vue'
import MoodLogForm from '@/components/feature/health/MoodLogForm.vue'
import Modal from '@/components/ui/Modal.vue'

const sleepFormOpen = ref(false)
const weightFormOpen = ref(false)
const moodFormOpen = ref(false)

function openSleepForm(): void {
  sleepFormOpen.value = true
}

function openWeightForm(): void {
  weightFormOpen.value = true
}

function openMoodForm(): void {
  moodFormOpen.value = true
}
</script>

<template>
  <div class="p-8 max-w-5xl">
    <header class="mb-8">
      <p class="heading-sm text-ink-faint mb-2">SALUD</p>
      <h1 class="display-xl text-ink">Tus métricas</h1>
      <p class="body-md text-ink-soft mt-2">
        Agua, sueño, peso y ánimo. Lo básico, sin agobios.
      </p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <WaterWidget />
      <SleepWidget :open-form="openSleepForm" />
      <WeightWidget :open-form="openWeightForm" />
      <MoodWidget :open-form="openMoodForm" />
    </div>

    <Modal v-model="sleepFormOpen" title="Registrar noche">
      <SleepLogForm
        @close="sleepFormOpen = false"
        @saved="sleepFormOpen = false"
      />
    </Modal>

    <Modal v-model="weightFormOpen" title="Registrar peso">
      <WeightLogForm
        @close="weightFormOpen = false"
        @saved="weightFormOpen = false"
      />
    </Modal>

    <Modal v-model="moodFormOpen" title="¿Cómo te sientes hoy?">
      <MoodLogForm
        @close="moodFormOpen = false"
        @saved="moodFormOpen = false"
      />
    </Modal>
  </div>
</template>
