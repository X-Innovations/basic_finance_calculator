<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuoteStore } from '@/stores/quote'
import { formatCurrency } from '@/utils'

const quoteStore = useQuoteStore()

const quoteName = ref<string>("")

const canSubmit = computed(() => !quoteStore.loading && quoteName.value)

async function saveCurrentQuote() {
  // no validation needed. any string works.
  await quoteStore.saveCurrentQuote(quoteName.value);
}

</script>

<template>
  <div class="card mb-6 rounded-lg border border-gray-200">
    <div class="p-4 bg-gray-100 border-b border-gray-200">
      <h1>Result</h1>
    </div>
    <div class="flex flex-col gap-4 p-4">
      <div class="flex justify-between items-center h-12">
        <span class="text-gray-700">Taxes: </span>
        <span class="text-gray-700">{{ formatCurrency(quoteStore.currentQuoteAmount.taxes) }}</span>
      </div>
      <div class="flex justify-between items-center h-12">
        <span class="text-gray-700">Base Loan Amount: </span>
        <span class="text-gray-700">{{ formatCurrency(quoteStore.currentQuoteAmount.baseLoanAmount) }}</span>
      </div>
      <div class="flex justify-between items-center h-12">
        <span class="text-gray-700">Interest: </span>
        <span class="text-gray-700">{{ formatCurrency(quoteStore.currentQuoteAmount.interest) }}</span>
      </div>
      <div class="flex justify-between items-center h-12">
        <span class="text-gray-700">Total Loan Amount: </span>
        <span class="text-gray-700">{{ formatCurrency(quoteStore.currentQuoteAmount.totalLoanAmount) }}</span>
      </div>
      <div class="flex justify-between items-center font-bold h-12">
        <span class="text-gray-700">Payment: </span>
        <span class="text-gray-700">{{ formatCurrency(quoteStore.currentQuoteAmount.monthlyPayment) }}</span>
      </div>
      <div class="flex justify-between items-center font-bold h-12">
        <span class="text-gray-700">Out Of Pocket: </span>
        <span class="text-gray-700">{{ formatCurrency(quoteStore.currentQuoteAmount.downPayment) }}</span>
      </div>
      <div class="flex justify-between items-center h-12">
        <label class="text-gray-700">Quote Name: </label>
        <input type="text" 
          v-model="quoteName"
          class="min-w-50 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" />
      </div>
      <div class="flex justify-end">
      <!-- need to add dynamic class binding for disabled state -->
      <button type="button" :disabled="!canSubmit" @click="saveCurrentQuote" class="bg-black text-white px-6 py-2 rounded hover:bg-blue-600 transition">Save</button>
      </div>
  </div>
  </div>
</template>
