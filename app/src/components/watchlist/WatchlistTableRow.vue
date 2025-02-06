<template>
  <!-- Bind inherited attributes (like data-row) from the parent -->
  <tr
    v-bind="$attrs"
    :class="{ 'updated-row': crypto.updated }"
    tabindex="0"
    @keydown.enter="$emit('select', crypto.id)"
  >
    <td
      role="gridcell"
      tabindex="0"
      data-col="0"
      data-label="#"
      @keydown="$emit('keydown', $event)"
    >
      {{ $attrs['data-row'] }}
    </td>
    <td
      role="gridcell"
      tabindex="0"
      data-col="0"
      data-label="Added"
      @keydown="$emit('keydown', $event)"
    >
      {{ formatDate(crypto.added) }}
    </td>
    <td
      role="gridcell"
      tabindex="0"
      data-col="1"
      data-label="Logo"
      @keydown="$emit('keydown', $event)"
    >
      <img :src="crypto.image" :alt="'Logo of ' + crypto.name" class="crypto-logo" />
    </td>
    <td
      role="gridcell"
      tabindex="0"
      data-col="2"
      data-label="Name"
      @keydown="$emit('keydown', $event)"
    >
      <RouterLink
        :to="`/crypto/${crypto.id}`"
        class="crypto-link"
        :aria-label="`View details for ${crypto.name}`"
      >
        {{ crypto.name }}
      </RouterLink>
    </td>
    <td
      role="gridcell"
      tabindex="0"
      data-col="3"
      data-label="Symbol"
      @keydown="$emit('keydown', $event)"
    >
      {{ crypto.symbol.toUpperCase() }}
    </td>
    <td
      role="gridcell"
      tabindex="0"
      data-col="4"
      data-label="Price"
      @keydown="$emit('keydown', $event)"
    >
      {{ formatCurrency(crypto.price, crypto.currency) }}
    </td>
    <td
      role="gridcell"
      tabindex="0"
      data-col="5"
      data-label="Change"
      :class="{
        positive: crypto.priceChangePercentage >= 0,
        negative: crypto.priceChangePercentage < 0
      }"
      @keydown="$emit('keydown', $event)"
    >
      {{ formatPercentage(crypto.priceChangePercentage) }}
    </td>
    <td
      role="gridcell"
      tabindex="0"
      data-col="6"
      data-label="Updated Date"
      @keydown="$emit('keydown', $event)"
    >
      {{ formatDate(crypto.lastUpdated) }}
    </td>
    <td
      role="gridcell"
      tabindex="0"
      data-col="7"
      data-label="Actions"
      @keydown="$emit('keydown', $event)"
    >
      <button class="btn-delete" aria-label="Delete {{ crypto.name }}" @click="$emit('delete')">
        <i class="bi bi-trash3-fill" aria-hidden="true"></i>
      </button>
    </td>
  </tr>
</template>

<script>
import { defineComponent } from 'vue'
import { useFormat } from '@/composables/table/useFormat'
import { RouterLink } from 'vue-router'

export default defineComponent({
  name: 'WatchlistTableRow',
  components: {
    RouterLink
  },
  props: {
    crypto: {
      type: Object,
      required: true
    }
  },
  emits: ['delete', 'keydown', 'select'],
  setup() {
    const { formatCurrency, formatPercentage, formatDate } = useFormat()

    return {
      formatCurrency,
      formatPercentage,
      formatDate
    }
  }
})
</script>
