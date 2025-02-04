import { createApp } from 'vue'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './routes/routes'
import { useAuthenticationStore } from '@/stores/AuthenticationStore'

const app = createApp(App)
const pinia = createPinia()
//pinia.use(piniaPluginPersistedstate)
app.use(pinia)
app.use(Toast)

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
