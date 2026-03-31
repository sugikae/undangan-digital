<template>
  <div class="dashboard-page">

    <!-- Sidebar -->
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
        <router-link to="/dashboard" class="nav-item active">
          <span class="nav-icon">🏠</span> Dashboard
        </router-link>
        <a class="nav-item" @click="logout">
          <span class="nav-icon">🚪</span> Keluar
        </a>
      </nav>

      <div class="sidebar-user">
        <div class="user-avatar">{{ userInitial }}</div>
        <div class="user-info">
          <p class="user-email">{{ authStore.user?.email }}</p>
          <p class="user-role">Owner</p>
        </div>
      </div>
    </aside>

    <!-- Main content -->
    <main class="dashboard-main">

      <!-- Header -->
      <div class="dash-header">
        <div>
          <h1 class="dash-title">Dashboard</h1>
          <p class="dash-sub">Kelola semua undangan digitalmu</p>
        </div>
        <button class="btn-new" @click="showNewModal = true">
          + Buat Undangan
        </button>
      </div>

      <!-- Loading -->
      <div v-if="dashStore.isLoading" class="loading-state">
        <div class="loading-dot" />
        <p>Memuat data...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="dashStore.invitations.length === 0" class="empty-state">
        <div class="empty-icon">💌</div>
        <h3>Belum ada undangan</h3>
        <p>Buat undangan digitalmu yang pertama!</p>
        <button class="btn-new" @click="showNewModal = true">
          + Buat Undangan Pertama
        </button>
      </div>

      <!-- Invitation cards -->
      <div v-else class="inv-grid">
        <div
          v-for="inv in dashStore.invitations"
          :key="inv.id"
          class="inv-card"
        >
          <!-- Card header -->
          <div class="inv-card-header">
            <div class="inv-theme-badge">{{ inv.theme }}</div>
            <div class="inv-status" :class="{ published: inv.is_published }">
              {{ inv.is_published ? '● Live' : '○ Draft' }}
            </div>
          </div>

          <!-- Names -->
          <h3 class="inv-names">
            {{ inv.config.bride_name }} & {{ inv.config.groom_name }}
          </h3>
          <p class="inv-slug">/i/{{ inv.slug }}</p>
          <p class="inv-date">{{ formatDate(inv.event_date) }}</p>

          <!-- Stats -->
          <div class="inv-stats" v-if="dashStore.stats[inv.id]">
            <div class="stat-item">
              <span class="stat-num">{{ dashStore.stats[inv.id].total_hadir }}</span>
              <span class="stat-lbl">Hadir</span>
            </div>
            <div class="stat-item">
              <span class="stat-num">{{ dashStore.stats[inv.id].total_ucapan }}</span>
              <span class="stat-lbl">Ucapan</span>
            </div>
            <div class="stat-item">
              <span class="stat-num">{{ dashStore.stats[inv.id].total_buka }}</span>
              <span class="stat-lbl">Dibuka</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="inv-actions">
            <a :href="`/i/${inv.slug}`" target="_blank" class="action-btn btn-view">
              👁️ Preview
            </a>
            <button
              class="action-btn btn-publish"
              :class="{ unpublish: inv.is_published }"
              @click="togglePublish(inv)"
            >
              {{ inv.is_published ? '⏸ Unpublish' : '🚀 Publish' }}
            </button>
            <button class="action-btn btn-detail"
              @click="$router.push(`/dashboard/invitation/${inv.id}`)">
              ⚙️ Kelola
            </button>
          </div>
        </div>
      </div>

    </main>

    <!-- Modal Buat Undangan Baru -->
    <Transition name="modal">
      <div v-if="showNewModal" class="modal-overlay" @click.self="showNewModal = false">
        <div class="modal-box">
          <h2 class="modal-title">Buat Undangan Baru</h2>

          <div class="field">
            <label>Nama Mempelai Wanita</label>
            <input v-model="newForm.bride_name" class="form-input" placeholder="Nama mempelai wanita"/>
          </div>
          <div class="field">
            <label>Nama Mempelai Pria</label>
            <input v-model="newForm.groom_name" class="form-input" placeholder="Nama mempelai pria"/>
          </div>
          <div class="field">
            <label>Slug URL</label>
            <div class="slug-input-wrap">
              <span class="slug-prefix">/i/</span>
              <input v-model="newForm.slug" class="form-input slug-input" placeholder="nama-pasangan-2025"/>
            </div>
            <p class="field-hint">Huruf kecil, tanpa spasi, gunakan tanda -</p>
          </div>
          <div class="field">
            <label>Tanggal Pernikahan</label>
            <input v-model="newForm.event_date" type="datetime-local" class="form-input"/>
          </div>

          <div v-if="newError" class="auth-error">{{ newError }}</div>

          <div class="modal-actions">
            <button class="btn-cancel" @click="showNewModal = false">Batal</button>
            <button class="btn-create" :disabled="isCreating" @click="createInvitation">
              {{ isCreating ? 'Membuat...' : 'Buat Undangan' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { useDashboardStore } from '@/stores/dashboard.store'
import { supabase } from '@/services/supabase'
import dayjs from 'dayjs'
import 'dayjs/locale/id'
dayjs.locale('id')

const router = useRouter()
const authStore = useAuthStore()
const dashStore = useDashboardStore()

const showNewModal = ref(false)
const isCreating = ref(false)
const newError = ref('')

const newForm = reactive({
  bride_name: '',
  groom_name: '',
  slug: '',
  event_date: '',
})

const userInitial = computed(() =>
  authStore.user?.email?.charAt(0).toUpperCase() ?? 'U'
)

function formatDate(date: string) {
  return dayjs(date).format('DD MMMM YYYY')
}

async function logout() {
  await authStore.logout()
  router.push('/login')
}

async function togglePublish(inv: any) {
  await dashStore.togglePublish(inv.id, inv.is_published)
}

async function createInvitation() {
  if (!newForm.bride_name || !newForm.groom_name || !newForm.slug) {
    newError.value = 'Semua field wajib diisi'
    return
  }

  // Validasi slug
  if (!/^[a-z0-9-]+$/.test(newForm.slug)) {
    newError.value = 'Slug hanya boleh huruf kecil, angka, dan tanda -'
    return
  }

  isCreating.value = true
  newError.value = ''

  try {
    const config = {
    bride_name: newForm.bride_name,
    groom_name: newForm.groom_name,
    bride_parents: '',
    groom_parents: '',
    bride_photo: 'https://i.pravatar.cc/300?img=47',
    groom_photo: 'https://i.pravatar.cc/300?img=68',
    cover_photo: '',
    music_url: '',
    music_autoplay: false,
    countdown_enabled: true,
    rsvp_enabled: true,
    wishes_enabled: true,
    gallery_enabled: true,
    gift_enabled: true,
    qr_enabled: false,
    flower_animation: true,
    flower_color: '#a8c5d8',
    opening_animation: 'flower',
    bg_animation_stars: true,
    hero_parallax: true,
    confetti_on_rsvp: true,
    venues: [
      {
        name: 'Akad Nikah',
        location: 'Lokasi akad nikah',
        date: newForm.event_date || new Date().toISOString(),
        maps_url: 'https://maps.google.com',
      },
      {
        name: 'Resepsi',
        location: 'Lokasi resepsi',
        date: newForm.event_date || new Date().toISOString(),
        maps_url: 'https://maps.google.com',
      },
    ],
    bank_accounts: [
      { bank: 'BCA', number: '0000000000', name: newForm.groom_name },
      { bank: 'Mandiri', number: '0000000000', name: newForm.bride_name },
    ],
    love_story: [
      { year: '2020', title: 'Pertama Bertemu', description: 'Ceritakan bagaimana kalian pertama kali bertemu.' },
      { year: '2021', title: 'Mulai Dekat', description: 'Ceritakan perjalanan kedekatan kalian.' },
      { year: '2023', title: 'Resmi Berpacaran', description: 'Momen spesial saat kalian resmi bersama.' },
      { year: new Date().getFullYear().toString(), title: 'Menuju Pelaminan', description: 'Dengan restu keluarga, melangkah ke jenjang pernikahan.' },
    ],
  }

    const { data, error } = await supabase
      .from('invitations')
      .insert({
        user_id: authStore.user!.id,
        slug: newForm.slug,
        theme: 'floral',
        is_published: false,
        event_date: newForm.event_date || null,
        config,
      })
      .select()
      .single()

    if (error) {
      newError.value = error.message.includes('unique')
        ? 'Slug sudah dipakai, coba yang lain'
        : error.message
      return
    }

    showNewModal.value = false
    await dashStore.loadInvitations()
    router.push(`/dashboard/invitation/${data.id}`)
  } finally {
    isCreating.value = false
  }
}

onMounted(async () => {
  await dashStore.loadInvitations()
  // Load stats untuk setiap undangan
  for (const inv of dashStore.invitations) {
    dashStore.loadStats(inv.id)
  }
})
</script>

<style scoped>
.dashboard-page {
  display: flex; min-height: 100vh;
  background: #f0f7fc;
  font-family: 'DM Sans', sans-serif;
}

/* Sidebar */
.sidebar {
  width: 240px; flex-shrink: 0;
  background: linear-gradient(180deg, #1e4a63 0%, #2d6e8f 100%);
  display: flex; flex-direction: column;
  padding: 24px 16px;
  position: fixed; top: 0; left: 0; bottom: 0;
  z-index: 10;
}

.sidebar-brand {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 8px 24px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  margin-bottom: 24px;
}
.sidebar-brand span {
  font-family: 'Cormorant Garamond', serif;
  font-size: 16px; font-weight: 600; color: rgba(255,255,255,0.9);
}

.sidebar-nav { flex: 1; display: flex; flex-direction: column; gap: 4px; }

.nav-item {
  display: flex; align-items: center; gap: 10px;
  padding: 10px 12px; border-radius: 10px;
  color: rgba(255,255,255,0.65); font-size: 14px;
  text-decoration: none; cursor: pointer;
  transition: all 0.2s;
}
.nav-item:hover, .nav-item.active {
  background: rgba(255,255,255,0.12);
  color: white;
}
.nav-icon { font-size: 16px; }

.sidebar-user {
  display: flex; align-items: center; gap: 10px;
  padding: 16px 8px 8px;
  border-top: 1px solid rgba(255,255,255,0.1);
}
.user-avatar {
  width: 36px; height: 36px; border-radius: 50%;
  background: rgba(255,255,255,0.2);
  display: flex; align-items: center; justify-content: center;
  color: white; font-weight: 600; font-size: 14px; flex-shrink: 0;
}
.user-email { font-size: 12px; color: rgba(255,255,255,0.8); margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 150px; }
.user-role { font-size: 11px; color: rgba(255,255,255,0.4); }

/* Main */
.dashboard-main {
  flex: 1; margin-left: 240px;
  padding: 32px; max-width: calc(100vw - 240px);
}

.dash-header {
  display: flex; justify-content: space-between; align-items: flex-start;
  margin-bottom: 32px;
}
.dash-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 32px; font-weight: 600; color: #1e4a63; margin-bottom: 4px;
}
.dash-sub { font-size: 14px; color: rgba(44,95,122,0.6); }

.btn-new {
  padding: 10px 22px; border-radius: 100px; border: none;
  background: linear-gradient(135deg, #1e4a63, #2d6e8f);
  color: white; font-family: 'DM Sans', sans-serif;
  font-size: 14px; font-weight: 500; cursor: pointer;
  transition: all 0.2s; box-shadow: 0 4px 14px rgba(30,74,99,0.25);
}
.btn-new:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(30,74,99,0.35); }

/* Loading & empty */
.loading-state, .empty-state {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; padding: 80px 24px; gap: 12px; text-align: center;
}
.loading-dot {
  width: 10px; height: 10px; border-radius: 50%;
  background: #5b8fa8; animation: dotPulse 1.2s infinite;
}
.empty-icon { font-size: 48px; margin-bottom: 8px; }
.empty-state h3 { font-family: 'Cormorant Garamond', serif; font-size: 24px; color: #1e4a63; }
.empty-state p { font-size: 14px; color: rgba(44,95,122,0.6); }

/* Invitation grid */
.inv-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.inv-card {
  background: white; border-radius: 16px;
  border: 1px solid rgba(91,143,168,0.15);
  padding: 20px; transition: all 0.25s;
  box-shadow: 0 2px 12px rgba(91,143,168,0.08);
}
.inv-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(91,143,168,0.15); }

.inv-card-header {
  display: flex; justify-content: space-between;
  align-items: center; margin-bottom: 12px;
}
.inv-theme-badge {
  padding: 3px 10px; border-radius: 100px;
  background: rgba(91,143,168,0.1); color: #5b8fa8;
  font-size: 11px; font-weight: 500; text-transform: capitalize;
}
.inv-status { font-size: 12px; color: rgba(44,95,122,0.5); font-weight: 500; }
.inv-status.published { color: #059669; }

.inv-names {
  font-family: 'Cormorant Garamond', serif;
  font-size: 20px; font-style: italic; font-weight: 600;
  color: #1e4a63; margin-bottom: 4px;
}
.inv-slug { font-size: 12px; color: rgba(44,95,122,0.5); margin-bottom: 4px; font-family: 'DM Mono', monospace; }
.inv-date { font-size: 13px; color: rgba(44,95,122,0.7); margin-bottom: 16px; }

.inv-stats {
  display: flex; gap: 0;
  border: 1px solid rgba(91,143,168,0.1);
  border-radius: 10px; overflow: hidden; margin-bottom: 16px;
}
.stat-item {
  flex: 1; text-align: center; padding: 10px 8px;
  border-right: 1px solid rgba(91,143,168,0.1);
}
.stat-item:last-child { border-right: none; }
.stat-num { display: block; font-family: 'Cormorant Garamond', serif; font-size: 22px; font-weight: 600; color: #1e4a63; }
.stat-lbl { font-size: 10px; color: rgba(44,95,122,0.5); text-transform: uppercase; letter-spacing: 1px; }

.inv-actions { display: flex; gap: 8px; flex-wrap: wrap; }
.action-btn {
  padding: 7px 14px; border-radius: 8px; border: none;
  font-size: 12px; font-weight: 500; cursor: pointer;
  transition: all 0.2s; text-decoration: none;
  display: inline-flex; align-items: center; gap: 4px;
}
.btn-view { background: rgba(91,143,168,0.1); color: #2d5570; }
.btn-view:hover { background: rgba(91,143,168,0.2); }
.btn-publish { background: rgba(5,150,105,0.1); color: #059669; }
.btn-publish:hover { background: rgba(5,150,105,0.2); }
.btn-publish.unpublish { background: rgba(239,68,68,0.08); color: #dc2626; }
.btn-publish.unpublish:hover { background: rgba(239,68,68,0.15); }
.btn-detail { background: rgba(201,169,110,0.1); color: #8b6914; }
.btn-detail:hover { background: rgba(201,169,110,0.2); }

/* Modal */
.modal-overlay {
  position: fixed; inset: 0; z-index: 1000;
  background: rgba(10,30,50,0.5); backdrop-filter: blur(4px);
  display: flex; align-items: center; justify-content: center; padding: 24px;
}
.modal-box {
  background: white; border-radius: 20px; padding: 32px;
  width: 100%; max-width: 480px;
  box-shadow: 0 20px 60px rgba(10,30,50,0.3);
  display: flex; flex-direction: column; gap: 16px;
}
.modal-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 24px; font-weight: 600; color: #1e4a63; margin-bottom: 4px;
}
.field { display: flex; flex-direction: column; gap: 6px; }
.field label { font-size: 12px; font-weight: 500; color: rgba(44,95,122,0.7); }
.form-input {
  padding: 10px 14px; border: 1px solid rgba(91,143,168,0.25);
  border-radius: 8px; font-size: 14px; color: #1e4a63;
  outline: none; transition: border-color 0.2s; font-family: 'DM Sans', sans-serif;
}
.form-input:focus { border-color: #5b8fa8; }
.slug-input-wrap { display: flex; align-items: center; border: 1px solid rgba(91,143,168,0.25); border-radius: 8px; overflow: hidden; }
.slug-prefix { padding: 10px 12px; background: rgba(91,143,168,0.08); color: rgba(44,95,122,0.5); font-size: 13px; font-family: 'DM Mono', monospace; border-right: 1px solid rgba(91,143,168,0.2); white-space: nowrap; }
.slug-input { border: none; border-radius: 0; flex: 1; }
.slug-input:focus { border-color: transparent; }
.field-hint { font-size: 11px; color: rgba(44,95,122,0.45); margin-top: 2px; }
.auth-error { padding: 10px 14px; border-radius: 8px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); font-size: 13px; color: #dc2626; }
.modal-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 8px; }
.btn-cancel { padding: 10px 20px; border-radius: 8px; border: 1px solid rgba(91,143,168,0.25); background: white; color: rgba(44,95,122,0.7); font-size: 14px; cursor: pointer; }
.btn-create { padding: 10px 24px; border-radius: 8px; border: none; background: linear-gradient(135deg, #1e4a63, #2d6e8f); color: white; font-size: 14px; font-weight: 500; cursor: pointer; }
.btn-create:disabled { opacity: 0.5; cursor: not-allowed; }

/* Modal transition */
.modal-enter-active, .modal-leave-active { transition: all 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.95); }

@keyframes dotPulse {
  0%,100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.6); opacity: 1; }
}
</style>
