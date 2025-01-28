import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import DefaultLayout from '../layouts/DefaultLayout.vue'
import CryptoDetail from '../views/CryptoDetail.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/login',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'Login',
          component: LoginView
        }
      ]
    },
    {
      path: '/crypto/:id',
      component: DefaultLayout,
      children: [
        {
          path: '',
          name: 'CryptoDetail',
          component: CryptoDetail,
          props: route => ({
            cryptoId: route.params.id
          }),
          // Optional: Add navigation guard to preload data
          beforeEnter: async (to, from, next) => {
            // Here you could fetch initial crypto data if needed
            next()
          }
        }
      ]
    }
  ]
})

export default router
