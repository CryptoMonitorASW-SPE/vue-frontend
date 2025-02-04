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
        const response = await axios.get(
          '/api/management/users/profile',
          {},
          { withCredentials: true }
        )
        console.log('User profile:', response.data)
        // Store the returned profile
        this.user = response.data
        console.log('User:', this.user)
        this.error = null
        return true
      } catch (error) {
        // Handle 404: No profile found
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
        // Adapt keys so the server sees { name, surname, dateOfBirth }
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
        // Refresh the user data after successful update
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
