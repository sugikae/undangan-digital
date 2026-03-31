<template>
  <!-- Opening Overlay (transisi daun saat pertama buka) -->
  <Teleport to="body">
    <Transition name="opening">
      <div v-if="showOpening" class="opening-overlay" @click="triggerOpen">
        <canvas ref="openingCanvas" class="opening-canvas" />
        <div class="opening-content">
          <div class="opening-ornament">
            <svg viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 20 Q30 5 60 20 Q90 35 120 20" stroke="rgba(255,255,255,0.6)" stroke-width="0.8" fill="none"/>
              <path d="M0 20 Q30 35 60 20 Q90 5 120 20" stroke="rgba(255,255,255,0.4)" stroke-width="0.5" fill="none"/>
            </svg>
          </div>
          <p class="opening-label">Kepada Yth.</p>
          <h2 class="opening-name">{{ guestName }}</h2>
          <button class="opening-btn" @click.stop="triggerOpen">
            <span>Buka Undangan</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
          <p class="opening-hint">ketuk di mana saja untuk membuka</p>
        </div>
        <!-- Floating petals on opening screen too -->
        <canvas ref="openingPetalsCanvas" class="opening-petals-canvas" />
      </div>
    </Transition>
  </Teleport>

  <!-- Main animation layer (always on top of invitation content) -->
  <div class="flower-layer" :class="{ active: !showOpening }">
    <canvas ref="mainCanvas" class="main-canvas" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  guestName: { type: String, default: 'Tamu Undangan' },
  petalColor: { type: String, default: '#a8c5d8' },   // dusty blue seperti referensi
  petalColor2: { type: String, default: '#d4e8f0' },  // biru muda
  petalColor3: { type: String, default: '#ffffff' },  // putih
  butterflyColor: { type: String, default: '#5b8fa8' },
  enabled: { type: Boolean, default: true },
  autoOpen: { type: Boolean, default: false },        // skip opening screen
})

const emit = defineEmits(['opened'])

const showOpening = ref(!props.autoOpen)
const openingCanvas = ref(null)
const openingPetalsCanvas = ref(null)
const mainCanvas = ref(null)

let mainCtx, openingCtx, openingPetalsCtx
let animFrame, openingFrame, openingPetalsFrame
let petals = [], butterflies = [], openingPetals = []
let openingParticles = []
let isOpening = false
let openProgress = 0
let W = 0, H = 0

// ─── PETAL class ───────────────────────────────────────────────
class Petal {
  constructor(ctx, w, h, colors, fromTop = false) {
    this.ctx = ctx
    this.w = w
    this.h = h
    this.colors = colors
    this.reset(fromTop)
  }

  reset(fromTop = false) {
    this.x = Math.random() * this.w
    this.y = fromTop ? -20 : Math.random() * this.h * -1
    this.size = 6 + Math.random() * 12
    this.speedY = 0.4 + Math.random() * 1.2
    this.speedX = (Math.random() - 0.5) * 0.8
    this.rotation = Math.random() * Math.PI * 2
    this.rotSpeed = (Math.random() - 0.5) * 0.04
    this.opacity = 0.4 + Math.random() * 0.5
    this.wobble = Math.random() * Math.PI * 2
    this.wobbleSpeed = 0.02 + Math.random() * 0.02
    this.wobbleAmp = 0.5 + Math.random() * 1.5
    // petal shape: 0=rose, 1=oval, 2=teardrop
    this.type = Math.floor(Math.random() * 3)
    this.color = this.colors[Math.floor(Math.random() * this.colors.length)]
    // wind gust
    this.windPhase = Math.random() * Math.PI * 2
  }

