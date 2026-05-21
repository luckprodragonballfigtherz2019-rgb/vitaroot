import { ref, readonly } from 'vue'

export type ToastVariant = 'success' | 'error' | 'info'

export interface Toast {
  id: number
  message: string
  variant: ToastVariant
}

// Estado compartido a nivel de módulo (singleton).
// Todos los componentes que importen useToast() ven el mismo array.
const toasts = ref<Toast[]>([])
let nextId = 0

const DEFAULT_DURATION_MS = 4000

function add(message: string, variant: ToastVariant): void {
  const id = ++nextId
  toasts.value.push({ id, message, variant })

  setTimeout(() => {
    remove(id)
  }, DEFAULT_DURATION_MS)
}

function remove(id: number): void {
  toasts.value = toasts.value.filter((t) => t.id !== id)
}

export function useToast() {
  return {
    toasts: readonly(toasts),
    success: (message: string) => add(message, 'success'),
    error: (message: string) => add(message, 'error'),
    info: (message: string) => add(message, 'info'),
    remove,
  }
}
