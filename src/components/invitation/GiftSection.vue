<template>
  <section class="gift-section" ref="sectionRef">

    <div class="top-connector">
      <div class="connector-line" />
      <div class="connector-dot" />
      <div class="connector-line" />
    </div>

    <p class="section-label" :class="{ show: visible }">Kado Digital</p>

    <div class="gift-intro" :class="{ show: visible }">
      <p>Doa restu Anda adalah hadiah terbesar bagi kami. Namun jika ingin memberikan tanda kasih, berikut informasinya:</p>
    </div>

    <!-- Bank accounts -->
    <div class="accounts-list" :class="{ show: visible }">
      <div
        v-for="(acc, i) in accounts"
        :key="i"
        class="account-card"
        :style="{ transitionDelay: `${0.1 + i * 0.12}s` }"
      >
        <div class="account-top">
          <div class="bank-logo">{{ acc.bank }}</div>
          <button class="copy-btn" @click="copyNumber(acc.number, i)">
            {{ copiedIndex === i ? '✓ Tersalin' : 'Salin' }}
          </button>
        </div>
        <p class="account-number">{{ acc.number }}</p>
        <p class="account-name">a.n. {{ acc.name }}</p>
      </div>
    </div>

    <!-- Confirm transfer -->
    <div class="confirm-section" :class="{ show: visible }">
      <p class="confirm-label">Sudah transfer? Konfirmasi di sini</p>

      <div v-if="confirmed" class="confirm-done">
        <span>🎁</span>
        <p>Terima kasih atas kadonya! 💕</p>
      </div>

      <div v-else class="confirm-form">
        <input v-model="confirmForm.name" class="form-input" placeholder="Namamu" maxlength="80"/>
        <input v-model="confirmForm.bank" class="form-input" placeholder="Bank tujuan (BCA/Mandiri/dll)"/>
        <input v-model="confirmForm.amount" class="form-input" placeholder="Nominal (opsional)" type="number"/>
        <button
          class="confirm-btn"
          :disabled="!confirmForm.name.trim() || isConfirming"
          @click="confirmGift"
        >
          {{ isConfirming ? 'Mengirim...' : 'Konfirmasi Transfer' }}
        </button>
      </div>
    </div>

    <!-- Footer closing -->
    <div class="closing" :class="{ show: visible }">
      <div class="closing-ornament">
        <svg width="200" height="40" viewBox="0 0 200 40" fill="none">
          <path d="M10 20 Q50 6 100 20 Q150 34 190 20" stroke="#5b8fa8" stroke-width="0.8" opacity="0.4"/>
          <path d="M10 20 Q50 34 100 20 Q150 6 190 20" stroke="#5b8fa8" stroke-width="0.5" opacity="0.3"/>
          <circle cx="100" cy="20" r="3" fill="#92bdd4" opacity="0.5"/>
        </svg>
      </div>
      <p class="closing-text">Terima kasih telah menjadi bagian dari hari istimewa kami</p>
      <p class="closing-names">{{ brideName }} & {{ groomName }}</p>
    </div>

  </section>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'
import type { BankAccount } from '@/types'

const props = defineProps<{
  accounts: BankAccount[]
  brideName: string
  groomName: string
}>()

const sectionRef = ref<HTMLElement>()
const visible = ref(false)
const copiedIndex = ref(-1)
const confirmed = ref(false)
const isConfirming = ref(false)

const accounts = computed(() => props.accounts ?? [])

const confirmForm = reactive({ name: '', bank: '', amount: '' })

function copyNumber(number: string, index: number) {
  navigator.clipboard.writeText(number).then(() => {
    copiedIndex.value = index
    setTimeout(() => { copiedIndex.value = -1 }, 2000)
  })
}

