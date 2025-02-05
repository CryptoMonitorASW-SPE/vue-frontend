import { defineStore } from 'pinia'
import axios from 'axios'
import CryptoSocketController from '@/controllers/CryptoSocketController'

export const useCryptoStore = defineStore('cryptoStore', {
  state: () => ({
    cryptocurrencies: [],
    timestamp: null,
    selectedCurrency: 'USD',
    socketController: null,
    isInitialized: false
  }),

  actions: {
    async setCurrency(currency) {
      console.log('Changing currency to:', currency)
      this.selectedCurrency = currency
      localStorage.setItem('selectedCurrency', currency) // Explicitly set localStorage

      if (this.socketController) {
        this.socketController.setupListener(currency)
        await this.fetchInitialData()
      }
    },
    // Called typically in App.vue onMounted
    initializeSocket() {
      if (this.isInitialized) return

      // Load state from local storage at init
      const savedData = localStorage.getItem('cryptoStore')
      const selectedCurrency = localStorage.getItem('selectedCurrency')
      if (selectedCurrency) {
        this.selectedCurrency = selectedCurrency
      }
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData)
          this.cryptocurrencies = parsedData.cryptocurrencies || []
          this.timestamp = parsedData.timestamp || null
        } catch (e) {
          console.warn('Failed to parse cryptoStore data from localStorage:', e)
        }
      }

      // Setup & connect Socket
      this.socketController = new CryptoSocketController(this.updateCryptocurrencies.bind(this))
      this.socketController.connect()
      this.socketController.setupListener(this.selectedCurrency)

      // Optionally fetch initial data
      this.fetchInitialData()
      this.isInitialized = true
    },

    async fetchInitialData() {
      try {
        await axios.post('/api/cryptomarket/start', null, {
          params: { currency: this.selectedCurrency }
        })
        // On success, server should push CRYPTO_UPDATE event via socket
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    },

    updateCryptocurrencies(data) {
      if (data.eventType === 'CRYPTO_UPDATE') {
        const updatedIds = new Set()
        console.log('Received crypto update:', data.payload)
        this.$patch(state => {
          data.payload.forEach(newCrypto => {
            // Find if crypto already exists
            const index = state.cryptocurrencies.findIndex(crypto => crypto.id === newCrypto.id)

            if (index !== -1) {
              if (state.cryptocurrencies[index].lastUpdated !== newCrypto.lastUpdated) {
                state.cryptocurrencies[index] = {
                  ...state.cryptocurrencies[index],
                  ...newCrypto,
                  updated: true
                }
                updatedIds.add(newCrypto.id)
              }
            } else {
              // If it's a brand-new crypto, push it
              state.cryptocurrencies.push({ ...newCrypto, updated: true })
              updatedIds.add(newCrypto.id)
            }
          })

          // Update overall timestamp after processing
          state.timestamp = data.timestamp

          // Keep local storage update INSIDE $patch
          localStorage.setItem(
            'cryptoStore',
            JSON.stringify({
              cryptocurrencies: state.cryptocurrencies,
              timestamp: state.timestamp
            })
          )
        })

        console.log('Updated cryptos:', updatedIds)

        // Reset the "updated" flag with a timeout for any crypto that was updated/added
        setTimeout(() => {
          this.$patch(state => {
            state.cryptocurrencies = state.cryptocurrencies.map(crypto => {
              if (updatedIds.has(crypto.id)) {
                return { ...crypto, updated: false }
              }
              return crypto
            })

            // Persist again to local storage after resetting
            localStorage.setItem(
              'cryptoStore',
              JSON.stringify({
                cryptocurrencies: state.cryptocurrencies,
                timestamp: state.timestamp
              })
            )
          })
        }, 3000)
      }
    },
    fetchCryptoById(id) {
      const crypto = this.cryptocurrencies.find(crypto => crypto.id === id)
      if (crypto) return crypto
      console.warn(`Crypto with ID ${id} not found in store`)
      return {}
    },

    cleanup() {
      if (this.socketController) {
        this.socketController.disconnect()
        this.socketController = null
      }
      this.isInitialized = false
    }
  }
})
