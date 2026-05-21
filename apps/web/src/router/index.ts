import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
  },
  {
    path: '/gym',
    name: 'gym-history',
    component: () => import('@/views/gym/GymHistoryView.vue'),
  },
  {
    path: '/gym/new',
    name: 'gym-new',
    component: () => import('@/views/gym/GymNewView.vue'),
  },
  {
    path: '/gym/:id',
    name: 'gym-detail',
    component: () => import('@/views/gym/GymDetailView.vue'),
  },
  {
    path: '/meals',
    name: 'meals',
    component: () => import('@/views/meals/MealsView.vue'),
  },
  {
    path: '/health',
    name: 'health',
    component: () => import('@/views/health/HealthView.vue'),
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/settings/ProfileView.vue'),
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/settings/SettingsView.vue'),
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
