import { defineStore } from 'pinia'
import axios from 'axios'
import { watch } from 'vue'
import { useCryptoStore } from './CryptoStore'

export const useWatchlistStore = defineStore('watchlistStore', {
  state: () => ({
    watchlist: [],
    error: null,
    watchInitialized: false
  }),

  actions: {
    // Call this once (e.g., in onMounted) to set up currency watchers
    initializeWatchlist() {
      if (this.watchInitialized) return
      this.watchInitialized = true

      const cryptoStore = useCryptoStore()
      watch(
        () => cryptoStore.selectedCurrency,
        async newCurrency => {
          console.log('[WatchlistStore] Currency changed to:', newCurrency)
          // 1) Refresh cryptos in the new currency
          await cryptoStore.fetchInitialData()
          // 2) Now fetch watchlist so it merges updated crypto data
          await this.fetchWatchlist()
        },
        { immediate: false }
      )
    },

    async fetchWatchlist() {
      try {
        const response = await axios.get('/api/management/watchlist', {
          withCredentials: true
        })
        this.watchlist = response.data.items
        this.error = null
        return true
      } catch (error) {
        this.handleError(error)
        return false
      }
    },

    async isCryptoInWatchlist(cryptoId) {
      await this.fetchWatchlist()
      return this.watchlist.some(item => item.cryptoId === cryptoId)
    },

    async addItem(cryptoId) {
      try {
        const response = await axios.post(
          '/api/management/watchlist',
          { cryptoId },
          { withCredentials: true }
        )
        console.log('Response:', response)
        await this.fetchWatchlist()
        this.error = null
        return true
      } catch (error) {
        this.handleError(error)
        return false
      }
    },

    async removeItem(itemId) {
      try {
        await axios.delete(`/api/management/watchlist/${itemId}`, { withCredentials: true })
        await this.fetchWatchlist()
        this.error = null
        return true
      } catch (error) {
        this.handleError(error)
        return false
      }
    },

    async createAlert(cryptoId, price, currency, alertType, message) {
      try {
        console.log('Creating alert for', cryptoId, price, currency, alertType, message)
        const messageBody = {
          message: message
        }
        const response = await axios.post('/api/notification/createAlert', messageBody, {
          withCredentials: true,
          params: { cryptoId, price, currency, alertType }
        })
        console.log('Alert created:', response)
        this.error = null
        return true
      } catch (error) {
        console.log('Error creating alert:', error)
        this.handleError(error)
        return false
      }
    },

    handleError(error) {
      if (error.response && error.response.data && error.response.data.error) {
        this.error = error.response.data.error
      } else {
        this.error = 'An unexpected error occurred.'
      }
    }
  }
})
