import { io } from 'socket.io-client'
import { useCryptoStore } from '../stores/CryptoStore'
import axios from 'axios'

let socket = null

export function initializeSocket() {
  const cryptoStore = useCryptoStore()
  let currentListener = null

  const setupListener = currency => {
    // Rimuovi il vecchio listener se presente
    if (currentListener) {
      socket.off(currentListener)
    }

    // Imposta il nuovo listener
    const eventName = `broadcast${currency.toUpperCase()}`
    socket.on(eventName, data => {
      console.log(`Received ${eventName} message:`, data)
      cryptoStore.updateCryptocurrencies(data)
    })
    currentListener = eventName
  }

  socket = io(window.location.origin, {
    path: '/updates'
  })

  socket.on('connect', () => {
    console.log('Connected to the server!')
    const currency = cryptoStore.selectedCurrency

    // Fai la chiamata iniziale con la valuta corretta
    axios
      .post('/api/cryptomarket/start', null, {
        params: { currency }
      })
      .then(response => {
        console.log('Initial data:', response.data)
        cryptoStore.updateCryptocurrencies(response.data)
      })

    // Imposta il listener per la valuta corrente
    setupListener(currency)
  })

  // Ascolta i cambiamenti di valuta
  window.addEventListener('currency-changed', event => {
    const currency = event.detail.currency
    setupListener(currency)

    // Riavvia la connessione con la nuova valuta
    axios
      .post('/api/cryptomarket/start', null, {
        params: { currency }
      })
      .then(response => {
        console.log('Initial data with new currency:', response.data)
        cryptoStore.updateCryptocurrencies(response.data)
      })
  })

  // Handle errors
  socket.on('connect_error', error => {
    console.error('Connection error:', error)
  })
}

export default socket
