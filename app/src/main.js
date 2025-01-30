import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './routes/routes'
import { useAuthenticationStore } from '@/stores/AuthenticationStore'

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)

const initializeApp = async () => {
  const authStore = useAuthenticationStore()
  console.log('Initializing app...')

  try {
    console.log('Attempting to refresh authentication...')
    const isAuth = await authStore.initAuth()

    if (isAuth) {
      console.log('User is authenticated:', authStore.user)
    } else {
      console.log('User is not authenticated.')
    }
  } catch (error) {
    console.error('Error during authentication initialization:', error)
  } finally {
    app.use(router)
    app.mount('#app')
  }
}

initializeApp()
