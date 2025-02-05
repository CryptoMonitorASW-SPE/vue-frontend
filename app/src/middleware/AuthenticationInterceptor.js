// api.js
import axios from 'axios'
import { useAuthenticationStore } from '@/stores/AuthenticationStore'

// Definiamo le rotte per cui vogliamo abilitare il refresh
const refreshablePaths = ['/api/notification', '/api/management']

axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    // Controlla se la richiesta ha restituito un errore di autenticazione (es. 401)
    // ed è per una rotta per cui vogliamo il refresh del token
    if (
      error.response &&
      error.response.status === 401 &&
      refreshablePaths.some(path => originalRequest.url.includes(path))
    ) {
      // Per evitare loop infiniti, controlla se la richiesta non è già stata ripetuta
      if (!originalRequest._retry) {
        originalRequest._retry = true

        // Esegui il refresh del token, ad esempio chiamando il metodo refreshToken dello store
        const authStore = useAuthenticationStore() // o come lo importi nel tuo contesto
        const refreshSuccess = await authStore.refreshToken()

        if (refreshSuccess) {
          // Se il refresh ha avuto successo, ripeti la richiesta originale
          // (l'eventuale aggiornamento dei cookie avviene automaticamente se usi withCredentials)
          return axios(originalRequest)
        } else {
          // Se il refresh fallisce, esegui eventualmente il logout o gestisci l'errore
          await authStore.logout()
        }
      }
    }
    return Promise.reject(error)
  }
)
