<template>
  <div class="detail-page">

    <!-- Sidebar sama seperti dashboard -->
    <aside class="sidebar">
      <div class="sidebar-brand">
        <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="18" stroke="#5b8fa8" stroke-width="1.5" opacity="0.6"/>
          <path d="M20 8C14 8 10 12 10 17c0 8 10 15 10 15s10-7 10-15c0-5-4-9-10-9z" fill="#5b8fa8" opacity="0.8"/>
          <circle cx="20" cy="17" r="3.5" fill="white" opacity="0.9"/>
        </svg>
        <span>Undangan Digital</span>
      </div>
      <nav class="sidebar-nav">
        <router-link to="/dashboard" class="nav-item">
          <span class="nav-icon">← </span> Kembali
        </router-link>
      </nav>
    </aside>

    <main class="detail-main">
      <div v-if="isLoading" class="loading-state">
        <div class="loading-dot" />
        <p>Memuat data...</p>
      </div>

      <template v-else-if="invitation">
        <!-- Header -->
        <div class="detail-header">
          <div>
            <h1 class="detail-title">
              {{ invitation.config.bride_name }} & {{ invitation.config.groom_name }}
            </h1>
            <p class="detail-slug">/i/{{ invitation.slug }}</p>
          </div>
          <div class="header-actions">
            <a :href="`/i/${invitation.slug}`" target="_blank" class="action-btn btn-preview">
              👁️ Preview
            </a>
            <button
              class="action-btn"
              :class="invitation.is_published ? 'btn-unpublish' : 'btn-publish'"
              @click="togglePublish"
            >
              {{ invitation.is_published ? '⏸ Unpublish' : '🚀 Publish' }}
            </button>
          </div>
        </div>

        <!-- Tabs -->
        <div class="detail-tabs">
          <button v-for="tab in tabs" :key="tab.id"
            class="tab-btn" :class="{ active: activeTab === tab.id }"
            @click="activeTab = tab.id">
            {{ tab.icon }} {{ tab.label }}
          </button>
        </div>

        <!-- Tab: Info Dasar -->
        <div v-if="activeTab === 'info'" class="tab-content">
          <div class="form-grid">
            <div class="field">
              <label>Nama Mempelai Wanita</label>
              <input v-model="editConfig.bride_name" class="form-input"/>
            </div>
            <div class="field">
              <label>Nama Mempelai Pria</label>
              <input v-model="editConfig.groom_name" class="form-input"/>
            </div>
            <div class="field">
              <label>Orang Tua Wanita</label>
              <input v-model="editConfig.bride_parents" class="form-input" placeholder="Bapak & Ibu ..."/>
            </div>
            <div class="field">
              <label>Orang Tua Pria</label>
              <input v-model="editConfig.groom_parents" class="form-input" placeholder="Bapak & Ibu ..."/>
            </div>
            <div class="field full">
              <label>Tanggal Acara</label>
              <input v-model="editEventDate" type="datetime-local" class="form-input"/>
            </div>
            <div class="field full">
              <label>Warna Bunga Animasi</label>
              <div style="display:flex;gap:10px;align-items:center">
                <input v-model="editConfig.flower_color" type="color" style="width:48px;height:40px;border-radius:8px;border:1px solid #ddd;cursor:pointer"/>
                <input v-model="editConfig.flower_color" class="form-input" style="flex:1"/>
              </div>
            </div>
          </div>
          <button class="btn-save" @click="saveConfig">💾 Simpan Perubahan</button>
        </div>

        <!-- Tab: Lokasi & Venue -->
        <div v-if="activeTab === 'venues'" class="tab-content">
          <p class="tab-desc">Atur lokasi akad & resepsi</p>
          <div
            v-for="(venue, i) in editConfig.venues"
            :key="i"
            class="venue-edit-card"
          >
            <div class="venue-edit-header">
              <h4>📍 Venue {{ Number(i) + 1 }}</h4>
              <button class="btn-remove" @click="editConfig.venues.splice(i, 1)">✕ Hapus</button>
            </div>
            <div class="form-grid">
              <div class="field full">
                <label>Nama Acara</label>
                <input v-model="venue.name" class="form-input" placeholder="Akad Nikah / Resepsi"/>
              </div>
              <div class="field full">
                <label>Lokasi Lengkap</label>
                <input v-model="venue.location" class="form-input" placeholder="Nama gedung, jalan, kota"/>
              </div>
              <div class="field">
                <label>Tanggal & Waktu</label>
                <input v-model="venue.date" type="datetime-local" class="form-input"/>
              </div>
              <div class="field">
                <label>Link Google Maps</label>
                <input v-model="venue.maps_url" class="form-input" placeholder="https://maps.google.com/..."/>
              </div>
            </div>
          </div>
          <button class="btn-add" @click="editConfig.venues.push({ name: '', location: '', date: '', maps_url: '' })">
            + Tambah Venue
          </button>
          <button class="btn-save" style="margin-top:16px" @click="saveConfig">💾 Simpan</button>
        </div>

        <!-- Tab: Rekening -->
        <div v-if="activeTab === 'bank'" class="tab-content">
          <p class="tab-desc">Informasi rekening untuk kado digital</p>
          <div
            v-for="(acc, i) in editConfig.bank_accounts"
            :key="i"
            class="venue-edit-card"
          >
            <div class="venue-edit-header">
              <h4>💳 Rekening {{ Number(i) + 1 }}</h4>
              <button class="btn-remove" @click="editConfig.bank_accounts.splice(i, 1)">✕ Hapus</button>
            </div>
            <div class="form-grid">
              <div class="field">
                <label>Nama Bank</label>
                <input v-model="acc.bank" class="form-input" placeholder="BCA / Mandiri / BNI / dll"/>
              </div>
              <div class="field">
                <label>Nomor Rekening</label>
                <input v-model="acc.number" class="form-input" placeholder="0000000000"/>
              </div>
              <div class="field full">
                <label>Atas Nama</label>
                <input v-model="acc.name" class="form-input" placeholder="Nama pemilik rekening"/>
              </div>
            </div>
          </div>
          <button class="btn-add" @click="editConfig.bank_accounts.push({ bank: '', number: '', name: '' })">
            + Tambah Rekening
          </button>
          <button class="btn-save" style="margin-top:16px" @click="saveConfig">💾 Simpan</button>
        </div>

        <!-- Tab: Kisah Cinta -->
        <div v-if="activeTab === 'lovestory'" class="tab-content">
          <p class="tab-desc">Ceritakan perjalanan cinta kalian</p>
          <div
            v-for="(story, i) in editConfig.love_story"
            :key="i"
            class="venue-edit-card"
          >
            <div class="venue-edit-header">
              <h4>💕 Momen {{ Number(i) + 1 }}</h4>
              <button class="btn-remove" @click="editConfig.love_story.splice(i, 1)">✕ Hapus</button>
            </div>
            <div class="form-grid">
              <div class="field">
                <label>Tahun</label>
                <input v-model="story.year" class="form-input" placeholder="2020"/>
              </div>
              <div class="field">
                <label>Judul</label>
                <input v-model="story.title" class="form-input" placeholder="Pertama Bertemu"/>
              </div>
              <div class="field full">
                <label>Cerita</label>
                <textarea v-model="story.description" class="form-input" rows="3"
                  style="resize:vertical" placeholder="Ceritakan momen ini..."/>
              </div>
            </div>
          </div>
          <button class="btn-add" @click="editConfig.love_story.push({ year: '', title: '', description: '' })">
            + Tambah Momen
          </button>
          <button class="btn-save" style="margin-top:16px" @click="saveConfig">💾 Simpan</button>
        </div>

        <!-- Tab: Animasi -->
        <div v-if="activeTab === 'animation'" class="tab-content">
          <p class="tab-desc">Pilih animasi yang aktif di undangan</p>
          <div class="toggle-list">
            <div class="toggle-item">
              <div>
                <p class="toggle-name">Opening Animation</p>
                <p class="toggle-desc">Pilih animasi pembuka undangan</p>
              </div>
              <select v-model="editConfig.opening_animation" class="form-select">
                <option value="flower">🌸 Bunga Melayang</option>
                <option value="envelope">💌 Buka Amplop</option>
              </select>
            </div>
            <div class="toggle-item">
              <div>
                <p class="toggle-name">🌸 Bunga & Kupu-kupu</p>
                <p class="toggle-desc">Animasi bunga melayang di background</p>
              </div>
              <div class="toggle" :class="{ on: editConfig.flower_animation }"
                @click="editConfig.flower_animation = !editConfig.flower_animation">
                <div class="toggle-knob"/>
              </div>
            </div>
            <div class="toggle-item">
              <div>
                <p class="toggle-name">⭐ Bintang Berkelip</p>
                <p class="toggle-desc">Partikel bintang di background</p>
              </div>
              <div class="toggle" :class="{ on: editConfig.bg_animation_stars }"
                @click="editConfig.bg_animation_stars = !editConfig.bg_animation_stars">
                <div class="toggle-knob"/>
              </div>
            </div>
            <div class="toggle-item">
              <div>
                <p class="toggle-name">🎊 Confetti RSVP</p>
                <p class="toggle-desc">Confetti bunga saat tamu kirim RSVP</p>
              </div>
              <div class="toggle" :class="{ on: editConfig.confetti_on_rsvp }"
                @click="editConfig.confetti_on_rsvp = !editConfig.confetti_on_rsvp">
                <div class="toggle-knob"/>
              </div>
            </div>
            <div class="toggle-item">
              <div>
                <p class="toggle-name">🖼️ Parallax Hero</p>
                <p class="toggle-desc">Efek parallax saat scroll di hero section</p>
              </div>
              <div class="toggle" :class="{ on: editConfig.hero_parallax }"
                @click="editConfig.hero_parallax = !editConfig.hero_parallax">
                <div class="toggle-knob"/>
              </div>
            </div>
          </div>
          <button class="btn-save" @click="saveConfig">💾 Simpan Perubahan</button>
        </div>

        <!-- Tab: Fitur -->
        <div v-if="activeTab === 'features'" class="tab-content">
          <p class="tab-desc">Aktifkan atau nonaktifkan fitur undangan</p>
          <div class="toggle-list">
            <div class="toggle-item" v-for="feat in featureToggles" :key="feat.key">
              <div>
                <p class="toggle-name">{{ feat.icon }} {{ feat.label }}</p>
                <p class="toggle-desc">{{ feat.desc }}</p>
              </div>
              <div class="toggle" :class="{ on: (editConfig as any)[feat.key] }"
                @click="(editConfig as any)[feat.key] = !(editConfig as any)[feat.key]">
                <div class="toggle-knob"/>
              </div>
            </div>
          </div>
          <button class="btn-save" @click="saveConfig">💾 Simpan Perubahan</button>
        </div>

        <!-- Tab: RSVP -->
        <div v-if="activeTab === 'rsvp'" class="tab-content">
          <div class="stats-row">
            <div class="stat-card green">
              <span class="sc-num">{{ stats.total_hadir }}</span>
              <span class="sc-lbl">Hadir</span>
            </div>
            <div class="stat-card red">
              <span class="sc-num">{{ stats.total_tidak_hadir }}</span>
              <span class="sc-lbl">Tidak Hadir</span>
            </div>
            <div class="stat-card yellow">
              <span class="sc-num">{{ stats.total_mungkin }}</span>
              <span class="sc-lbl">Mungkin</span>
            </div>
            <div class="stat-card blue">
              <span class="sc-num">{{ stats.total_tamu }}</span>
              <span class="sc-lbl">Est. Tamu</span>
            </div>
          </div>

          <div class="rsvp-list">
            <div v-for="r in rsvpList" :key="r.id" class="rsvp-item">
              <div class="rsvp-avatar">{{ r.guests?.name?.charAt(0) ?? '?' }}</div>
              <div class="rsvp-info">
                <p class="rsvp-name">{{ r.guests?.name ?? 'Tamu Anonymous' }}</p>
                <p class="rsvp-note">{{ r.note || '-' }}</p>
              </div>
              <div class="rsvp-right">
                <span class="rsvp-status" :class="r.status">{{ r.status.replace('_', ' ') }}</span>
                <span class="rsvp-pax">{{ r.pax }} orang</span>
              </div>
            </div>
            <p v-if="rsvpList.length === 0" class="empty-msg">Belum ada RSVP</p>
          </div>
        </div>

        <!-- Tab: Ucapan -->
        <div v-if="activeTab === 'messages'" class="tab-content">
          <div class="msg-list">
            <div v-for="msg in messageList" :key="msg.id" class="msg-item">
              <div class="msg-avatar">{{ msg.guest_name.charAt(0) }}</div>
              <div class="msg-body">
                <p class="msg-name">{{ msg.guest_name }}</p>
                <p class="msg-content">{{ msg.content }}</p>
                <p class="msg-time">{{ dayjs(msg.created_at).fromNow() }}</p>
              </div>
              <button class="msg-delete" @click="deleteMessage(msg.id)">✕</button>
            </div>
            <p v-if="messageList.length === 0" class="empty-msg">Belum ada ucapan</p>
          </div>
        </div>

        <!-- Tab: Musik -->
        <div v-if="activeTab === 'music'" class="tab-content">
          <p class="tab-desc">Atur musik background undangan</p>
          <div class="field" style="margin-bottom:16px">
            <label>URL Musik</label>
            <input
              v-model="editConfig.music_url"
              class="form-input"
              placeholder="https://... atau /sounds/lagu.mp3"
            />
            <p class="field-hint">Upload file MP3 ke folder public/sounds/ lalu isi /sounds/nama-file.mp3</p>
          </div>
          <div class="toggle-item" style="padding:16px 0">
            <div>
              <p class="toggle-name">🎵 Autoplay Musik</p>
              <p class="toggle-desc">Musik otomatis berbunyi saat undangan dibuka</p>
            </div>
            <div class="toggle" :class="{ on: editConfig.music_autoplay }"
              @click="editConfig.music_autoplay = !editConfig.music_autoplay">
              <div class="toggle-knob"/>
            </div>
          </div>
          <button class="btn-save" @click="saveConfig">💾 Simpan</button>
        </div>

        <!-- Tab: Tamu & Blast -->
        <div v-if="activeTab === 'guests'" class="tab-content">
          <p class="tab-desc">Kelola daftar tamu & kirim undangan</p>

          <!-- Blast buttons -->
          <div class="blast-section">
            <h4 class="blast-title">📤 Kirim Undangan</h4>
            <div class="blast-btns">
              <button class="blast-btn wa" @click="blastWA" :disabled="isBlasting">
                <span>📱</span>
                <div>
                  <p>Blast WhatsApp</p>
                  <p class="blast-sub">Kirim ke semua tamu via WA</p>
                </div>
              </button>
              <button class="blast-btn email" @click="blastEmailFn" :disabled="isBlasting">
                <span>📧</span>
                <div>
                  <p>Blast Email</p>
                  <p class="blast-sub">Kirim ke semua tamu via Email</p>
                </div>
              </button>
            </div>
            <div v-if="blastResult" class="blast-result">
              ✅ Terkirim: {{ blastResult.success }} |
              ❌ Gagal: {{ blastResult.failed }} |
              Total: {{ blastResult.total }}
            </div>
          </div>

          <!-- Add guest form -->
          <div class="add-guest-form">
            <h4 class="blast-title">➕ Tambah Tamu</h4>
            <div class="form-grid">
              <div class="field">
                <label>Nama</label>
                <input v-model="newGuest.name" class="form-input" placeholder="Nama tamu"/>
              </div>
              <div class="field">
                <label>No. WhatsApp</label>
                <input v-model="newGuest.phone" class="form-input" placeholder="628xxx"/>
              </div>
              <div class="field">
                <label>Email</label>
                <input v-model="newGuest.email" class="form-input" placeholder="email@tamu.com"/>
              </div>
              <div class="field">
                <label>Grup</label>
                <input v-model="newGuest.group_name" class="form-input" placeholder="Keluarga / Rekan Kerja"/>
              </div>
            </div>
            <button class="btn-save" @click="addGuest">➕ Tambah Tamu</button>
          </div>

          <!-- Guest list -->
          <div class="guest-list" style="margin-top:24px">
            <h4 class="blast-title">👥 Daftar Tamu ({{ guestList.length }})</h4>
            <div v-for="g in guestList" :key="g.id" class="guest-item">
              <div class="guest-avatar">{{ g.name.charAt(0) }}</div>
              <div class="guest-info">
                <p class="guest-name">{{ g.name }}</p>
                <p class="guest-detail">{{ g.phone || '-' }} · {{ g.group_name || '-' }}</p>
              </div>
              <div class="guest-right">
                <span class="guest-status" :class="{ opened: g.is_opened }">
                  {{ g.is_opened ? '✓ Dibuka' : '○ Belum' }}
                </span>
                <a :href="`/i/${invitation?.slug}/guest/${g.token}`" target="_blank"
                  class="guest-link">🔗</a>
                <button class="msg-delete" @click="removeGuest(g.id)">✕</button>
              </div>
            </div>
            <p v-if="guestList.length === 0" class="empty-msg">Belum ada tamu</p>
          </div>
        </div>

      </template>
    </main>

    <!-- Toast notif -->
    <Transition name="toast">
      <div v-if="toastMsg" class="toast">{{ toastMsg }}</div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { supabase } from '@/services/supabase'
