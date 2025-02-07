import { defineStore } from 'pinia'
import axios from 'axios'
import { watch } from 'vue'
import { useCryptoStore } from './CryptoStore'

export const useWatchlistStore = defineStore('watchlistStore', {
  state: () => ({
    watchlist: [],
    alerts: [],
    error: null,
    watchInitialized: false
  }),

  actions: {
    initializeWatchlist() {
      if (this.watchInitialized) return
      this.watchInitialized = true

      const cryptoStore = useCryptoStore()
      watch(
        () => cryptoStore.selectedCurrency,
        async newCurrency => {
          console.log('[WatchlistStore] Currency changed to:', newCurrency)
          await cryptoStore.fetchInitialData()
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
        console.log('Fetched watchlist:', response.data)
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
        await this.fetchAlerts()
        return true
      } catch (error) {
        console.log('Error creating alert:', error)
        this.handleError(error)
        return false
      }
    },

    async fetchAlerts() {
      try {
        const response = await axios.get('/api/notification/alerts', { withCredentials: true })
        console.log('Fetched alerts:', response.data)
        this.alerts = response.data
        this.error = null
        return true
      } catch (error) {
        this.handleError(error)
        return false
      }
    },

    async toggleAlert(alertId, status) {
      try {
        await axios.put('/api/notification/active', null, {
          withCredentials: true,
          params: { alertId, status }
        })
        await this.fetchAlerts()
        this.error = null
        return true
      } catch (error) {
        this.handleError(error)
        return false
      }
    },

    async deleteAlert(alertId) {
      try {
        await axios.delete(`/api/notification/alerts`, {
          withCredentials: true,
          params: { alertId }
        })
        await this.fetchAlerts()
        this.error = null
        return true
      } catch (error) {
        this.handleError(error)
        return false
      }
    },

    handleError(error) {
      console.log(error)
      if (error.response && error.response.data && error.response.data.error) {
        this.error = error.response.data.error
      } else {
        this.error = 'An unexpected error occurred.'
      }
    }
  }
})
