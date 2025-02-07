import axios from 'axios'
import { useAuthenticationStore } from '@/store/AuthenticationStore'

const refreshablePaths = ['/api/notification', '/api/management']

axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    if (
      error.response &&
      error.response.status === 401 &&
      refreshablePaths.some(path => originalRequest.url.includes(path))
    ) {
      if (!originalRequest._retry) {
        originalRequest._retry = true

        const authStore = useAuthenticationStore()
        const refreshSuccess = await authStore.refreshToken()

        if (refreshSuccess) {
          return axios(originalRequest)
        } else {
          await authStore.logout()
        }
      }
    }
    return Promise.reject(error)
  }
)
