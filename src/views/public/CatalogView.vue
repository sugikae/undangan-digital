<template>
  <div class="catalog-page">
    <!-- Canvas animasi bunga + bintang -->
    <canvas ref="bgCanvas" class="catalog-canvas" />

    <!-- Header -->
    <div class="catalog-header">
      <div class="cat-ornament">
        <svg width="200" height="32" viewBox="0 0 200 32" fill="none">
          <path d="M10 16 Q50 4 100 16 Q150 28 190 16" stroke="#5b8fa8" stroke-width="0.8" opacity="0.5"/>
          <path d="M10 16 Q50 28 100 16 Q150 4 190 16" stroke="#5b8fa8" stroke-width="0.5" opacity="0.35"/>
          <circle cx="100" cy="16" r="3" fill="#5b8fa8" opacity="0.5"/>
        </svg>
      </div>
      <p class="cat-label">Katalog</p>
      <h1 class="cat-title">Undangan Digital</h1>
      <p class="cat-sub">Animasi & Tema Pilihan</p>
    </div>

    <!-- Demo Opening Animations -->
    <section class="cat-section">
      <p class="cat-section-label">✨ Animasi Pembuka</p>

      <div class="cat-grid">
        <!-- Card: Bunga Melayang -->
        <div class="cat-card" @click="showDemo('flower')">
          <div class="cat-preview flower-preview">
            <canvas ref="flowerPreviewCanvas" class="preview-canvas" />
            <div class="preview-overlay">
              <div class="preview-frame">
                <p class="pf-label">Kepada Yth.</p>
                <p class="pf-name">Nama Tamu</p>
                <div class="pf-btn">Buka Undangan 🌸</div>
              </div>
            </div>
          </div>
          <div class="cat-card-info">
            <h3>🌸 Bunga Melayang</h3>
            <p>Kelopak bunga & kupu-kupu beterbangan elegan. Tema dusty blue nan romantis.</p>
            <div class="cat-tags">
              <span class="cat-tag">Elegan</span>
              <span class="cat-tag">Romantis</span>
              <span class="cat-tag">Populer</span>
            </div>
          </div>
        </div>

        <!-- Card: Buka Amplop -->
        <div class="cat-card" @click="showDemo('envelope')">
          <div class="cat-preview envelope-preview">
            <div class="env-demo" :class="{ open: envOpen }">
              <div class="env-body-demo">
                <div class="env-flap-demo" />
                <div class="env-letter-demo" :class="{ out: envOpen }">
                  <p class="el-to">Kepada Yth.</p>
                  <p class="el-name">Nama Tamu</p>
                  <p class="el-from">The Wedding of</p>
                  <p class="el-couple">Pengantin & Pasangan</p>
                </div>
                <div class="env-seal-demo" :class="{ broken: envOpen }">✦</div>
              </div>
            </div>
            <div class="env-hint-demo" v-if="!envOpen">
              <p>Ketuk untuk buka 💌</p>
            </div>
          </div>
          <div class="cat-card-info">
            <h3>💌 Buka Amplop</h3>
            <p>Animasi amplop terbuka dramatis dengan segel lilin. Kesan mewah & berkesan.</p>
            <div class="cat-tags">
              <span class="cat-tag">Mewah</span>
              <span class="cat-tag">Unik</span>
              <span class="cat-tag">Dramatis</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Demo Fitur -->
    <section class="cat-section">
      <p class="cat-section-label">⚙️ Fitur Undangan</p>
      <div class="feature-showcase">
        <div class="fs-item" v-for="feat in features" :key="feat.name">
          <span class="fs-icon">{{ feat.icon }}</span>
          <div>
            <p class="fs-name">{{ feat.name }}</p>
            <p class="fs-desc">{{ feat.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing / CTA -->
    <section class="cat-section">
      <p class="cat-section-label">💰 Paket</p>
      <div class="pricing-grid">
        <div class="price-card">
          <div class="price-badge">Basic</div>
          <div class="price-num">Rp 75.000</div>
          <ul class="price-list">
            <li>✓ Semua fitur undangan</li>
            <li>✓ Animasi bunga / amplop</li>
            <li>✓ RSVP & Ucapan</li>
            <li>✓ Galeri 6 foto</li>
            <li>✓ Musik background</li>
            <li>✓ Link personal tamu</li>
            <li>✓ Aktif 6 bulan</li>
          </ul>
          <a :href="waLink" target="_blank" class="price-btn">Pesan Sekarang</a>
        </div>
        <div class="price-card premium">
          <div class="price-badge gold">Premium</div>
          <div class="price-num gold">Rp 150.000</div>
          <ul class="price-list">
            <li>✓ Semua fitur Basic</li>
            <li>✓ Galeri unlimited foto</li>
            <li>✓ Kisah cinta timeline</li>
            <li>✓ Kado digital</li>
            <li>✓ Dashboard owner</li>
            <li>✓ Aktif 1 tahun</li>
            <li>✓ Revisi 3x</li>
          </ul>
          <a :href="waLink" target="_blank" class="price-btn gold-btn">Pesan Sekarang</a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="cat-footer">
      <p>Dibuat dengan 🌸 untuk momen spesialmu</p>
      <a :href="waLink" target="_blank" class="wa-btn">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Hubungi Kami via WhatsApp
      </a>
    </footer>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const bgCanvas = ref<HTMLCanvasElement>()
const flowerPreviewCanvas = ref<HTMLCanvasElement>()
const envOpen = ref(false)

// WhatsApp link — ganti dengan nomor kamu
const waLink = 'https://wa.me/6285156363746?text=Halo%2C%20saya%20ingin%20pesan%20undangan%20digital'

const features = [
  { icon: '🕐', name: 'Countdown Timer', desc: 'Hitung mundur real-time menuju hari H' },
  { icon: '✅', name: 'RSVP Digital', desc: 'Tamu konfirmasi kehadiran online' },
  { icon: '💬', name: 'Ucapan & Doa', desc: 'Wall ucapan live dari tamu' },
  { icon: '📸', name: 'Galeri Foto', desc: 'Album foto dengan lightbox' },
  { icon: '🗺️', name: 'Lokasi & Maps', desc: 'Navigasi langsung ke venue' },
  { icon: '🎵', name: 'Musik Background', desc: 'Lagu romantis menemani undangan' },
  { icon: '💰', name: 'Kado Digital', desc: 'Info rekening & konfirmasi transfer' },
  { icon: '💕', name: 'Kisah Cinta', desc: 'Timeline perjalanan cinta kalian' },
  { icon: '📅', name: 'Add to Calendar', desc: 'Tamu bisa simpan jadwal langsung' },
  { icon: '🌸', name: '5 Animasi Keren', desc: 'Bunga, amplop, bintang, parallax, confetti' },
  { icon: '📱', name: 'Mobile Friendly', desc: 'Tampil sempurna di semua device' },
  { icon: '🔗', name: 'Link Personal', desc: 'Setiap tamu dapat link dengan nama mereka' },
]

// Envelope demo animation
let envTimer: ReturnType<typeof setInterval>

function showDemo(type: string) {
  if (type === 'envelope') {
    envOpen.value = false
    setTimeout(() => { envOpen.value = true }, 800)
    setTimeout(() => { envOpen.value = false }, 3000)
  }
}

// Simple floating particles for background
let animFrame: number
let particles: any[] = []

function initBg() {
  const canvas = bgCanvas.value!
  const ctx = canvas.getContext('2d')!
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  particles = Array.from({ length: 40 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: 2 + Math.random() * 6,
    speedY: 0.2 + Math.random() * 0.6,
    speedX: (Math.random() - 0.5) * 0.4,
    opacity: 0.1 + Math.random() * 0.25,
    wobble: Math.random() * Math.PI * 2,
    color: ['#92bdd4', '#b0cfe0', '#ffffff', '#c8dde8'][Math.floor(Math.random() * 4)],
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.03,
  }))

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach(p => {
      p.wobble += 0.02
      p.x += p.speedX + Math.sin(p.wobble) * 0.5
      p.y -= p.speedY
      p.rotation += p.rotSpeed
      if (p.y < -20) { p.y = canvas.height + 20; p.x = Math.random() * canvas.width }

      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rotation)
      ctx.globalAlpha = p.opacity
      ctx.beginPath()
      ctx.moveTo(0, -p.size * 0.5)
      ctx.bezierCurveTo(p.size * 0.6, -p.size * 0.3, p.size * 0.6, p.size * 0.4, 0, p.size * 0.5)
      ctx.bezierCurveTo(-p.size * 0.6, p.size * 0.4, -p.size * 0.6, -p.size * 0.3, 0, -p.size * 0.5)
      ctx.fillStyle = p.color
      ctx.fill()
      ctx.restore()
    })
    animFrame = requestAnimationFrame(loop)
  }
  loop()
}

