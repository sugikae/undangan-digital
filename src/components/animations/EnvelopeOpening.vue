<template>
  <Teleport to="body">
    <Transition name="envelope-screen">
      <div v-if="show" class="envelope-overlay" @click="handleClick">
        <canvas ref="bgCanvas" class="env-bg-canvas" />

        <!-- Envelope -->
        <div class="envelope-wrap" :class="envState">

          <!-- Envelope body -->
          <div class="envelope-body">

            <!-- Flap back (behind) -->
            <div class="env-flap-back" />

            <!-- Left & right triangles -->
            <div class="env-side-left" />
            <div class="env-side-right" />

            <!-- Bottom triangle -->
            <div class="env-bottom" />

            <!-- Letter inside -->
            <div class="env-letter" :class="{ out: envState === 'opened' }">
              <div class="letter-content">
                <div class="letter-ornament">
                  <svg width="80" height="20" viewBox="0 0 80 20" fill="none">
                    <path d="M5 10 Q20 3 40 10 Q60 17 75 10" stroke="#5b8fa8" stroke-width="0.8" opacity="0.6"/>
                    <path d="M5 10 Q20 17 40 10 Q60 3 75 10" stroke="#5b8fa8" stroke-width="0.5" opacity="0.4"/>
                    <circle cx="40" cy="10" r="2.5" fill="#5b8fa8" opacity="0.55"/>
                  </svg>
                </div>
                <p class="letter-to">Kepada Yth.</p>
                <p class="letter-name">{{ guestName }}</p>
                <div class="letter-divider">
                  <span /><span class="div-dot" /><span />
                </div>
                <p class="letter-from">The Wedding of</p>
                <p class="letter-couple">{{ brideName }} & {{ groomName }}</p>
              </div>
            </div>

            <!-- Flap front (animates open) -->
            <div class="env-flap-front" />

            <!-- Wax seal -->
            <div class="env-seal" :class="{ broken: envState !== 'idle' }">
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
                <circle cx="22" cy="22" r="20" fill="#2d5570" opacity="0.9"/>
                <circle cx="22" cy="22" r="16" stroke="rgba(255,255,255,0.2)" stroke-width="1" fill="none"/>
                <text x="22" y="27" text-anchor="middle"
                  font-family="Cormorant Garamond, serif"
                  font-size="14" font-style="italic"
                  fill="rgba(255,255,255,0.85)">✦</text>
              </svg>
            </div>
          </div>

        </div>

        <!-- Text below envelope -->
        <div class="env-hint" :class="{ hide: envState !== 'idle' }">
          <p class="hint-text">Anda mendapat undangan</p>
          <button class="open-btn" @click.stop="openEnvelope">
            <span>Buka Undangan</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
          <p class="hint-sub">atau ketuk di mana saja</p>
        </div>

      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  guestName: string
  brideName: string
  groomName: string
}>()

const emit = defineEmits(['opened'])

const show = ref(true)
const bgCanvas = ref<HTMLCanvasElement>()
const envState = ref<'idle' | 'opening' | 'opened' | 'done'>('idle')

let bgCtx: CanvasRenderingContext2D | null = null
let animFrame: number
let particles: BgParticle[] = []
let W = window.innerWidth
let H = window.innerHeight

// Simple background floating particles
class BgParticle {
  x: number; y: number; size: number
  speedY: number; speedX: number
  opacity: number; wobble: number

  constructor() {
    this.x = Math.random() * W
    this.y = Math.random() * H
    this.size = 2 + Math.random() * 5
    this.speedY = 0.2 + Math.random() * 0.4
    this.speedX = (Math.random() - 0.5) * 0.3
    this.opacity = 0.1 + Math.random() * 0.25
    this.wobble = Math.random() * Math.PI * 2
  }

  update() {
    this.wobble += 0.015
    this.x += this.speedX + Math.sin(this.wobble) * 0.4
    this.y -= this.speedY
    if (this.y < -10) { this.y = H + 10; this.x = Math.random() * W }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.globalAlpha = this.opacity
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(200,228,240,0.8)'
    ctx.fill()
    ctx.restore()
  }
}

