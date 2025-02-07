import { defineStore } from 'pinia'
import axios from 'axios'
import { useAuthenticationStore } from '@/store/AuthenticationStore'

export const useUserStore = defineStore('userStore', {
  state: () => ({
    user: null,
    error: null
  }),

  actions: {
    async getProfile() {
      try {
        const response = await axios.get(
          '/api/management/users/profile',
          {},
          { withCredentials: true }
        )
        console.log('User profile:', response.data)
        this.user = response.data
        this.error = null
        return true
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.warn('[UserStore] No profile found, setting empty default.')
          this.user = {
            firstName: '',
            lastName: '',
            dob: ''
          }
          this.error = null
          return false
        }
        console.error(error)
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
            name: profileData.firstName,
            surname: profileData.lastName,
            dateOfBirth: profileData.dob
          },
          { withCredentials: true }
        )
        console.log('Profile updated response:', response.data)
        this.error = null
        await this.getProfile()
        return true
      } catch (error) {
        console.error('Failed to update profile:', error)
        this.handleUserError(error)
        return false
      }
    },

    handleUserError(error) {
      if (error.response) {
        this.error = error.response.data.error || 'Unknown error occurred'
      } else {
        this.error = error.message
      }
    }
  }
})
