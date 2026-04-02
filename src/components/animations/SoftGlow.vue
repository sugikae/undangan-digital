<template>
  <div class="glow-layer">
    <div v-for="(g, i) in glows" :key="i"
      class="glow-orb"
      :style="{
        left: g.x + '%', top: g.y + '%',
        width: g.size + 'px', height: g.size + 'px',
        background: g.color,
        animationDuration: g.dur + 's',
        animationDelay: g.delay + 's',
      }"
    />
  </div>
</template>

<script setup lang="ts">
const glows = Array.from({ length: 8 }, (_, i) => ({
  x: 10 + Math.random() * 80,
  y: 10 + Math.random() * 80,
  size: 200 + Math.random() * 300,
  color: [
    'radial-gradient(circle, rgba(168,197,216,0.15) 0%, transparent 70%)',
    'radial-gradient(circle, rgba(212,192,170,0.12) 0%, transparent 70%)',
    'radial-gradient(circle, rgba(143,173,158,0.12) 0%, transparent 70%)',
    'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
  ][i % 4],
  dur: 8 + Math.random() * 8,
  delay: Math.random() * -10,
}))
</script>

<style scoped>
.glow-layer {
  position: fixed; inset: 0; z-index: 97;
  pointer-events: none; overflow: hidden;
}
.glow-orb {
  position: absolute; border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: glowFloat ease-in-out infinite alternate;
}
@keyframes glowFloat {
  0% { transform: translate(-50%,-50%) scale(1); opacity: 0.5; }
  100% { transform: translate(-50%,-50%) scale(1.3); opacity: 1; }
}
</style>
