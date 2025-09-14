<script setup lang="ts">
import QuoteSpecification from './components/QuoteSpecification.vue';
import QuoteAmount from './components/QuoteAmount.vue';
import QuoteList from './components/QuoteList.vue';
</script>

<template>
  <div class="min-h-screen">
    <header class="bg-black flex justify-left h-16 min-w-7xl sticky top-0 z-50 px-4 py-2">
        <img 
              src="https://xinnovationsusa.com/src/images/logo/xdeskpro-logo.png" 
              alt="XDeskPro Logo"
            />
    </header>
    <main class="bg-gray-50 p-4 max-w-7xl mx-auto">
      <!-- main layout, forms on top and results below -->
      <div class="card rounded-lg p-4 bg-white">
        <div class="flex column-2 gap-4">
          <QuoteSpecification class="w-1/2" />
          <QuoteAmount class="w-1/2" />
        </div>
        <QuoteList />
      </div>
    </main>
  </div>
</template>

<style scoped>
</style>
