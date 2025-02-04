import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthenticationStore } from '@/stores/AuthenticationStore'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: null,
    error: null
  }),

  actions: {
    async getProfile() {
      try {
        const response = await axios.get('/api/management/users/profile', {
          withCredentials: true
        })
        this.user = response.data
        this.error = null
        return true
      } catch (error) {
        this.handleUserError(error)
        return false
      }
    },

    async updateProfile(profileData) {
      const authStore = useAuthenticationStore()
      const email = authStore.user?.email

      if (!email) {
        this.error = 'User is not authenticated'
        return false
      }

      try {
        const response = await axios.put(
          '/api/management/users/profile',
          {
            email,
            ...profileData
          },
          {
            withCredentials: true
          }
        )
        this.user = response.data
        this.error = null
        return true
      } catch (error) {
        this.handleUserError(error)
        return false
      }
    },

    handleUserError(error) {
      if (error.response && error.response.data && error.response.data.message) {
        this.error = error.response.data.message
      } else {
        this.error = 'An unexpected error occurred.'
      }
    }
  }
})