import type { Invitation } from '@/types'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/id'
dayjs.extend(relativeTime)
dayjs.locale('id')

//blastwa
import { blastWhatsApp, blastEmail } from '@/services/invitation.service'



const route = useRoute()
const authStore = useAuthStore()

const isLoading = ref(true)
const invitation = ref<Invitation | null>(null)
const rsvpList = ref<any[]>([])
const messageList = ref<any[]>([])
const toastMsg = ref('')
const activeTab = ref('info')

const editConfig = reactive<any>({})
const editEventDate = ref('')

const tabs = [
  { id: 'info', icon: '📝', label: 'Info Dasar' },
  { id: 'venues', icon: '📍', label: 'Lokasi' },        // ← tambah
  { id: 'bank', icon: '💳', label: 'Rekening' },         // ← tambah
  { id: 'lovestory', icon: '💕', label: 'Kisah Cinta' }, // ← tambah
  { id: 'animation', icon: '✨', label: 'Animasi' },
  { id: 'features', icon: '⚙️', label: 'Fitur' },
  { id: 'rsvp', icon: '✅', label: 'RSVP' },
  { id: 'messages', icon: '💬', label: 'Ucapan' },
  { id: 'music', icon: '🎵', label: 'Musik' },
  { id: 'guests', icon: '👥', label: 'Tamu & Blast' },
]

