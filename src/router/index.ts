import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // ── PUBLIC ─────────────────────────────────────────────
    {
      path: '/i/:slug',
      name: 'invitation',
      component: () => import('@/views/public/InvitationView.vue'),
      props: true,
    },
    {
      path: '/i/:slug/guest/:token',
      name: 'invitation-guest',
      component: () => import('@/views/public/InvitationView.vue'),
      props: true,
    },

    // ── AUTH ───────────────────────────────────────────────
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/auth/LoginView.vue'),
      meta: { guestOnly: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/auth/RegisterView.vue'),
      meta: { guestOnly: true },
    },

    // ── DASHBOARD ──────────────────────────────────────────
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/dashboard/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/dashboard/invitation/:id',
      name: 'dashboard-detail',
      component: () => import('@/views/dashboard/InvitationDetailView.vue'),
      meta: { requiresAuth: true },
    },

    // ── DEFAULT ────────────────────────────────────────────
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/public/NotFoundView.vue'),
    },
    {
      path: '/catalog',
      name: 'catalog',
      component: () => import('@/views/public/CatalogView.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

// Navigation guard
router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return { name: 'login' }
  }

  if (to.meta.guestOnly && authStore.isLoggedIn) {
    return { name: 'dashboard' }
  }
})

export default router
