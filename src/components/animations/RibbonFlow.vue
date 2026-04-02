<template>
  <canvas ref="canvas" class="anim-layer" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
const canvas = ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D | null = null
let animFrame: number
let W = 0, H = 0
let ribbons: any[] = []
let t = 0

function resize() {
  W = window.innerWidth; H = window.innerHeight
  if (canvas.value) { canvas.value.width = W; canvas.value.height = H }
}

function init() {
  resize()
  ctx = canvas.value?.getContext('2d') ?? null
  ribbons = Array.from({ length: 5 }, (_, i) => ({
    startX: Math.random() * W,
    amp: 40 + Math.random() * 80,
    freq: 0.003 + Math.random() * 0.004,
    speed: 0.008 + Math.random() * 0.008,
    phase: (i / 5) * Math.PI * 2,
    color: ['rgba(168,197,216,0.12)','rgba(212,192,170,0.1)','rgba(143,173,158,0.1)','rgba(200,221,232,0.12)','rgba(255,255,255,0.08)'][i],
    width: 2 + Math.random() * 3,
    offset: Math.random() * W,
  }))
  loop()
}

function loop() {
  if (!ctx) return
  ctx.clearRect(0, 0, W, H)
  t += 0.01
  ribbons.forEach(r => {
    ctx!.beginPath()
    ctx!.moveTo(0, H/2)
    for (let x = 0; x <= W; x += 4) {
      const y = H/2 + Math.sin(x * r.freq + t * r.speed + r.phase) * r.amp
             + Math.sin(x * r.freq * 0.5 + t * r.speed * 0.7) * r.amp * 0.4
      x === 0 ? ctx!.moveTo(x, y) : ctx!.lineTo(x, y)
    }
    ctx!.strokeStyle = r.color
    ctx!.lineWidth = r.width
    ctx!.stroke()
  })
  animFrame = requestAnimationFrame(loop)
}

onMounted(() => { window.addEventListener('resize', resize); init() })
onUnmounted(() => { window.removeEventListener('resize', resize); cancelAnimationFrame(animFrame) })
</script>
<style scoped>
.anim-layer { position:fixed; inset:0; pointer-events:none; z-index:98; width:100%; height:100%; }
</style>