const featureToggles = [
  { key: 'countdown_enabled', icon: '⏱️', label: 'Countdown Timer', desc: 'Hitung mundur menuju hari H' },
  { key: 'rsvp_enabled', icon: '✅', label: 'RSVP', desc: 'Form konfirmasi kehadiran' },
  { key: 'wishes_enabled', icon: '💬', label: 'Ucapan & Doa', desc: 'Wall ucapan dari tamu' },
  { key: 'gallery_enabled', icon: '📸', label: 'Galeri Foto', desc: 'Album foto undangan' },
  { key: 'gift_enabled', icon: '🎁', label: 'Kado Digital', desc: 'Info rekening & konfirmasi' },
  { key: 'qr_enabled', icon: '📱', label: 'QR Check-in', desc: 'QR code per tamu untuk check-in' },
  { key: 'music_autoplay', icon: '🎵', label: 'Autoplay Musik', desc: 'Musik otomatis saat undangan dibuka' },
  { key: 'qr_enabled', icon: '📱', label: 'QR Check-in', desc: 'QR code per tamu (butuh input data tamu manual)' },
]

const stats = computed(() => ({
  total_hadir: rsvpList.value.filter(r => r.status === 'hadir').length,
  total_tidak_hadir: rsvpList.value.filter(r => r.status === 'tidak_hadir').length,
  total_mungkin: rsvpList.value.filter(r => r.status === 'mungkin').length,
  total_tamu: rsvpList.value.filter(r => r.status === 'hadir').reduce((s: number, r: any) => s + r.pax, 0),
}))

