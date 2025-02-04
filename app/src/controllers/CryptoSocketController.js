import { io } from 'socket.io-client'

export default class CryptoSocketController {
  constructor(onDataReceived) {
    this.socket = null
    this.currentListener = null
    this.onDataReceived = onDataReceived
  }

  connect() {
    if (this.socket) {
      console.log('[CryptoSocket] Already connected:', this.socket.id)
      return
    }

    this.socket = io(window.location.origin, {
      path: '/updates'
    })

    this.socket.on('connect', () => {
      console.log('[CryptoSocket] Connected:', this.socket.id)
    })

    this.socket.on('connect_error', error => {
      console.error('[CryptoSocket] Connection error:', error)
    })
  }

  setupListener(currency) {
    if (!this.socket) return

    if (this.currentListener) {
      this.socket.off(this.currentListener)
    }

    const eventName = `broadcast${currency.toUpperCase()}`
    this.socket.on(eventName, data => {
      console.log(`[CryptoSocket] Received ${eventName}:`, data)
      this.onDataReceived(data)
    })
    this.currentListener = eventName
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.currentListener = null
    }
  }
}
