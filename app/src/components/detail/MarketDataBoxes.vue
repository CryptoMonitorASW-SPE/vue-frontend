<template>
  <div class="market-data-boxes">
    <div class="row g-3">
      <div
        v-for="(item, index) in marketData"
        :key="index"
        :class="index < 2 ? 'col-12' : 'col-12 col-md-6'"
      >
        <div class="data-box p-3 rounded-3">
          <div class="data-title text-secondary mb-1 small">
            {{ item.title }}
          </div>
          <div class="data-value fw-semibold">
            {{ item.value }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'MarketDataBoxes',
  props: {
    circulatingSupply: { type: Number, required: true },
    totalSupply: { type: Number, required: true },
    maxSupply: { type: Number, required: true },
    ATH: { type: Number, required: true },
    athChangePercentage: { type: Number, required: true },
    currency: { type: String, default: 'usd' }
  },
  setup(props) {
    console.log(props)
    const marketData = computed(() => {
      return [
        {
          title: 'Circulating Supply',
          value: `${formatNumber(props.circulatingSupply)}`
        },
        {
          title: 'Max Supply',
          value: `${formatNumber(props.maxSupply)}`
        },
        {
          title: 'All-Time High (ATH)',
          value: props.ATH ? formatCurrency(props.ATH, props.currency) : 'N/A'
        },
        {
          title: 'ATH Change %',
          value: props.athChangePercentage ? `${props.athChangePercentage.toFixed(2)}%` : 'N/A'
        }
      ]
    })

    // Helper functions to format numbers and currencies
    const formatCurrency = (value, currency) => {
      if (!value) return 'N/A'
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency.toUpperCase(),
        maximumFractionDigits: 2
      }).format(value)
    }

    const formatNumber = value => {
      if (!value) return 'N/A'
      return new Intl.NumberFormat().format(value)
    }

    return {
      marketData
    }
  }
}
</script>
