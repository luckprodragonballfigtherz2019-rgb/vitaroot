<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  LayoutDashboard,
  Dumbbell,
  Apple,
  Leaf,
  User,
  Settings,
  Sprout,
} from 'lucide-vue-next'
import { useSidebar } from '@/composables/useSidebar'

const route = useRoute()
const { collapsed } = useSidebar()

const navItems = [
  { to: '/', label: 'Hoy', icon: LayoutDashboard },
  { to: '/gym', label: 'Gym', icon: Dumbbell },
  { to: '/meals', label: 'Comidas', icon: Apple },
  { to: '/health', label: 'Salud', icon: Leaf },
]

const bottomItems = [
  { to: '/profile', label: 'Perfil', icon: User },
  { to: '/settings', label: 'Ajustes', icon: Settings },
]

const isActive = (path: string): boolean => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const itemClasses = computed(() => (path: string) => [
  'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium',
  'transition-colors duration-base ease-out-soft',
  isActive(path)
    ? 'bg-moss-50 text-moss-700'
    : 'text-ink-soft hover:text-ink hover:bg-paper-soft',
])

const asideClasses = computed(() => [
  'fixed left-0 top-0 h-screen bg-paper border-r border-line-soft flex flex-col',
  'transition-[width] duration-slow ease-out-soft overflow-hidden',
  collapsed.value ? 'w-16' : 'w-60',
])
</script>

<template>
  <aside :class="asideClasses">
    <div class="px-6 py-5 flex items-center gap-2 shrink-0">
      <Sprout :size="22" class="text-moss-500 shrink-0" />
      <span v-if="!collapsed" class="display-sm text-ink whitespace-nowrap">
        VitaRoot
      </span>
    </div>

    <nav class="flex-1 px-3 py-2 space-y-1">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        :class="itemClasses(item.to)"
        :title="collapsed ? item.label : undefined"
      >
        <component :is="item.icon" :size="18" class="shrink-0" />
        <span v-if="!collapsed" class="whitespace-nowrap">{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="px-3 py-3 border-t border-line-soft space-y-1">
      <RouterLink
        v-for="item in bottomItems"
        :key="item.to"
        :to="item.to"
        :class="itemClasses(item.to)"
        :title="collapsed ? item.label : undefined"
      >
        <component :is="item.icon" :size="18" class="shrink-0" />
        <span v-if="!collapsed" class="whitespace-nowrap">{{ item.label }}</span>
      </RouterLink>
    </div>
  </aside>
</template>
