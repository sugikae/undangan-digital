<template>
  <div
    ref="el"
    class="scroll-reveal"
    :class="[`effect-${effect}`, { visible: isVisible }]"
    :style="{ transitionDelay: `${delay}ms` }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

type ScrollEffect = 'fade-up' | 'zoom-in' | 'bounce' | 'slide-left' | 'flip-up'

const props = withDefaults(defineProps<{
  effect?: ScrollEffect
  delay?: number
  threshold?: number
}>(), {
  effect: 'fade-up',
  delay: 0,
  threshold: 0.15,
})

const el = ref<HTMLElement>()
const isVisible = ref(false)
let observer: IntersectionObserver

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry?.isIntersecting) {
        isVisible.value = true
        observer.disconnect()
      }
    },
    { threshold: props.threshold }
  )
  if (el.value) observer.observe(el.value)
})

onUnmounted(() => observer?.disconnect())
</script>

<style scoped>
.scroll-reveal {
  transition: all 0.8s cubic-bezier(0.34, 1.2, 0.64, 1);
}

/* ── fade-up ── */
.effect-fade-up {
  opacity: 0;
  transform: translateY(40px);
}
.effect-fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ── zoom-in ── */
.effect-zoom-in {
  opacity: 0;
  transform: scale(0.85);
}
.effect-zoom-in.visible {
  opacity: 1;
  transform: scale(1);
}

/* ── bounce ── */
.effect-bounce {
  opacity: 0;
  transform: translateY(60px) scale(0.9);
  transition: all 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
}
.effect-bounce.visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* ── slide-left ── */
.effect-slide-left {
  opacity: 0;
  transform: translateX(-50px);
}
.effect-slide-left.visible {
  opacity: 1;
  transform: translateX(0);
}

/* ── flip-up ── */
.effect-flip-up {
  opacity: 0;
  transform: perspective(600px) rotateX(25deg) translateY(30px);
  transition: all 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
}
.effect-flip-up.visible {
  opacity: 1;
  transform: perspective(600px) rotateX(0deg) translateY(0);
}
</style>