//blast wa
const guestList = ref<any[]>([])
const isBlasting = ref(false)
const blastResult = ref<any>(null)
const newGuest = reactive({ name: '', phone: '', email: '', group_name: '' })

function showToast(msg: string) {
  toastMsg.value = msg
  setTimeout(() => { toastMsg.value = '' }, 3000)
}

async function loadData() {
  const id = route.params.id as string
  isLoading.value = true
  try {
    const [invRes, rsvpRes, msgRes] = await Promise.all([
      supabase.from('invitations').select('*').eq('id', id).single(),
      supabase.from('rsvp').select('*, guests(name)').eq('invitation_id', id).order('responded_at', { ascending: false }),
      supabase.from('messages').select('*').eq('invitation_id', id).order('created_at', { ascending: false }),
    ])
    if (invRes.data) {
      invitation.value = invRes.data
      Object.assign(editConfig, { ...invRes.data.config })
      editEventDate.value = invRes.data.event_date
        ? dayjs(invRes.data.event_date).format('YYYY-MM-DDTHH:mm')
        : ''
    }
    rsvpList.value = rsvpRes.data ?? []
    messageList.value = msgRes.data ?? []
    await loadGuests() // ← tambah ini
  } finally {
    isLoading.value = false
  }
}

async function saveConfig() {
  if (!invitation.value) return
  const { error } = await supabase
    .from('invitations')
    .update({
      config: { ...editConfig },
      event_date: editEventDate.value || null,
    })
    .eq('id', invitation.value.id)

  if (error) { showToast('❌ Gagal menyimpan'); return }
  invitation.value.config = { ...editConfig }
  showToast('✓ Perubahan disimpan!')
}

