import { io } from 'socket.io-client'

export default class UserSocketController {
  constructor() {
    this.socket = null
  }

  connect() {
    if (this.socket) {
      console.log('[UserSocket] Socket already connected:', this.socket.id)
      return
    }

    console.log('[UserSocket] Attempting connection...')
    this.socket = io(window.location.origin, {
      path: '/user-updates',
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000
    })

    this.socket.on('connect', () => {
      console.log(`[UserSocket] Connected as socket id: ${this.socket.id}`)
    })

    this.socket.on('connect_error', error => {
      console.error('[UserSocket] Connection error:', error)
    })

    this.socket.on('disconnect', reason => {
      console.log(`[UserSocket] Disconnected: ${reason}`)
    })

    this.socket.on('reconnect_attempt', attempt => {
      console.log(`[UserSocket] Reconnection attempt: ${attempt}`)
    })

    this.socket.on('reconnect_error', error => {
      console.error('[UserSocket] Reconnection error:', error)
    })

    this.socket.on('reconnect', attemptNumber => {
      console.log(`[UserSocket] Reconnected on attempt ${attemptNumber}`)
    })

    this.socket.on('user-specific-event', data => {
      console.log('[UserSocket] Received user-specific-event:', data)
      window.dispatchEvent(new CustomEvent('user-specific-event', { detail: data }))
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      console.log('[UserSocket] Disconnected from user socket')
      this.socket = null
    }
  }

  send(event, payload) {
    if (this.socket && this.socket.connected) {
      this.socket.emit(event, payload)
      console.log(`[UserSocket] Sent event "${event}":`, payload)
    } else {
      console.warn('[UserSocket] Cannot send message, socket not connected.')
    }
  }
}
