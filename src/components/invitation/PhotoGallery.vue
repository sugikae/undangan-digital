<template>
  <section class="gallery-section" ref="sectionRef">

    <div class="top-connector">
      <div class="connector-line" />
      <div class="connector-dot" />
      <div class="connector-line" />
    </div>

    <p class="section-label" :class="{ show: visible }">Galeri Foto</p>

    <!-- Grid -->
    <div class="gallery-grid" :class="{ show: visible }">
      <div
        v-for="(item, i) in galleries"
        :key="item.id"
        class="gallery-item"
        :style="{ transitionDelay: `${i * 0.08}s` }"
        @click="openLightbox(i)"
      >
        <img :src="item.thumbnail_url || item.url" :alt="item.caption || ''" loading="lazy" />
        <div class="gallery-overlay">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="white" stroke-width="1.5"/>
            <path d="M20 20l-3-3" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            <path d="M8 11h6M11 8v6" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition name="lightbox">
        <div v-if="lightboxOpen" class="lightbox" @click.self="closeLightbox">
          <button class="lb-close" @click="closeLightbox">✕</button>

          <button class="lb-nav lb-prev" @click="prevPhoto" v-if="galleries.length > 1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>

          <div class="lb-content">
            <img :src="currentPhoto?.url" :alt="currentPhoto?.caption || ''" />
            <p v-if="currentPhoto?.caption" class="lb-caption">{{ currentPhoto.caption }}</p>
            <p class="lb-counter">{{ currentIndex + 1 }} / {{ galleries.length }}</p>
          </div>

          <button class="lb-nav lb-next" @click="nextPhoto" v-if="galleries.length > 1">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </Transition>
    </Teleport>

  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Gallery } from '@/types'

const props = defineProps<{ galleries: Gallery[] }>()

const sectionRef = ref<HTMLElement>()
const visible = ref(false)
const lightboxOpen = ref(false)
const currentIndex = ref(0)

const currentPhoto = computed(() => props.galleries[currentIndex.value] ?? null)

function openLightbox(i: number) {
  currentIndex.value = i
  lightboxOpen.value = true
  document.body.style.overflow = 'hidden'
}

function closeLightbox() {
  lightboxOpen.value = false
  document.body.style.overflow = ''
}

function prevPhoto() {
  currentIndex.value = (currentIndex.value - 1 + props.galleries.length) % props.galleries.length
}

function nextPhoto() {
  currentIndex.value = (currentIndex.value + 1) % props.galleries.length
}

// Keyboard navigation
function onKeydown(e: KeyboardEvent) {
  if (!lightboxOpen.value) return
  if (e.key === 'ArrowLeft') prevPhoto()
  if (e.key === 'ArrowRight') nextPhoto()
  if (e.key === 'Escape') closeLightbox()
}

let observer: IntersectionObserver
onMounted(() => {
  window.addEventListener('keydown', onKeydown)
  observer = new IntersectionObserver(
  (entries) => { const entry = entries[0]; if (entry?.isIntersecting) { visible.value = true; observer.disconnect() } },
  { threshold: 0.2 }
)
  if (sectionRef.value) observer.observe(sectionRef.value)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
  observer?.disconnect()
  document.body.style.overflow = ''
})
</script>

<style scoped>
.gallery-section {
  padding: 20px 24px 64px;
  background: linear-gradient(180deg, #dff0f8 0%, #e8f4fa 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.top-connector {
  display: flex; align-items: center; gap: 12px;
  margin-bottom: 32px; width: 100%; max-width: 200px;
}
.connector-line { flex: 1; height: 1px; background: rgba(91,143,168,0.2); }
.connector-dot {
  width: 8px; height: 8px; border-radius: 50%;
  border: 1px solid rgba(91,143,168,0.4);
}

.section-label {
  font-family: 'Cormorant Garamond', serif;
  font-size: 11px; letter-spacing: 4px; text-transform: uppercase;
  color: rgba(44,95,122,0.6); margin-bottom: 28px;
  opacity: 0; transform: translateY(14px);
  transition: all 0.7s ease;
}
.section-label.show { opacity: 1; transform: translateY(0); }

/* Grid */
.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  width: 100%;
  max-width: 400px;
  opacity: 0; transform: translateY(20px);
  transition: all 0.7s ease 0.1s;
}
.gallery-grid.show { opacity: 1; transform: translateY(0); }

.gallery-item {
  position: relative;
  aspect-ratio: 3/4;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  background: #c8dde8;
}

.gallery-item:nth-child(2) { margin-top: 20px; }
.gallery-item:nth-child(5) { margin-top: 20px; }

.gallery-item img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.gallery-item:hover img { transform: scale(1.06); }

.gallery-overlay {
  position: absolute; inset: 0;
  background: rgba(30,74,99,0);
  display: flex; align-items: center; justify-content: center;
  transition: background 0.3s;
}
.gallery-item:hover .gallery-overlay {
  background: rgba(30,74,99,0.35);
}
.gallery-overlay svg { opacity: 0; transition: opacity 0.3s; }
.gallery-item:hover .gallery-overlay svg { opacity: 1; }

/* Lightbox */
.lightbox {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(10,15,20,0.95);
  display: flex; align-items: center; justify-content: center;
  padding: 20px;
}

.lb-close {
  position: absolute; top: 16px; right: 16px;
  width: 36px; height: 36px; border-radius: 50%;
  background: rgba(255,255,255,0.1); border: none;
  color: white; font-size: 14px; cursor: pointer;
  transition: background 0.2s;
}
.lb-close:hover { background: rgba(255,255,255,0.2); }

.lb-nav {
  position: absolute;
  top: 50%; transform: translateY(-50%);
  width: 44px; height: 44px; border-radius: 50%;
  background: rgba(255,255,255,0.1); border: none;
  color: white; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background 0.2s;
}
.lb-nav:hover { background: rgba(255,255,255,0.2); }
.lb-prev { left: 16px; }
.lb-next { right: 16px; }

.lb-content {
  display: flex; flex-direction: column;
  align-items: center; gap: 12px;
  max-width: min(90vw, 500px);
}

.lb-content img {
  max-height: 75vh; max-width: 100%;
  border-radius: 12px;
  object-fit: contain;
}

.lb-caption {
  font-family: 'Cormorant Garamond', serif;
  font-size: 14px; font-style: italic;
  color: rgba(255,255,255,0.7); text-align: center;
}

.lb-counter {
  font-family: 'DM Mono', monospace;
  font-size: 11px; color: rgba(255,255,255,0.4);
  letter-spacing: 2px;
}

/* Lightbox transition */
.lightbox-enter-active, .lightbox-leave-active { transition: opacity 0.3s ease; }
.lightbox-enter-from, .lightbox-leave-to { opacity: 0; }
</style>
