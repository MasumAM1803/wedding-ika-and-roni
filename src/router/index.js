import { createRouter, createWebHistory } from 'vue-router'
import WeddingInvitation from '../components/invitation/wedding/fullWidth/wedding-3d-02.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: WeddingInvitation
  },
  {
    path: '/guest/:slug',
    name: 'GuestInvitation',
    component: WeddingInvitation,
    props: true
  },
  {
    path: '/admin',
    name: 'AdminLogin',
    component: () => import('../components/admin/AdminLogin.vue')
  },
  {
    path: '/admin/dashboard',
    name: 'AdminDashboard',
    component: () => import('../components/admin/AdminDashboard.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

// Simple auth guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth) {
    const isAuthenticated = localStorage.getItem('isAdmin') === 'true'
    if (!isAuthenticated) {
      return next({ name: 'AdminLogin' })
    }
  }
  next()
})
