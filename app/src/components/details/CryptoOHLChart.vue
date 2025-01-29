<template>
  <div class="ohlc-chart-container">
    <div class="time-span-buttons" role="group" aria-label="Select Time Span">
      <button
        v-for="span in timeSpans"
        :key="span"
        :class="['time-span-button', { active: selectedSpan === span }]"
        :aria-pressed="selectedSpan === span"
        :aria-label="`Select ${span} time span`"
        @click="setTimeSpan(span)"
      >
        {{ span }}
      </button>
    </div>
    <div v-if="isLoading" class="loading" role="status" aria-live="polite">Loading...</div>
    <div v-else-if="error" class="error" role="alert">
      {{ error }}
    </div>
    <div v-else class="ohlc-chart" aria-labelledby="chart-title">
      <h2 id="chart-title" class="visually-hidden">Candlestick Chart for {{ cryptoId }}</h2>
      <apexcharts
        type="candlestick"
        :options="chartOptions"
        :series="currentSeries"
        aria-hidden="true"
      ></apexcharts>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'
import { ref, computed, onMounted } from 'vue'
import { useCryptoChartDetailStore } from '../../stores/CryptoChartDetailStore'

export default {
  name: 'CryptoOHLChart',
  components: {
    apexcharts: VueApexCharts
  },
  props: {
    cryptoId: { type: String, required: true },
    currency: { type: String, default: 'usd' }
  },
  setup(props) {
    const cryptoChartDetailStore = useCryptoChartDetailStore()

    const coinId = props.cryptoId
    const currency = props.currency

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
        text: coinId + ' - ' + currency.toUpperCase(),
        align: 'left'
      },
      xaxis: {
        type: 'datetime'
      },
      yaxis: {
        tooltip: {
          enabled: true
        }
      },
      // Accessibility enhancements for ApexCharts
      accessibility: {
        enabled: true,
        description: 'Candlestick chart showing OHLC data for the selected cryptocurrency.'
        // Optionally, more detailed descriptions can be added here
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
     * Generates a descriptive summary of the chart data for screen readers.
     */
    const chartDescription = computed(() => {
      if (!currentSeries.value.length) return 'No data available.'

      const latestData = currentSeries.value[0].data[currentSeries.value[0].data.length - 1]
      const date = new Date(latestData.x).toLocaleDateString()
      const open = latestData.y[0]
      const high = latestData.y[1]
      const low = latestData.y[2]
      const close = latestData.y[3]

      return `As of ${date}, the open price was ${open}, the high was ${high}, the low was ${low}, and the close was ${close}.`
    })

    /**
     * Prepares data for the accessible data table.
     */
    const tableData = computed(() => {
      if (!currentSeries.value.length) return []

      return currentSeries.value[0].data.map(point => ({
        x: point.x,
        y: point.y
      }))
    })

    /**
     * Formats a timestamp into a readable date string.
     * @param {number|string} timestamp - The timestamp to format.
     * @returns {string} - The formatted date string.
     */
    const formatDate = timestamp => {
      const date = new Date(timestamp)
      return date.toLocaleDateString()
    }

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
      setTimeSpan,
      chartDescription,
      tableData,
      formatDate
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
  color: #000; /* Ensuring sufficient contrast */
}

.time-span-button.active {
  background-color: #0056b3; /* Darker blue for better contrast */
  color: #ffffff;
}

.time-span-button:hover,
.time-span-button:focus {
  background-color: #dcdcdc;
  outline: none; /* Ensure focus is indicated via other means */
}

.loading,
.error {
  font-size: 16px;
  margin-top: 20px;
}

.error {
  color: #d9534f; /* Red color for errors with sufficient contrast */
}

.ohlc-chart {
  width: 100%;
  max-width: 800px;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