  update(windX) {
    this.wobble += this.wobbleSpeed
    this.windPhase += 0.008
    const wind = Math.sin(this.windPhase) * 0.6 + windX
    this.x += this.speedX + Math.sin(this.wobble) * this.wobbleAmp + wind
    this.y += this.speedY
    this.rotation += this.rotSpeed + Math.cos(this.wobble) * 0.01

    if (this.y > this.h + 30 || this.x < -50 || this.x > this.w + 50) {
      this.reset(true)
    }
  }

  draw() {
    const c = this.ctx
    c.save()
    c.translate(this.x, this.y)
    c.rotate(this.rotation)
    c.globalAlpha = this.opacity

    if (this.type === 0) {
      // Rose petal - curved teardrop
      c.beginPath()
      c.moveTo(0, -this.size * 0.5)
      c.bezierCurveTo(this.size * 0.6, -this.size * 0.3, this.size * 0.6, this.size * 0.4, 0, this.size * 0.5)
      c.bezierCurveTo(-this.size * 0.6, this.size * 0.4, -this.size * 0.6, -this.size * 0.3, 0, -this.size * 0.5)
      c.fillStyle = this.color
      c.fill()
      // Inner highlight
      c.beginPath()
      c.moveTo(0, -this.size * 0.3)
      c.bezierCurveTo(this.size * 0.2, -this.size * 0.1, this.size * 0.15, this.size * 0.2, 0, this.size * 0.3)
      c.bezierCurveTo(-this.size * 0.15, this.size * 0.2, -this.size * 0.2, -this.size * 0.1, 0, -this.size * 0.3)
      c.fillStyle = 'rgba(255,255,255,0.2)'
      c.fill()
    } else if (this.type === 1) {
      // Oval petal
      c.beginPath()
      c.ellipse(0, 0, this.size * 0.35, this.size * 0.55, 0, 0, Math.PI * 2)
      c.fillStyle = this.color
      c.fill()
    } else {
      // Small cherry blossom petal
      c.beginPath()
      c.moveTo(0, -this.size * 0.6)
      c.bezierCurveTo(this.size * 0.5, -this.size * 0.5, this.size * 0.5, this.size * 0.3, 0, this.size * 0.6)
      c.bezierCurveTo(-this.size * 0.5, this.size * 0.3, -this.size * 0.5, -this.size * 0.5, 0, -this.size * 0.6)
      c.fillStyle = this.color
      c.fill()
      // Vein
      c.beginPath()
      c.moveTo(0, -this.size * 0.5)
      c.lineTo(0, this.size * 0.5)
      c.strokeStyle = 'rgba(255,255,255,0.25)'
      c.lineWidth = 0.5
      c.stroke()
    }

    c.restore()
  }
}

// ─── BUTTERFLY class ────────────────────────────────────────────
class Butterfly {
  constructor(ctx, w, h) {
    this.ctx = ctx
    this.w = w
    this.h = h
    this.reset()
  }

  reset() {
    this.x = Math.random() * this.w
    this.y = -30 - Math.random() * 200
    this.targetX = Math.random() * this.w
    this.targetY = 80 + Math.random() * (this.h * 0.6)
    this.speedBase = 0.4 + Math.random() * 0.6
    this.size = 12 + Math.random() * 14
    this.wingPhase = Math.random() * Math.PI * 2
    this.wingSpeed = 0.08 + Math.random() * 0.06
    this.opacity = 0
    this.fadeIn = true
    this.lifetime = 300 + Math.random() * 400
    this.age = 0
    this.wanderAngle = Math.random() * Math.PI * 2
    this.wanderSpeed = 0.02 + Math.random() * 0.02
    // Color variation
    const colors = [
      { body: '#5b8fa8', wing: '#7fb3cc', accent: '#a8d4e8' },
      { body: '#3d6b85', wing: '#5b8fa8', accent: '#8cc4dc' },
      { body: '#8baec4', wing: '#b0cfe0', accent: '#d4e8f4' },
      { body: '#6b9ab8', wing: '#92bdd4', accent: '#c0dcec' },
    ]
    this.palette = colors[Math.floor(Math.random() * colors.length)]
  }

