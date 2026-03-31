<template>
  <Teleport to="body">
    <Transition name="toast">
      <div v-if="visible" :class="[
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-[9998]',
        'px-6 py-3 rounded-full shadow-lg',
        'font-cormorant text-sm font-semibold tracking-wide',
        'flex items-center gap-2',
        typeClass
      ]">
        <span>{{ icon }}</span>
        <span>{{ message }}</span>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

type ToastType = 'success' | 'error' | 'info'

const visible = ref(false)
const message = ref('')
const type = ref<ToastType>('success')
let timer: ReturnType<typeof setTimeout>

const typeClass = computed(() => ({
  success: 'bg-dusty-700 text-dusty-50',
  error:   'bg-red-500 text-white',
  info:    'bg-dusty-500 text-white',
}[type.value]))

const icon = computed(() => ({
  success: '✓', error: '✕', info: 'ℹ',
}[type.value]))

function show(msg: string, t: ToastType = 'success', duration = 3000) {
  message.value = msg
  type.value = t
  visible.value = true
  clearTimeout(timer)
  timer = setTimeout(() => { visible.value = false }, duration)
}

defineExpose({ show })
</script>

<style scoped>
.toast-enter-active, .toast-leave-active { transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, 20px) scale(0.9); }
</style>
