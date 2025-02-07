import { defineStore } from 'pinia'
import axios from 'axios'
import UserSocketController from '@/controller/UserSocketController'

export const useAuthenticationStore = defineStore('authentication', {
  state: () => ({
    user: null,
    error: null,
    isInitialized: false,
    socketController: null
  }),

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
        const response = await axios.post('/api/auth/login', credentials, {})
        this.setAuthData(response.data)
        this.error = null
        this.initSocketController()
        return true
      } catch (error) {
        this.handleAuthError(error)
        return false
      }
    },

    async register(userData) {
      try {
        await axios.post('/api/auth/register', userData, {})

        this.error = null
        return true
      } catch (error) {
        this.handleAuthError(error)
        console.error('Registration failed:', error)
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
      if (!data || !data.userId || !data.email) {
        console.error('Invalid auth data:', data)
        return
      }
      this.user = { userId: data.userId, email: data.email }
      console.log('User set:', this.user)
    },

    handleAuthError(error) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            this.error = 'Invalid credentials. Please check your email and password.'
            break
          case 409:
            this.error = 'Email already registered. Please use a different email.'
            break
          default:
            this.error = error.response.data?.message || 'An unexpected error occurred.'
        }
      } else {
        this.error = 'Network error. Please check your connection.'
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
