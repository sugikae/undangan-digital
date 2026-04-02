<template>
  <div class="catalog-page">
    <!-- Animated background -->
    <canvas ref="bgCanvas" class="catalog-bg-canvas" />

    <!-- Header -->
    <header class="catalog-header" ref="headerRef">
      <div class="header-ornament">
        <svg width="240" height="36" viewBox="0 0 240 36" fill="none">
          <path d="M10 18 Q60 4 120 18 Q180 32 230 18" stroke="currentColor" stroke-width="0.8" opacity="0.5"/>
          <path d="M10 18 Q60 32 120 18 Q180 4 230 18" stroke="currentColor" stroke-width="0.5" opacity="0.35"/>
          <circle cx="120" cy="18" r="3.5" fill="currentColor" opacity="0.5"/>
          <circle cx="10" cy="18" r="2" fill="currentColor" opacity="0.3"/>
          <circle cx="230" cy="18" r="2" fill="currentColor" opacity="0.3"/>
        </svg>
      </div>
      <p class="header-eyebrow">Portofolio & Katalog</p>
      <h1 class="header-title">Undangan Digital</h1>
      <p class="header-sub">Pilih model undangan impianmu 💌</p>
      <div class="header-stats">
        <div class="stat"><span>3</span><p>Model Tersedia</p></div>
        <div class="stat-divider"/>
        <div class="stat"><span>12+</span><p>Fitur Unggulan</p></div>
        <div class="stat-divider"/>
        <div class="stat"><span>100%</span><p>Mobile Friendly</p></div>
      </div>
    </header>

    <!-- Model undangan -->
    <section class="models-section">
      <p class="section-eyebrow">✨ Pilih Model Undangan</p>

      <div class="models-list">
        <div
          v-for="(model, i) in catalogModels"
          :key="model.id"
          class="model-row"
          :class="{ reverse: i % 2 !== 0 }"
        >
          <!-- Preview card -->
          <div class="model-preview-wrap">
            <div class="model-phone-frame">
              <div class="phone-notch" />
              <div class="phone-screen" :style="{
                  background: `linear-gradient(160deg,
                    ${lighten(model.color, 30)}dd 0%,
                    ${model.color}88 35%,
                    ${lighten(model.color, 50)}ee 65%,
                    ${lighten(model.color, 20)}bb 100%)`
                }">
                <!-- Mini preview content -->
                <div class="mini-hero">
                  <div class="mini-petal-1" :style="{ background: model.color }" />
                  <div class="mini-petal-2" :style="{ background: model.color }" />
                  <div class="mini-petal-3" :style="{ background: model.color }" />
                  <p class="mini-label">The Wedding of</p>
                  <p class="mini-bride" :style="{ color: darkenColor(model.color) }">{{ model.brideName }}</p>
                  <p class="mini-amp" :style="{ color: model.color }">{{ '&' }}</p>
                  <p class="mini-groom" :style="{ color: darkenColor(model.color) }">{{ model.groomName }}</p>
                  <div class="mini-divider" :style="{ background: model.color }"/>
                  <p class="mini-date">{{ model.dateStr }}</p>
                </div>
                <!-- Mini bottom ornament -->
                <div class="mini-flowers">
                  <div v-for="j in 5" :key="j" class="mini-flower"
                    :style="{ background: model.color, left: `${j * 18}%`, animationDelay: `${j * 0.3}s` }"/>
                </div>
              </div>
            </div>
            <!-- Color dot -->
            <div class="color-badge" :style="{ background: model.color }">
              <span>{{ model.colorName }}</span>
            </div>
          </div>

          <!-- Info -->
          <div class="model-info">
            <div class="model-number">{{ String(i + 1).padStart(2, '0') }}</div>
            <h2 class="model-name">{{ model.name }}</h2>
            <p class="model-desc">{{ model.description }}</p>

            <div class="model-tags">
              <span v-for="tag in model.tags" :key="tag" class="model-tag"
                :style="{ borderColor: model.color, color: model.color }">
                {{ tag }}
              </span>
            </div>

            <!-- Fitur highlight -->
            <div class="model-features">
              <div class="mf-item" v-for="feat in model.highlights" :key="feat">
                <span class="mf-dot" :style="{ background: model.color }"/>
                {{ feat }}
              </div>
            </div>

            <!-- CTA buttons -->
            <div class="model-actions">
              <a
                :href="`/i/${model.preview_slug}`"
                target="_blank"
                class="btn-preview-live"
                :style="{ background: `linear-gradient(135deg, ${darkenColor(model.color)}, ${model.color})` }"
              >
                👁️ Lihat Demo Live
              </a>

              <a :href="waLink(model)" target="_blank" class="btn-order">
                📱 Pesan Model Ini
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Fitur section -->
    <section class="features-section">
      <p class="section-eyebrow">⚙️ Semua Fitur Sudah Termasuk</p>
      <div class="features-grid">
        <div class="feat-card" v-for="feat in allFeatures" :key="feat.name">
          <span class="feat-icon">{{ feat.icon }}</span>
          <p class="feat-name">{{ feat.name }}</p>
          <p class="feat-desc">{{ feat.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section class="pricing-section">
      <p class="section-eyebrow">💰 Harga Terjangkau</p>
      <div class="pricing-grid">
        <div class="price-card">
          <div class="price-top">
            <p class="price-name">Basic</p>
            <p class="price-amount">Rp 75.000</p>
            <p class="price-period">sekali bayar • aktif 6 bulan</p>
          </div>
          <ul class="price-features">
            <li v-for="f in basicFeatures" :key="f">✓ {{ f }}</li>
          </ul>
          <a :href="waOrderLink" target="_blank" class="price-cta">Pesan Sekarang</a>
        </div>

        <div class="price-card featured">
          <div class="price-badge-top">⭐ Terpopuler</div>
          <div class="price-top">
            <p class="price-name">Premium</p>
            <div class="price-discount-wrap">
              <p class="price-amount">Rp 120.000</p>
              <p class="price-original">Rp 150.000</p>
            </div>
            <p class="price-period">sekali bayar • aktif 1 tahun</p>
            <div class="price-save-badge">Hemat Rp 30.000!</div>
          </div>
          <ul class="price-features">
            <li v-for="f in premiumFeatures" :key="f">
              {{ f.includes('*') ? '' : '✓' }} {{ f }}
            </li>
            <li class="price-note">*request custom atas pertimbangan admin</li>
          </ul>
          <a :href="waOrderLink" target="_blank" class="price-cta featured-cta">Pesan Sekarang</a>
        </div>
      </div>
    </section>

    <!-- Cara pesan -->
    <section class="howto-section">
      <p class="section-eyebrow">📋 Cara Pesan</p>
      <div class="steps-list">
        <div class="step-item" v-for="(step, i) in orderSteps" :key="i">
          <div class="step-num">{{ i + 1 }}</div>
          <div class="step-line" v-if="i < orderSteps.length - 1" />
          <div class="step-info">
            <p class="step-title">{{ step.title }}</p>
            <p class="step-desc">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer CTA -->
    <footer class="catalog-footer">
      <div class="footer-ornament">
        <svg width="200" height="32" viewBox="0 0 200 32" fill="none">
          <path d="M10 16 Q50 4 100 16 Q150 28 190 16" stroke="#5b8fa8" stroke-width="0.8" opacity="0.4"/>
          <path d="M10 16 Q50 28 100 16 Q150 4 190 16" stroke="#5b8fa8" stroke-width="0.5" opacity="0.3"/>
          <circle cx="100" cy="16" r="3" fill="#5b8fa8" opacity="0.45"/>
        </svg>
      </div>
      <p class="footer-text">Wujudkan undangan impianmu sekarang 🌸</p>
      <a :href="waOrderLink" target="_blank" class="footer-wa-btn">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Hubungi Kami via WhatsApp
      </a>
    </footer>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { catalogModels as rawModels } from '@/data/catalog.data'
import dayjs from 'dayjs'
import 'dayjs/locale/id'
dayjs.locale('id')

// Ganti dengan nomor WA kamu
const WA_NUMBER = '6285156363746'
const waOrderLink = `https://wa.me/${WA_NUMBER}?text=Halo%2C%20saya%20ingin%20pesan%20undangan%20digital`

function waLink(model: any) {
  return `https://wa.me/${WA_NUMBER}?text=Halo%2C%20saya%20ingin%20pesan%20undangan%20digital%20model%20${encodeURIComponent(model.name)}`
}

// Enhance catalog models dengan data tambahan
const catalogModels = computed(() => rawModels.map(m => ({
  ...m,
  brideName: m.id === 'model-1' ? 'Siti Rahayu' : m.id === 'model-2' ? 'Aulia Putri' : 'Nadia Safira',
  groomName: m.id === 'model-1' ? 'Ahmad Fauzi' : m.id === 'model-2' ? 'Rizky Pratama' : 'Dimas Arya',
  dateStr: m.id === 'model-1' ? '12 Desember 2025' : m.id === 'model-2' ? '8 November 2025' : '14 Februari 2026',
  colorName: m.id === 'model-1' ? 'Dusty Blue' : m.id === 'model-2' ? 'Rose Gold' : 'Sage Green',
  highlights: [
    `Animasi ${m.opening === 'envelope' ? 'buka amplop 💌' : 'bunga melayang 🌸'}`,
    'RSVP & Ucapan digital',
    'Kisah cinta timeline',
    'Kado digital',
  ],
})))

const allFeatures = [
  { icon: '🕐', name: 'Countdown Timer', desc: 'Hitung mundur real-time' },
  { icon: '✅', name: 'RSVP Digital', desc: 'Konfirmasi kehadiran online' },
  { icon: '💬', name: 'Ucapan & Doa', desc: 'Live wall ucapan tamu' },
  { icon: '📸', name: 'Galeri Foto', desc: 'Album lightbox interaktif' },
  { icon: '🗺️', name: 'Google Maps', desc: 'Navigasi langsung ke venue' },
  { icon: '🎵', name: 'Musik Latar', desc: 'Lagu romantis background' },
  { icon: '💰', name: 'Kado Digital', desc: 'Info rekening & konfirmasi' },
  { icon: '💕', name: 'Kisah Cinta', desc: 'Timeline perjalanan cinta' },
  { icon: '📅', name: 'Add to Calendar', desc: 'Simpan ke Google Calendar' },
  { icon: '🌸', name: 'Animasi Keren', desc: 'Bunga, amplop, bintang, dll' },
  { icon: '📱', name: 'Mobile Friendly', desc: 'Sempurna di semua device' },
  { icon: '🔗', name: 'Link Personal', desc: 'Link unik per tamu' },
]

const basicFeatures = [
  'Semua fitur basic',
  'Musik latar default dari kami',
  'Animasi standar (bunga melayang)',
  'Warna template default',
  'Galeri minimal 6 foto',
  'RSVP & Ucapan tamu',
  'Link personal per tamu',
  'Google Maps & Kalender',
  'Aktif 6 bulan',
  'Revisi 1x',
]

//'🔗 QR Check-in tamu',
//'📊 Dashboard kelola mandiri',
const premiumFeatures = [
  'Semua fitur Basic Plus',
  '🎵 Musik latar bebas (pilihan sendiri)',
  '🎨 Warna template custom',
  '✨ Semua animasi tersedia (10 pilihan)',
  '📸 Galeri foto unlimited',
  '💕 Kisah cinta timeline',
  '💍 Kado digital lengkap',
  '✅ Revisi 3x',
  '📅 Aktif 1 tahun',
  '⭐ Bisa request custom*',
  '🚀 Prioritas pengerjaan',
]

const orderSteps = [
  { title: 'Pilih Model', desc: 'Pilih model undangan yang sesuai selera dan klik "Pesan Model Ini"' },
  { title: 'Isi Data', desc: 'Kirim data mempelai, venue, foto, dan detail lainnya via WhatsApp' },
  { title: 'Proses 24 Jam', desc: 'Undangan digital kamu akan selesai dalam 1x24 jam setelah data lengkap' },
  { title: 'Review & Revisi', desc: 'Cek undangan, minta revisi jika diperlukan sesuai paket' },
  { title: 'Siap Sebar!', desc: 'Undangan siap disebarkan ke semua tamu dengan link personal' },
]

function darkenColor(hex: string): string {
  try {
    const r = Math.max(0, parseInt(hex.slice(1,3),16) - 50)
    const g = Math.max(0, parseInt(hex.slice(3,5),16) - 50)
    const b = Math.max(0, parseInt(hex.slice(5,7),16) - 50)
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`
  } catch { return '#1e4a63' }
}

// Background canvas animation
const bgCanvas = ref<HTMLCanvasElement>()
let animFrame: number
let particles: any[] = []

function initBg() {
  const canvas = bgCanvas.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')!
  const resize = () => { canvas.width = window.innerWidth; canvas.height = document.body.scrollHeight }
  resize()
  window.addEventListener('resize', resize)

  const colors = ['#92bdd4','#b0cfe0','#ffffff','#c8dde8','#d4a574','#8fad9e','#e8d5b0']
  particles = Array.from({ length: 80 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: 3 + Math.random() * 10,
    speedY: 0.15 + Math.random() * 0.5,
    speedX: (Math.random() - 0.5) * 0.4,
    opacity: 0.06 + Math.random() * 0.18,
    wobble: Math.random() * Math.PI * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.025,
    type: Math.floor(Math.random() * 3),
  }))

  // Stars
  const stars = Array.from({ length: 60 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: 0.8 + Math.random() * 2.5,
    maxOp: 0.08 + Math.random() * 0.18,
    opacity: 0,
    phase: Math.random() * Math.PI * 2,
    speed: 0.015 + Math.random() * 0.02,
    type: Math.floor(Math.random() * 2),
  }))

  function loop() {
    ctx.clearRect(0, 0, canvas!.width, canvas!.height)

    // Draw stars
    stars.forEach(s => {
      s.phase += s.speed
      s.opacity = s.maxOp * Math.abs(Math.sin(s.phase))
      ctx.save()
      ctx.globalAlpha = s.opacity
      ctx.translate(s.x, s.y)
      if (s.type === 0) {
        const g = ctx.createRadialGradient(0,0,0,0,0,s.size*2.5)
        g.addColorStop(0, 'rgba(255,255,255,0.9)')
        g.addColorStop(1, 'rgba(200,228,240,0)')
        ctx.beginPath(); ctx.arc(0,0,s.size*2.5,0,Math.PI*2)
        ctx.fillStyle = g; ctx.fill()
      } else {
        const sv = s.size*1.8
        ctx.beginPath(); ctx.moveTo(0,-sv); ctx.lineTo(0,sv)
        ctx.moveTo(-sv,0); ctx.lineTo(sv,0)
        ctx.strokeStyle = 'rgba(255,255,255,0.6)'; ctx.lineWidth = 0.7; ctx.stroke()
      }
      ctx.restore()
    })

    // Draw petals
    particles.forEach(p => {
      p.wobble += 0.018
      p.x += p.speedX + Math.sin(p.wobble) * 0.6
      p.y -= p.speedY
      p.rotation += p.rotSpeed
      if (p.y < -20) { p.y = canvas!.height + 20; p.x = Math.random() * canvas!.width }

      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation)
      ctx.globalAlpha = p.opacity

      if (p.type === 0) {
        ctx.beginPath()
        ctx.moveTo(0, -p.size*.5)
        ctx.bezierCurveTo(p.size*.6,-p.size*.3, p.size*.6,p.size*.4, 0,p.size*.5)
        ctx.bezierCurveTo(-p.size*.6,p.size*.4, -p.size*.6,-p.size*.3, 0,-p.size*.5)
        ctx.fillStyle = p.color; ctx.fill()
      } else if (p.type === 1) {
        ctx.beginPath(); ctx.arc(0,0,p.size*.4,0,Math.PI*2)
        ctx.fillStyle = p.color; ctx.fill()
      } else {
        ctx.beginPath()
        ctx.ellipse(0, 0, p.size*.3, p.size*.55, 0, 0, Math.PI*2)
        ctx.fillStyle = p.color; ctx.fill()
      }
      ctx.restore()
    })

    animFrame = requestAnimationFrame(loop)
  }
  loop()
}

function lighten(hex: string, amt: number): string {
  try {
    const r = Math.min(255, parseInt(hex.slice(1,3),16) + amt)
    const g = Math.min(255, parseInt(hex.slice(3,5),16) + amt)
    const b = Math.min(255, parseInt(hex.slice(5,7),16) + amt)
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`
  } catch { return hex }
}

onMounted(() => { setTimeout(initBg, 100) })
onUnmounted(() => cancelAnimationFrame(animFrame))
</script>

<style scoped>
.catalog-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #c8dde8 0%, #daeef8 20%, #e8f4fa 50%, #daeef8 80%, #c8dde8 100%);
  font-family: 'DM Sans', sans-serif;
  position: relative; overflow: hidden;
}

.catalog-bg-canvas {
  position: fixed; inset: 0;
  pointer-events: none; z-index: 0;
  width: 100%; height: 100%;
}

/* Header */
.catalog-header {
  position: relative; z-index: 1;
  text-align: center; padding: 64px 24px 48px;
}
.header-ornament { color: #5b8fa8; margin-bottom: 20px; }
.header-eyebrow {
  font-family: 'Cormorant Garamond', serif;
  font-size: 11px; letter-spacing: 5px; text-transform: uppercase;
  color: rgba(44,95,122,0.6); margin-bottom: 12px;
}
.header-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(36px, 8vw, 64px); font-style: italic; font-weight: 300;
  color: #1e4a63; line-height: 1; margin-bottom: 12px;
}
.header-sub {
  font-family: 'Cormorant Garamond', serif;
  font-size: 18px; font-style: italic; color: rgba(44,95,122,0.65);
  margin-bottom: 36px;
}
.header-stats {
  display: inline-flex; align-items: center; gap: 28px;
  background: rgba(255,255,255,0.6); backdrop-filter: blur(10px);
  border: 1px solid rgba(91,143,168,0.2); border-radius: 100px;
  padding: 14px 32px;
}
.stat { text-align: center; }
.stat span { display: block; font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 600; color: #1e4a63; }
.stat p { font-size: 11px; color: rgba(44,95,122,0.6); margin-top: 2px; }
.stat-divider { width: 1px; height: 32px; background: rgba(91,143,168,0.2); }

/* Section */
.models-section, .features-section, .pricing-section, .howto-section {
  position: relative; z-index: 1;
  max-width: 1000px; margin: 0 auto; padding: 48px 24px;
}
.section-eyebrow {
  font-family: 'Cormorant Garamond', serif;
  font-size: 11px; letter-spacing: 5px; text-transform: uppercase;
  color: rgba(44,95,122,0.55); text-align: center; margin-bottom: 40px;
}

/* Model rows */
.models-list { display: flex; flex-direction: column; gap: 80px; }

.model-row {
  display: grid; grid-template-columns: 1fr 1fr; gap: 48px;
  align-items: center;
}
.model-row.reverse { direction: rtl; }
.model-row.reverse > * { direction: ltr; }

@media(max-width: 768px) {
  .model-row, .model-row.reverse { grid-template-columns: 1fr; direction: ltr; }
  .model-row.reverse > * { direction: ltr; }
}

/* Phone frame */
.model-preview-wrap { position: relative; display: flex; justify-content: center; }

.model-phone-frame {
  width: 220px; height: 440px;
  background: #1a1a2e; border-radius: 36px;
  padding: 8px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.1);
  position: relative;
}
.phone-notch {
  width: 80px; height: 22px; background: #1a1a2e;
  border-radius: 0 0 16px 16px; position: absolute;
  top: 8px; left: 50%; transform: translateX(-50%); z-index: 2;
}
.phone-screen {
  width: 100%; height: 100%; border-radius: 30px;
  overflow: hidden; position: relative;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
}

/* Mini hero in phone */
.mini-hero {
  text-align: center; padding: 40px 16px 16px; position: relative; z-index: 1; flex: 1;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
}
.mini-petal-1, .mini-petal-2, .mini-petal-3 {
  position: absolute; border-radius: 50% 0;
  opacity: 0.15; animation: floatPetal 4s ease-in-out infinite;
}
.mini-petal-1 { width:20px; height:30px; top:20px; left:20px; animation-delay:0s; }
.mini-petal-2 { width:15px; height:22px; top:40px; right:24px; animation-delay:1s; }
.mini-petal-3 { width:18px; height:26px; top:10px; right:40px; animation-delay:2s; }

.mini-label { font-family:'Cormorant Garamond',serif; font-size:8px; letter-spacing:2px; color:rgba(44,95,122,0.6); text-transform:uppercase; margin-bottom:4px; }
.mini-bride, .mini-groom { font-family:'Cormorant Garamond',serif; font-size:18px; font-style:italic; font-weight:300; color:#1e4a63; line-height:1; }
.mini-amp { font-family:'Cormorant Garamond',serif; font-size:13px; color:#5b8fa8; margin:2px 0; }
.mini-divider { height:1px; width:60px; margin:8px auto; opacity:0.3; }
.mini-date { font-family:'Cormorant Garamond',serif; font-size:9px; color:rgba(44,95,122,0.7); letter-spacing:1px; }

/* Mini flowers at bottom */
.mini-flowers {
  position: absolute; bottom: 0; left: 0; right: 0;
  height: 50px; overflow: hidden;
}
.mini-flower {
  position: absolute; bottom: 0;
  width: 14px; height: 20px; border-radius: 50% 50% 0 0;
  opacity: 0.35; animation: floatUp 3s ease-in-out infinite;
}

/* Color badge */
.color-badge {
  position: absolute; bottom: -12px; right: -12px;
  width: 52px; height: 52px; border-radius: 50%;
  border: 3px solid white; display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}
.color-badge span {
  position: absolute; bottom: -22px; right: 0; left: -20px;
  font-size: 9px; color: rgba(44,95,122,0.5); white-space: nowrap; text-align: center;
}

/* Model info */
.model-number {
  font-family: 'Cormorant Garamond', serif;
  font-size: 64px; font-weight: 300; color: rgba(91,143,168,0.15);
  line-height: 1; margin-bottom: -16px;
}
.model-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: 32px; font-style: italic; font-weight: 600;
  color: #1e4a63; margin-bottom: 12px;
}
.model-desc {
  font-size: 14px; color: rgba(44,95,122,0.7);
  line-height: 1.7; margin-bottom: 16px;
}
.model-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
.model-tag { padding: 4px 12px; border-radius: 100px; border: 1px solid; font-size: 12px; font-weight: 500; }

.model-features { display: flex; flex-direction: column; gap: 6px; margin-bottom: 24px; }
.mf-item { display: flex; align-items: center; gap: 10px; font-size: 13px; color: rgba(44,95,122,0.8); }
.mf-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }

.model-actions { display: flex; gap: 10px; flex-wrap: wrap; }
.btn-preview-live {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 11px 22px; border-radius: 100px;
  color: white; text-decoration: none; font-size: 14px; font-weight: 600;
  transition: all 0.3s; letter-spacing: 0.5px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.2);
}
.btn-preview-live:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(0,0,0,0.25); }
.btn-order {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 11px 22px; border-radius: 100px;
  border: 1px solid rgba(91,143,168,0.35);
  background: rgba(255,255,255,0.7); color: #2d5570;
  text-decoration: none; font-size: 14px; font-weight: 500;
  transition: all 0.2s; backdrop-filter: blur(8px);
}
.btn-order:hover { background: rgba(255,255,255,0.9); border-color: #5b8fa8; }

/* Features grid */
.features-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px;
}
.feat-card {
  background: rgba(255,255,255,0.65); backdrop-filter: blur(8px);
  border: 1px solid rgba(91,143,168,0.15); border-radius: 14px;
  padding: 16px 18px; transition: all 0.2s;
}
.feat-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(91,143,168,0.12); }
.feat-icon { font-size: 22px; margin-bottom: 8px; display: block; }
.feat-name { font-size: 13px; font-weight: 600; color: #1e4a63; margin-bottom: 3px; }
.feat-desc { font-size: 11px; color: rgba(44,95,122,0.6); line-height: 1.4; }

/* Pricing */
.pricing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; max-width: 700px; margin: 0 auto; }
@media(max-width:560px) { .pricing-grid { grid-template-columns: 1fr; } }

