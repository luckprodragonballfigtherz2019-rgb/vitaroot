<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue'
import { X } from 'lucide-vue-next'

const props = defineProps<{
  modelValue: boolean
  title?: string
  closeOnBackdrop?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function close(): void {
  emit('update:modelValue', false)
}

function onBackdropClick(): void {
  if (props.closeOnBackdrop !== false) {
    close()
  }
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && props.modelValue) {
    close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})

// Bloquea el scroll del body cuando el modal está abierto
watch(
  () => props.modelValue,
  (open) => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = open ? 'hidden' : ''
  },
)
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="title ? 'modal-title' : undefined"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-ink/40 backdrop-blur-sm"
          @click="onBackdropClick"
        />

        <!-- Contenido -->
        <div
          class="relative w-full max-w-md bg-paper border border-line-soft rounded-lg shadow-lg overflow-hidden"
        >
          <div
            v-if="title || $slots.header"
            class="flex items-center justify-between px-5 py-4 border-b border-line-soft"
          >
            <h2 v-if="title" id="modal-title" class="heading-md text-ink">
              {{ title }}
            </h2>
            <slot name="header" />
            <button
              type="button"
              class="p-1 rounded-md text-ink-faint hover:text-ink hover:bg-paper-soft transition-colors duration-fast"
              aria-label="Cerrar"
              @click="close"
            >
              <X :size="18" />
            </button>
          </div>

          <div class="p-5">
            <slot />
          </div>

          <div v-if="$slots.footer" class="px-5 py-4 border-t border-line-soft bg-paper-soft/50">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 200ms cubic-bezier(0.32, 0.72, 0.32, 1);
}

.modal-enter-active > div:last-child,
.modal-leave-active > div:last-child {
  transition: transform 200ms cubic-bezier(0.5, 1.6, 0.5, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from > div:last-child,
.modal-leave-to > div:last-child {
  transform: scale(0.96);
}
</style>
