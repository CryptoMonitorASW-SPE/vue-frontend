import { io } from 'socket.io-client'
import { useCryptoStore } from '../stores/CryptoStore'

let socket = null

export function initializeSocket() {
  const cryptoStore = useCryptoStore()

  // Connect to the Socket.IO server
  const socket = io('http://localhost:3000', {
    path: '/updates' // Specify the custom path for updates
  })

  // Listen for the 'connect' event to confirm connection
  socket.on('connect', () => {
    console.log('Connected to the server!')
  })

  // Listen for the 'broadcast' event
  socket.on('broadcast', data => {
    console.log('Received broadcast message:', data)
    cryptoStore.updateCryptocurrencies(data)
  })

  // Handle errors
  socket.on('connect_error', error => {
    console.error('Connection error:', error)
  })

  // Handle disconnection
  socket.on('disconnect', reason => {
    console.log('Disconnected from server:', reason)
  })
}

export default socket
