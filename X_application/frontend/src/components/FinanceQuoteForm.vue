<script setup lang="ts">
import { reactive, watch, toRefs } from 'vue'

export type InputState = {
  cost: number | null
  profit: number | null
  term: number | null
  rate: number | null
  outOfPocket: number | null
  taxRate: number | null
}

const props = defineProps<{
  modelValue: InputState
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: InputState): void
  (e: 'apply', v?: InputState): void
}>()

const local = reactive<InputState>({ ...props.modelValue })


watch(local, (nv) => {
  emit('update:modelValue', { ...nv })
}, { deep: true })

watch(
  () => ({ ...props.modelValue }), // force update check
  (nv) => {
    if (!nv) return
    Object.assign(local, nv)
  },
  { deep: true, immediate: true }
)

function onApply(){
  emit('apply', { ...local })
}
</script>

<template>
  <div style="display:flex; flex-direction:column; gap:12px;">
    <div>
      <label>Cost:</label>
      <div class="input"><span>$</span><input v-model.number="local.cost" type="number" step="0.01"></div>
    </div>
    <div>
      <label>Profit:</label>
      <div class="input"><span>$</span><input v-model.number="local.profit" type="number" step="0.01"></div>
    </div>
    <div>
      <label>Selling Price:</label>
      <div class="input"><span>$</span><input :value="((Number(local.cost)||0)+(Number(local.profit)||0)).toFixed(2)" disabled></div>
    </div>
    <div style="display:flex; gap:12px;">
      <div style="flex:1">
        <label>Term:</label>
        <div class="input">
          <input v-model.number="local.term" type="number" step="1">
          <span class="small">Months</span>
        </div>
      </div>
      <div style="flex:1">
        <label>Rate:</label>
        <div class="input">
          <input v-model.number="local.rate" type="number" step="0.01">
          <span class="small">%</span>
        </div>
      </div>
    </div>
    <div>
      <label>Out Of Pocket:</label>
      <div class="input"><span>$</span><input v-model.number="local.outOfPocket" type="number" step="0.01"></div>
    </div>
    <div>
      <label>Tax Rate:</label>
      <div class="input">
        <input v-model.number="local.taxRate" type="number" step="0.01">
        <span class="small">%</span>
      </div>
    </div>
    <div>
      <button class="btn" @click="onApply">Apply</button>
    </div>
  </div>
</template>
