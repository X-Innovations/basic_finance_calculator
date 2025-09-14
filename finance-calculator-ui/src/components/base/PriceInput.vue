<script setup lang="ts">
// can combine this with RateInput with a prop to switch formatting
import { computed, ref } from 'vue'
import { formatCurrency } from '@/utils'

const props = defineProps<{ value: string }>()

const valueNumber = computed(() => {
  const num = parseFloat(props.value);
  return isNaN(num) ? 0 : num;
})

const inFocus = ref(false)

const displayValue = computed(() => inFocus.value ? valueNumber.value : formatCurrency(valueNumber.value));

</script>

<template>
  <input
    v-bind="$attrs"
    :value="displayValue"
    type="text"
    class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 text-right"
    @focus="inFocus = true"
    @blur="inFocus = false"
    @input="$emit('input', $event)"
  />
</template>
