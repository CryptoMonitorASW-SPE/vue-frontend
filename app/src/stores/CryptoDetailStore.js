import { defineStore } from 'pinia'
import axios from 'axios'

export const useCryptoDetailStore = defineStore('cryptoDetailStore', {
  state: () => ({
    chartData: {},
    timestamp: null,
    isLoading: false,
    error: null,
    cryptoDetails: null,
    isLoadingDetails: false,
    errorDetails: null,
    // New state for initial load tracking
    initialLoadComplete: false
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
     * Fetches detailed information for a specific cryptocurrency
     * @param {string} coinId - The ID of the cryptocurrency (e.g., 'bitcoin')
     */
    async fetchCryptoDetails(coinId) {
      this.isLoadingDetails = true
      this.errorDetails = null
      try {
        const endpoint = `/api/cryptomarket/details/${coinId}`
        const response = await axios.get(endpoint)

        if (!response?.data) {
          throw new Error('Invalid response from the crypto-market service')
        }

        // Process and store the response data
        this.cryptoDetails = this.transformDetailsResponse(response.data)
      } catch (err) {
        this.errorDetails =
          err.response?.data?.message || err.message || 'Failed to fetch crypto details'
        console.error('Fetch Crypto Details Error:', err)
      } finally {
        this.isLoadingDetails = false
      }
    },

    transformDetailsResponse(data) {
      return {
        homepage: data.links.homepage[0],
        whitepaper: data.links.whitepaper,
        sentiment_up_percentage: data.sentiment_votes_up_percentage,
        sentiment_down_percentage: data.sentiment_votes_down_percentage
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
    },
    /**
     * Initial load of both chart data and crypto details
     * @param {string} coinId - Cryptocurrency ID
     * @param {string} currency - Display currency
     * @param {Object} [options] - Optional parameters
     * @param {number} [options.days=1] - Initial chart days
     * @param {string} [options.timeSpan='1D'] - Initial timespan label
     */
    async fetchInitialData(coinId, currency, { days = 1, timeSpan = '1D' } = {}) {
      try {
        // Reset initial load complete status
        this.initialLoadComplete = false

        // Execute both requests in parallel
        await Promise.all([
          this.fetchChartData(coinId, currency, days, timeSpan),
          this.fetchCryptoDetails(coinId)
        ])

        this.initialLoadComplete = true
      } catch (error) {
        console.error('Initial data load failed:', error)
        // Errors are already handled in individual fetch methods
      }
    }
  }
})