  update() {
    this.age++
    this.wingPhase += this.wingSpeed

    // Fade in/out
    if (this.age < 40) this.opacity = Math.min(1, this.age / 40 * 0.85)
    else if (this.age > this.lifetime - 40) this.opacity = Math.max(0, (this.lifetime - this.age) / 40 * 0.85)

    // Wander toward target with organic movement
    this.wanderAngle += (Math.random() - 0.5) * this.wanderSpeed * 2
    const dx = this.targetX - this.x
    const dy = this.targetY - this.y
    const dist = Math.sqrt(dx * dx + dy * dy)

    if (dist < 50) {
      // Pick new target
      this.targetX = 50 + Math.random() * (this.w - 100)
      this.targetY = 60 + Math.random() * (this.h * 0.5)
    }

    const angle = Math.atan2(dy, dx) + Math.sin(this.wanderAngle) * 0.5
    this.x += Math.cos(angle) * this.speedBase
    this.y += Math.sin(angle) * this.speedBase * 0.5 + Math.sin(this.wingPhase * 0.3) * 0.4

    if (this.age > this.lifetime) this.reset()
  }

  draw() {
    const c = this.ctx
    const wf = Math.abs(Math.sin(this.wingPhase)) // wing flap 0..1
    const wingOpen = 0.3 + wf * 0.7

    c.save()
    c.translate(this.x, this.y)
    c.globalAlpha = this.opacity

    // Direction
    const dx = this.targetX - this.x
    const facing = dx < 0 ? -1 : 1

    c.scale(facing, 1)

    // Upper wing left
    this._drawWing(c, -2, -2, this.size * wingOpen, this.size * 0.7, -0.3, this.palette)
    // Upper wing right
    c.scale(-1, 1)
    this._drawWing(c, -2, -2, this.size * wingOpen, this.size * 0.7, -0.3, this.palette)
    c.scale(-1, 1)
    // Lower wing left
    this._drawWing(c, -2, 2, this.size * wingOpen * 0.65, this.size * 0.5, 0.3, this.palette)
    // Lower wing right
    c.scale(-1, 1)
    this._drawWing(c, -2, 2, this.size * wingOpen * 0.65, this.size * 0.5, 0.3, this.palette)
    c.scale(-1, 1)

    // Body
    c.beginPath()
    c.ellipse(0, 0, 1.5, this.size * 0.35, 0, 0, Math.PI * 2)
    c.fillStyle = this.palette.body
    c.fill()

    // Antennae
    c.beginPath()
    c.moveTo(0, -this.size * 0.3)
    c.quadraticCurveTo(-4, -this.size * 0.7, -6, -this.size * 0.75)
    c.moveTo(0, -this.size * 0.3)
    c.quadraticCurveTo(4, -this.size * 0.7, 6, -this.size * 0.75)
    c.strokeStyle = this.palette.body
    c.lineWidth = 0.8
    c.stroke()
    // Antenna tips
    c.beginPath()
    c.arc(-6, -this.size * 0.75, 1.5, 0, Math.PI * 2)
    c.arc(6, -this.size * 0.75, 1.5, 0, Math.PI * 2)
    c.fillStyle = this.palette.body
    c.fill()

    c.restore()
  }

