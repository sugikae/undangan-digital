<template>
  <canvas ref="canvas" class="anim-layer" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
const canvas = ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D | null = null
let animFrame: number
let W = 0, H = 0
let branches: any[] = []
let progress = 0

function resize() {
  W = window.innerWidth; H = window.innerHeight
  if (canvas.value) { canvas.value.width = W; canvas.value.height = H }
}

function createBranch(x: number, y: number, angle: number, length: number, depth: number) {
  return { x, y, angle, length, depth, progress: 0, speed: 0.008 + Math.random()*0.006 }
}

function init() {
  resize()
  ctx = canvas.value?.getContext('2d') ?? null
  branches = [
    createBranch(0, H*0.7, -30, 120, 4),
    createBranch(W, H*0.6, -150, 110, 4),
    createBranch(W*0.2, H, -80, 100, 3),
    createBranch(W*0.8, H, -100, 100, 3),
  ]
  loop()
}

function drawBranch(c: CanvasRenderingContext2D, b: any, t: number) {
  if (b.depth <= 0 || b.length < 8) return
  const rad = (b.angle * Math.PI) / 180
  const ex = b.x + Math.cos(rad) * b.length * t
  const ey = b.y + Math.sin(rad) * b.length * t
  c.beginPath(); c.moveTo(b.x, b.y); c.lineTo(ex, ey)
  c.strokeStyle = `rgba(91,143,168,${0.08 + b.depth * 0.03})`
  c.lineWidth = b.depth * 0.4; c.stroke()

  if (t >= 1) {
    // Draw small leaf at end
    c.save(); c.translate(ex, ey); c.rotate(rad)
    c.beginPath()
    c.moveTo(0, 0)
    c.bezierCurveTo(8, -6, 8, 6, 0, 10)
    c.bezierCurveTo(-4, 6, -4, -6, 0, 0)
    c.fillStyle = `rgba(91,143,168,${0.06 + b.depth * 0.02})`
    c.fill(); c.restore()
    // Sub branches
    drawBranch(c, { x:ex,y:ey, angle:b.angle-25, length:b.length*0.65, depth:b.depth-1 }, t)
    drawBranch(c, { x:ex,y:ey, angle:b.angle+20, length:b.length*0.6, depth:b.depth-1 }, t)
  }
}

function loop() {
  if (!ctx) return
  ctx.clearRect(0, 0, W, H)
  progress = Math.min(1, progress + 0.003)
  branches.forEach(b => drawBranch(ctx!, b, progress))
  animFrame = requestAnimationFrame(loop)
}

onMounted(() => { window.addEventListener('resize', resize); init() })
onUnmounted(() => { window.removeEventListener('resize', resize); cancelAnimationFrame(animFrame) })
</script>
<style scoped>
.anim-layer { position:fixed; inset:0; pointer-events:none; z-index:99; width:100%; height:100%; }
</style>
