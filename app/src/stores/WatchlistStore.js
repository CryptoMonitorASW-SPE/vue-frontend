import { defineStore } from 'pinia'
import axios from 'axios'

export const useWatchlistStore = defineStore('watchlistStore', {
  state: () => ({
    watchlist: [],
    error: null
  }),

  actions: {
    /**
     * GET /api/watchlist
     * Purpose: List the user's favorite cryptos.
     */
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

    /**
     * Check if a crypto is in the watchlist.
     * This method fetches the latest watchlist once before checking.
     * @param {string} cryptoId - The crypto identifier to check.
     * @returns {boolean} True if exists in the watchlist, false otherwise.
     */
    async isCryptoInWatchlist(cryptoId) {
      // Ensure the watchlist is up-to-date.
      await this.fetchWatchlist()
      console.log('Watchlist:', this.watchlist)
      return this.watchlist.some(item => item.cryptoId === cryptoId)
    },

    /**
     * POST /api/watchlist
     * Purpose: Add a crypto to the watchlist.
     * @param {string} cryptoId - The crypto identifier to add.
     */
    async addItem(cryptoId) {
      try {
        const response = await axios.post(
          '/api/management/watchlist',
          { cryptoId },
          {
            withCredentials: true
          }
        )
        console.log('Response:', response)
        // Option 1: Re-fetch the watchlist to update the store
        await this.fetchWatchlist()
        // Option 2: Alternatively, if the API returns the added item, you could update the watchlist directly:
        // this.watchlist.push(response.data);
        this.error = null
        return true
      } catch (error) {
        this.handleError(error)
        return false
      }
    },

    async createAlert(cryptoId, price, currency, message) {
      try {
        console.log({ cryptoId, price, currency })
        // Ensure the endpoint starts with a slash and all parameters are provided.
        const response = await axios.post(
          '/api/notification/createAlert', // endpoint with leading slash
          message, // request body (message should be JSON serializable)
          {
            withCredentials: true,
            params: { cryptoId, price, currency } // query parameters for the API
          }
        )
        console.log('Alert created:', response)
        this.error = null
        return true
      } catch (error) {
        this.handleError(error)
        return false
      }
    },

    /**
     * DELETE /api/watchlist/:itemId
     * Purpose: Remove a crypto from the watchlist.
     * @param {string} itemId - The item identifier to remove.
     */
    async removeItem(itemId) {
      try {
        await axios.delete(`/api/watchlist/${itemId}`, {
          withCredentials: true
        })
        // Refresh the watchlist after deletion
        await this.fetchWatchlist()
        this.error = null
        return true
      } catch (error) {
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
  },

  // Enable persistence for this store (if you have the appropriate plugin configured)
  persist: true
})
