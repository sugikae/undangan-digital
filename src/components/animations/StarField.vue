<template>
  <canvas ref="canvas" class="star-canvas" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const canvas = ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D | null = null
let animFrame: number
let stars: Star[] = []
let W = 0, H = 0

class Star {
  x: number; y: number; size: number
  maxOpacity: number; opacity: number
  twinkleSpeed: number; twinklePhase: number
  speedY: number; type: number

  constructor() {
    this.x = Math.random() * W
    this.y = Math.random() * H
    this.size = 0.8 + Math.random() * 2.5
    this.maxOpacity = 0.12 + Math.random() * 0.28
    this.opacity = Math.random() * this.maxOpacity
    this.twinkleSpeed = 0.015 + Math.random() * 0.025
    this.twinklePhase = Math.random() * Math.PI * 2
    this.speedY = 0.08 + Math.random() * 0.15
    this.type = Math.floor(Math.random() * 3)
  }

  update() {
    this.twinklePhase += this.twinkleSpeed
    this.opacity = this.maxOpacity * (0.3 + 0.7 * Math.abs(Math.sin(this.twinklePhase)))
    this.y -= this.speedY
    if (this.y < -10) { this.y = H + 10; this.x = Math.random() * W }
  }

  draw(c: CanvasRenderingContext2D) {
    c.save()
    c.globalAlpha = this.opacity
    c.translate(this.x, this.y)

    if (this.type === 0) {
      // Glowing dot
      const g = c.createRadialGradient(0,0,0,0,0,this.size*2.5)
      g.addColorStop(0, 'rgba(255,255,255,0.95)')
      g.addColorStop(0.4, 'rgba(200,228,240,0.5)')
      g.addColorStop(1, 'rgba(200,228,240,0)')
      c.beginPath()
      c.arc(0,0,this.size*2.5,0,Math.PI*2)
      c.fillStyle = g; c.fill()
      c.beginPath()
      c.arc(0,0,this.size*0.4,0,Math.PI*2)
      c.fillStyle = 'white'; c.fill()
    } else if (this.type === 1) {
      // 4-point star
      const s = this.size * 1.8
      c.beginPath()
      c.moveTo(0,-s); c.lineTo(0,s)
      c.moveTo(-s,0); c.lineTo(s,0)
      c.strokeStyle = 'rgba(255,255,255,0.75)'
      c.lineWidth = 0.7; c.stroke()
      const sd = s * 0.45
      c.beginPath()
      c.moveTo(-sd,-sd); c.lineTo(sd,sd)
      c.moveTo(sd,-sd); c.lineTo(-sd,sd)
      c.strokeStyle = 'rgba(255,255,255,0.35)'
      c.lineWidth = 0.5; c.stroke()
    } else {
      // Diamond
      const d = this.size * 1.4
      c.beginPath()
      c.moveTo(0,-d); c.lineTo(d*0.4,0)
      c.lineTo(0,d); c.lineTo(-d*0.4,0)
      c.closePath()
      c.fillStyle = 'rgba(220,240,250,0.65)'; c.fill()
    }
    c.restore()
  }
}

function resize() {
  W = window.innerWidth; H = window.innerHeight
  if (canvas.value) { canvas.value.width = W; canvas.value.height = H }
}

function init() {
  resize()
  ctx = canvas.value?.getContext('2d') ?? null
  const count = Math.min(80, Math.floor(W * H / 10000))
  stars = Array.from({ length: count }, () => new Star())
  loop()
}

function loop() {
  if (!ctx) return
  ctx.clearRect(0, 0, W, H)
  stars.forEach(s => { s.update(); s.draw(ctx!) })
  animFrame = requestAnimationFrame(loop)
}

onMounted(() => {
  window.addEventListener('resize', resize)
  init()
})
onUnmounted(() => {
  window.removeEventListener('resize', resize)
  cancelAnimationFrame(animFrame)
})
</script>

<style scoped>
.star-canvas {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 99;
  width: 100%; height: 100%;
}
</style>