async function confirmGift() {
  if (!confirmForm.name.trim()) return
  isConfirming.value = true
  await new Promise(r => setTimeout(r, 800)) // simulasi
  confirmed.value = true
  isConfirming.value = false
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
.gift-section {
  padding: 20px 24px 80px;
  background: linear-gradient(180deg, #e8f4fa 0%, #daeef8 50%, #c8dde8 100%);
  display: flex; flex-direction: column; align-items: center;
}

.top-connector {
  display: flex; align-items: center; gap: 12px;
  margin-bottom: 32px; width: 100%; max-width: 200px;
}
.connector-line { flex: 1; height: 1px; background: rgba(91,143,168,0.2); }
.connector-dot { width: 8px; height: 8px; border-radius: 50%; border: 1px solid rgba(91,143,168,0.4); }

.section-label {
  font-family: 'Cormorant Garamond', serif;
  font-size: 11px; letter-spacing: 4px; text-transform: uppercase;
  color: rgba(44,95,122,0.6); margin-bottom: 16px;
  opacity: 0; transform: translateY(14px); transition: all 0.7s ease;
}
.section-label.show { opacity: 1; transform: translateY(0); }

.gift-intro {
  max-width: 320px; text-align: center; margin-bottom: 28px;
  opacity: 0; transition: opacity 0.7s ease 0.1s;
}
.gift-intro.show { opacity: 1; }
.gift-intro p {
  font-family: 'Cormorant Garamond', serif;
  font-size: 14px; font-style: italic;
  color: rgba(44,95,122,0.7); line-height: 1.65;
}

/* Accounts */
.accounts-list {
  width: 100%; max-width: 360px;
  display: flex; flex-direction: column; gap: 12px;
  margin-bottom: 28px;
  opacity: 0; transform: translateY(16px);
  transition: all 0.7s ease 0.15s;
}
.accounts-list.show { opacity: 1; transform: translateY(0); }

.account-card {
  background: rgba(255,255,255,0.65);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(91,143,168,0.18);
  border-radius: 16px; padding: 18px 20px;
  box-shadow: 0 2px 16px rgba(91,143,168,0.08);
}
.account-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
.bank-logo {
  font-family: 'Cormorant Garamond', serif;
  font-size: 18px; font-weight: 700; color: var(--theme-darker); letter-spacing: 1px;
}
.copy-btn {
  padding: 5px 14px; border-radius: 100px;
  border: 1px solid var(--theme-border);
  background: transparent; color: var(--theme-dark);
  font-family: 'DM Sans', sans-serif; font-size: 12px;
  cursor: pointer; transition: all 0.2s;
}
.copy-btn:hover { background: rgba(91,143,168,0.08); }
.account-number {
  font-family: 'DM Mono', monospace; font-size: 20px;
  color: var(--theme-darker); letter-spacing: 2px; margin-bottom: 4px;
}
.account-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 13px; color: rgba(44,95,122,0.6);
}

/* Confirm section */
.confirm-section {
  width: 100%; max-width: 360px;
  opacity: 0; transition: opacity 0.7s ease 0.2s;
}
.confirm-section.show { opacity: 1; }
.confirm-label {
  font-family: 'Cormorant Garamond', serif;
  font-size: 12px; letter-spacing: 2px; text-transform: uppercase;
  color: rgba(44,95,122,0.55); text-align: center; margin-bottom: 14px;
}
.confirm-form { display: flex; flex-direction: column; gap: 10px; }
.form-input {
  width: 100%; padding: 11px 14px;
  border: 1px solid rgba(91,143,168,0.2); border-radius: 10px;
  background: rgba(255,255,255,0.6);
  font-family: 'Cormorant Garamond', serif; font-size: 15px; color: #1e4a63;
  outline: none; transition: border-color 0.2s;
}
.form-input:focus { border-color: #5b8fa8; }
.form-input::placeholder { color: rgba(44,95,122,0.35); }
.confirm-btn {
  padding: 12px; border-radius: 100px;
  border-color: var(--theme-border);
  background: linear-gradient(135deg, #1e4a63, #2d6e8f);
  color: var(--theme-dark);
  font-family: 'Cormorant Garamond', serif;
  font-size: 14px; font-weight: 600; letter-spacing: 2px;
  cursor: pointer; transition: all 0.3s;
  box-shadow: 0 4px 14px rgba(30,74,99,0.25);
}
.confirm-btn:hover:not(:disabled) { transform: translateY(-2px); }
.confirm-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.confirm-done {
  display: flex; flex-direction: column; align-items: center;
  gap: 8px; padding: 24px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 16px; color: #1e4a63; font-style: italic;
}
.confirm-done span { font-size: 36px; }

/* Closing */
.closing {
  margin-top: 56px; text-align: center;
  opacity: 0; transition: opacity 0.8s ease 0.3s;
}
.closing.show { opacity: 1; }
.closing-ornament { margin-bottom: 20px; }
.closing-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 14px; font-style: italic;
  color: rgba(44,95,122,0.65); margin-bottom: 10px; line-height: 1.6;
  max-width: 260px; margin-left: auto; margin-right: auto;
}
.closing-names {
  font-family: 'Cormorant Garamond', serif;
  font-size: 24px; font-style: italic;
  color: var(--theme-darker);
}
</style>
