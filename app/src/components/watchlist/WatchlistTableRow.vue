<template>
  <tr :class="{ 'updated-row': crypto.updated }">
    <td data-label="Added">{{ formatDate(crypto.added) }}</td>
    <td data-label="Logo">
      <img :src="crypto.image" :alt="'Logo of ' + crypto.name" class="crypto-logo" />
    </td>
    <td data-label="Name">
      <RouterLink
        :to="`/crypto/${crypto.id}`"
        class="crypto-link"
        :aria-label="`View details for ${crypto.name}`"
      >
        {{ crypto.name }}
      </RouterLink>
    </td>
    <td data-label="Symbol">{{ crypto.symbol.toUpperCase() }}</td>
    <td data-label="Price">{{ formatCurrency(crypto.price, crypto.currency) }}</td>
    <td
      data-label="Change"
      :class="{
        positive: crypto.priceChangePercentage >= 0,
        negative: crypto.priceChangePercentage < 0
      }"
    >
      {{ formatPercentage(crypto.priceChangePercentage) }}
    </td>
    <td data-label="Updated Date">{{ formatDate(crypto.lastUpdated) }}</td>
    <td data-label="Actions">
      <button class="btn-delete" aria-label="Delete {{ crypto.name }}" @click="$emit('delete')">
        <i class="bi bi-trash3-fill" aria-hidden="true"></i>
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
