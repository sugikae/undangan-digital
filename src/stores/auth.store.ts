import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/services/supabase'
import type { User } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)

  const isLoggedIn = computed(() => !!user.value)

  // Init — cek session yang sudah ada
  async function init() {
    const { data } = await supabase.auth.getSession()
    user.value = data.session?.user ?? null

    // Listen perubahan auth
    supabase.auth.onAuthStateChange((_event, session) => {
      user.value = session?.user ?? null
    })
  }

  async function login(email: string, password: string): Promise<string | null> {
    isLoading.value = true
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return error.message
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function register(email: string, password: string): Promise<string | null> {
    isLoading.value = true
    try {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) return error.message
      return null
    } finally {
      isLoading.value = false
    }
  }

  async function logout() {
    await supabase.auth.signOut()
    user.value = null
  }

  return { user, isLoading, isLoggedIn, init, login, register, logout }
})
