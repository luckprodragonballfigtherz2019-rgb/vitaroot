<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    placeholder?: string
    type?: 'text' | 'email' | 'date' | 'datetime-local' | 'time' | 'password'
    error?: string
    hint?: string
    disabled?: boolean
    required?: boolean
    autocomplete?: string
    maxlength?: number
  }>(),
  {
    type: 'text',
    disabled: false,
    required: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputId = computed(() => `input-${Math.random().toString(36).slice(2, 9)}`)

const inputClasses = computed(() => [
  'w-full px-3 py-2 rounded-md border bg-paper text-ink',
  'transition-colors duration-fast ease-out-soft',
  'placeholder:text-ink-faint',
  'focus:outline-none focus:ring-2 focus:ring-moss-500 focus:ring-offset-2 focus:ring-offset-paper',
  'disabled:opacity-50 disabled:cursor-not-allowed',
  props.error ? 'border-garnet' : 'border-line hover:border-line-soft',
])
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" :for="inputId" class="body-sm text-ink font-medium">
      {{ label }}
      <span v-if="required" class="text-garnet">*</span>
    </label>

    <input
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :autocomplete="autocomplete"
      :maxlength="maxlength"
      :class="inputClasses"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />

    <p v-if="error" :id="`${inputId}-error`" class="body-xs text-garnet">
      {{ error }}
    </p>
    <p v-else-if="hint" :id="`${inputId}-hint`" class="body-xs text-ink-faint">
      {{ hint }}
    </p>
  </div>
</template>
