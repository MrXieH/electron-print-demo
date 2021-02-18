import { createRouter, createWebHistory } from 'vue-router'
// import Home from '../views/home/index.vue'
import Home2 from '../views/home2/index'
// import Home3 from '../views/home3/index'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home2
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
