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
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