function initBg() {
  if (!bgCanvas.value) return
  bgCanvas.value.width = W
  bgCanvas.value.height = H
  bgCtx = bgCanvas.value.getContext('2d')
  particles = Array.from({ length: 30 }, () => new BgParticle())
  loopBg()
}

function loopBg() {
  if (!bgCtx || !bgCanvas.value) return
  bgCtx.clearRect(0, 0, W, H)
  particles.forEach(p => { p.update(); p.draw(bgCtx!) })
  animFrame = requestAnimationFrame(loopBg)
}

function handleClick() {
  if (envState.value === 'idle') openEnvelope()
}

function openEnvelope() {
  if (envState.value !== 'idle') return
  envState.value = 'opening'

  // Setelah flap terbuka, munculkan letter
  setTimeout(() => {
    envState.value = 'opened'
  }, 600)

  // Setelah letter keluar, fade out overlay
  setTimeout(() => {
    envState.value = 'done'
  }, 1400)

  setTimeout(() => {
    show.value = false
    emit('opened')
    cancelAnimationFrame(animFrame)
  }, 2200)
}

onMounted(() => {
  setTimeout(initBg, 50)
  window.addEventListener('resize', () => {
    W = window.innerWidth; H = window.innerHeight
    if (bgCanvas.value) { bgCanvas.value.width = W; bgCanvas.value.height = H }
  })
})

onUnmounted(() => cancelAnimationFrame(animFrame))
</script>

<style scoped>
.envelope-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: linear-gradient(160deg, #b8d4e4 0%, #d8eef8 40%, #e8f4fa 70%, #c8dde8 100%);
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  cursor: pointer; overflow: hidden;
}

.env-bg-canvas {
  position: absolute; inset: 0;
  pointer-events: none; z-index: 0;
}

/* ── Envelope wrap ── */
.envelope-wrap {
  position: relative; z-index: 2;
  margin-bottom: 32px;
  animation: envFloat 4s ease-in-out infinite;
}

.envelope-wrap.opening { animation: envShake 0.5s ease; }
.envelope-wrap.opened  { animation: envLift 0.6s ease forwards; }
.envelope-wrap.done    { animation: envFadeOut 0.4s ease forwards; }

.envelope-body {
  position: relative;
  width: 280px; height: 200px;
  filter: drop-shadow(0 20px 40px rgba(30,74,99,0.25));
}

