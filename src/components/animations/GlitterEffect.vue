<template>
  <canvas ref="canvas" class="anim-layer" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
const canvas = ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D | null = null
let animFrame: number
let W = 0, H = 0
let glitters: any[] = []

function resize() {
  W = window.innerWidth; H = window.innerHeight
  if (canvas.value) { canvas.value.width = W; canvas.value.height = H }
}

function init() {
  resize()
  ctx = canvas.value?.getContext('2d') ?? null
  glitters = Array.from({ length: 120 }, () => createGlitter())
  loop()
}

function createGlitter() {
  return {
    x: Math.random() * W, y: Math.random() * H,
    size: 0.5 + Math.random() * 3,
    opacity: 0, maxOp: 0.4 + Math.random() * 0.6,
    phase: Math.random() * Math.PI * 2,
    speed: 0.02 + Math.random() * 0.05,
    color: ['#ffffff','#ffe8cc','#ffd6e0','#e8f4ff','#fff5cc'][Math.floor(Math.random()*5)],
    type: Math.floor(Math.random() * 3), // 0=dot, 1=star, 2=diamond
    vx: (Math.random()-0.5)*0.3, vy: -0.1 - Math.random()*0.3,
  }
}

function loop() {
  if (!ctx) return
  ctx.clearRect(0, 0, W, H)
  glitters.forEach(g => {
    g.phase += g.speed
    g.opacity = g.maxOp * Math.abs(Math.sin(g.phase))
    g.x += g.vx; g.y += g.vy
    if (g.y < -10) { g.y = H + 10; g.x = Math.random() * W }

    ctx!.save(); ctx!.translate(g.x, g.y); ctx!.globalAlpha = g.opacity

    if (g.type === 0) {
      const gr = ctx!.createRadialGradient(0,0,0,0,0,g.size*3)
      gr.addColorStop(0, g.color); gr.addColorStop(1, 'transparent')
      ctx!.beginPath(); ctx!.arc(0,0,g.size*3,0,Math.PI*2)
      ctx!.fillStyle = gr; ctx!.fill()
    } else if (g.type === 1) {
      const s = g.size * 2
      ctx!.beginPath()
      ctx!.moveTo(0,-s); ctx!.lineTo(0,s)
      ctx!.moveTo(-s,0); ctx!.lineTo(s,0)
      ctx!.strokeStyle = g.color; ctx!.lineWidth = 0.8; ctx!.stroke()
      const sd = s*0.5
      ctx!.beginPath()
      ctx!.moveTo(-sd,-sd); ctx!.lineTo(sd,sd)
      ctx!.moveTo(sd,-sd); ctx!.lineTo(-sd,sd)
      ctx!.strokeStyle = g.color; ctx!.lineWidth = 0.5; ctx!.stroke()
    } else {
      const d = g.size * 2
      ctx!.beginPath()
      ctx!.moveTo(0,-d); ctx!.lineTo(d*0.4,0)
      ctx!.lineTo(0,d); ctx!.lineTo(-d*0.4,0)
      ctx!.closePath(); ctx!.fillStyle = g.color; ctx!.fill()
    }
    ctx!.restore()
  })
  animFrame = requestAnimationFrame(loop)
}

onMounted(() => { window.addEventListener('resize', resize); init() })
onUnmounted(() => { window.removeEventListener('resize', resize); cancelAnimationFrame(animFrame) })
</script>
<style scoped>
.anim-layer { position:fixed; inset:0; pointer-events:none; z-index:101; width:100%; height:100%; }
</style>
