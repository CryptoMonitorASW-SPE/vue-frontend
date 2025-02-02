import { defineStore } from 'pinia'

export const useCryptoStore = defineStore('cryptoStore', {
  state: () => ({
    cryptocurrencies: [],
    timestamp: null,
    selectedCurrency: 'USD'
  }),
  actions: {
    setCurrency(currency) {
      console.log('Selected currency:', currency)
      this.selectedCurrency = currency
      localStorage.setItem('selectedCurrency', currency)
      this.restartConnection(currency)
    },
    updateCryptocurrencies(data) {
      if (data.eventType === 'CRYPTO_UPDATE') {
        data.payload.forEach(newCrypto => {
          const index = this.cryptocurrencies.findIndex(crypto => crypto.id === newCrypto.id)

          if (index !== -1) {
            // Criptovaluta esistente: aggiorna i dati e imposta `updated` su true
            this.cryptocurrencies.splice(index, 1, {
              ...this.cryptocurrencies[index],
              ...newCrypto,
              updated: true
            })

            // Log per verificare l'aggiornamento
            console.log(`Updated crypto: ${newCrypto.id}`)

            // Resetta `updated` dopo 1 secondo
            setTimeout(() => {
              // Sposta l'elemento di nuovo per annullare updated
              this.cryptocurrencies.splice(index, 1, {
                ...this.cryptocurrencies[index],
                updated: false
              })
            }, 2000)
          } else {
            // Nuova criptovaluta: aggiungi all'array con `updated` su true
            this.cryptocurrencies.push({
              ...newCrypto,
              updated: true
            })

            // Log per verificare l'aggiornamento
            console.log(`New crypto added: ${newCrypto.id}`)

            // Resetta `updated` dopo 1 secondo
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
        console.log('Cryptocurrencies aggiornate:', this.cryptocurrencies)
      }
    },
    fetchCryptoById(id) {
      // Check if the crypto is already in the store
      const crypto = this.cryptocurrencies.find(crypto => crypto.id === id)
      if (crypto) {
        return crypto
      }

      // If not found, return an empty object or handle accordingly
      console.warn(`Crypto with ID ${id} not found in store`)
      return {}
    },
    restartConnection(currency) {
      window.dispatchEvent(
        new CustomEvent('currency-changed', {
          detail: { currency }
        })
      )
    }
  }
})
