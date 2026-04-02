<template>
  <section class="bridegroom-section" ref="sectionRef">

    <!-- Top connector -->
    <div class="top-connector">
      <div class="connector-line" />
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C8.5 2 6 4.5 6 7.5c0 4 6 10 6 10s6-6 6-10C18 4.5 15.5 2 12 2z"
          fill="#92bdd4" opacity="0.6"/>
        <circle cx="12" cy="7.5" r="2" fill="white" opacity="0.8"/>
      </svg>
      <div class="connector-line" />
    </div>

    <ScrollReveal :effect="scrollEffect" :delay="0">
      <!-- Section label -->
      <p class="section-label" :class="{ show: visible }">Mempelai</p>
    </ScrollReveal>


    <ScrollReveal :effect="scrollEffect" :delay="100">
      <!-- Bismillah / ayat -->
      <div class="ayat-box" :class="{ show: visible }">
        <p class="ayat-arabic">وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا</p>
        <p class="ayat-latin">Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri</p>
        <p class="ayat-source">— QS. Ar-Rum: 21</p>
      </div>
    </ScrollReveal>


    <ScrollReveal :effect="scrollEffect" :delay="200">
      <!-- Bride -->
    <div class="person-card" :class="{ show: visible }" style="transition-delay: 0.2s">
      <div class="person-photo-wrap">
        <div class="photo-ring" />
        <div class="photo-ring ring-2" />
        <img
          :src="config?.bride_photo || defaultPhoto"
          :alt="brideName"
          class="person-photo"
          @error="onImgError"
        />
        <div class="photo-overlay" />
      </div>
      <div class="person-info">
        <p class="person-role">Mempelai Wanita</p>
        <h2 class="person-name">{{ brideName }}</h2>
        <p class="person-parents">
          Putri dari Bapak & Ibu<br/>
          <span>{{ config?.bride_parents || 'Keluarga Mempelai Wanita' }}</span>
        </p>
      </div>
    </div>
    </ScrollReveal>

    <ScrollReveal :effect="scrollEffect" :delay="300">
    <!-- Divider -->
    <div class="couple-divider" :class="{ show: visible }">
      <span class="div-line" />
      <div class="div-heart">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <path d="M16 27s-11-7.5-11-14A7 7 0 0116 8.6 7 7 0 0127 13c0 6.5-11 14-11 14z"
            fill="#92bdd4" opacity="0.7"/>
        </svg>
      </div>
      <span class="div-line" />
    </div>
    </ScrollReveal>

    <!-- Groom -->
    <ScrollReveal :effect="scrollEffect" :delay="400">
    <div class="person-card" :class="{ show: visible }" style="transition-delay: 0.4s">
      <div class="person-photo-wrap">
        <div class="photo-ring" />
        <div class="photo-ring ring-2" />
        <img
          :src="config?.groom_photo || defaultPhoto"
          :alt="groomName"
          class="person-photo"
          @error="onImgError"
        />
        <div class="photo-overlay" />
      </div>
      <div class="person-info">
        <p class="person-role">Mempelai Pria</p>
        <h2 class="person-name">{{ groomName }}</h2>
        <p class="person-parents">
          Putra dari Bapak & Ibu<br/>
          <span>{{ config?.groom_parents || 'Keluarga Mempelai Pria' }}</span>
        </p>
      </div>
    </div>
    </ScrollReveal>

  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted,computed } from 'vue'
import type { InvitationConfig } from '@/types'
import ScrollReveal from '@/components/ui/ScrollReveal.vue'

const props = defineProps<{
  brideName: string
  groomName: string
  config: InvitationConfig | null
}>()

const defaultPhoto = 'https://i.pravatar.cc/300?img=47'
const defaultPhoto2 = 'https://i.pravatar.cc/300?img=68'
const sectionRef = ref<HTMLElement>()
const visible = ref(false)

// Efek scroll dari config
const scrollEffect = computed(() =>
  (props.config as any)?.scroll_effect ?? 'fade-up'
)

function onImgError(e: Event) {
  const img = e.target as HTMLImageElement
  img.src = defaultPhoto
}

