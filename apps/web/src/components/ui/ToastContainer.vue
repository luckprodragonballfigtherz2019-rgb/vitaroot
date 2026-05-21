<script setup lang="ts">
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-vue-next'
import { useToast, type ToastVariant } from '@/composables/useToast'

const { toasts, remove } = useToast()

const variantConfig: Record<
  ToastVariant,
  { icon: typeof CheckCircle2; classes: string }
> = {
  success: {
    icon: CheckCircle2,
    classes: 'bg-paper border-moss-300 text-ink',
  },
  error: {
    icon: AlertTriangle,
    classes: 'bg-paper border-garnet text-ink',
  },
  info: {
    icon: Info,
    classes: 'bg-paper border-line text-ink',
  },
}

const iconColor: Record<ToastVariant, string> = {
  success: 'text-moss-500',
  error: 'text-garnet',
  info: 'text-ink-soft',
}
</script>

<template>
  <div
    class="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
    aria-live="polite"
    aria-atomic="true"
  >
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'pointer-events-auto flex items-start gap-3 min-w-[280px] max-w-md px-4 py-3 rounded-md border shadow-md',
          variantConfig[toast.variant].classes,
        ]"
        role="status"
      >
        <component
          :is="variantConfig[toast.variant].icon"
          :size="18"
          :class="['mt-0.5 shrink-0', iconColor[toast.variant]]"
        />
        <p class="body-sm flex-1">{{ toast.message }}</p>
        <button
          type="button"
          class="shrink-0 text-ink-faint hover:text-ink transition-colors duration-fast"
          aria-label="Cerrar"
          @click="remove(toast.id)"
        >
          <X :size="16" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 250ms cubic-bezier(0.32, 0.72, 0.32, 1),
    transform 250ms cubic-bezier(0.32, 0.72, 0.32, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

.toast-move {
  transition: transform 250ms cubic-bezier(0.32, 0.72, 0.32, 1);
}
</style>
