import { defineStore } from 'pinia'
import axios from 'axios'
import UserSocketController from '@/controllers/UserSocketController'

export const useAuthenticationStore = defineStore('authentication', {
  state: () => ({
    user: null,
    error: null,
    isInitialized: false,
    // Do not persist the socket controller instance.
    socketController: null
  }),

  // Persist only the user and error so that refresh reloads the token and socket properly.
  persist: {
    paths: ['user', 'error']
  },

  getters: {
    isAuthenticated: state => !!state.user
  },

  actions: {
    async initAuth() {
      // Always try to refresh on app start
      try {
        const success = await this.refreshToken()
        this.isInitialized = true
        if (success && this.user) {
          this.initSocketController()
        }
        return success
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        this.isInitialized = true
        return false
      }
    },

    async login(credentials) {
      try {
        const response = await axios.post('/api/auth/login', credentials, {
          withCredentials: true
        })
        this.setAuthData(response.data)
        this.error = null
        // Initialize user-specific socket connection on login.
        this.initSocketController()
        return true
      } catch (error) {
        this.handleAuthError(error)
        return false
      }
    },

    async refreshToken() {
      console.log('Refreshing token...')
      try {
        const response = await axios.post('/api/auth/refresh', {}, { withCredentials: true })
        this.setAuthData(response.data)
        return true
      } catch (error) {
        console.error('Refresh token failed:', error)
        this.user = null
        return false
      }
    },

    setAuthData(data) {
      this.user = { userId: data.userId, email: data.email }
      console.log('User set:', this.user)
    },

    handleAuthError(error) {
      if (error.response && error.response.data && error.response.data.message) {
        this.error = error.response.data.message
      } else {
        this.error = 'An unexpected error occurred.'
      }
    },

    async logout() {
      try {
        await axios.post('/api/auth/logout', {}, { withCredentials: true })
      } catch (error) {
        console.error('Error during logout:', error)
      } finally {
        this.user = null
        this.error = null
        // Disconnect the socket when logging out.
        this.disconnectSocketController()
      }
    },

    initSocketController() {
      if (!this.user || !this.user.userId) {
        console.warn('Cannot initialize socket: Missing user data')
        return
      }
      if (this.socketController) {
        console.log('Socket controller already initialized')
        return
      }
      console.log('Initializing user socket controller...')
      // Create instance and connect.
      this.socketController = new UserSocketController()
      this.socketController.connect()
    },

    disconnectSocketController() {
      if (this.socketController) {
        this.socketController.disconnect()
        this.socketController = null
      }
    }
  }
})
