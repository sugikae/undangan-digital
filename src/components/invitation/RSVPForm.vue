<template>
  <ConfettiFlower :trigger="showConfetti" />
  <section class="rsvp-section" ref="sectionRef">

    <div class="top-connector">
      <div class="connector-line" />
      <div class="connector-dot" />
      <div class="connector-line" />
    </div>

    <p class="section-label" :class="{ show: visible }">Konfirmasi Kehadiran</p>

    <!-- Already submitted -->
    <div v-if="submitted" class="submitted-state" :class="{ show: visible }">
      <div class="submitted-icon">🌸</div>
      <h3>Terima Kasih!</h3>
      <p>Konfirmasi kehadiranmu sudah kami terima.<br/>Sampai jumpa di hari bahagia kami.</p>
    </div>

    <!-- Form -->
    <div v-else class="rsvp-card" :class="{ show: visible }">

      <!-- Status pilihan -->
      <p class="form-label">Apakah kamu bisa hadir?</p>
      <div class="status-options">
        <button
          v-for="opt in statusOptions"
          :key="opt.value"
          class="status-btn"
          :class="{ active: form.status === opt.value }"
          @click="form.status = opt.value"
        >
          <span class="status-icon">{{ opt.icon }}</span>
          <span>{{ opt.label }}</span>
        </button>
      </div>

      <!-- Jumlah tamu -->
      <div v-if="form.status === 'hadir'" class="pax-section">
        <p class="form-label">Jumlah tamu yang hadir</p>
        <div class="pax-control">
          <button class="pax-btn" @click="decreasePax" :disabled="form.pax <= 1">−</button>
          <span class="pax-number">{{ form.pax }}</span>
          <button class="pax-btn" @click="increasePax" :disabled="form.pax >= 10">+</button>
        </div>
        <p class="pax-hint">orang (termasuk kamu)</p>
      </div>

      <!-- Nama -->
      <div class="field-group">
        <p class="form-label">Nama</p>
        <input
          v-model="form.name"
          type="text"
          class="form-input"
          placeholder="Nama lengkapmu"
          maxlength="100"
        />
      </div>

      <!-- Catatan -->
      <div class="field-group">
        <p class="form-label">Pesan (opsional)</p>
        <textarea
          v-model="form.note"
          class="form-input form-textarea"
          placeholder="Ada pesan untuk kami?"
          maxlength="200"
          rows="3"
        />
      </div>

      <!-- Submit -->
      <button
        class="submit-btn"
        :disabled="!form.status || !form.name.trim() || isSubmitting"
        @click="submitRSVP"
      >
        <span v-if="isSubmitting">Mengirim...</span>
        <span v-else>Kirim Konfirmasi</span>
      </button>

    </div>

  </section>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { useInvitationStore } from '@/stores/invitation.store'
import ConfettiFlower from '@/components/animations/ConfettiFlower.vue'

const props = defineProps<{ enableConfetti?: boolean }>()
const showConfetti = ref(false)
const store = useInvitationStore()
const sectionRef = ref<HTMLElement>()
const visible = ref(false)
const submitted = ref(store.rsvpSubmitted)
const isSubmitting = ref(false)

const form = reactive({
  status: '' as 'hadir' | 'tidak_hadir' | 'mungkin' | '',
  pax: 1,
  name: store.guestName !== 'Tamu Undangan' ? store.guestName : '',
  note: '',
})

const statusOptions = [
  { value: 'hadir' as const,        icon: '✓', label: 'Hadir' },
  { value: 'tidak_hadir' as const,  icon: '✕', label: 'Tidak Hadir' },
  { value: 'mungkin' as const,      icon: '?', label: 'Mungkin' },
]

function decreasePax() { if (form.pax > 1) form.pax-- }
function increasePax() { if (form.pax < 10) form.pax++ }

async function submitRSVP() {
  if (!form.status || !form.name.trim()) return
  isSubmitting.value = true
  try {
    const ok = await store.sendRSVP(
      form.status,
      form.pax,
      form.note || undefined,
      form.name.trim()    // ← tambah nama
    )
    if (ok) {
      submitted.value = true
      if (props.enableConfetti !== false) {
        showConfetti.value = true
        setTimeout(() => { showConfetti.value = false }, 100)
      }
    }
  } finally {
    isSubmitting.value = false
  }
}

let observer: IntersectionObserver
onMounted(() => {
  observer = new IntersectionObserver(
  (entries) => { const entry = entries[0]; if (entry?.isIntersecting) { visible.value = true; observer.disconnect() } },
  { threshold: 0.2 }
)
  if (sectionRef.value) observer.observe(sectionRef.value)
})
onUnmounted(() => observer?.disconnect())
</script>

