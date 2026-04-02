<template>
  <canvas ref="canvas" class="anim-layer" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
const canvas = ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D | null = null
let animFrame: number
let W = 0, H = 0
let creatures: any[] = []

function resize() {
  W = window.innerWidth; H = window.innerHeight
  if (canvas.value) { canvas.value.width = W; canvas.value.height = H }
}

function createCreature(type: 'butterfly'|'bird') {
  return {
    type, x: Math.random()*W, y: Math.random()*H*0.6,
    tx: Math.random()*W, ty: Math.random()*H*0.6,
    speed: 0.5 + Math.random()*0.8,
    size: type==='bird' ? 8+Math.random()*8 : 14+Math.random()*14,
    wingPhase: Math.random()*Math.PI*2,
    wingSpeed: type==='bird' ? 0.15+Math.random()*0.1 : 0.07+Math.random()*0.07,
    opacity: 0.5+Math.random()*0.4,
    wander: Math.random()*Math.PI*2,
    age: 0, lifetime: 350+Math.random()*400,
    color: type==='bird'
      ? ['#92bdd4','#b0cfe0','#d4e8f4'][Math.floor(Math.random()*3)]
      : ['#a8c5d8','#d4a574','#8fad9e'][Math.floor(Math.random()*3)],
  }
}

function init() {
  resize()
  ctx = canvas.value?.getContext('2d') ?? null
  creatures = [
    ...Array.from({length:4},()=>createCreature('butterfly')),
    ...Array.from({length:3},()=>createCreature('bird')),
  ]
  loop()
}

function loop() {
  if (!ctx) return
  ctx.clearRect(0, 0, W, H)
  creatures.forEach(cr => {
    cr.age++; cr.wingPhase += cr.wingSpeed; cr.wander += 0.02
    const dx = cr.tx-cr.x, dy = cr.ty-cr.y
    if (Math.sqrt(dx*dx+dy*dy) < 60) { cr.tx=60+Math.random()*(W-120); cr.ty=40+Math.random()*(H*0.55) }
    const angle = Math.atan2(dy,dx) + Math.sin(cr.wander)*0.4
    cr.x += Math.cos(angle)*cr.speed; cr.y += Math.sin(angle)*cr.speed*0.5 + Math.sin(cr.wingPhase*0.3)*0.3
    if (cr.age > cr.lifetime) Object.assign(cr, createCreature(cr.type))

    ctx!.save(); ctx!.translate(cr.x, cr.y); ctx!.globalAlpha = cr.opacity
    const facing = (cr.tx-cr.x)<0 ? -1:1
    ctx!.scale(facing,1)

    if (cr.type === 'butterfly') drawButterfly(ctx!, cr)
    else drawBird(ctx!, cr)
    ctx!.restore()
  })
  animFrame = requestAnimationFrame(loop)
}

function drawButterfly(c: CanvasRenderingContext2D, cr: any) {
  const wf = Math.abs(Math.sin(cr.wingPhase))
  const wo = 0.3 + wf * 0.7
  for (const fx of [-1,1]) {
    c.save(); c.scale(fx,1)
    c.beginPath(); c.moveTo(0,0)
    c.bezierCurveTo(cr.size*.1,-cr.size*.75, cr.size*.85*wo,-cr.size*.85, cr.size*wo,-cr.size*.08)
    c.bezierCurveTo(cr.size*.85*wo,cr.size*.25, cr.size*.18,cr.size*.18, 0,0)
    c.fillStyle = cr.color+'BB'; c.fill()
    c.restore()
  }
  c.beginPath(); c.ellipse(0,0,1.5,cr.size*.3,0,0,Math.PI*2)
  c.fillStyle = cr.color; c.fill()
}

function drawBird(c: CanvasRenderingContext2D, cr: any) {
  const wf = Math.sin(cr.wingPhase)
  const wy = wf * cr.size * 0.4
  c.beginPath()
  c.moveTo(-cr.size*0.5, wy)
  c.quadraticCurveTo(-cr.size*0.2, -wy*0.5, 0, 0)
  c.quadraticCurveTo(cr.size*0.2, -wy*0.5, cr.size*0.5, wy)
  c.strokeStyle = cr.color; c.lineWidth = 1.5; c.stroke()
  // Body dot
  c.beginPath(); c.arc(0,0,2,0,Math.PI*2)
  c.fillStyle = cr.color; c.fill()
}

onMounted(() => { window.addEventListener('resize', resize); init() })
onUnmounted(() => { window.removeEventListener('resize', resize); cancelAnimationFrame(animFrame) })
</script>
<style scoped>
.anim-layer { position:fixed; inset:0; pointer-events:none; z-index:101; width:100%; height:100%; }
</style>