async function togglePublish() {
  if (!invitation.value) return
  const { error } = await supabase
    .from('invitations')
    .update({ is_published: !invitation.value.is_published })
    .eq('id', invitation.value.id)

  if (!error) {
    invitation.value.is_published = !invitation.value.is_published
    showToast(invitation.value.is_published ? '🚀 Undangan dipublish!' : '⏸ Undangan di-unpublish')
  }
}

async function deleteMessage(id: string) {
  const { error } = await supabase.from('messages').delete().eq('id', id)
  if (!error) {
    messageList.value = messageList.value.filter(m => m.id !== id)
    showToast('✓ Ucapan dihapus')
  }
}

//blast wa
// Load guests
async function loadGuests() {
  if (!invitation.value) return
  const { data } = await supabase
    .from('guests')
    .select('*')
    .eq('invitation_id', invitation.value.id)
    .order('created_at', { ascending: false })
  guestList.value = data ?? []
}

async function addGuest() {
  if (!newGuest.name || !invitation.value) return
  const { data, error } = await supabase
    .from('guests')
    .insert({
      invitation_id: invitation.value.id,
      name: newGuest.name,
      phone: newGuest.phone,
      email: newGuest.email,
      group_name: newGuest.group_name,
      token: Math.random().toString(36).substring(2, 18),
      is_opened: false,
    })
    .select()
    .single()

  if (!error && data) {
    guestList.value.unshift(data)
    newGuest.name = ''
    newGuest.phone = ''
    newGuest.email = ''
    newGuest.group_name = ''
    showToast('✓ Tamu berhasil ditambahkan')
  }
}

