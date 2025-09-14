<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useQuoteStore } from '@/stores/quote'
import { formatCurrency, formatPercentage } from '@/utils'

const quoteStore = useQuoteStore()

onMounted(() => {
  // Fetch initial quotes when the component is mounted
  quoteStore.fetchAllQuotes()
})

// state tracking which quotes are expanded
const openQuotes = ref<number[]>([])

const toggleQuote = (id: number) => {
  const index = openQuotes.value.indexOf(id);
  if (index > -1) {
    openQuotes.value.splice(index, 1);
  } else {
    openQuotes.value.push(id);
  }
}
</script>

<template>
  <div class="card mb-6 rounded-lg border border-gray-200">
    <div class="p-4 bg-gray-100 border-b border-gray-200">
      <h1>Saved Quotes</h1>
    </div>
    <div class="flex flex-col gap-4 p-4 divide-y divide-gray-200">
      <div v-for="quote in quoteStore.quotes" :key="quote.id" class="flex flex-col items-center h-auto p-4">
        <div class="block w-full flex flex-row justify-between items-center">
        <!-- details -->
        <div class="flex flex-col items-start">
          <div class="font-bold text-lg">{{ quote.quoteName }}</div>
          <div class="text-sm gap-2 flex">
            <div>
              Payments: <span class="font-bold">{{ formatCurrency(quote.amount.monthlyPayment) }}</span>
            </div>
            <div>
              Out of Pocket: <span class="font-bold">{{ formatCurrency(quote.amount.downPayment) }}</span>
            </div>
          </div>
        </div>
        <!-- buttons -->
        <div class="flex flex-row">
          <button @click="toggleQuote(quote.id)" class="bg-black text-white px-6 py-2 rounded hover:bg-blue-600 transition">
            {{ openQuotes.includes(quote.id) ? 'Close' : 'View' }}
          </button>
          <button @click="quoteStore.removeQuote(quote.id)" class="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-800 transition ml-2">
            Delete
          </button>
        </div>
        </div>
         <!-- expanded details -->
        <div v-if="openQuotes.includes(quote.id)" class="block mt-4 w-full border-t pt-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
              <div class="font-bold">Specifications</div>
              <div>Cost: {{ formatCurrency(quote.specification.baseCost) }}</div>
              <div>Profit: {{ formatCurrency(quote.specification.targetProfit) }}</div>
              <div>Selling Price: {{ formatCurrency(quote.specification.totalPrice) }}</div>
              <div>Term (Months): {{ quote.specification.termMonths }}</div>
              <div>Rate: {{ formatPercentage(quote.specification.interestRate) }}</div>
              <div>Tax Rate: {{ formatPercentage(quote.specification.taxRate) }}</div>
            </div>
            <div class="flex flex-col gap-2">
              <div class="font-bold">Amounts</div>
              <div>Taxes: {{ formatCurrency(quote.amount.taxes) }}</div>
              <div>Base Loan Amount: {{ formatCurrency(quote.amount.baseLoanAmount) }}</div>
              <div>Interest: {{ formatCurrency(quote.amount.interest) }}</div>
              <div>Total Loan Amount: {{ formatCurrency(quote.amount.totalLoanAmount) }}</div>
              <div class="font-bold">Payment: {{ formatCurrency(quote.amount.monthlyPayment) }}</div>
              <div class="font-bold">Out Of Pocket: {{ formatCurrency(quote.amount.downPayment) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
