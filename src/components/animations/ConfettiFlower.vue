<template>
  <Teleport to="body">
    <canvas
      ref="canvas"
      class="confetti-canvas"
      v-if="active"
    />
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'

const props = defineProps<{ trigger: boolean }>()

const canvas = ref<HTMLCanvasElement>()
const active = ref(false)
let animFrame: number
let particles: ConfettiPetal[] = []

class ConfettiPetal {
  x: number; y: number
  vx: number; vy: number
  rotation: number; rotSpeed: number
  size: number; opacity: number
  color: string; type: number
  gravity: number; wobble: number; wobbleSpeed: number

  constructor(w: number, h: number) {
    this.x = Math.random() * w
    this.y = -20 - Math.random() * 100
    this.vx = (Math.random() - 0.5) * 4
    this.vy = 2 + Math.random() * 4
    this.rotation = Math.random() * Math.PI * 2
    this.rotSpeed = (Math.random() - 0.5) * 0.15
    this.size = 6 + Math.random() * 12
    this.opacity = 0.8 + Math.random() * 0.2
    this.gravity = 0.08 + Math.random() * 0.06
    this.wobble = Math.random() * Math.PI * 2
    this.wobbleSpeed = 0.03 + Math.random() * 0.04
    const colors = [
      '#92bdd4','#b0cfe0','#d4e8f4',
      '#ffffff','#ffd6e0','#ffb7c5',
      '#c8dde8','#5b8fa8','#e8d5b0'
    ]
    this.color = colors[Math.floor(Math.random() * colors.length)] ?? '#92bdd4'
    this.type = Math.floor(Math.random() * 3)
  }

  update() {
    this.wobble += this.wobbleSpeed
    this.vy += this.gravity
    this.vx += Math.sin(this.wobble) * 0.1
    this.x += this.vx
    this.y += this.vy
    this.rotation += this.rotSpeed
    this.opacity -= 0.004
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.translate(this.x, this.y)
    ctx.rotate(this.rotation)
    ctx.globalAlpha = Math.max(0, this.opacity)

    if (this.type === 0) {
      ctx.beginPath()
      ctx.moveTo(0, -this.size * 0.5)
      ctx.bezierCurveTo(this.size*0.6, -this.size*0.3, this.size*0.6, this.size*0.4, 0, this.size*0.5)
      ctx.bezierCurveTo(-this.size*0.6, this.size*0.4, -this.size*0.6, -this.size*0.3, 0, -this.size*0.5)
      ctx.fillStyle = this.color; ctx.fill()
    } else if (this.type === 1) {
      ctx.beginPath()
      ctx.arc(0, 0, this.size * 0.4, 0, Math.PI * 2)
      ctx.fillStyle = this.color; ctx.fill()
    } else {
      const s = this.size * 0.5
      ctx.beginPath()
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5 - Math.PI / 2
        const x = Math.cos(angle) * s
        const y = Math.sin(angle) * s
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
        const ia = angle + Math.PI / 5
        ctx.lineTo(Math.cos(ia) * s * 0.4, Math.sin(ia) * s * 0.4)
      }
      ctx.closePath()
      ctx.fillStyle = this.color; ctx.fill()
    }
    ctx.restore()
  }
}

function launch() {
  active.value = true
  setTimeout(() => {
    if (!canvas.value) return
    const ctx = canvas.value.getContext('2d')!
    canvas.value.width = window.innerWidth
    canvas.value.height = window.innerHeight

    particles = Array.from({ length: 120 }, () =>
      new ConfettiPetal(window.innerWidth, window.innerHeight)
    )

    function loop() {
      ctx.clearRect(0, 0, canvas.value!.width, canvas.value!.height)
      particles.forEach(p => { p.update(); p.draw(ctx) })
      particles = particles.filter(p => p.opacity > 0 && p.y < canvas.value!.height + 50)
      if (particles.length > 0) {
        animFrame = requestAnimationFrame(loop)
      } else {
        active.value = false
      }
    }
    loop()
  }, 50)
}

watch(() => props.trigger, (val) => { if (val) launch() })
onUnmounted(() => cancelAnimationFrame(animFrame))
</script>

<style scoped>
.confetti-canvas {
  position: fixed; inset: 0;
  pointer-events: none; z-index: 9998;
}
</style>
