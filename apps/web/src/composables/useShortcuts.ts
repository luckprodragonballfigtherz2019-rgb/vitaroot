import { onMounted, onUnmounted } from 'vue'

type Handler = (event: KeyboardEvent) => void

export interface ShortcutMap {
  /** Atajos con modificadores (Cmd/Ctrl + tecla). Key formato: "mod+\\", "mod+s" */
  modifier?: Record<string, Handler>
  /** Secuencias de teclas tipo Vim (g luego h). Key formato: "g h", "g g" */
  sequence?: Record<string, Handler>
}

const SEQUENCE_TIMEOUT_MS = 1000

/**
 * Registra atajos de teclado globales.
 * Se limpian automáticamente al desmontar el componente.
 *
 * Ignora eventos cuando el foco está en inputs/textareas/contenteditable.
 */
export function useShortcuts(shortcuts: ShortcutMap): void {
  let pendingKey: string | null = null
  let pendingTimeout: ReturnType<typeof setTimeout> | null = null

  const clearPending = (): void => {
    pendingKey = null
    if (pendingTimeout !== null) {
      clearTimeout(pendingTimeout)
      pendingTimeout = null
    }
  }

  const isTypingInInput = (target: EventTarget | null): boolean => {
    if (!(target instanceof HTMLElement)) return false
    const tag = target.tagName
    return (
      tag === 'INPUT' ||
      tag === 'TEXTAREA' ||
      tag === 'SELECT' ||
      target.isContentEditable
    )
  }

  const handler = (event: KeyboardEvent): void => {
    if (isTypingInInput(event.target)) return

    const key = event.key.toLowerCase()
    const hasModifier = event.metaKey || event.ctrlKey

    // 1. Atajos con modificador (Cmd/Ctrl + X)
    if (hasModifier && shortcuts.modifier) {
      const comboKey = `mod+${key}`
      const fn = shortcuts.modifier[comboKey]
      if (fn) {
        event.preventDefault()
        fn(event)
        clearPending()
        return
      }
    }

    // 2. Secuencias tipo Vim (g luego h)
    if (!hasModifier && shortcuts.sequence) {
      if (pendingKey) {
        // Hay tecla previa, intentar completar secuencia
        const comboKey = `${pendingKey} ${key}`
        const fn = shortcuts.sequence[comboKey]
        if (fn) {
          event.preventDefault()
          fn(event)
        }
        clearPending()
        return
      }

      // Empieza una nueva posible secuencia
      const isStartOfSequence = Object.keys(shortcuts.sequence).some((k) =>
        k.startsWith(`${key} `),
      )
      if (isStartOfSequence) {
        pendingKey = key
        pendingTimeout = setTimeout(clearPending, SEQUENCE_TIMEOUT_MS)
      }
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handler)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handler)
    clearPending()
  })
}
