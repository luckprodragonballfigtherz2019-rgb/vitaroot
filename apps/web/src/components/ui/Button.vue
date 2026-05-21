<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg' | 'xl'

const props = withDefaults(
  defineProps<{
    variant?: Variant
    size?: Size
    loading?: boolean
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    type: 'button',
  },
)

const classes = computed(() => [
  'inline-flex items-center justify-center gap-2 rounded-md font-medium',
  'transition-colors transition-transform duration-fast ease-spring',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-500 focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
  'active:scale-[0.97]',
  'disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100',
  props.variant === 'primary' && 'bg-moss-500 text-paper hover:bg-moss-700',
  props.variant === 'secondary' && 'border border-line text-ink hover:bg-paper-deep',
  props.variant === 'ghost' && 'text-ink-soft hover:text-ink hover:bg-paper-soft',
  props.variant === 'danger' && 'bg-garnet text-paper hover:opacity-90',
  props.size === 'sm' && 'h-8 px-3 text-sm',
  props.size === 'md' && 'h-10 px-4 text-base',
  props.size === 'lg' && 'h-12 px-5 text-base',
  props.size === 'xl' && 'h-14 px-6 text-lg',
])
</script>

<template>
  <button :type="type" :class="classes" :disabled="disabled || loading">
    <span v-if="loading" class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
    <slot v-else />
  </button>
</template>
