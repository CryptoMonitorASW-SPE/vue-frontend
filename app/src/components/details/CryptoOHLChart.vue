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
      <!-- Accessible Data Table -->
      <table class="visually-hidden" aria-hidden="false">
        <caption>
          Candlestick Data for
          {{
            cryptoId
          }}
        </caption>
        <thead>
          <tr>
            <th>Date</th>
            <th>Open</th>
            <th>High</th>
            <th>Low</th>
            <th>Close</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in tableData" :key="index">
            <td>{{ formatDate(row.x) }}</td>
            <td>{{ row.y[0] }}</td>
            <td>{{ row.y[1] }}</td>
            <td>{{ row.y[2] }}</td>
            <td>{{ row.y[3] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Screen Reader Description -->
    <div class="sr-only" aria-live="polite">{{ chartDescription }}</div>
  </div>
</template>

<script>
import VueApexCharts from 'vue3-apexcharts'
import { ref, computed, onMounted, watch } from 'vue'
import { useCryptoDetailStore } from '../../stores/CryptoDetailStore'

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
    const cryptoDetailStore = useCryptoDetailStore()

    const coinId = props.cryptoId

    const timeSpans = ['1D', '7D', '1M', '6M', '1Y']
    const spanToDaysMap = {
      '1D': 1,
      '7D': 7,
      '1M': 30,
      '6M': 180,
      '1Y': 365
    }
    const selectedSpan = ref('1D')
    const isLoading = computed(() => cryptoDetailStore.isLoading)
    const error = computed(() => cryptoDetailStore.error)

    const chartOptions = ref({
      chart: {
        type: 'candlestick',
        height: 350,
        toolbar: {
          show: true
        }
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
      const chartDataForSpan = cryptoDetailStore.chartData[selectedSpan.value]

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
      console.log(coinId)
      await cryptoDetailStore.fetchChartData(coinId, props.currency, days, span)
    }

    /**
     * Sets the selected time span and fetches data if not already available.
     * @param {string} span - The time span to set (e.g., '1D').
     */
    const setTimeSpan = async span => {
      if (selectedSpan.value !== span) {
        selectedSpan.value = span
        if (!cryptoDetailStore.chartData[span]) {
          await fetchDataForSpan(span)
        }
      }
    }

    // Watch for changes in the 'currency' prop and refetch data accordingly
    watch(
      () => props.currency,
      async (newCurrency, oldCurrency) => {
        console.log(
          `Currency changed from ${oldCurrency} to ${newCurrency}. Refetching chart data.`
        )
        // Optionally, reset chart data if needed
        // cryptoDetailStore.resetChartData()
        await fetchDataForSpan(selectedSpan.value)
      }
    )

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