onMounted(() => {
  initBg()
  // Auto demo envelope
  envTimer = setInterval(() => {
    envOpen.value = true
    setTimeout(() => { envOpen.value = false }, 2000)
  }, 5000)
})

onUnmounted(() => {
  cancelAnimationFrame(animFrame)
  clearInterval(envTimer)
})
</script>

<style scoped>
.catalog-page {
  min-height: 100vh;
  background: linear-gradient(160deg, #c8dde8 0%, #daeef8 40%, #e8f4fa 70%, #d4e8f2 100%);
  position: relative; overflow: hidden;
  font-family: 'DM Sans', sans-serif;
}

.catalog-canvas {
  position: fixed; inset: 0;
  pointer-events: none; z-index: 0;
}

/* Header */
.catalog-header {
  position: relative; z-index: 1;
  text-align: center; padding: 60px 24px 32px;
}
.cat-ornament { margin-bottom: 16px; }
.cat-label {
  font-family: 'Cormorant Garamond', serif;
  font-size: 11px; letter-spacing: 4px; text-transform: uppercase;
  color: rgba(44,95,122,0.6); margin-bottom: 8px;
}
.cat-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(32px, 7vw, 56px); font-style: italic; font-weight: 300;
  color: #1e4a63; margin-bottom: 8px; line-height: 1.1;
}
.cat-sub {
  font-family: 'Cormorant Garamond', serif;
  font-size: 16px; color: rgba(44,95,122,0.6); font-style: italic;
}

