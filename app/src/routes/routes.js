import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
import CryptoDetail from '@/views/CryptoDetail.vue'
import { useAuthenticationStore } from '@/stores/AuthenticationStore'

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: HomeView
      },
      {
        path: 'crypto/:id',
        name: 'CryptoDetail',
        component: CryptoDetail,
        props: route => ({
          cryptoId: route.params.id
        })
      }
    ]
  },
  {
    path: '/login',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'Login',
        component: LoginView,
        meta: { requiresUnauth: true } // Requires user to be unauthenticated
      }
    ]
  },
  {
    path: '/signup',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'Signup',
        component: SignupView,
        meta: { requiresUnauth: true } // Requires user to be unauthenticated
      }
    ]
  }
  // Add more routes as needed
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthenticationStore()

  // Initialize authentication if not already done
  if (!authStore.isInitialized) {
    await authStore.initAuth()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Route requires authentication but user isn't authenticated
    next('/login')
  } else if (to.meta.requiresUnauth && authStore.isAuthenticated) {
    // Route requires unauthentication but user is authenticated
    next('/')
  } else {
    // Proceed to the route
    next()
  }
})

export default router
