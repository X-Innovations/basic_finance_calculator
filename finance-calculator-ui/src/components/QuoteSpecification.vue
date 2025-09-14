<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuoteStore } from '@/stores/quote'
import type { QuoteSpecification, StringObject } from '@/types'
import PriceInput from './base/PriceInput.vue'
import RateInput from './base/RateInput.vue'

const quoteStore = useQuoteStore()

const errors = ref<StringObject>({})

const canSubmit = computed(() => {
  return !quoteStore.loading && Object.keys(errors.value).length === 0
})

const spec = ref<QuoteSpecification>(quoteStore.currentQuoteSpec || {
    baseCost: "26906.00",
    targetProfit: "1500.00",
    totalPrice: "28406.00",
    termMonths: 36,
    downPayment: "2000.00",
    interestRate: "5.7",
    taxRate: "7.5",
})

function handleBaseCostChange(event: Event) {
  const baseCost = parseFloat((event.target as HTMLInputElement).value);
  if (!baseCost) {
    errors.value.baseCost = "Base Cost must be a valid number";
    spec.value.baseCost = "";
    return;
  }
  delete errors.value.baseCost;
  spec.value.baseCost = baseCost.toFixed(2);

  if (!spec.value.baseCost && !spec.value.targetProfit) {
    return;
  }
  
  // favor target profit if both are present
  if (spec.value.targetProfit) {
    const profit = parseFloat(spec.value.targetProfit)
    if (!isNaN(profit)) {
      spec.value.totalPrice = (baseCost + profit).toFixed(2)
    }
    return;
  }

  const total = parseFloat(spec.value.totalPrice)
  if (!isNaN(total)) {
    spec.value.targetProfit = (total - baseCost).toFixed(2)
  }
}

function handleProfitChange(event: Event) {
  const profit = parseFloat((event.target as HTMLInputElement).value);
  if (!profit) {
    errors.value.targetProfit = "Target Profit must be a valid number";
    spec.value.targetProfit = "";
    return;
  }
  delete errors.value.targetProfit
  spec.value.targetProfit = profit.toFixed(2);

  if (!spec.value.baseCost && !spec.value.totalPrice) {
    return;
  }

  // favor base cost if both are present
  if (spec.value.baseCost) {
    const baseCost = parseFloat(spec.value.baseCost);
    if (!isNaN(baseCost)) {
      spec.value.totalPrice = (baseCost + profit).toFixed(2);
    }
    return;
  }

  const total = parseFloat(spec.value.totalPrice);
  if (!isNaN(total)) {
    spec.value.baseCost = (total - profit).toFixed(2);
  }
}

function handleTotalPriceChange(event: Event) {
  const total = parseFloat((event.target as HTMLInputElement).value);
  if (!total) {
    errors.value.totalPrice = "Total Price must be a valid number";
    spec.value.totalPrice = "";
    return;
  }
  delete errors.value.totalPrice;
  spec.value.totalPrice = total.toFixed(2);

  if (!spec.value.baseCost && !spec.value.targetProfit) {
    return;
  }
  
  // favor target profit if both are present
  if (spec.value.targetProfit) {
    const profit = parseFloat(spec.value.targetProfit)
    if (!isNaN(profit)) {
      spec.value.baseCost = (total - profit).toFixed(2)
    }
    return;
  }

  const baseCost = parseFloat(spec.value.baseCost)
  if (!isNaN(baseCost)) {
    spec.value.targetProfit = (total - baseCost).toFixed(2)
  }
}

function handleDownPaymentChange(event: Event) {
  const price = parseFloat((event.target as HTMLInputElement).value);
  if (!price) {
    errors.value.downPayment = "Down Payment must be a valid number";
    spec.value.downPayment = "";
    return;
  }
  delete errors.value.downPayment;
  spec.value.downPayment = price.toFixed(2);
}

function handleRateChange(event: Event, field: 'interestRate' | 'taxRate') {
  const price = parseFloat((event.target as HTMLInputElement).value);
  if (!price) {
    errors.value[field] = `${field} must be a valid number`;
    spec.value[field] = "";
    return;
  }
  if (price < 0) {
    errors.value[field] = `${field} must be a positive number`;
    spec.value[field] = "";
    return;
  }
  delete errors.value[field];
  spec.value[field] = price.toFixed(2);
}

async function submitQuote() {
  // skipping validation since fields are validated on change.
  await quoteStore.generateQuote(spec.value);
}

</script>

<template>
  <div class="card mb-6 rounded-lg border border-gray-200">
    <div class="p-4 bg-gray-100 border-b border-gray-200">
      <h1>Finance Quote</h1>
    </div>
    <div class="flex flex-col gap-4 p-4">
      <div class="flex items-center justify-between ">
        <label class="w-1/2 text-gray-700">Cost: </label>
        <div class="flex flex-col items-end">
          <PriceInput :value="spec.baseCost" @input="handleBaseCostChange" />
          <span v-if="errors.cost" class="error-text">{{ errors.baseCost }}</span>
        </div>
      </div>
      <div class="flex items-center justify-between ">
        <label class="w-1/2 text-gray-700">Profit: </label>
        <div class="flex flex-col items-end">
          <PriceInput :value="spec.targetProfit" @input="handleProfitChange" />
          <span v-if="errors.profit" class="error-text">{{ errors.targetProfit }}</span>
          </div>
      </div>
      <div class="flex items-center justify-between h-12">
        <label class="w-1/2 text-gray-700">Selling Price: </label>
        <div class="flex flex-col items-end">
          <PriceInput :value="spec.totalPrice" @input="handleTotalPriceChange" />
          <span v-if="errors.cost" class="error-text">{{ errors.totalPrice }}</span>
        </div>
      </div>
      <!-- formatting is off for this field because of non-component. could be a separate type when shared input is created -->
      <div class="flex items-center justify-between h-12">
        <label class="w-1/2 text-gray-700">Term (Months): </label>
        <div class="flex flex-col items-end">
        <input type="number" 
        min="1"
        max="120"
        v-model.number="spec.termMonths"
        class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200 text-right"/>
          </div>
      </div>
      <div class="flex items-center justify-between h-12">
        <label class="w-1/2 text-gray-700">Rate: </label>
        <div class="flex flex-col items-end">
          <RateInput :value="spec.interestRate" @input="handleRateChange($event, 'interestRate')" />
        <span v-if="errors.interestRate" class="error-text">{{ errors.interestRate }}</span>
        </div>
      </div>
      <div class="flex items-center justify-between h-12">
        <label class="w-1/2 text-gray-700">Out of Pocket: </label>
        <div class="flex flex-col items-end">
          <PriceInput :value="spec.downPayment" @input="handleDownPaymentChange" />
          <span v-if="errors.downPayment" class="error-text">{{ errors.downPayment }}</span>
        </div>
      </div>
      <div class="flex items-center justify-between h-12">
        <label class="w-1/2 text-gray-700">Tax Rate: </label>
        <div class="flex flex-col items-end">
          <RateInput :value="spec.taxRate" @input="handleRateChange($event, 'taxRate')" />
          <span v-if="errors.taxRate" class="error-text">{{ errors.taxRate }}</span>
      </div>
      </div>
      <div class="flex justify-end">
      <!-- need to add dynamic class binding for disabled state -->
        <button type="button" :disabled="!canSubmit" @click="submitQuote" class="bg-black text-white px-6 py-2 rounded hover:bg-blue-600 transition">Apply</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
