// filepath: /home/tone/university/SPE+WEB/bootstrap/src/vue-frontend/app/src/stores/AuthenticationStore.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthenticationStore = defineStore('authentication', {
  state: () => ({
    user: null,
    error: null,
    isInitialized: false
  }),

  getters: {
    isAuthenticated: state => !!state.user
  },

  actions: {
    async initAuth() {
      if (this.isInitialized) return

      try {
        const success = await this.refreshToken()
        this.isInitialized = true
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
        return true
      } catch (error) {
        this.handleAuthError(error)
        return false
      }
    },

    async register(userData) {
      try {
        await axios.post('/api/auth/register', userData, {
          withCredentials: true
        })

        this.error = null
        return true
      } catch (error) {
        this.handleAuthError(error)
        return false
      }
    },

    async refreshToken() {
      console.log('refreshing token')
      try {
        const response = await axios.post(
          '/api/auth/refresh',
          {},
          {
            withCredentials: true
          }
        )
        console.log('refresh token response:', response)

        const { userId, email } = response.data
        if (!userId || !email) {
          console.error('Invalid response data:', response.data)
          return false
        }

        this.setAuthData({ userId, email })
        this.error = null
        return true
      } catch (error) {
        console.error('Refresh token failed:', error)
        this.logout()
        return false
      }
    },

    setAuthData(data) {
      if (!data?.userId || !data?.email) {
        console.error('Invalid user data:', data)
        return
      }

      this.user = {
        id: data.userId,
        email: data.email
      }
      console.log('User set:', this.user)
      console.log('Is authenticated:', !!this.user)
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
        await axios.post(
          '/api/auth/logout',
          {},
          {
            withCredentials: true
          }
        )
      } catch (error) {
        console.error('Error during logout:', error)
      } finally {
        this.user = null
        this.error = null
      }
    }
  },
  persist: true
})
