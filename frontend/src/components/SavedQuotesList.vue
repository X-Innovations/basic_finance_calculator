<script setup lang="ts">
export type SavedQuote = {
  id: string
  quoteName: string
  result: {
    payment: number
  }
  input: {
    outOfPocket: number
  }
}

const props = defineProps<{ items: SavedQuote[] }>()

const emit = defineEmits<{
  (e: 'delete', id: string): void
  (e: 'view', item: any): void
}>()
</script>

<template>
  <div>
    <div class="section-title">Saved Quotes</div>

    <div v-if="props.items.length === 0" class="footer-note">No quotes yet.</div>

    <div v-for="item in props.items" :key="item.id" class="saved-item">
      <div>
        <div style="font-weight:600">{{ item.quoteName }}</div>
        <div class="footer-note">
          Payment: ${{ item.result ? item.result.payment.toFixed(2) : '0.00' }}
          &nbsp;&nbsp; Out of Pocket:: <span style="font-weight:700">${{ (item.input?.outOfPocket || 0).toFixed(2) }}</span>
        </div>
      </div>
      <div class="actions">
        <button class="action-btn view" @click="() => emit('view', item)">View</button>
        <button class="action-btn delete" @click="() => emit('delete', item.id)">Delete</button>
      </div>
    </div>
  </div>
</template>
