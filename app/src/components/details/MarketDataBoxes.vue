<template>
  <div class="market-data-boxes">
    <div class="row g-3">
      <div v-for="(item, index) in marketData" :key="index" class="col-12 col-md-6">
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
export default {
  name: 'MarketDataBoxes',
  data() {
    return {
      marketData: [
        { title: 'Market Cap', value: '$2.02T -0.33%' },
        { title: 'Volume 24h', value: '$42.14B -35.43%' },
        { title: 'FDV', value: '$2.15T' },
        { title: 'Vol/Mkt Cap', value: '2.07%' },
        { title: 'Total Supply', value: '19.81M BTC' },
        { title: 'Max Supply', value: '21M BTC' },
        { title: 'Circulating Supply', value: '19.81M BTC' }
        // Add more dummy data items if needed
      ]
    }
  }
}
</script>

<style scoped>
.data-box {
  background-color: #f8f9fa;
  border: 1px solid #e9ecef;
  transition: background-color 0.2s ease;
}

.data-box:hover {
  background-color: #f1f3f5;
}

.data-title {
  font-size: 0.875rem;
}

.data-value {
  font-size: 1.125rem;
  color: #212529;
}
</style>