async function removeGuest(id: string) {
  await supabase.from('guests').delete().eq('id', id)
  guestList.value = guestList.value.filter(g => g.id !== id)
  showToast('✓ Tamu dihapus')
}

async function getAuthToken() {
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? ''
}

async function blastWA() {
  if (!invitation.value) return
  isBlasting.value = true
  blastResult.value = null
  try {
    const token = await getAuthToken()
    const result = await blastWhatsApp(invitation.value.id, token)
    blastResult.value = result
    showToast(`📱 WA terkirim: ${result.success}/${result.total}`)
  } catch (e) {
    showToast('❌ WA Blast gagal — pastikan WA API sudah dikonfigurasi')
  } finally {
    isBlasting.value = false
  }
}

async function blastEmailFn() {
  if (!invitation.value) return
  isBlasting.value = true
  blastResult.value = null
  try {
    const token = await getAuthToken()
    const result = await blastEmail(invitation.value.id, token)
    blastResult.value = result
    showToast(`📧 Email terkirim: ${result.success}/${result.total}`)
  } catch (e) {
    showToast('❌ Email Blast gagal — pastikan SMTP sudah dikonfigurasi')
  } finally {
    isBlasting.value = false
  }
}

onMounted(loadData)
</script>

<style scoped>
.detail-page { display: flex; min-height: 100vh; background: #f0f7fc; font-family: 'DM Sans', sans-serif; }
.sidebar { width: 240px; flex-shrink: 0; background: linear-gradient(180deg, #1e4a63, #2d6e8f); display: flex; flex-direction: column; padding: 24px 16px; position: fixed; top: 0; left: 0; bottom: 0; z-index: 10; }
.sidebar-brand { display: flex; align-items: center; gap: 10px; padding: 8px 8px 24px; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 24px; }
.sidebar-brand span { font-family: 'Cormorant Garamond', serif; font-size: 16px; font-weight: 600; color: rgba(255,255,255,0.9); }
.sidebar-nav { flex: 1; }
.nav-item { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; color: rgba(255,255,255,0.65); font-size: 14px; text-decoration: none; cursor: pointer; transition: all 0.2s; }
.nav-item:hover { background: rgba(255,255,255,0.12); color: white; }

.detail-main { flex: 1; margin-left: 240px; padding: 32px; }

.detail-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; flex-wrap: wrap; gap: 16px; }
.detail-title { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 600; font-style: italic; color: #1e4a63; margin-bottom: 4px; }
.detail-slug { font-size: 13px; color: rgba(44,95,122,0.5); font-family: 'DM Mono', monospace; }
.header-actions { display: flex; gap: 10px; }
.action-btn { padding: 9px 18px; border-radius: 8px; border: none; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.2s; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; }
.btn-preview { background: rgba(91,143,168,0.1); color: #2d5570; }
.btn-publish { background: rgba(5,150,105,0.1); color: #059669; }
.btn-unpublish { background: rgba(239,68,68,0.1); color: #dc2626; }

.detail-tabs { display: flex; gap: 4px; margin-bottom: 24px; flex-wrap: wrap; border-bottom: 1px solid rgba(91,143,168,0.15); padding-bottom: 0; }
.tab-btn { padding: 10px 16px; border: none; background: transparent; font-size: 13px; font-weight: 500; color: rgba(44,95,122,0.6); cursor: pointer; transition: all 0.2s; border-bottom: 2px solid transparent; margin-bottom: -1px; }
.tab-btn:hover { color: #2d5570; }
.tab-btn.active { color: #1e4a63; border-bottom-color: #5b8fa8; }

.tab-content { background: white; border-radius: 16px; padding: 24px; border: 1px solid rgba(91,143,168,0.12); }
.tab-desc { font-size: 13px; color: rgba(44,95,122,0.6); margin-bottom: 20px; }

.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.field.full { grid-column: 1 / -1; }
.field label { font-size: 12px; font-weight: 500; color: rgba(44,95,122,0.7); }
.form-input { padding: 10px 14px; border: 1px solid rgba(91,143,168,0.2); border-radius: 8px; font-size: 14px; color: #1e4a63; outline: none; transition: border-color 0.2s; font-family: 'DM Sans', sans-serif; }
.form-input:focus { border-color: #5b8fa8; }
.form-select { padding: 8px 12px; border: 1px solid rgba(91,143,168,0.2); border-radius: 8px; font-size: 13px; color: #1e4a63; outline: none; background: white; cursor: pointer; }

.btn-save { padding: 10px 24px; border-radius: 8px; border: none; background: linear-gradient(135deg, #1e4a63, #2d6e8f); color: white; font-size: 14px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
.btn-save:hover { transform: translateY(-1px); }

/* Toggle */
.toggle-list { display: flex; flex-direction: column; gap: 0; margin-bottom: 20px; }
.toggle-item { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid rgba(91,143,168,0.08); }
.toggle-item:last-child { border-bottom: none; }
.toggle-name { font-size: 14px; font-weight: 500; color: #1e4a63; margin-bottom: 2px; }
.toggle-desc { font-size: 12px; color: rgba(44,95,122,0.55); }
.toggle { width: 44px; height: 24px; border-radius: 100px; background: rgba(91,143,168,0.2); cursor: pointer; position: relative; transition: background 0.25s; flex-shrink: 0; }
.toggle.on { background: #2d6e8f; }
.toggle-knob { position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%; background: white; transition: transform 0.25s; box-shadow: 0 1px 4px rgba(0,0,0,0.2); }
.toggle.on .toggle-knob { transform: translateX(20px); }

/* Stats */
.stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 24px; }
.stat-card { border-radius: 12px; padding: 16px; text-align: center; display: flex; flex-direction: column; gap: 4px; }
.stat-card.green { background: rgba(5,150,105,0.08); border: 1px solid rgba(5,150,105,0.15); }
.stat-card.red { background: rgba(239,68,68,0.08); border: 1px solid rgba(239,68,68,0.12); }
.stat-card.yellow { background: rgba(245,158,11,0.08); border: 1px solid rgba(245,158,11,0.12); }
.stat-card.blue { background: rgba(91,143,168,0.08); border: 1px solid rgba(91,143,168,0.15); }
.sc-num { font-family: 'Cormorant Garamond', serif; font-size: 28px; font-weight: 600; color: #1e4a63; }
.sc-lbl { font-size: 11px; color: rgba(44,95,122,0.6); text-transform: uppercase; letter-spacing: 1px; }

/* RSVP list */
.rsvp-list { display: flex; flex-direction: column; gap: 10px; }
.rsvp-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: #f8fbfd; border-radius: 10px; border: 1px solid rgba(91,143,168,0.1); }
.rsvp-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #5b8fa8, #2d5570); color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; flex-shrink: 0; }
.rsvp-info { flex: 1; }
.rsvp-name { font-size: 14px; font-weight: 500; color: #1e4a63; margin-bottom: 2px; }
.rsvp-note { font-size: 12px; color: rgba(44,95,122,0.5); }
.rsvp-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.rsvp-status { padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 500; text-transform: capitalize; }
.rsvp-status.hadir { background: rgba(5,150,105,0.1); color: #059669; }
.rsvp-status.tidak_hadir { background: rgba(239,68,68,0.1); color: #dc2626; }
.rsvp-status.mungkin { background: rgba(245,158,11,0.1); color: #d97706; }
.rsvp-pax { font-size: 11px; color: rgba(44,95,122,0.5); }

/* Messages */
.msg-list { display: flex; flex-direction: column; gap: 10px; }
.msg-item { display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px; background: #f8fbfd; border-radius: 10px; border: 1px solid rgba(91,143,168,0.1); }
.msg-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #5b8fa8, #2d5570); color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; flex-shrink: 0; }
.msg-body { flex: 1; }
.msg-name { font-size: 14px; font-weight: 500; color: #1e4a63; margin-bottom: 4px; }
.msg-content { font-size: 13px; color: rgba(44,95,122,0.8); line-height: 1.5; margin-bottom: 6px; }
.msg-time { font-size: 11px; color: rgba(44,95,122,0.4); }
.msg-delete { padding: 4px 8px; border: none; background: rgba(239,68,68,0.08); color: #dc2626; border-radius: 6px; cursor: pointer; font-size: 12px; flex-shrink: 0; }
.msg-delete:hover { background: rgba(239,68,68,0.15); }

.empty-msg { text-align: center; padding: 32px; font-size: 14px; color: rgba(44,95,122,0.5); font-style: italic; }

/* Toast */
.toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: #1e4a63; color: white; padding: 12px 24px; border-radius: 100px; font-size: 14px; font-weight: 500; z-index: 9999; box-shadow: 0 8px 24px rgba(30,74,99,0.3); }
.toast-enter-active, .toast-leave-active { transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translate(-50%, 20px) scale(0.9); }

.loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 80px; gap: 12px; }
.loading-dot { width: 10px; height: 10px; border-radius: 50%; background: #5b8fa8; animation: dotPulse 1.2s infinite; }
@keyframes dotPulse { 0%,100% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.6); opacity: 1; } }

.venue-edit-card {
  background: #f8fbfd;
  border: 1px solid rgba(91,143,168,0.15);
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 16px;
}
.venue-edit-header {
  display: flex; justify-content: space-between;
  align-items: center; margin-bottom: 14px;
}
.venue-edit-header h4 {
  font-size: 14px; font-weight: 600; color: #1e4a63;
}
.btn-remove {
  padding: 5px 12px; border-radius: 6px; border: none;
  background: rgba(239,68,68,0.08); color: #dc2626;
  font-size: 12px; cursor: pointer;
}
.btn-remove:hover { background: rgba(239,68,68,0.15); }
.btn-add {
  padding: 9px 20px; border-radius: 8px;
  border: 1px dashed rgba(91,143,168,0.4);
  background: transparent; color: #5b8fa8;
  font-size: 13px; font-weight: 500; cursor: pointer;
  width: 100%; transition: all 0.2s;
}
.btn-add:hover { background: rgba(91,143,168,0.05); border-color: #5b8fa8; }


.blast-section { margin-bottom: 28px; }
.blast-title { font-size: 14px; font-weight: 600; color: #1e4a63; margin-bottom: 14px; }
.blast-btns { display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 12px; }
.blast-btn {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 20px; border-radius: 12px; border: none;
  cursor: pointer; transition: all 0.2s; flex: 1; min-width: 200px;
  font-family: 'DM Sans', sans-serif; text-align: left;
}
.blast-btn p { font-size: 14px; font-weight: 600; margin-bottom: 2px; }
.blast-sub { font-size: 11px; opacity: 0.7; font-weight: 400; }
.blast-btn span { font-size: 24px; }
.blast-btn.wa { background: rgba(37,211,102,0.1); color: #128C7E; border: 1px solid rgba(37,211,102,0.2); }
.blast-btn.wa:hover { background: rgba(37,211,102,0.18); }
.blast-btn.email { background: rgba(66,133,244,0.1); color: #1a73e8; border: 1px solid rgba(66,133,244,0.2); }
.blast-btn.email:hover { background: rgba(66,133,244,0.18); }
.blast-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.blast-result { padding: 10px 14px; border-radius: 8px; background: rgba(5,150,105,0.08); border: 1px solid rgba(5,150,105,0.15); font-size: 13px; color: #059669; }
.add-guest-form { padding: 20px; background: #f8fbfd; border-radius: 12px; border: 1px solid rgba(91,143,168,0.12); margin-bottom: 20px; }
.guest-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: #f8fbfd; border-radius: 10px; border: 1px solid rgba(91,143,168,0.1); margin-bottom: 8px; }
.guest-avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #5b8fa8, #2d5570); color: white; display: flex; align-items: center; justify-content: center; font-weight: 600; font-size: 14px; flex-shrink: 0; }
.guest-info { flex: 1; }
.guest-name { font-size: 14px; font-weight: 500; color: #1e4a63; margin-bottom: 2px; }
.guest-detail { font-size: 12px; color: rgba(44,95,122,0.5); }
.guest-right { display: flex; align-items: center; gap: 8px; }
.guest-status { font-size: 11px; padding: 3px 8px; border-radius: 100px; background: rgba(91,143,168,0.1); color: rgba(44,95,122,0.6); }
.guest-status.opened { background: rgba(5,150,105,0.1); color: #059669; }
.guest-link { padding: 4px 8px; border-radius: 6px; background: rgba(91,143,168,0.1); color: #2d5570; text-decoration: none; font-size: 13px; }
</style>

