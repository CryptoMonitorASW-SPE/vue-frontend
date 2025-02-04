<!-- filepath: /src/components/wallet/WalletPieChart.vue -->
<template>
  <div class="pie-chart">
    <apexchart type="pie" :options="chartOptions" :series="series" />
  </div>
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
      responsive: [
        {
          breakpoint: 480,
          options: { chart: { width: 300 } }
        }
      ]
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