<style scoped>
.rsvp-section {
  padding: 20px 24px 64px;
  background: linear-gradient(180deg, #e8f4fa 0%, #dff0f8 100%);
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
  opacity: 0; transform: translateY(14px);
  transition: all 0.7s ease;
}
.section-label.show { opacity: 1; transform: translateY(0); }

/* Submitted state */
.submitted-state {
  text-align: center; padding: 40px 24px;
  opacity: 0; transform: translateY(20px);
  transition: all 0.7s ease;
}
.submitted-state.show { opacity: 1; transform: translateY(0); }
.submitted-icon { font-size: 48px; margin-bottom: 16px; animation: float 3s ease-in-out infinite; }
.submitted-state h3 {
  font-family: 'Cormorant Garamond', serif;
  font-size: 28px; font-style: italic; color: #1e4a63; margin-bottom: 10px;
}
.submitted-state p {
  font-family: 'Cormorant Garamond', serif;
  font-size: 15px; color: rgba(44,95,122,0.7); line-height: 1.7;
}

/* Card */
.rsvp-card {
  width: 100%; max-width: 360px;
  background: rgba(255,255,255,0.65);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(91,143,168,0.18);
  border-radius: 20px; padding: 28px 24px;
  box-shadow: 0 4px 24px rgba(91,143,168,0.1);
  opacity: 0; transform: translateY(24px);
  transition: all 0.7s cubic-bezier(0.34,1.56,0.64,1);
}
.rsvp-card.show { opacity: 1; transform: translateY(0); }

.form-label {
  font-family: 'Cormorant Garamond', serif;
  font-size: 12px; letter-spacing: 2px; text-transform: uppercase;
  color: rgba(44,95,122,0.6); margin-bottom: 12px;
}

/* Status options */
.status-options {
  display: grid; grid-template-columns: repeat(3,1fr);
  gap: 8px; margin-bottom: 24px;
}
.status-btn {
  display: flex; flex-direction: column; align-items: center;
  gap: 4px; padding: 12px 8px; border-radius: 12px;
  border: 1px solid rgba(91,143,168,0.2);
  background: rgba(255,255,255,0.5);
  cursor: pointer; transition: all 0.2s;
  font-family: 'Cormorant Garamond', serif;
  font-size: 13px; color: rgba(44,95,122,0.7);
}
.status-btn:hover { border-color: #5b8fa8; background: rgba(91,143,168,0.06); }
.status-btn.active {
  background: #2d5570; color: white;
  border-color: #2d5570;
  box-shadow: 0 4px 12px rgba(45,85,112,0.3);
}
.status-icon { font-size: 16px; font-weight: 700; }

/* Pax control */
.pax-section {
  text-align: center; margin-bottom: 20px;
}
.pax-control {
  display: inline-flex; align-items: center; gap: 20px;
  background: rgba(255,255,255,0.5);
  border: 1px solid rgba(91,143,168,0.2);
  border-radius: 100px; padding: 8px 20px;
  margin-bottom: 6px;
}
.pax-btn {
  width: 28px; height: 28px; border-radius: 50%;
  border: 1px solid rgba(91,143,168,0.3);
  background: white; color: #2d5570;
  font-size: 18px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s; line-height: 1;
}
.pax-btn:hover:not(:disabled) { background: #2d5570; color: white; }
.pax-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.pax-number {
  font-family: 'Cormorant Garamond', serif;
  font-size: 24px; font-weight: 600; color: #1e4a63;
  min-width: 24px; text-align: center;
}
.pax-hint {
  font-family: 'Cormorant Garamond', serif;
  font-size: 12px; color: rgba(44,95,122,0.5); letter-spacing: 1px;
}

/* Fields */
.field-group { margin-bottom: 16px; }
.form-input {
  width: 100%; padding: 11px 14px;
  border: 1px solid rgba(91,143,168,0.2);
  border-radius: 10px;
  background: rgba(255,255,255,0.6);
  font-family: 'Cormorant Garamond', serif;
  font-size: 15px; color: #1e4a63;
  outline: none; transition: border-color 0.2s;
  resize: none;
}
.form-input:focus { border-color: #5b8fa8; background: rgba(255,255,255,0.9); }
.form-input::placeholder { color: rgba(44,95,122,0.35); }
.form-textarea { min-height: 80px; }

/* Submit */
.submit-btn {
  width: 100%; padding: 13px;
  border-radius: 100px; border: none;
  background: linear-gradient(135deg, #1e4a63, #2d6e8f);
  color: #e8f4fa;
  font-family: 'Cormorant Garamond', serif;
  font-size: 15px; font-weight: 600; letter-spacing: 2px;
  cursor: pointer; transition: all 0.3s;
  margin-top: 8px;
  box-shadow: 0 4px 16px rgba(30,74,99,0.3);
}
.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(30,74,99,0.4);
}
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

@keyframes float {
  0%,100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
</style>
