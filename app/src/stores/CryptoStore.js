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
        data.payload.forEach(newCrypto => {
          const index = this.cryptocurrencies.findIndex(crypto => crypto.id === newCrypto.id)
          if (index !== -1) {
            // Existing crypto: update data, set updated = true
            this.cryptocurrencies.splice(index, 1, {
              ...this.cryptocurrencies[index],
              ...newCrypto,
              updated: true
            })
            // Reset updated after 2s
            setTimeout(() => {
              this.cryptocurrencies.splice(index, 1, {
                ...this.cryptocurrencies[index],
                updated: false
              })
            }, 2000)
          } else {
            // New crypto: push with updated = true
            this.cryptocurrencies.push({
              ...newCrypto,
              updated: true
            })
            setTimeout(() => {
              const newIndex = this.cryptocurrencies.findIndex(crypto => crypto.id === newCrypto.id)
              if (newIndex !== -1) {
                this.cryptocurrencies.splice(newIndex, 1, {
                  ...this.cryptocurrencies[newIndex],
                  updated: false
                })
              }
            }, 2000)
          }
        })

        this.timestamp = data.timestamp

        // Save latest data to local storage
        localStorage.setItem(
          'cryptoStore',
          JSON.stringify({
            cryptocurrencies: this.cryptocurrencies,
            timestamp: this.timestamp
          })
        )
        console.log('Cryptocurrencies aggiornate:', this.cryptocurrencies)
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