.price-card {
  background: rgba(255,255,255,0.7); backdrop-filter: blur(12px);
  border: 1px solid rgba(91,143,168,0.2); border-radius: 24px;
  padding: 28px 24px; position: relative;
}
.price-card.featured {
  border-color: rgba(201,169,110,0.4);
  background: rgba(255,252,245,0.85);
  box-shadow: 0 8px 32px rgba(201,169,110,0.15);
}
.price-badge-top {
  position: absolute; top: -12px; left: 50%; transform: translateX(-50%);
  background: linear-gradient(135deg, #8b6914, #c9a96e); color: white;
  padding: 4px 16px; border-radius: 100px; font-size: 12px; font-weight: 600;
  white-space: nowrap;
}
.price-top { text-align: center; margin-bottom: 20px; }
.price-name { font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: rgba(44,95,122,0.6); margin-bottom: 8px; }
.price-amount { font-family: 'Cormorant Garamond', serif; font-size: 36px; font-weight: 600; color: #1e4a63; }
.price-period { font-size: 12px; color: rgba(44,95,122,0.5); margin-top: 2px; }
.price-features { list-style: none; display: flex; flex-direction: column; gap: 8px; margin-bottom: 24px; }
.price-features li { font-size: 13px; color: rgba(44,95,122,0.8); }
.price-cta {
  display: block; text-align: center; padding: 12px;
  border-radius: 100px; background: #2d5570;
  color: white; text-decoration: none; font-size: 14px; font-weight: 500;
  transition: all 0.2s;
}
.price-cta:hover { background: #1e4a63; }
.featured-cta { background: linear-gradient(135deg, #8b6914, #c9a96e); }
.featured-cta:hover { background: linear-gradient(135deg, #6b4f10, #a8884a); }

/* How to order */
.steps-list {
  display: flex; gap: 0; flex-wrap: wrap;
  justify-content: center; position: relative;
}
.step-item {
  display: flex; flex-direction: column; align-items: center;
  text-align: center; flex: 1; min-width: 140px; max-width: 180px;
  position: relative; padding: 0 8px;
}
.step-num {
  width: 44px; height: 44px; border-radius: 50%;
  background: linear-gradient(135deg, #2d5570, #5b8fa8);
  color: white; font-family: 'Cormorant Garamond', serif;
  font-size: 20px; font-weight: 600;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 12px; flex-shrink: 0; position: relative; z-index: 1;
}
.step-line {
  position: absolute; top: 22px; left: calc(50% + 22px);
  right: calc(-50% + 22px); height: 1px;
  background: rgba(91,143,168,0.25);
}
.step-title { font-size: 13px; font-weight: 600; color: #1e4a63; margin-bottom: 4px; }
.step-desc { font-size: 11px; color: rgba(44,95,122,0.6); line-height: 1.4; }

/* Footer */
.catalog-footer {
  position: relative; z-index: 1; text-align: center; padding: 48px 24px 64px;
}
.footer-ornament { color: #5b8fa8; margin-bottom: 20px; }
.footer-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 18px; font-style: italic; color: rgba(44,95,122,0.7);
  margin-bottom: 24px;
}
.footer-wa-btn {
  display: inline-flex; align-items: center; gap: 10px;
  padding: 16px 36px; border-radius: 100px;
  background: #25D366; color: white; text-decoration: none;
  font-size: 16px; font-weight: 600;
  box-shadow: 0 8px 28px rgba(37,211,102,0.35);
  transition: all 0.3s;
}
.footer-wa-btn:hover { transform: translateY(-3px); box-shadow: 0 14px 36px rgba(37,211,102,0.45); }

@keyframes floatPetal {
  0%,100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(10deg); }
}
@keyframes floatUp {
  0%,100% { transform: translateY(0); opacity: 0.35; }
  50% { transform: translateY(-8px); opacity: 0.5; }
}

.price-discount-wrap { display: flex; align-items: baseline; gap: 10px; justify-content: center; }
.price-original {
  font-size: 16px; color: rgba(44,95,122,0.4);
  text-decoration: line-through;
}
.price-save-badge {
  display: inline-block; margin-top: 6px;
  padding: 3px 12px; border-radius: 100px;
  background: rgba(5,150,105,0.1); color: #059669;
  font-size: 12px; font-weight: 600;
}
.price-note {
  font-size: 11px !important; color: rgba(44,95,122,0.45) !important;
  font-style: italic;
}
</style>