let observer: IntersectionObserver
onMounted(() => {
  observer = new IntersectionObserver(
  (entries) => { const entry = entries[0]; if (entry?.isIntersecting) { visible.value = true; observer.disconnect() } },
  { threshold: 0.2 }
)
  if (sectionRef.value) observer.observe(sectionRef.value)
})
onUnmounted(() => observer?.disconnect())
</script>

<style scoped>
.bridegroom-section {
  padding: 20px 24px 64px;
  background: var(--theme-section-alt);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.top-connector {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 32px;
  width: 100%;
  max-width: 200px;
}
.connector-line { flex: 1; height: 1px; background: rgba(91,143,168,0.2); }

.section-label {
  font-family: 'Cormorant Garamond', serif;
  font-size: 11px;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: rgba(44,95,122,0.6);
  margin-bottom: 28px;
  opacity: 0; transform: translateY(16px);
  transition: all 0.7s ease;
}
.section-label.show { opacity: 1; transform: translateY(0); }

/* Ayat box */
.ayat-box {
  max-width: 340px;
  text-align: center;
  margin-bottom: 40px;
  padding: 24px 28px;
  background: rgba(255,255,255,0.5);
  border: 1px solid var(--theme-border);
  border-radius: 16px;
  backdrop-filter: blur(8px);
  opacity: 0; transform: translateY(16px);
  transition: all 0.7s ease 0.1s;
}
.ayat-box.show { opacity: 1; transform: translateY(0); }

.ayat-arabic {
  font-size: 22px;
  color: var(--theme-darker);
  line-height: 1.8;
  margin-bottom: 12px;
  font-family: 'Traditional Arabic', 'Arial Unicode MS', serif;
}
.ayat-latin {
  font-family: 'Cormorant Garamond', serif;
  font-size: 13px;
  font-style: italic;
  color: var(--theme-text-muted);
  font-weight: 500;
  line-height: 1.6;
  margin-bottom: 8px;
}
.ayat-source {
  font-family: 'Cormorant Garamond', serif;
  font-size: 11px;
  letter-spacing: 2px;
  color: rgba(44,95,122,0.5);
}

/* Person card */
.person-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  max-width: 320px;
  width: 100%;
  opacity: 0; transform: translateY(24px);
  transition: all 0.8s cubic-bezier(0.34,1.56,0.64,1);
}
.person-card.show { opacity: 1; transform: translateY(0); }

/* Photo */
.person-photo-wrap {
  position: relative;
  width: 180px; height: 180px;
}
.photo-ring {
  position: absolute;
  inset: -6px;
  border-radius: 50%;
  border: 1px solid rgba(91,143,168,0.25);
}
.ring-2 {
  inset: -12px;
  border-color: rgba(91,143,168,0.12);
}
.person-photo {
  width: 180px; height: 180px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--theme-primary);
  box-shadow: 0 8px 32px rgba(91,143,168,0.25);
  position: relative; z-index: 1;
}
.photo-overlay {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: linear-gradient(to bottom, transparent 50%, rgba(30,74,99,0.1));
  z-index: 2;
  pointer-events: none;
}

/* Info */
.person-info { text-align: center; }
.person-role {
  font-family: 'Cormorant Garamond', serif;
  font-size: 10px;
  letter-spacing: 3.5px;
  text-transform: uppercase;
  color: var(--theme-text-muted);
  margin-bottom: 6px;
}
.person-name {
  font-family: 'Cormorant Garamond', serif;
  font-size: clamp(28px, 7vw, 40px);
  font-style: italic;
  font-weight: 400;
  color: var(--theme-darker);
  line-height: 1.1;
  margin-bottom: 10px;
}
.person-parents {
  font-family: 'Cormorant Garamond', serif;
  font-size: 13px;
  color: var(--theme-text-muted);
  line-height: 1.7;
}
.person-parents span { font-weight: 700; color: var(--theme-dark); }

/* Couple divider */
.couple-divider {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  max-width: 280px;
  margin: 36px 0;
  opacity: 0; transition: opacity 0.6s ease 0.3s;
}
.couple-divider.show { opacity: 1; }
.div-line { flex: 1; height: 1px; background: rgba(91,143,168,0.2); }
.div-heart { display: flex; animation: heartbeat 2s ease-in-out infinite; }

@keyframes heartbeat {
  0%,100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}
</style>
