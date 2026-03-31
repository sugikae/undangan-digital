<template>
  <section class="hero-section">
    <!-- Background -->
    <div class="hero-bg" :style="{ transform: parallaxBg }">
      <div class="blob blob-1" />
      <div class="blob blob-2" />
      <div class="blob blob-3" />
    </div>

    <!-- Background SVG Branches -->
    <svg class="branches-svg" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" fill="none" :style="{ transform: parallaxBg }">
      <path d="M-20 800 Q50 600 100 400 Q150 200 80 0" stroke="#2c5f7a" stroke-width="1.5" opacity="0.15"/>
      <path d="M100 400 Q140 340 180 300" stroke="#2c5f7a" stroke-width="1" opacity="0.12"/>
      <path d="M80 200 Q110 160 150 140" stroke="#2c5f7a" stroke-width="1" opacity="0.12"/>
      <path d="M420 800 Q360 580 320 380 Q270 180 340 0" stroke="#2c5f7a" stroke-width="1.5" opacity="0.15"/>
      <path d="M320 380 Q280 320 240 290" stroke="#2c5f7a" stroke-width="1" opacity="0.12"/>
      <ellipse cx="180" cy="300" rx="8" ry="14" transform="rotate(-30 180 300)" fill="#5b8fa8" opacity="0.2"/>
      <ellipse cx="240" cy="290" rx="7" ry="12" transform="rotate(20 240 290)" fill="#5b8fa8" opacity="0.18"/>
      <ellipse cx="150" cy="140" rx="9" ry="15" transform="rotate(-45 150 140)" fill="#5b8fa8" opacity="0.2"/>
    </svg>

    <!-- Content -->
    <div class="hero-content" ref="contentRef" :style="{ transform: parallaxContent }">

      <!-- Top ornament -->
      <div class="ornament-top" :class="{ show: visible }">
        <svg width="180" height="40" viewBox="0 0 180 40" fill="none">
          <path d="M10 20 Q45 6 90 20 Q135 34 170 20" stroke="#2c5f7a" stroke-width="0.8" opacity="0.6"/>
          <path d="M10 20 Q45 34 90 20 Q135 6 170 20" stroke="#2c5f7a" stroke-width="0.5" opacity="0.4"/>
          <circle cx="90" cy="20" r="3.5" fill="#5b8fa8" opacity="0.55"/>
          <circle cx="10" cy="20" r="2" fill="#5b8fa8" opacity="0.35"/>
          <circle cx="170" cy="20" r="2" fill="#5b8fa8" opacity="0.35"/>
          <circle cx="46" cy="8" r="1.8" fill="#7aaec4" opacity="0.45"/>
          <circle cx="134" cy="8" r="1.8" fill="#7aaec4" opacity="0.45"/>
        </svg>
      </div>

      <!-- Label -->
      <p class="hero-label" :class="{ show: visible }">The Wedding of</p>

      <!-- Names -->
      <div class="hero-names" :class="{ show: visible }">
        <span class="name-bride">{{ brideName }}</span>
        <span class="hero-amp">&</span>
        <span class="name-groom">{{ groomName }}</span>
      </div>

      <!-- Divider -->
      <div class="hero-divider" :class="{ show: visible }">
        <span class="line" />
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 1v12M1 7h12" stroke="rgba(44,95,122,0.4)" stroke-width="0.8"/>
          <circle cx="7" cy="7" r="2.5" stroke="rgba(44,95,122,0.4)" stroke-width="0.8" fill="none"/>
        </svg>
        <span class="line" />
      </div>

      <!-- Date -->
      <p class="hero-date" :class="{ show: visible }">
        {{ formattedDate }}
      </p>

      <!-- Location snippet -->
      <p class="hero-location" :class="{ show: visible }">
        {{ firstVenue }}
      </p>

      <!-- Bottom flower illustration -->
      <div class="flower-bottom" :class="{ show: visible }">
        <svg viewBox="0 0 360 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- Stems -->
          <path d="M180 100 Q180 70 180 52" stroke="#5b8fa8" stroke-width="1.2" opacity="0.4"/>
          <path d="M180 80 Q162 66 144 62" stroke="#5b8fa8" stroke-width="1" opacity="0.35"/>
          <path d="M180 80 Q198 66 216 62" stroke="#5b8fa8" stroke-width="1" opacity="0.35"/>
          <path d="M160 72 Q132 58 106 54" stroke="#5b8fa8" stroke-width="0.8" opacity="0.3"/>
          <path d="M200 72 Q228 58 254 54" stroke="#5b8fa8" stroke-width="0.8" opacity="0.3"/>
          <path d="M112 56 Q76 42 52 38" stroke="#5b8fa8" stroke-width="0.7" opacity="0.25"/>
          <path d="M248 56 Q284 42 308 38" stroke="#5b8fa8" stroke-width="0.7" opacity="0.25"/>
          <!-- Center Rose -->
          <g transform="translate(180,44)">
            <circle r="15" fill="#92bdd4" opacity="0.25"/>
            <circle r="11" fill="#7aaec4" opacity="0.35"/>
            <circle r="7" fill="#5b8fa8" opacity="0.5"/>
            <circle r="3.5" fill="#2d5570" opacity="0.55"/>
            <circle r="1.5" fill="white" opacity="0.5"/>
            <ellipse cx="0" cy="-13" rx="4.5" ry="7" fill="#92bdd4" opacity="0.45"/>
            <ellipse cx="13" cy="0" rx="7" ry="4.5" fill="#92bdd4" opacity="0.45"/>
            <ellipse cx="0" cy="13" rx="4.5" ry="7" fill="#92bdd4" opacity="0.45"/>
            <ellipse cx="-13" cy="0" rx="7" ry="4.5" fill="#92bdd4" opacity="0.45"/>
            <ellipse cx="9" cy="-9" rx="4" ry="6" transform="rotate(45 9 -9)" fill="#b0cfe0" opacity="0.38"/>
            <ellipse cx="9" cy="9" rx="4" ry="6" transform="rotate(-45 9 9)" fill="#b0cfe0" opacity="0.38"/>
            <ellipse cx="-9" cy="9" rx="4" ry="6" transform="rotate(45 -9 9)" fill="#b0cfe0" opacity="0.38"/>
            <ellipse cx="-9" cy="-9" rx="4" ry="6" transform="rotate(-45 -9 -9)" fill="#b0cfe0" opacity="0.38"/>
          </g>
          <!-- Side roses -->
          <g transform="translate(144,56)"><circle r="10" fill="#92bdd4" opacity="0.22"/><circle r="7" fill="#7aaec4" opacity="0.32"/><circle r="4" fill="#5b8fa8" opacity="0.42"/><circle r="2" fill="white" opacity="0.38"/><ellipse cx="0" cy="-9" rx="3.5" ry="5.5" fill="#b0cfe0" opacity="0.35"/><ellipse cx="9" cy="0" rx="5.5" ry="3.5" fill="#b0cfe0" opacity="0.35"/><ellipse cx="0" cy="9" rx="3.5" ry="5.5" fill="#b0cfe0" opacity="0.35"/><ellipse cx="-9" cy="0" rx="5.5" ry="3.5" fill="#b0cfe0" opacity="0.35"/></g>
          <g transform="translate(216,56)"><circle r="10" fill="#92bdd4" opacity="0.22"/><circle r="7" fill="#7aaec4" opacity="0.32"/><circle r="4" fill="#5b8fa8" opacity="0.42"/><circle r="2" fill="white" opacity="0.38"/><ellipse cx="0" cy="-9" rx="3.5" ry="5.5" fill="#b0cfe0" opacity="0.35"/><ellipse cx="9" cy="0" rx="5.5" ry="3.5" fill="#b0cfe0" opacity="0.35"/><ellipse cx="0" cy="9" rx="3.5" ry="5.5" fill="#b0cfe0" opacity="0.35"/><ellipse cx="-9" cy="0" rx="5.5" ry="3.5" fill="#b0cfe0" opacity="0.35"/></g>
          <g transform="translate(106,47)"><circle r="7" fill="#7aaec4" opacity="0.28"/><circle r="4" fill="#5b8fa8" opacity="0.38"/><circle r="1.8" fill="white" opacity="0.32"/></g>
          <g transform="translate(254,47)"><circle r="7" fill="#7aaec4" opacity="0.28"/><circle r="4" fill="#5b8fa8" opacity="0.38"/><circle r="1.8" fill="white" opacity="0.32"/></g>
          <g transform="translate(52,32)"><circle r="5.5" fill="#92bdd4" opacity="0.22"/><circle r="3" fill="#5b8fa8" opacity="0.32"/></g>
          <g transform="translate(308,32)"><circle r="5.5" fill="#92bdd4" opacity="0.22"/><circle r="3" fill="#5b8fa8" opacity="0.32"/></g>
          <!-- Leaves -->
          <ellipse cx="124" cy="62" rx="7" ry="12" transform="rotate(-38 124 62)" fill="#5b8fa8" opacity="0.25"/>
          <ellipse cx="236" cy="62" rx="7" ry="12" transform="rotate(38 236 62)" fill="#5b8fa8" opacity="0.25"/>
          <ellipse cx="88" cy="51" rx="6" ry="10" transform="rotate(-48 88 51)" fill="#6b9ab8" opacity="0.22"/>
          <ellipse cx="272" cy="51" rx="6" ry="10" transform="rotate(48 272 51)" fill="#6b9ab8" opacity="0.22"/>
        </svg>
      </div>

      <!-- Scroll hint -->
      <div class="scroll-hint" :class="{ show: visible }">
        <div class="scroll-line" />
        <p>scroll</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { InvitationConfig, Venue } from '@/types'
