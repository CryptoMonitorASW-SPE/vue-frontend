import { defineStore } from 'pinia'
import axios from 'axios'

export const useAuthenticationStore = defineStore('authentication', {
  state: () => ({
    user: null,
    authToken: null,
    refreshToken: null,
    error: null
  }),
  actions: {
    async login(credentials) {
      try {
        const response = await axios.post('/api/auth/login', credentials)
        this.user = {
          id: response.data.userId,
          email: response.data.email
        }
        this.authToken = response.data.authToken
        this.refreshToken = response.data.refreshToken
        this.error = null
        console.log('Login successful')
        console.log('User:', this.user)
        console.log('Auth token:', this.authToken)
        console.log('Refresh token:', this.refreshToken)
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed'
      }
    },
    logout() {
      this.user = null
      this.authToken = null
      this.refreshToken = null
      this.error = null
    }
  }
})
