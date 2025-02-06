<template>
  <figure class="pie-chart" aria-labelledby="pie-chart-caption">
    <figcaption id="pie-chart-caption" class="sr-only">
      Wallet Asset Allocation Pie Chart showing the distribution of assets in your wallet.
    </figcaption>
    <div v-if="!data || data.length === 0" class="text-center my-5">
      <div>
        <h2>No data available</h2>
      </div>
    </div>
    <apexchart v-esle type="pie" :options="chartOptions" :series="series" />
  </figure>
</template>

<script>
import { computed } from 'vue'
import ApexChart from 'vue3-apexcharts'

export default {
  name: 'WalletPieChart',
  components: { apexchart: ApexChart },
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const series = computed(() => props.data.map(item => item.quantity))
    const chartOptions = computed(() => ({
      labels: props.data.map(item => item.crypto),
      legend: { position: 'bottom' },
      responsive: [{ breakpoint: 480, options: { chart: { width: 300 } } }]
    }))

    return { series, chartOptions }
  }
}
</script>

<style scoped>
.pie-chart {
  max-width: 400px;
  margin: 0 auto;
}
</style>
