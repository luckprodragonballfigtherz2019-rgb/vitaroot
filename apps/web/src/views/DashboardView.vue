<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getHealth, type HealthResponse } from '@/api/system'
import { useToast } from '@/composables/useToast'
import Button from '@/components/ui/Button.vue'

const health = ref<HealthResponse | null>(null)
const error = ref<string | null>(null)
const loading = ref(true)

const toast = useToast()

onMounted(async () => {
  try {
    health.value = await getHealth()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Error desconocido'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="p-12">
    <p class="heading-sm text-ink-faint mb-2">VITAROOT</p>
    <h1 class="display-xl text-ink">Hola, mundo.</h1>
    <p class="body-lg text-ink-soft mt-4">
      Si ves esto con la tipografía correcta y un fondo cálido, el frontend está funcionando 🌱
    </p>

    <div class="mt-12">
      <p class="heading-sm text-ink-faint mb-3">CONEXIÓN CON BACKEND</p>

      <div v-if="loading" class="body-md text-ink-soft">Cargando...</div>

      <div v-else-if="error" class="body-md text-garnet">Error: {{ error }}</div>

      <div v-else-if="health" class="space-y-1">
        <p class="body-md text-ink">
          Estado:
          <span class="font-mono text-moss-700">{{ health.status }}</span>
        </p>
        <p class="body-md text-ink">
          Entorno:
          <span class="font-mono text-moss-700">{{ health.env }}</span>
        </p>
        <p class="body-sm text-ink-faint">
          Timestamp: <span class="font-mono">{{ health.timestamp }}</span>
        </p>
      </div>
    </div>

    <div class="mt-12">
      <p class="heading-sm text-ink-faint mb-3">PROBAR TOASTS</p>
      <div class="flex gap-3">
        <Button variant="primary" @click="toast.success('Workout guardado')">
          Success
        </Button>
        <Button variant="secondary" @click="toast.info('Recordatorio: bebe agua')">
          Info
        </Button>
        <Button variant="danger" @click="toast.error('No se pudo guardar')">
          Error
        </Button>
      </div>
    </div>
  </div>
</template>