/* Sections */
.cat-section {
  position: relative; z-index: 1;
  max-width: 900px; margin: 0 auto; padding: 40px 24px;
}
.cat-section-label {
  font-family: 'Cormorant Garamond', serif;
  font-size: 11px; letter-spacing: 4px; text-transform: uppercase;
  color: rgba(44,95,122,0.55); text-align: center; margin-bottom: 28px;
}

/* Animation cards */
.cat-grid {
  display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
}
@media(max-width:640px){ .cat-grid { grid-template-columns: 1fr; } }

.cat-card {
  background: rgba(255,255,255,0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(91,143,168,0.2);
  border-radius: 20px; overflow: hidden;
  transition: all 0.3s; cursor: pointer;
  box-shadow: 0 4px 20px rgba(91,143,168,0.12);
}
.cat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(91,143,168,0.2); }

/* Preview area */
.cat-preview {
  height: 220px; position: relative; overflow: hidden;
  background: linear-gradient(160deg, #b8d4e4, #daeef8);
  display: flex; align-items: center; justify-content: center;
}
.preview-canvas { position:absolute; inset:0; width:100%; height:100%; }
.preview-overlay { position:relative; z-index:1; }
.preview-frame {
  text-align: center; padding: 20px 24px;
  background: rgba(255,255,255,0.75);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(91,143,168,0.2);
  border-radius: 12px;
}
.pf-label { font-family:'Cormorant Garamond',serif; font-size:10px; letter-spacing:3px; color:rgba(44,95,122,0.6); margin-bottom:4px; text-transform:uppercase; }
.pf-name { font-family:'Cormorant Garamond',serif; font-size:20px; font-style:italic; color:#1e4a63; margin-bottom:12px; }
.pf-btn { display:inline-block; padding:7px 18px; border-radius:100px; background:#2d5570; color:white; font-size:12px; font-family:'Cormorant Garamond',serif; letter-spacing:1px; }

/* Envelope preview */
.env-demo {
  position: relative; transition: all 0.5s;
}
.env-body-demo {
  width: 180px; height: 130px; position: relative;
  filter: drop-shadow(0 8px 20px rgba(30,74,99,0.2));
}
.env-flap-demo {
  position:absolute; top:0; left:0; right:0; height:50%;
  background: linear-gradient(to bottom, #c4d8e8, #b8ceda);
  clip-path: polygon(0 0, 50% 55%, 100% 0);
  z-index:3; transform-origin:top center;
  transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);
  background: linear-gradient(to bottom, #d4e8f4, #c4d8e8);
}
.env-demo.open .env-flap-demo { transform: rotateX(180deg); }

.env-letter-demo {
  position:absolute; left:10px; right:10px; bottom:8px;
  height:105px; background:white; border-radius:3px;
  border:1px solid rgba(91,143,168,0.2); z-index:2;
  display:flex; flex-direction:column; align-items:center;
  justify-content:center; text-align:center; padding:8px;
  transition: transform 0.8s cubic-bezier(0.34,1.56,0.64,1);
}
.env-letter-demo.out { transform: translateY(-90px); }
.el-to { font-family:'Cormorant Garamond',serif; font-size:8px; letter-spacing:2px; color:rgba(44,95,122,0.5); text-transform:uppercase; margin-bottom:2px; }
.el-name { font-family:'Cormorant Garamond',serif; font-size:13px; font-style:italic; color:#1e4a63; margin-bottom:6px; font-weight:600; }
.el-from { font-family:'Cormorant Garamond',serif; font-size:7px; letter-spacing:1px; color:rgba(44,95,122,0.4); text-transform:uppercase; margin-bottom:1px; }
.el-couple { font-family:'Cormorant Garamond',serif; font-size:10px; font-style:italic; color:#2d5570; }

.env-seal-demo {
  position:absolute; top:calc(50% - 14px); left:calc(50% - 14px);
  width:28px; height:28px; border-radius:50%;
  background:#2d5570; color:white; font-size:12px;
  display:flex; align-items:center; justify-content:center;
  z-index:5; transition:all 0.3s;
}
.env-seal-demo.broken { transform:scale(0) rotate(45deg); opacity:0; }
.env-hint-demo { position:absolute; bottom:12px; font-family:'Cormorant Garamond',serif; font-size:12px; color:rgba(44,95,122,0.6); font-style:italic; }

.cat-card-info { padding: 18px 20px; }
.cat-card-info h3 { font-family:'Cormorant Garamond',serif; font-size:18px; font-weight:600; color:#1e4a63; margin-bottom:6px; }
.cat-card-info p { font-size:13px; color:rgba(44,95,122,0.7); line-height:1.5; margin-bottom:10px; }
.cat-tags { display:flex; gap:6px; flex-wrap:wrap; }
.cat-tag { padding:3px 10px; border-radius:100px; background:rgba(91,143,168,0.1); color:#5b8fa8; font-size:11px; font-weight:500; }

/* Features */
.feature-showcase {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}
.fs-item {
  display:flex; gap:12px; align-items:flex-start;
  background:rgba(255,255,255,0.6); backdrop-filter:blur(8px);
  border:1px solid rgba(91,143,168,0.15); border-radius:12px;
  padding:14px 16px;
}
.fs-icon { font-size:22px; flex-shrink:0; }
.fs-name { font-size:13px; font-weight:600; color:#1e4a63; margin-bottom:2px; }
.fs-desc { font-size:11px; color:rgba(44,95,122,0.6); line-height:1.4; }

/* Pricing */
.pricing-grid { display:grid; grid-template-columns:1fr 1fr; gap:20px; }
@media(max-width:560px){ .pricing-grid { grid-template-columns:1fr; } }

.price-card {
  background:rgba(255,255,255,0.7); backdrop-filter:blur(12px);
  border:1px solid rgba(91,143,168,0.2); border-radius:20px;
  padding:28px 24px; text-align:center;
}
.price-card.premium { border-color:rgba(201,169,110,0.4); background:rgba(255,252,245,0.8); }
.price-badge { display:inline-block; padding:4px 14px; border-radius:100px; background:rgba(91,143,168,0.1); color:#5b8fa8; font-size:12px; font-weight:600; letter-spacing:1px; text-transform:uppercase; margin-bottom:16px; }
.price-badge.gold { background:rgba(201,169,110,0.15); color:#8b6914; }
.price-num { font-family:'Cormorant Garamond',serif; font-size:32px; font-weight:600; color:#1e4a63; margin-bottom:20px; }
.price-num.gold { color:#8b6914; }
.price-list { list-style:none; text-align:left; margin-bottom:24px; display:flex; flex-direction:column; gap:8px; }
.price-list li { font-size:13px; color:rgba(44,95,122,0.8); }
.price-btn { display:block; padding:12px 24px; border-radius:100px; background:#2d5570; color:white; text-decoration:none; font-size:14px; font-weight:500; transition:all 0.2s; }
.price-btn:hover { background:#1e4a63; transform:translateY(-2px); }
.gold-btn { background:linear-gradient(135deg, #8b6914, #c9a96e); }
.gold-btn:hover { background:linear-gradient(135deg, #6b4f10, #a8884a); }

/* Footer */
.cat-footer {
  position:relative; z-index:1; text-align:center; padding:40px 24px 60px;
}
.cat-footer p { font-family:'Cormorant Garamond',serif; font-size:15px; font-style:italic; color:rgba(44,95,122,0.6); margin-bottom:20px; }
.wa-btn {
  display:inline-flex; align-items:center; gap:10px;
  padding:14px 32px; border-radius:100px;
  background:#25D366; color:white; text-decoration:none;
  font-size:15px; font-weight:600; transition:all 0.3s;
  box-shadow:0 8px 24px rgba(37,211,102,0.3);
}
.wa-btn:hover { transform:translateY(-3px); box-shadow:0 14px 32px rgba(37,211,102,0.4); }
</style>
