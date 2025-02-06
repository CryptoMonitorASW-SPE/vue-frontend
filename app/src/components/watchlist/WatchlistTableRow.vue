<template>
  <!-- Remove explicit role on tr; tabindex kept for keyboard navigation -->
  <tr
    :class="{ 'updated-row': crypto.updated }"
    tabindex="0"
    @keydown.enter="$emit('select', crypto.id)"
  >
    <td data-label="Added" data-col="added">{{ formatDate(crypto.added) }}</td>
    <td data-label="Logo" data-col="logo">
      <img :src="crypto.image" :alt="'Logo of ' + crypto.name" class="crypto-logo" />
    </td>
    <td data-label="Name" data-col="name">
      <RouterLink
        :to="`/crypto/${crypto.id}`"
        class="crypto-link"
        :aria-label="`View details for ${crypto.name}`"
      >
        {{ crypto.name }}
      </RouterLink>
    </td>
    <td data-label="Symbol" data-col="symbol">{{ crypto.symbol.toUpperCase() }}</td>
    <td data-label="Price" data-col="price">{{ formatCurrency(crypto.price, crypto.currency) }}</td>
    <td
      data-label="Change"
      data-col="change"
      :class="{
        positive: crypto.priceChangePercentage >= 0,
        negative: crypto.priceChangePercentage < 0
      }"
    >
      {{ formatPercentage(crypto.priceChangePercentage) }}
    </td>
    <td data-label="Updated Date" data-col="updated-date">{{ formatDate(crypto.lastUpdated) }}</td>
    <td data-label="Actions" data-col="actions">
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
