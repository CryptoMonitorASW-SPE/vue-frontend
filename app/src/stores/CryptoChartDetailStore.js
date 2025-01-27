// store/CryptoChartDetailStore.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const useCryptoChartDetailStore = defineStore('cryptoChartDetailStore', {
  state: () => ({
    chartData: {}, // Store chart data per time span
    timestamp: null,
    isLoading: false,
    error: null
  }),
  actions: {
    /**
     * Updates chart data based on the event type.
     * @param {Object} data - The data object containing eventType, timeSpan, payload, and timestamp.
     */
    updateCryptoChartDetail(data) {
      if (data.eventType === 'CRYPTO_DETAIL_CHART_UPDATE') {
        this.chartData[data.timespan] = data
      }
    },

    /**
     * Fetches chart data for a specific coin, currency, and time span.
     * @param {string} coinId - The ID of the cryptocurrency (e.g., 'bitcoin').
     * @param {string} currency - The currency to display prices in (e.g., 'usd').
     * @param {number|string} days - The number of days for the chart data (e.g., 1).
     * @param {string} timeSpan - The time span label corresponding to days (e.g., '1D').
     */
    async fetchChartData(coinId, currency, days, timeSpan) {
      this.isLoading = true
      this.error = null
      try {
        // Construct the API endpoint with string expansion
        const endpoint = `/api/cryptomarket/chart/${coinId}/${currency}/${days}`
        const response = await axios.get(endpoint)

        if (!response || !response.data) {
          throw new Error('Invalid response from the crypto-market service.')
        }

        const data = response.data.dataPoints.map(point => ({
          x: new Date(point.timestamp),
          y: [point.open, point.high, point.low, point.close]
        }))

        console.log(data)
        // Update the store with the fetched data
        this.updateCryptoChartDetail({
          eventType: 'CRYPTO_DETAIL_CHART_UPDATE',
          payload: data,
          timespan: timeSpan
        })
      } catch (err) {
        this.error = err.response?.data?.message || err.message || 'Failed to fetch chart data.'
        console.error('Fetch Chart Data Error:', err)
      } finally {
        this.isLoading = false
      }
    }
  }
})
