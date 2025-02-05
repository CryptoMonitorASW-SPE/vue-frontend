import { createRouter, createWebHistory } from 'vue-router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
import CryptoDetail from '@/views/CryptoDetail.vue'
import ProfileView from '@/views/ProfileView.vue' // Import the Profile component
import ProfileWatchlist from '../views/ProfileWatchlist.vue'
import ProfileWallet from '../views/ProfileWallet.vue'
import AboutView from '@/views/AboutView.vue'
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
        path: 'about',
        name: 'About',
        component: AboutView
      },
      {
        path: 'crypto/:id',
        name: 'CryptoDetail',
        component: CryptoDetail,
        props: route => ({
          cryptoId: route.params.id
        })
      },
      {
        path: 'profile',
        name: 'Profile',
        component: ProfileView,
        meta: { requiresAuth: true } // Requires user to be authenticated
      },
      {
        path: 'watchlist',
        name: 'Watchlist',
        component: ProfileWatchlist,
        meta: { requiresAuth: true } // Requires user to be authenticated
      },
      {
        path: 'wallet',
        name: 'Wallet',
        component: ProfileWallet,
        meta: { requiresAuth: true }
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
  },
  {
    path: '/:pathMatch(.*)*',
    component: DefaultLayout,
    children: [
      {
        path: '',
        name: 'NotFound',
        component: AboutView,
        props: {
          errorMessage: 'If you are redirected here, it means that something went wrong.',
          errorCode: 404
        }
      }
    ]
  }
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

  if (to.matched.some(record => record.meta.requiresAuth) && !authStore.isAuthenticated) {
    // Route requires authentication but user isn't authenticated
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (to.matched.some(record => record.meta.requiresUnauth) && authStore.isAuthenticated) {
    // Route requires unauthentication but user is authenticated
    next({ name: 'Home' })
  } else {
    // Proceed to the route
    next()
  }
})

export default router