  _drawWing(c, ox, oy, w, h, tilt, palette) {
    c.save()
    c.translate(ox, oy)
    c.rotate(tilt)
    // Wing shape
    c.beginPath()
    c.moveTo(0, 0)
    c.bezierCurveTo(w * 0.1, -h * 0.8, w * 0.9, -h * 0.9, w, -h * 0.1)
    c.bezierCurveTo(w * 0.9, h * 0.3, w * 0.2, h * 0.2, 0, 0)

    // Wing gradient
    const grad = c.createRadialGradient(w * 0.3, -h * 0.3, 0, w * 0.3, -h * 0.3, w * 0.8)
    grad.addColorStop(0, palette.accent + 'CC')
    grad.addColorStop(0.5, palette.wing + '99')
    grad.addColorStop(1, palette.body + '55')
    c.fillStyle = grad
    c.fill()

    // Wing veins
    c.beginPath()
    c.moveTo(0, 0)
    c.lineTo(w * 0.7, -h * 0.6)
    c.moveTo(0, 0)
    c.lineTo(w * 0.5, -h * 0.85)
    c.moveTo(0, 0)
    c.lineTo(w * 0.9, -h * 0.1)
    c.strokeStyle = palette.body + '50'
    c.lineWidth = 0.6
    c.stroke()

    // Wing pattern spots
    c.beginPath()
    c.arc(w * 0.6, -h * 0.5, w * 0.08, 0, Math.PI * 2)
    c.fillStyle = 'rgba(255,255,255,0.35)'
    c.fill()

    c.restore()
  }
}

// ─── OPENING PARTICLE class (leaves/branches burst) ─────────────
class OpeningParticle {
  constructor(ctx, w, h) {
    this.ctx = ctx
    this.w = w
    this.h = h
    // Start from edges or center
    const side = Math.floor(Math.random() * 4)
    if (side === 0) { this.x = 0; this.y = Math.random() * h }
    else if (side === 1) { this.x = w; this.y = Math.random() * h }
    else if (side === 2) { this.x = Math.random() * w; this.y = 0 }
    else { this.x = Math.random() * w; this.y = h }

    this.vx = (w / 2 - this.x) * 0.02 + (Math.random() - 0.5) * 3
    this.vy = (h / 2 - this.y) * 0.02 + (Math.random() - 0.5) * 3
    this.size = 4 + Math.random() * 16
    this.rotation = Math.random() * Math.PI * 2
    this.rotSpeed = (Math.random() - 0.5) * 0.1
    this.opacity = 0.7 + Math.random() * 0.3
    this.life = 1
    this.decay = 0.008 + Math.random() * 0.012
    this.isLeaf = Math.random() > 0.3
    this.color = Math.random() > 0.5 ? '#c8dde8' : '#e8f2f8'
  }

  update() {
    this.x += this.vx
    this.y += this.vy
    this.vy += 0.05
    this.vx *= 0.99
    this.rotation += this.rotSpeed
    this.life -= this.decay
    this.opacity = this.life * 0.8
  }

  draw() {
    if (this.life <= 0) return
    const c = this.ctx
    c.save()
    c.translate(this.x, this.y)
    c.rotate(this.rotation)
    c.globalAlpha = this.opacity

    if (this.isLeaf) {
      c.beginPath()
      c.moveTo(0, -this.size)
      c.bezierCurveTo(this.size * 0.6, -this.size * 0.5, this.size * 0.6, this.size * 0.5, 0, this.size)
      c.bezierCurveTo(-this.size * 0.6, this.size * 0.5, -this.size * 0.6, -this.size * 0.5, 0, -this.size)
      c.fillStyle = this.color
      c.fill()
      c.beginPath()
      c.moveTo(0, -this.size * 0.8)
      c.lineTo(0, this.size * 0.8)
      c.strokeStyle = 'rgba(255,255,255,0.4)'
      c.lineWidth = 0.8
      c.stroke()
    } else {
      // Branch/twig segment
      c.beginPath()
      c.moveTo(-this.size, 0)
      c.lineTo(this.size, 0)
      c.strokeStyle = this.color
      c.lineWidth = 1.5
      c.stroke()
      // Small branches
      c.beginPath()
      c.moveTo(-this.size * 0.3, 0)
      c.lineTo(-this.size * 0.1, -this.size * 0.5)
      c.moveTo(this.size * 0.2, 0)
      c.lineTo(this.size * 0.5, -this.size * 0.4)
      c.stroke()
    }

    c.restore()
  }
}

