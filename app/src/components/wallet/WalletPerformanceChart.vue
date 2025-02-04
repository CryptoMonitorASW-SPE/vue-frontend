<!-- filepath: /src/components/wallet/WalletPerformanceChart.vue -->
<template>
  <div class="performance-chart">
    <apexchart type="line" :options="chartOptions" :series="series" />
  </div>
</template>

<script>
import { computed } from 'vue'
import ApexChart from 'vue3-apexcharts'

export default {
  name: 'WalletPerformanceChart',
  components: { apexchart: ApexChart },
  props: {
    history: {
      type: Array,
      required: true
    },
    currentValue: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    // Merge history with currentValue if necessary
    const augmentedHistory = computed(() => {
      let points = [...props.history]
      if (points.length === 0 || points[points.length - 1].value !== props.currentValue) {
        points.push({
          date: new Date(),
          value: props.currentValue,
          type: 'current'
        })
      }
      return points
    })

    // Format series data as [timestamp, value]
    const series = computed(() => [
      {
        name: 'Wallet Value',
        data: augmentedHistory.value.map(point => [new Date(point.date).getTime(), point.value])
      }
    ])

    const chartOptions = computed(() => ({
      chart: {
        type: 'line',
        zoom: { enabled: false }
      },
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        labels: {
          formatter: val => `${val.toLocaleString()}`
        }
      },
      tooltip: {
        x: {
          format: 'dd MMM yyyy'
        },
        y: {
          formatter: val => `${val.toLocaleString()}`
        }
      }
    }))

    return { series, chartOptions }
  }
}
</script>

<style scoped>
.performance-chart {
  height: 400px;
  margin: 2rem 0;
}
</style>
