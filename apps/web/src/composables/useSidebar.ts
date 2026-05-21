import { ref, readonly } from 'vue'

// Estado compartido del sidebar a nivel de módulo.
const collapsed = ref(false)

export function useSidebar() {
  return {
    collapsed: readonly(collapsed),
    toggle: () => {
      collapsed.value = !collapsed.value
    },
    collapse: () => {
      collapsed.value = true
    },
    expand: () => {
      collapsed.value = false
    },
  }
}
