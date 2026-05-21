<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: number | null
    label?: string
    placeholder?: string
    error?: string
    hint?: string
    disabled?: boolean
    required?: boolean
    min?: number
    max?: number
    step?: number
    suffix?: string
  }>(),
  {
    disabled: false,
    required: false,
    step: 1,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
}>()

const inputId = computed(() => `numinput-${Math.random().toString(36).slice(2, 9)}`)

const inputClasses = computed(() => [
  'w-full px-3 py-2 rounded-md border bg-paper text-ink',
  'transition-colors duration-fast ease-out-soft',
  'placeholder:text-ink-faint',
  'focus:outline-none focus:ring-2 focus:ring-moss-500 focus:ring-offset-2 focus:ring-offset-paper',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  // Quita las flechitas nativas de incremento (más limpio)
  '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
  props.error ? 'border-garnet' : 'border-line hover:border-line-soft',
])

function onInput(event: Event): void {
  const target = event.target as HTMLInputElement
  const raw = target.value.trim()

  if (raw === '') {
    emit('update:modelValue', null)
    return
  }

  const parsed = parseFloat(raw.replace(',', '.'))
  if (!Number.isNaN(parsed)) {
    emit('update:modelValue', parsed)
  }
}

const displayValue = computed(() =>
  props.modelValue === null || props.modelValue === undefined
    ? ''
    : String(props.modelValue),
)
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" :for="inputId" class="body-sm text-ink font-medium">
      {{ label }}
      <span v-if="required" class="text-garnet">*</span>
    </label>

    <div class="relative">
      <input
        :id="inputId"
        type="number"
        inputmode="decimal"
        :value="displayValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :min="min"
        :max="max"
        :step="step"
        :class="[inputClasses, suffix ? 'pr-12' : '']"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined"
        @input="onInput"
      />
      <span
        v-if="suffix"
        class="absolute right-3 top-1/2 -translate-y-1/2 body-sm text-ink-faint pointer-events-none"
      >
        {{ suffix }}
      </span>
    </div>

    <p v-if="error" :id="`${inputId}-error`" class="body-xs text-garnet">
      {{ error }}
    </p>
    <p v-else-if="hint" :id="`${inputId}-hint`" class="body-xs text-ink-faint">
      {{ hint }}
    </p>
  </div>
</template>