import dayjs from 'dayjs'
import 'dayjs/locale/id'
dayjs.locale('id')

const props = defineProps<{
  brideName: string
  groomName: string
  eventDate: string
  config: InvitationConfig | null
  enableParallax?: boolean   // ← tambah ini
}>()

const visible = ref(false)
const contentRef = ref<HTMLElement>()
const scrollY = ref(0)

const formattedDate = computed(() => {
  if (!props.eventDate) return ''
  return dayjs(props.eventDate).format('dddd, DD MMMM YYYY')
})

const firstVenue = computed(() => {
  const venues = props.config?.venues ?? []
  return venues[0]?.location?.split(',')[0] ?? ''
})

const parallaxBg = computed(() =>
  props.enableParallax ? `translateY(${scrollY.value * 0.5}px)` : 'none'
)
const parallaxContent = computed(() =>
  props.enableParallax ? `translateY(${scrollY.value * -0.15}px)` : 'none'
)

function onScroll() { scrollY.value = window.scrollY }

onMounted(() => {
  setTimeout(() => { visible.value = true }, 200)
  window.addEventListener('scroll', onScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.hero-section {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(160deg, #c8dde8 0%, #daeef8 35%, #eef7fc 65%, #d4e8f2 100%);
}

/* Background blobs */
.hero-bg { position: absolute; inset: 0; pointer-events: none; }
.blob { position: absolute; border-radius: 50%; filter: blur(70px); }
.blob-1 { width: 500px; height: 400px; background: rgba(168,205,220,0.35); top: -80px; left: -80px; }
.blob-2 { width: 380px; height: 480px; background: rgba(184,218,232,0.28); top: 180px; right: -60px; }
.blob-3 { width: 550px; height: 280px; background: rgba(200,228,240,0.22); bottom: 0; left: 40px; }

.branches-svg {
  position: absolute; inset: 0; width: 100%; height: 100%;
  pointer-events: none; z-index: 0;
}
.hero-bg {
  transition: transform 0.1s linear;
}

.hero-content {
  transition: transform 0.1s linear;
}
/* Content */
.hero-content {
  position: relative; z-index: 2;
  text-align: center;
  padding: 60px 32px 40px;
  width: 100%; max-width: 480px;
}

/* Animations — reveal on mount */
.ornament-top, .hero-label, .hero-names, .hero-divider,
.hero-date, .hero-location, .flower-bottom, .scroll-hint {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.ornament-top.show  { opacity: 1; transform: translateY(0); transition-delay: 0.1s; }
.hero-label.show    { opacity: 1; transform: translateY(0); transition-delay: 0.25s; }
.hero-names.show    { opacity: 1; transform: translateY(0); transition-delay: 0.4s; }
.hero-divider.show  { opacity: 1; transform: translateY(0); transition-delay: 0.55s; }
.hero-date.show     { opacity: 1; transform: translateY(0); transition-delay: 0.7s; }
.hero-location.show { opacity: 1; transform: translateY(0); transition-delay: 0.82s; }
.flower-bottom.show { opacity: 1; transform: translateY(0); transition-delay: 0.95s; }
.scroll-hint.show   { opacity: 1; transform: translateY(0); transition-delay: 1.2s; }

.ornament-top { margin-bottom: 20px; }

.hero-label {
  font-family: 'Cormorant Garamond', serif;
  font-size: 11px;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: rgba(44,95,122,0.7);
  margin-bottom: 12px;
}

.hero-names {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  margin-bottom: 4px;
}

.name-bride, .name-groom {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(40px, 11vw, 68px);
  font-style: italic;
  font-weight: 300;
  color: #1e4a63;
  line-height: 1;
  text-shadow: 0 4px 28px rgba(184,212,228,0.7);
}

.hero-amp {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(22px, 5vw, 32px);
  color: #5b8fa8;
  font-weight: 400;
  line-height: 1.4;
}

.hero-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 20px 0;
}
.hero-divider .line { height: 1px; width: 44px; background: rgba(44,95,122,0.25); }

.hero-date {
  font-family: 'Cormorant Garamond', serif;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 1.5px;
  color: #2d5570;
  margin-bottom: 6px;
  text-transform: capitalize;
}

.hero-location {
  font-family: 'Cormorant Garamond', serif;
  font-size: 13px;
  color: rgba(44,95,122,0.6);
  letter-spacing: 1px;
  margin-bottom: 0;
}

.flower-bottom {
  margin: 24px auto 0;
  width: 100%;
  max-width: 360px;
}

/* Scroll hint */
.scroll-hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 32px;
}
.scroll-line {
  width: 1px; height: 40px;
  background: linear-gradient(to bottom, rgba(44,95,122,0), rgba(44,95,122,0.4));
  animation: scrollPulse 2s ease-in-out infinite;
}
.scroll-hint p {
  font-family: 'Cormorant Garamond', serif;
  font-size: 10px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(44,95,122,0.45);
}

@keyframes scrollPulse {
  0%, 100% { opacity: 0.4; transform: scaleY(1); }
  50% { opacity: 1; transform: scaleY(1.1); }
}
</style>