// ─── RESIZE ─────────────────────────────────────────────────────
function resize() {
  W = window.innerWidth
  H = window.innerHeight

  if (mainCanvas.value) {
    mainCanvas.value.width = W
    mainCanvas.value.height = H
  }
  if (openingCanvas.value) {
    openingCanvas.value.width = W
    openingCanvas.value.height = H
  }
  if (openingPetalsCanvas.value) {
    openingPetalsCanvas.value.width = W
    openingPetalsCanvas.value.height = H
  }
}

// ─── INIT PARTICLES ─────────────────────────────────────────────
function initMain() {
  if (!mainCanvas.value) return
  mainCtx = mainCanvas.value.getContext('2d')

  const colors = [props.petalColor, props.petalColor2, props.petalColor3, '#e8f4f8', '#b8d4e4']
  const count = Math.min(40, Math.floor(W * H / 18000))
  petals = Array.from({ length: count }, () => new Petal(mainCtx, W, H, colors))

  const bfCount = Math.max(2, Math.min(6, Math.floor(W / 200)))
  butterflies = Array.from({ length: bfCount }, () => {
    const bf = new Butterfly(mainCtx, W, H)
    bf.y = Math.random() * H * 0.6  // spread initial positions
    bf.age = Math.floor(Math.random() * 200) // stagger
    bf.opacity = Math.random() * 0.7
    return bf
  })
}

function initOpeningPetals() {
  if (!openingPetalsCanvas.value) return
  openingPetalsCtx = openingPetalsCanvas.value.getContext('2d')
  const colors = ['#c8dde8', '#e0eff5', '#ffffff', '#d4e8f0']
  openingPetals = Array.from({ length: 25 }, () => new Petal(openingPetalsCtx, W, H, colors))
}

// ─── WIND ───────────────────────────────────────────────────────
let windX = 0
let windTarget = 0
let windTimer = 0

function updateWind() {
  windTimer++
  if (windTimer > 180) {
    windTarget = (Math.random() - 0.5) * 1.2
    windTimer = 0
  }
  windX += (windTarget - windX) * 0.005
}

// ─── MAIN LOOP ───────────────────────────────────────────────────
function loopMain() {
  if (!mainCtx) return
  mainCtx.clearRect(0, 0, W, H)
  updateWind()
  petals.forEach(p => { p.update(windX); p.draw() })
  butterflies.forEach(b => { b.update(); b.draw() })
  animFrame = requestAnimationFrame(loopMain)
}

function loopOpeningPetals() {
  if (!openingPetalsCtx) return
  openingPetalsCtx.clearRect(0, 0, W, H)
  openingPetals.forEach(p => { p.update(0.2); p.draw() })
  openingPetalsFrame = requestAnimationFrame(loopOpeningPetals)
}

// ─── OPENING ANIMATION ──────────────────────────────────────────
function triggerOpen() {
  if (isOpening) return
  isOpening = true

  // Burst particles
  if (openingCanvas.value) {
    openingCtx = openingCanvas.value.getContext('2d')
    openingParticles = Array.from({ length: 120 }, () => new OpeningParticle(openingCtx, W, H))
    animateOpening()
  } else {
    finishOpen()
  }
}

function animateOpening() {
  if (!openingCtx) return
  openProgress += 0.025

  openingCtx.clearRect(0, 0, W, H)

  // Draw sweep reveal from center
  const radius = openProgress * Math.sqrt(W * W + H * H)
  openingCtx.save()
  openingCtx.globalCompositeOperation = 'source-over'

  // Radial wipe: darken edges as it opens
  const grad = openingCtx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, radius * 0.5)
  grad.addColorStop(0, 'rgba(184,212,228,0)')
  grad.addColorStop(0.7, 'rgba(184,212,228,0.05)')
  grad.addColorStop(1, 'rgba(184,212,228,0.3)')
  openingCtx.beginPath()
  openingCtx.arc(W / 2, H / 2, radius, 0, Math.PI * 2)
  openingCtx.fillStyle = grad
  openingCtx.fill()
  openingCtx.restore()

  // Particles
  openingParticles.forEach(p => { p.update(); p.draw() })
  openingParticles = openingParticles.filter(p => p.life > 0)

  if (openProgress < 1 || openingParticles.length > 0) {
    openingFrame = requestAnimationFrame(animateOpening)
  } else {
    openingCtx.clearRect(0, 0, W, H)
    setTimeout(finishOpen, 100)
  }
}

