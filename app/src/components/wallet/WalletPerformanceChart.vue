<template>
  <figure class="performance-chart" aria-labelledby="performance-chart-caption">
    <figcaption id="performance-chart-caption" class="sr-only">
      Wallet Performance Chart showing the historical performance of the wallet.
    </figcaption>
    <div v-if="!history || history.length === 0" class="text-center my-5">
      <div>
        <h2>No data available</h2>
      </div>
    </div>
    <apexchart v-else type="line" :options="chartOptions" :series="series" />
  </figure>
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

    const series = computed(() => [
      {
        name: 'Wallet Value',
        data: augmentedHistory.value.map(point => [new Date(point.date).getTime(), point.value])
      }
    ])

    const chartOptions = computed(() => ({
      chart: { type: 'line', zoom: { enabled: false } },
      xaxis: { type: 'datetime' },
      yaxis: {
        labels: { formatter: val => `${val.toLocaleString()}` }
      },
      tooltip: {
        x: { format: 'dd MMM yyyy' },
        y: { formatter: val => `${val.toLocaleString()}` }
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
