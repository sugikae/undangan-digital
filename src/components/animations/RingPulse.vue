<template>
  <canvas ref="canvas" class="anim-layer" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
const canvas = ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D | null = null
let animFrame: number
let W = 0, H = 0
let rings: any[] = []
let t = 0

function resize() {
  W = window.innerWidth; H = window.innerHeight
  if (canvas.value) { canvas.value.width = W; canvas.value.height = H }
}

function init() {
  resize()
  ctx = canvas.value?.getContext('2d') ?? null
  // Create ring centers at romantic positions
  rings = [
    { cx: W*0.5, cy: H*0.5, maxR: Math.min(W,H)*0.4, phase: 0, speed: 0.008, color: 'rgba(168,197,216,' },
    { cx: W*0.15, cy: H*0.2, maxR: Math.min(W,H)*0.2, phase: Math.PI, speed: 0.01, color: 'rgba(212,192,170,' },
    { cx: W*0.85, cy: H*0.8, maxR: Math.min(W,H)*0.2, phase: Math.PI*0.5, speed: 0.009, color: 'rgba(143,173,158,' },
  ]
  loop()
}

function loop() {
  if (!ctx) return
  ctx.clearRect(0, 0, W, H)
  t += 0.01

  rings.forEach(r => {
    // Draw 3 concentric pulsing rings
    for (let i = 0; i < 3; i++) {
      const phase = r.phase + t * r.speed + (i * Math.PI * 0.66)
      const progress = (Math.sin(phase) + 1) / 2 // 0..1
      const radius = r.maxR * (0.3 + progress * 0.7)
      const opacity = (1 - progress) * 0.12

      ctx!.beginPath()
      ctx!.arc(r.cx, r.cy, radius, 0, Math.PI * 2)
      ctx!.strokeStyle = r.color + opacity + ')'
      ctx!.lineWidth = 1.5 - progress
      ctx!.stroke()

      // Small dots on ring
      for (let d = 0; d < 8; d++) {
        const angle = (d / 8) * Math.PI * 2 + t * 0.2
        const dx = r.cx + Math.cos(angle) * radius
        const dy = r.cy + Math.sin(angle) * radius
        ctx!.beginPath(); ctx!.arc(dx, dy, 1.5, 0, Math.PI*2)
        ctx!.fillStyle = r.color + (opacity * 1.5) + ')'; ctx!.fill()
      }
    }
  })
  animFrame = requestAnimationFrame(loop)
}

onMounted(() => { window.addEventListener('resize', resize); init() })
onUnmounted(() => { window.removeEventListener('resize', resize); cancelAnimationFrame(animFrame) })
</script>
<style scoped>
.anim-layer { position:fixed; inset:0; pointer-events:none; z-index:96; width:100%; height:100%; }
</style>
