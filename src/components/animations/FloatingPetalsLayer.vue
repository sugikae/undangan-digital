<template>
  <canvas ref="canvas" class="floating-layer" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { computed } from 'vue'
const props = defineProps<{ petalColor?: string }>()
const canvas = ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D | null = null
let animFrame: number
let W = 0, H = 0
let petals: any[] = []
let butterflies: any[] = []
let windX = 0, windTarget = 0, windTimer = 0

const colors = computed(() => {
  const base = props.petalColor ?? '#a8c5d8'
  return [base, lighten(base, 40), '#ffffff', lighten(base, 20), darken(base, 20)]
})

function lighten(hex: string, amt: number): string {
  try {
    const r = Math.min(255, parseInt(hex.slice(1,3),16) + amt)
    const g = Math.min(255, parseInt(hex.slice(3,5),16) + amt)
    const b = Math.min(255, parseInt(hex.slice(5,7),16) + amt)
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`
  } catch { return '#c8dde8' }
}
function darken(hex: string, amt: number): string {
  try {
    const r = Math.max(0, parseInt(hex.slice(1,3),16) - amt)
    const g = Math.max(0, parseInt(hex.slice(3,5),16) - amt)
    const b = Math.max(0, parseInt(hex.slice(5,7),16) - amt)
    return `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`
  } catch { return '#5b8fa8' }
}

function resize() {
  W = window.innerWidth; H = window.innerHeight
  if (canvas.value) { canvas.value.width = W; canvas.value.height = H }
}

function init() {
  resize()
  ctx = canvas.value?.getContext('2d') ?? null
  const base = props.petalColor ?? '#a8c5d8'
  const cls = [base, lighten(base,40), '#fff', lighten(base,20), darken(base,20)]
  const count = Math.min(35, Math.floor(W * H / 20000))
  petals = Array.from({ length: count }, () => createPetal(cls))
  butterflies = Array.from({ length: 3 }, () => createButterfly())
  loop()
}

function createPetal(cls: string[]) {
  return {
    x: Math.random() * W, y: Math.random() * H * -1,
    size: 5 + Math.random() * 12,
    speedY: 0.3 + Math.random() * 1.0,
    speedX: (Math.random() - 0.5) * 0.7,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.04,
    opacity: 0.3 + Math.random() * 0.5,
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: 0.02 + Math.random() * 0.02,
    wobbleAmp: 0.5 + Math.random() * 1.5,
    type: Math.floor(Math.random() * 3),
    color: cls[Math.floor(Math.random() * cls.length)],
    windPhase: Math.random() * Math.PI * 2,
  }
}

function createButterfly() {
  return {
    x: Math.random() * W, y: 50 + Math.random() * H * 0.5,
    targetX: Math.random() * W, targetY: 50 + Math.random() * H * 0.5,
    speedBase: 0.4 + Math.random() * 0.6,
    size: 12 + Math.random() * 12,
    wingPhase: Math.random() * Math.PI * 2,
    wingSpeed: 0.07 + Math.random() * 0.07,
    opacity: 0.5 + Math.random() * 0.4,
    wanderAngle: Math.random() * Math.PI * 2,
    age: Math.floor(Math.random() * 200),
    lifetime: 400 + Math.random() * 400,
  }
}

function updateWind() {
  windTimer++
  if (windTimer > 180) { windTarget = (Math.random() - 0.5) * 1.2; windTimer = 0 }
  windX += (windTarget - windX) * 0.005
}

function loop() {
  if (!ctx) return
  ctx.clearRect(0, 0, W, H)
  updateWind()

  const base = props.petalColor ?? '#a8c5d8'
  const cls = [base, lighten(base,40), '#fff', lighten(base,20), darken(base,20)]

  petals.forEach(p => {
    p.wobble += p.wobbleSpeed
    p.windPhase += 0.007
    p.x += p.speedX + Math.sin(p.wobble) * p.wobbleAmp + Math.sin(p.windPhase) * 0.6 + windX
    p.y += p.speedY
    p.rotation += p.rotSpeed
    if (p.y > H + 30 || p.x < -60 || p.x > W + 60) Object.assign(p, createPetal(cls), { y: -20 })
    drawPetal(ctx!, p)
  })

  butterflies.forEach(b => {
    b.age++; b.wingPhase += b.wingSpeed
    b.wanderAngle += (Math.random() - 0.5) * 0.03
    const dx = b.targetX - b.x, dy = b.targetY - b.y
    if (Math.sqrt(dx*dx+dy*dy) < 60) { b.targetX = 60 + Math.random()*(W-120); b.targetY = 50 + Math.random()*(H*0.5) }
    const angle = Math.atan2(dy, dx) + Math.sin(b.wanderAngle) * 0.5
    b.x += Math.cos(angle) * b.speedBase
    b.y += Math.sin(angle) * b.speedBase * 0.4 + Math.sin(b.wingPhase * 0.3) * 0.4
    if (b.age > b.lifetime) Object.assign(b, createButterfly())
    drawButterfly(ctx!, b)
  })

  animFrame = requestAnimationFrame(loop)
}

function drawPetal(c: CanvasRenderingContext2D, p: any) {
  c.save(); c.translate(p.x, p.y); c.rotate(p.rotation); c.globalAlpha = p.opacity
  if (p.type === 0) {
    c.beginPath(); c.moveTo(0,-p.size*.5)
    c.bezierCurveTo(p.size*.6,-p.size*.3, p.size*.6,p.size*.4, 0,p.size*.5)
    c.bezierCurveTo(-p.size*.6,p.size*.4, -p.size*.6,-p.size*.3, 0,-p.size*.5)
    c.fillStyle = p.color; c.fill()
  } else if (p.type === 1) {
    c.beginPath(); c.ellipse(0,0,p.size*.32,p.size*.54,0,0,Math.PI*2)
    c.fillStyle = p.color; c.fill()
  } else {
    c.beginPath(); c.moveTo(0,-p.size*.6)
    c.bezierCurveTo(p.size*.5,-p.size*.5, p.size*.5,p.size*.3, 0,p.size*.6)
    c.bezierCurveTo(-p.size*.5,p.size*.3, -p.size*.5,-p.size*.5, 0,-p.size*.6)
    c.fillStyle = p.color; c.fill()
  }
  c.restore()
}

function drawButterfly(c: CanvasRenderingContext2D, b: any) {
  const wf = Math.abs(Math.sin(b.wingPhase))
  const wo = 0.3 + wf * 0.7
  const base = props.petalColor ?? '#a8c5d8'
  const wing = lighten(base, 30)
  const accent = lighten(base, 50)
  c.save(); c.translate(b.x, b.y); c.globalAlpha = b.opacity
  const facing = (b.targetX - b.x) < 0 ? -1 : 1
  c.scale(facing, 1)
  for (const fx of [-1, 1]) {
    c.save(); c.scale(fx, 1)
    c.beginPath(); c.moveTo(0,0)
    c.bezierCurveTo(b.size*.1,-b.size*.78, b.size*.88*wo,-b.size*.88, b.size*wo,-b.size*.08)
    c.bezierCurveTo(b.size*.85*wo,b.size*.28, b.size*.18,b.size*.18, 0,0)
    const g = c.createRadialGradient(b.size*.28*wo,-b.size*.3,0, b.size*.28*wo,-b.size*.3,b.size*.75)
    g.addColorStop(0, accent+'CC'); g.addColorStop(.55, wing+'88'); g.addColorStop(1, base+'44')
    c.fillStyle = g; c.fill()
    c.restore()
  }
  c.beginPath(); c.ellipse(0,0,1.5,b.size*.3,0,0,Math.PI*2)
  c.fillStyle = darken(base, 30); c.fill()
  c.restore()
}

onMounted(() => { window.addEventListener('resize', resize); init() })
onUnmounted(() => { window.removeEventListener('resize', resize); cancelAnimationFrame(animFrame) })
</script>

<style scoped>
.floating-layer {
  position: fixed; inset: 0;
  pointer-events: none; z-index: 100;
  width: 100%; height: 100%;
}
</style>
