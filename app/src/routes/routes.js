import { createRouter, createWebHistory } from 'vue-router'

// Remove static imports for views (or keep those you want loaded immediately)
const HomeView = () => import('@/views/HomeView.vue')
const AboutView = () => import('@/views/AboutView.vue')
const CryptoDetail = () => import('@/views/CryptoDetail.vue')
const ProfileView = () => import('@/views/ProfileView.vue')
const ProfileWatchlist = () => import('@/views/ProfileWatchlist.vue')
const ProfileWallet = () => import('@/views/ProfileWallet.vue')
const LoginView = () => import('@/views/LoginView.vue')
const SignupView = () => import('@/views/SignupView.vue')

const routes = [
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      { path: '', name: 'Home', component: HomeView },
      { path: 'about', name: 'About', component: AboutView },
      {
        path: 'crypto/:id',
        name: 'CryptoDetail',
        component: CryptoDetail,
        props: route => ({ cryptoId: route.params.id })
      },
      {
        path: 'profile',
        name: 'Profile',
        component: ProfileView,
        meta: { requiresAuth: true }
      },
      {
        path: 'watchlist',
        name: 'Watchlist',
        component: ProfileWatchlist,
        meta: { requiresAuth: true }
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
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [{ path: '', name: 'Login', component: LoginView, meta: { requiresUnauth: true } }]
  },
  {
    path: '/signup',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [{ path: '', name: 'Signup', component: SignupView, meta: { requiresUnauth: true } }]
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/layouts/DefaultLayout.vue'),
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

// Navigation Guard (make sure to import useAuthenticationStore before using it)
router.beforeEach(async (to, from, next) => {
  const { useAuthenticationStore } = await import('@/stores/AuthenticationStore')
  const authStore = useAuthenticationStore()

  if (!authStore.isInitialized) {
    await authStore.initAuth()
  }

  if (to.matched.some(record => record.meta.requiresAuth) && !authStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (to.matched.some(record => record.meta.requiresUnauth) && authStore.isAuthenticated) {
    next({ name: 'Home' })
  } else {
    next()
  }
})

export default router