/* Back flap */
.env-flap-back {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 50%;
  background: linear-gradient(to bottom, #c4d8e8, #b8ceda);
  clip-path: polygon(0 0, 50% 55%, 100% 0);
  z-index: 1;
}

/* Side triangles */
.env-side-left {
  position: absolute;
  bottom: 0; left: 0;
  width: 50%; height: 100%;
  background: linear-gradient(135deg, #daeef8, #c8dde8);
  clip-path: polygon(0 0, 0 100%, 100% 100%);
  z-index: 2;
}
.env-side-right {
  position: absolute;
  bottom: 0; right: 0;
  width: 50%; height: 100%;
  background: linear-gradient(225deg, #daeef8, #c8dde8);
  clip-path: polygon(100% 0, 0 100%, 100% 100%);
  z-index: 2;
}

/* Bottom triangle */
.env-bottom {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 60%;
  background: linear-gradient(to top, #e8f4fa, #d4e8f4);
  clip-path: polygon(0 100%, 50% 0%, 100% 100%);
  z-index: 3;
}

/* Letter */
.env-letter {
  position: absolute;
  left: 16px; right: 16px;
  bottom: 16px;
  height: 160px;
  background: linear-gradient(to bottom, #f8fcff, #eef7fc);
  border-radius: 4px;
  border: 1px solid rgba(91,143,168,0.2);
  z-index: 2;
  display: flex; align-items: center; justify-content: center;
  transition: transform 0.8s cubic-bezier(0.34,1.56,0.64,1), opacity 0.4s ease;
  transform: translateY(0);
  box-shadow: 0 -4px 20px rgba(91,143,168,0.15);
}

.env-letter.out {
  transform: translateY(-140px);
}

.letter-content { text-align: center; padding: 12px; }
.letter-ornament { margin-bottom: 8px; }
.letter-to {
  font-family: 'Cormorant Garamond', serif;
  font-size: 9px; letter-spacing: 3px; text-transform: uppercase;
  color: rgba(44,95,122,0.55); margin-bottom: 4px;
}
.letter-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(14px, 4vw, 18px);
  font-weight: 600; font-style: italic;
  color: #1e4a63; line-height: 1.2; margin-bottom: 8px;
}
.letter-divider {
  display: flex; align-items: center; gap: 6px;
  justify-content: center; margin-bottom: 8px;
}
.letter-divider span {
  height: 1px; width: 24px;
  background: rgba(91,143,168,0.25);
}
.div-dot {
  width: 4px !important; height: 4px !important;
  border-radius: 50% !important;
  background: rgba(91,143,168,0.4) !important;
}
.letter-from {
  font-family: 'Cormorant Garamond', serif;
  font-size: 9px; letter-spacing: 2px; text-transform: uppercase;
  color: rgba(44,95,122,0.45); margin-bottom: 2px;
}
.letter-couple {
  font-family: 'Cormorant Garamond', serif;
  font-size: 13px; font-style: italic;
  color: #2d5570; font-weight: 500;
}

/* Front flap */
.env-flap-front {
  position: absolute;
  top: 0; left: 0; right: 0; height: 50%;
  background: linear-gradient(to bottom, #d4e8f4, #c4d8e8);
  clip-path: polygon(0 0, 50% 55%, 100% 0);
  z-index: 5;
  transform-origin: top center;
  transition: transform 0.6s cubic-bezier(0.4,0,0.2,1);
}

.opening .env-flap-front,
.opened .env-flap-front,
.done .env-flap-front {
  transform: rotateX(180deg);
  background: linear-gradient(to top, #d4e8f4, #b8ceda);
}

/* Wax seal */
.env-seal {
  position: absolute;
  top: calc(50% - 22px);
  left: calc(50% - 22px);
  z-index: 6;
  transition: transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease;
}
.env-seal.broken {
  transform: scale(0) rotate(45deg);
  opacity: 0;
}

/* Hint text */
.env-hint {
  position: relative; z-index: 2;
  text-align: center;
  transition: opacity 0.3s ease;
}
.env-hint.hide { opacity: 0; pointer-events: none; }

.hint-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 12px; letter-spacing: 3px; text-transform: uppercase;
  color: rgba(44,95,122,0.55); margin-bottom: 14px;
}

.open-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 32px; border-radius: 100px; border: none;
  background: linear-gradient(135deg, #1e4a63, #2d6e8f);
  color: #e8f4fa;
  font-family: 'Cormorant Garamond', serif;
  font-size: 14px; font-weight: 600; letter-spacing: 2px;
  cursor: pointer; transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
  box-shadow: 0 8px 28px rgba(30,74,99,0.3),
              0 0 0 1px rgba(255,255,255,0.15) inset;
  margin-bottom: 10px;
}
.open-btn:hover {
  transform: translateY(-3px) scale(1.03);
  box-shadow: 0 14px 36px rgba(30,74,99,0.4);
}

.hint-sub {
  font-family: 'Cormorant Garamond', serif;
  font-size: 10px; letter-spacing: 2px;
  color: rgba(44,95,122,0.4);
  animation: pulse 2.5s ease-in-out infinite;
}

/* Transitions */
.envelope-screen-enter-active { transition: opacity 0.5s ease; }
.envelope-screen-leave-active { transition: opacity 0.8s ease, transform 0.8s ease; }
.envelope-screen-enter-from { opacity: 0; }
.envelope-screen-leave-to { opacity: 0; transform: scale(1.05); }

/* Keyframes */
@keyframes envFloat {
  0%,100% { transform: translateY(0) rotate(-1deg); }
  50% { transform: translateY(-12px) rotate(1deg); }
}
@keyframes envShake {
  0%,100% { transform: rotate(-1deg); }
  25% { transform: rotate(-3deg) translateX(-4px); }
  75% { transform: rotate(3deg) translateX(4px); }
}
@keyframes envLift {
  to { transform: translateY(-30px) scale(1.05); }
}
@keyframes envFadeOut {
  to { opacity: 0; transform: translateY(-60px) scale(0.95); }
}
@keyframes pulse {
  0%,100% { opacity: 0.4; }
  50% { opacity: 0.9; }
}
</style>
