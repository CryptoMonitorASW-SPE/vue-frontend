// store/cryptoChartDetailStore.js
import { defineStore } from 'pinia'

export const useCryptoChartDetailStore = defineStore('cryptoChartDetailStore', {
  state: () => ({
    chartData: {}, // Store chart data per time span
    timestamp: null,
    isLoading: false,
    error: null,
  }),
  actions: {
    // Action to update chart data based on event type
    updateCryptoChartDetail(data) {
      if (data.eventType === 'CRYPTO_DETAIL_CHART_UPDATE') {
        const { timeSpan, payload, timestamp } = data
        this.chartData[timeSpan] = payload
        this.timestamp = timestamp
      }
    },
    // Action to fetch chart data for a specific time span
    async fetchChartData(timeSpan) {
      this.isLoading = true
      this.error = null
      try {
        // Replace the following with your actual data fetching logic
        // For example, you might call an API or subscribe to a WebSocket
        const response = await fetch(`/api/crypto/chart?span=${timeSpan}`)
        if (!response.ok) {
          throw new Error('Failed to fetch chart data')
        }
        const data = await response.json()
        // Assume the response has the structure: { eventType, payload, timestamp, timeSpan }
        this.updateCryptoChartDetail({ ...data, timeSpan })
      } catch (err) {
        this.error = err.message
      } finally {
        this.isLoading = false
      }
    },
  },
})
