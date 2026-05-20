import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
  },
  // El resto de rutas se añaden en T1.7
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})