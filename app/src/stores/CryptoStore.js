import { defineStore } from 'pinia'

export const useCryptoStore = defineStore('cryptoStore', {
  state: () => ({
    cryptocurrencies: [],
    timestamp: null
  }),
  actions: {
    updateCryptocurrencies(data) {
      if (data.eventType === 'CRYPTO_UPDATE') {
        this.cryptocurrencies = data.payload
        this.timestamp = data.timestamp
        console.log('Cryptocurrencies aggiornate:', this.cryptocurrencies)
      }
    }
  }
})