function finishOpen() {
  showOpening.value = false
  emit('opened')
}

// ─── LIFECYCLE ───────────────────────────────────────────────────
onMounted(() => {
  resize()
  window.addEventListener('resize', resize)
  initMain()
  initOpeningPetals()
  loopMain()
  loopOpeningPetals()
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
  cancelAnimationFrame(animFrame)
  cancelAnimationFrame(openingFrame)
  cancelAnimationFrame(openingPetalsFrame)
})

watch(() => props.enabled, (val) => {
  if (val) { loopMain(); loopOpeningPetals() }
  else {
    cancelAnimationFrame(animFrame)
    cancelAnimationFrame(openingPetalsFrame)
  }
})
</script>

<style scoped>
/* ── Opening Overlay ── */
.opening-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: linear-gradient(160deg, #b8d4e4 0%, #d8eef8 40%, #e8f4fa 70%, #c8dde8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  overflow: hidden;
}

.opening-canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1;
}

.opening-petals-canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.opening-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 40px 32px;
  animation: contentFloat 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.opening-ornament {
  width: 120px;
  margin: 0 auto 16px;
  opacity: 0.7;
}

.opening-label {
  font-family: 'Cormorant Garamond', 'Georgia', serif;
  font-size: 14px;
  font-weight: 400;
  color: rgba(60, 100, 130, 0.8);
  letter-spacing: 3px;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.opening-name {
  font-family: 'Cormorant Garamond', 'Palatino Linotype', 'Georgia', serif;
  font-size: clamp(24px, 6vw, 42px);
  font-weight: 600;
  color: #2c5f7a;
  letter-spacing: 1px;
  margin-bottom: 32px;
  line-height: 1.2;
  text-shadow: 0 2px 20px rgba(184, 212, 228, 0.8);
}

.opening-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 36px;
  background: linear-gradient(135deg, #2c5f7a, #3d7d9e);
  color: #e8f4fa;
  border: none;
  border-radius: 100px;
  font-family: 'Cormorant Garamond', 'Georgia', serif;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 1.5px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 8px 32px rgba(44, 95, 122, 0.35), 0 0 0 1px rgba(255,255,255,0.2) inset;
}

.opening-btn:hover {
  transform: translateY(-3px) scale(1.04);
  box-shadow: 0 14px 40px rgba(44, 95, 122, 0.45);
}

.opening-btn:active {
  transform: scale(0.97);
}

.opening-hint {
  margin-top: 16px;
  font-size: 11px;
  color: rgba(60, 100, 130, 0.55);
  letter-spacing: 1.5px;
  font-family: 'Cormorant Garamond', 'Georgia', serif;
  animation: pulse 2.5s ease-in-out infinite;
}

/* ── Main animation layer ── */
.flower-layer {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 100;
  opacity: 0;
  transition: opacity 1s ease;
}

.flower-layer.active {
  opacity: 1;
}

.main-canvas {
  width: 100%;
  height: 100%;
}

/* ── Transitions ── */
.opening-enter-active {
  transition: opacity 0.4s ease;
}

.opening-leave-active {
  transition: opacity 0.8s ease, transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.opening-enter-from { opacity: 0; }
.opening-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

@keyframes contentFloat {
  from { opacity: 0; transform: translateY(30px) scale(0.95); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}
</style>
