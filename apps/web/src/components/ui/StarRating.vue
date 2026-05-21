<script setup lang="ts">
import { computed, ref } from 'vue'
import { Star } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    modelValue: number | null
    max?: number
    size?: number
    disabled?: boolean
    label?: string
  }>(),
  {
    max: 5,
    size: 28,
    disabled: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const hoverValue = ref<number | null>(null)

const displayValue = computed(() => hoverValue.value ?? props.modelValue ?? 0)

function onSelect(value: number): void {
  if (props.disabled) return
  emit('update:modelValue', value)
}

function onEnter(value: number): void {
  if (props.disabled) return
  hoverValue.value = value
}

function onLeave(): void {
  hoverValue.value = null
}

function starClasses(index: number): string[] {
  const active = displayValue.value >= index
  return [
    'transition-colors duration-fast ease-out-soft',
    active ? 'text-ochre fill-ochre' : 'text-ink-faint fill-transparent',
    props.disabled ? 'cursor-not-allowed' : 'cursor-pointer hover:scale-110',
  ]
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <p v-if="label" class="body-sm text-ink font-medium">{{ label }}</p>

    <div
      class="flex items-center gap-1"
      role="radiogroup"
      :aria-label="label ?? 'Calificación'"
      @mouseleave="onLeave"
    >
      <button
        v-for="i in max"
        :key="i"
        type="button"
        :disabled="disabled"
        :class="starClasses(i)"
        :aria-label="`${i} de ${max} estrellas`"
        :aria-pressed="modelValue === i"
        class="p-1 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-500"
        @click="onSelect(i)"
        @mouseenter="onEnter(i)"
      >
        <Star :size="size" />
      </button>

      <span v-if="modelValue !== null" class="ml-2 body-sm text-ink-soft">
        {{ modelValue }}/{{ max }}
      </span>
    </div>
  </div>
</template>
