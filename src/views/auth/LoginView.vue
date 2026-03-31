<template>
  <div class="auth-page">
    <!-- Background -->
    <div class="auth-bg">
      <div class="blob blob-1" />
      <div class="blob blob-2" />
    </div>

    <div class="auth-card">
      <!-- Logo / Brand -->
      <div class="auth-brand">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" stroke="#5b8fa8" stroke-width="1.5" opacity="0.5"/>
          <path d="M20 8C14 8 10 12 10 17c0 8 10 15 10 15s10-7 10-15c0-5-4-9-10-9z"
            fill="#5b8fa8" opacity="0.7"/>
          <circle cx="20" cy="17" r="3.5" fill="white" opacity="0.9"/>
        </svg>
        <h1>Undangan Digital</h1>
      </div>

      <p class="auth-title">Masuk ke Dashboard</p>
      <p class="auth-sub">Kelola undangan digitalmu</p>

      <!-- Form -->
      <div class="auth-form">
        <div class="field">
          <label>Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="email@kamu.com"
            class="auth-input"
            @keyup.enter="submit"
          />
        </div>

        <div class="field">
          <label>Password</label>
          <div class="input-wrap">
            <input
              v-model="form.password"
              :type="showPass ? 'text' : 'password'"
              placeholder="••••••••"
              class="auth-input"
              @keyup.enter="submit"
            />
            <button class="toggle-pass" @click="showPass = !showPass">
              {{ showPass ? '🙈' : '👁️' }}
            </button>
          </div>
        </div>

        <!-- Error -->
        <div v-if="error" class="auth-error">
          {{ error }}
        </div>

        <!-- Submit -->
        <button
          class="auth-btn"
          :disabled="isLoading || !form.email || !form.password"
          @click="submit"
        >
          <span v-if="isLoading">Masuk...</span>
          <span v-else>Masuk</span>
        </button>

        <!-- Register link -->
        <p class="auth-link">
          Belum punya akun?
          <router-link to="/register">Daftar sekarang</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({ email: '', password: '' })
const error = ref('')
const isLoading = ref(false)
const showPass = ref(false)

async function submit() {
  if (!form.email || !form.password) return
  isLoading.value = true
  error.value = ''
  try {
    const err = await authStore.login(form.email, form.password)
    if (err) {
      error.value = err === 'Invalid login credentials'
        ? 'Email atau password salah'
        : err
    } else {
      router.push('/dashboard')
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, #c8dde8 0%, #daeef8 40%, #e8f4fa 100%);
  padding: 24px;
  position: relative;
  overflow: hidden;
}

.auth-bg { position: absolute; inset: 0; pointer-events: none; }
.blob { position: absolute; border-radius: 50%; filter: blur(80px); }
.blob-1 { width: 500px; height: 400px; background: rgba(91,143,168,0.2); top: -100px; left: -100px; }
.blob-2 { width: 400px; height: 500px; background: rgba(184,218,232,0.2); bottom: -100px; right: -100px; }

.auth-card {
  position: relative; z-index: 1;
  width: 100%; max-width: 400px;
  background: rgba(255,255,255,0.75);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(91,143,168,0.2);
  border-radius: 24px;
  padding: 40px 36px;
  box-shadow: 0 20px 60px rgba(30,74,99,0.15);
}

.auth-brand {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 28px; justify-content: center;
}
.auth-brand h1 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 20px; font-weight: 600;
  color: #1e4a63; letter-spacing: 0.5px;
}

.auth-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 26px; font-weight: 600; font-style: italic;
  color: #1e4a63; text-align: center; margin-bottom: 4px;
}
.auth-sub {
  font-family: 'Cormorant Garamond', serif;
  font-size: 14px; color: rgba(44,95,122,0.6);
  text-align: center; margin-bottom: 28px;
}

.auth-form { display: flex; flex-direction: column; gap: 16px; }

.field { display: flex; flex-direction: column; gap: 6px; }
.field label {
  font-family: 'DM Sans', sans-serif;
  font-size: 12px; font-weight: 500;
  color: rgba(44,95,122,0.7); letter-spacing: 0.5px;
}

.input-wrap { position: relative; }

.auth-input {
  width: 100%; padding: 12px 16px;
  border: 1px solid rgba(91,143,168,0.25);
  border-radius: 10px;
  background: rgba(255,255,255,0.7);
  font-family: 'DM Sans', sans-serif;
  font-size: 14px; color: #1e4a63;
  outline: none; transition: border-color 0.2s;
}
.auth-input:focus { border-color: #5b8fa8; background: white; }
.auth-input::placeholder { color: rgba(44,95,122,0.3); }

.toggle-pass {
  position: absolute; right: 12px; top: 50%;
  transform: translateY(-50%);
  background: none; border: none;
  cursor: pointer; font-size: 14px; padding: 4px;
}

.auth-error {
  padding: 10px 14px; border-radius: 8px;
  background: rgba(239,68,68,0.1);
  border: 1px solid rgba(239,68,68,0.2);
  font-family: 'DM Sans', sans-serif;
  font-size: 13px; color: #dc2626;
}

.auth-btn {
  padding: 13px; border-radius: 100px; border: none;
  background: linear-gradient(135deg, #1e4a63, #2d6e8f);
  color: white;
  font-family: 'Cormorant Garamond', serif;
  font-size: 16px; font-weight: 600; letter-spacing: 2px;
  cursor: pointer; transition: all 0.3s;
  box-shadow: 0 4px 16px rgba(30,74,99,0.3);
  margin-top: 4px;
}
.auth-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(30,74,99,0.4); }
.auth-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.auth-link {
  text-align: center;
  font-family: 'DM Sans', sans-serif;
  font-size: 13px; color: rgba(44,95,122,0.6);
}
.auth-link a { color: #2d6e8f; text-decoration: none; font-weight: 500; }
.auth-link a:hover { text-decoration: underline; }
</style>
