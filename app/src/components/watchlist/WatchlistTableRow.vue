<template>
  <tr :class="{ 'updated-row': crypto.updated }">
    <td>{{ formatDate(crypto.added) }}</td>
    <td>
      <img :src="crypto.image" :alt="'Logo of ' + crypto.name" class="crypto-logo" />
    </td>
    <td>
      <RouterLink
        :to="`/crypto/${crypto.id}`"
        class="crypto-link"
        :aria-label="`View details for ${crypto.name}`"
      >
        {{ crypto.name }}
      </RouterLink>
    </td>
    <td>{{ crypto.symbol.toUpperCase() }}</td>
    <td>{{ formatCurrency(crypto.price, crypto.currency) }}</td>
    <td
      :class="{
        positive: crypto.priceChangePercentage >= 0,
        negative: crypto.priceChangePercentage < 0
      }"
    >
      {{ formatPercentage(crypto.priceChangePercentage) }}
    </td>
    <td>{{ formatDate(crypto.lastUpdated) }}</td>
    <td>
      <button class="btn-delete" aria-label="Delete" @click="$emit('delete')">
        <i class="bi bi-trash3-fill"></i>
      </button>
    </td>
  </tr>
</template>

<script>
import { useFormat } from '@/composables/table/useFormat'

export default {
  name: 'WatchlistTableRow',
  props: {
    crypto: {
      type: Object,
      required: true
    }
  },
  emits: ['delete'],
  setup() {
    const { formatCurrency, formatPercentage, formatDate } = useFormat()

    return {
      formatCurrency,
      formatPercentage,
      formatDate
    }
  }
}
</script>
