<template>
  <section class="wishes-section" ref="sectionRef">

    <div class="top-connector">
      <div class="connector-line" />
      <div class="connector-dot" />
      <div class="connector-line" />
    </div>

    <p class="section-label" :class="{ show: visible }">Ucapan & Doa</p>

    <!-- Form kirim ucapan -->
    <div class="wish-form" :class="{ show: visible }">
      <input
        v-model="wishForm.name"
        type="text"
        class="form-input"
        placeholder="Namamu"
        maxlength="80"
      />
      <textarea
        v-model="wishForm.content"
        class="form-input form-textarea"
        placeholder="Tulis ucapan & doa untuk kami... 🌸"
        maxlength="300"
        rows="3"
      />
      <button
        class="send-btn"
        :disabled="!wishForm.name.trim() || !wishForm.content.trim() || isSending"
        @click="sendWish"
      >
        {{ isSending ? 'Mengirim...' : 'Kirim Ucapan' }}
      </button>
    </div>

    <!-- List ucapan -->
    <div class="wishes-list" :class="{ show: visible }">
      <TransitionGroup name="wish">
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="wish-card"
        >
          <div class="wish-avatar">
            {{ msg.guest_name.charAt(0).toUpperCase() }}
          </div>
          <div class="wish-body">
            <p class="wish-name">{{ msg.guest_name }}</p>
            <p class="wish-content">{{ msg.content }}</p>
            <p class="wish-time">{{ formatTime(msg.created_at) }}</p>
          </div>
        </div>
      </TransitionGroup>

      <div v-if="store.messages.length === 0" class="empty-wishes">
        <p>Jadilah yang pertama memberikan ucapan 🌸</p>
      </div>
    </div>

  </section>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useInvitationStore } from '@/stores/invitation.store'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/id'
dayjs.extend(relativeTime)
dayjs.locale('id')

const store = useInvitationStore()
const sectionRef = ref<HTMLElement>()
const visible = ref(false)
const isSending = ref(false)

// ← Pakai computed supaya reactive
const messages = computed(() => store.messages)

const wishForm = reactive({
  name: store.guestName !== 'Tamu Undangan' ? store.guestName : '',
  content: '',
})

async function sendWish() {
  if (!wishForm.name.trim() || !wishForm.content.trim()) return
  isSending.value = true
  try {
    const ok = await store.sendMessage(wishForm.name, wishForm.content)
    if (ok) {
      wishForm.content = '' // reset form
    }
  } finally {
    isSending.value = false
  }
}

function formatTime(dateStr: string) {
  return dayjs(dateStr).fromNow()
}

let observer: IntersectionObserver
onMounted(async () => {
  // Setup intersection observer
  observer = new IntersectionObserver(
  (entries) => { const entry = entries[0]; if (entry?.isIntersecting) { visible.value = true; observer.disconnect() } },
  { threshold: 0.2 }
)
  if (sectionRef.value) observer.observe(sectionRef.value)

  // ── Realtime subscription ─────────────────────────────────
  // Uncomment kalau USE_MOCK = false
  if (import.meta.env.VITE_USE_MOCK !== 'true' && store.invitation) {
    const { supabase } = await import('@/services/supabase')
    supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `invitation_id=eq.${store.invitation.id}`
      }, (payload) => {
        // Tambah pesan baru ke list tanpa reload
        store.messages.unshift(payload.new as any)
      })
      .subscribe()
  }
})
onUnmounted(() => observer?.disconnect())
</script>

<style scoped>
.wishes-section {
  padding: 20px 24px 64px;
  background: linear-gradient(180deg, #dff0f8 0%, #e8f4fa 100%);
  display: flex; flex-direction: column; align-items: center;
}

.top-connector {
  display: flex; align-items: center; gap: 12px;
  margin-bottom: 32px; width: 100%; max-width: 200px;
}
.connector-line { flex: 1; height: 1px; background: rgba(91,143,168,0.2); }
.connector-dot {
  width: 8px; height: 8px; border-radius: 50%;
  border: 1px solid rgba(91,143,168,0.4);
}

.section-label {
  font-family: 'Cormorant Garamond', serif;
  font-size: 11px; letter-spacing: 4px; text-transform: uppercase;
  color: rgba(44,95,122,0.6); margin-bottom: 28px;
  opacity: 0; transform: translateY(14px); transition: all 0.7s ease;
}
.section-label.show { opacity: 1; transform: translateY(0); }

/* Form */
.wish-form {
  width: 100%; max-width: 360px;
  display: flex; flex-direction: column; gap: 10px;
  margin-bottom: 28px;
  opacity: 0; transform: translateY(16px);
  transition: all 0.7s ease 0.1s;
}
.wish-form.show { opacity: 1; transform: translateY(0); }

.form-input {
  width: 100%; padding: 11px 14px;
  border: 1px solid rgba(91,143,168,0.2); border-radius: 10px;
  background: rgba(255,255,255,0.65);
  font-family: 'Cormorant Garamond', serif;
  font-size: 15px; color: #1e4a63;
  outline: none; transition: border-color 0.2s; resize: none;
}
.form-input:focus { border-color: #5b8fa8; background: rgba(255,255,255,0.9); }
.form-input::placeholder { color: rgba(44,95,122,0.35); }
.form-textarea { min-height: 80px; }

.send-btn {
  padding: 12px;
  border-radius: 100px; border: none;
  background: linear-gradient(135deg, #1e4a63, #2d6e8f);
  color: #e8f4fa;
  font-family: 'Cormorant Garamond', serif;
  font-size: 14px; font-weight: 600; letter-spacing: 2px;
  cursor: pointer; transition: all 0.3s;
  box-shadow: 0 4px 14px rgba(30,74,99,0.25);
}
.send-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(30,74,99,0.35); }
.send-btn:disabled { opacity: 0.45; cursor: not-allowed; }

/* Wishes list */
.wishes-list {
  width: 100%; max-width: 360px;
  display: flex; flex-direction: column; gap: 12px;
  opacity: 0; transition: opacity 0.7s ease 0.2s;
}
.wishes-list.show { opacity: 1; }

.wish-card {
  display: flex; gap: 12px; align-items: flex-start;
  background: rgba(255,255,255,0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(91,143,168,0.15);
  border-radius: 14px; padding: 14px 16px;
}

.wish-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: linear-gradient(135deg, #5b8fa8, #2d5570);
  color: white; font-family: 'Cormorant Garamond', serif;
  font-size: 16px; font-weight: 600;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.wish-body { flex: 1; }
.wish-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 14px; font-weight: 600; color: #1e4a63; margin-bottom: 4px;
}
.wish-content {
  font-family: 'Cormorant Garamond', serif;
  font-size: 14px; color: rgba(44,95,122,0.8);
  line-height: 1.55; margin-bottom: 6px;
}
.wish-time {
  font-size: 11px; color: rgba(44,95,122,0.4);
  font-family: 'DM Sans', sans-serif;
}

.empty-wishes {
  text-align: center; padding: 32px 0;
  font-family: 'Cormorant Garamond', serif;
  font-size: 15px; font-style: italic;
  color: rgba(44,95,122,0.5);
}

/* TransitionGroup */
.wish-enter-active { transition: all 0.5s cubic-bezier(0.34,1.56,0.64,1); }
.wish-enter-from { opacity: 0; transform: translateY(-16px) scale(0.97); }
</style>
