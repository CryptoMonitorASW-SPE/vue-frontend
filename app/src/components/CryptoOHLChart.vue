<template>
  <div class="ohlc-chart-container">
    <div class="time-span-buttons">
      <button
        v-for="span in timeSpans"
        :key="span"
        :class="['time-span-button', { active: selectedSpan === span }]"
        @click="setTimeSpan(span)"
      >
        {{ span }}
      </button>
    </div>
    <div v-if="isLoading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else class="ohlc-chart">
      <apexcharts type="candlestick" :options="chartOptions" :series="currentSeries"></apexcharts>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'
import { ref, computed, onMounted } from 'vue'
import { useCryptoChartDetailStore } from '../stores/CryptoChartDetailStore'

export default {
  name: 'CryptoOHLChart',
  components: {
    apexcharts: VueApexCharts
  },
  setup() {
    const cryptoChartDetailStore = useCryptoChartDetailStore()

    // Define constants for coinId and currency
    const coinId = 'bitcoin' // You can make this dynamic as needed
    const currency = 'usd' // You can make this dynamic as needed

    const timeSpans = ['1D', '7D', '1M', '6M', '1Y']
    const spanToDaysMap = {
      '1D': 1,
      '7D': 7,
      '1M': 30,
      '6M': 180,
      '1Y': 365
    }
    const selectedSpan = ref('1D')
    const isLoading = computed(() => cryptoChartDetailStore.isLoading)
    const error = computed(() => cryptoChartDetailStore.error)

    const chartOptions = ref({
      chart: {
        type: 'candlestick',
        height: 350,
        toolbar: {
          show: true
        }
      },
      title: {
        text: 'OHLC Chart',
        align: 'left'
      },
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      }
    })

    const currentSeries = computed(() => {
      const chartDataForSpan = cryptoChartDetailStore.chartData[selectedSpan.value]

      if (!chartDataForSpan || !chartDataForSpan.payload) {
        console.warn(`No payload available for span: ${selectedSpan.value}`)
        return []
      }

      const data = chartDataForSpan.payload

      return data && data.length > 0 ? [{ data }] : []
    })

    /**
     * Fetches chart data for the selected time span.
     * @param {string} span - The selected time span (e.g., '1D', '7D').
     */
    const fetchDataForSpan = async span => {
      const days = spanToDaysMap[span]
      if (!days) {
        console.error(`No days mapping found for span: ${span}`)
        return
      }
      console.log(`Fetching chart data for span: ${span}`)
      await cryptoChartDetailStore.fetchChartData(coinId, currency, days, span)
    }

    /**
     * Sets the selected time span and fetches data if not already available.
     * @param {string} span - The time span to set (e.g., '1D').
     */
    const setTimeSpan = async span => {
      if (selectedSpan.value !== span) {
        selectedSpan.value = span
        if (!cryptoChartDetailStore.chartData[span]) {
          await fetchDataForSpan(span)
        }
      }
    }

    onMounted(() => {
      fetchDataForSpan(selectedSpan.value)
    })

    return {
      timeSpans,
      selectedSpan,
      isLoading,
      error,
      chartOptions,
      currentSeries,
      setTimeSpan
    }
  }
}
</script>

<style lang="scss" scoped>
.ohlc-chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.time-span-buttons {
  margin-bottom: 20px;
}

.time-span-button {
  margin: 0 5px;
  padding: 8px 16px;
  border: none;
  background-color: #f0f0f0;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.time-span-button.active {
  background-color: #007bff;
  color: white;
}

.time-span-button:hover {
  background-color: #dcdcdc;
}

.loading,
.error {
  font-size: 16px;
  margin-top: 20px;
}

.ohlc-chart {
  width: 100%;
  max-width: 800px;
}
</style>
