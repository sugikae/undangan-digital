import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'  // ← pastikan baris ini ada

// const app = createApp(App)
// app.use(createPinia())
// app.use(router)
// app.mount('#app')

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Init auth sebelum mount
import { useAuthStore } from '@/stores/auth.store'
const authStore = useAuthStore()
authStore.init().then(() => {
  app.mount('#app')
})
