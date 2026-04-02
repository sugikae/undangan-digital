<template>
  <section class="lovestory-section" ref="sectionRef">

    <div class="top-connector">
      <div class="connector-line" />
      <div class="connector-dot" />
      <div class="connector-line" />
    </div>

    <ScrollReveal :effect="scrollEffect" :delay="0">
      <p class="section-label" :class="{ show: visible }">Kisah Cinta</p>
    </ScrollReveal>

    <ScrollReveal :effect="scrollEffect" :delay="100">
      <div class="section-subtitle" :class="{ show: visible }">
        <p>Perjalanan indah yang mengantarkan kami ke hari ini</p>
      </div>
    </ScrollReveal>


      <!-- Timeline -->
      <div class="timeline" :class="{ show: visible }">

        <!-- Timeline center line -->
        <div class="timeline-line" />

        <ScrollReveal v-for="(story, i) in stories"
            :key="i"
            :effect="scrollEffect"
            :delay="i * 120"
          >
        <div class="timeline-item"
          :class="{ 'item-right': i % 2 !== 0, show: visible }"
        >
          <!-- Dot on center line -->
          <div class="timeline-dot">
            <div class="dot-inner" />
          </div>

          <!-- Card -->
          <div class="story-card">
            <!-- Photo jika ada -->
            <div v-if="story.photo" class="story-photo-wrap">
              <img :src="story.photo" :alt="story.title" class="story-photo" />
            </div>

            <!-- Icon jika tidak ada foto -->
            <div v-else class="story-icon">
              {{ storyIcons[i % storyIcons.length] }}
            </div>

            <div class="story-year">{{ story.year }}</div>
            <h3 class="story-title">{{ story.title }}</h3>
            <p class="story-desc">{{ story.description }}</p>
          </div>

          <!-- Connector line to dot -->
          <div class="item-connector" />

        </div>
        </ScrollReveal>
      </div>



    <ScrollReveal :effect="scrollEffect" :delay="300">
      <!-- Closing quote -->
      <div class="closing-quote" :class="{ show: visible }">
        <svg width="32" height="24" viewBox="0 0 32 24" fill="none" class="quote-mark">
          <path d="M0 24V14.4C0 6.4 4.8 1.6 14.4 0l1.6 2.4C10.4 3.6 7.6 6.4 7.2 10.4H13.6V24H0ZM18.4 24V14.4C18.4 6.4 23.2 1.6 32 0l1.6 2.4C28 3.6 25.2 6.4 24.8 10.4H31.2V24H18.4Z"
            fill="#92bdd4" opacity="0.4"/>
        </svg>
        <p>Dan kini, kami siap memulai babak baru yang paling indah bersama.</p>
        <p class="quote-names">{{ brideName }} & {{ groomName }}</p>
      </div>
    </ScrollReveal>


  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { LoveStory as LoveStoryType, InvitationConfig } from '@/types'
import ScrollReveal from '@/components/ui/ScrollReveal.vue'

const props = defineProps<{
  brideName: string
  groomName: string
  config: InvitationConfig | null
}>()

const sectionRef = ref<HTMLElement>()
const visible = ref(false)

const storyIcons = ['💌', '🌙', '☕', '🌹', '💍', '✨', '🎉', '🕊️']

const stories = computed<LoveStoryType[]>(() => props.config?.love_story ?? [])


// Efek scroll dari config
const scrollEffect = computed(() =>
  (props.config as any)?.scroll_effect ?? 'fade-up'
)

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
.lovestory-section {
  padding: 20px 24px 64px;
  background: linear-gradient(180deg, #e4f2f8 0%, #daeef8 50%, #e8f4fa 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;
}

/* Decorative background */
.lovestory-section::before {
  content: '';
  position: absolute;
  top: -100px; right: -100px;
  width: 400px; height: 400px;
  border-radius: 50%;
  background: rgba(146,189,212,0.08);
  pointer-events: none;
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
  color: rgba(44,95,122,0.6); margin-bottom: 10px;
  opacity: 0; transform: translateY(14px);
  transition: all 0.7s ease;
}
.section-label.show { opacity: 1; transform: translateY(0); }

.section-subtitle {
  max-width: 280px; text-align: center; margin-bottom: 48px;
  opacity: 0; transition: opacity 0.7s ease 0.1s;
}
.section-subtitle.show { opacity: 1; }
.section-subtitle p {
  font-family: 'Cormorant Garamond', serif;
  font-size: 15px; font-style: italic;
  color: rgba(44,95,122,0.65); line-height: 1.6;
}

/* Timeline */
.timeline {
  position: relative;
  width: 100%; max-width: 360px;
  padding: 0 0 20px;
  opacity: 0; transition: opacity 0.5s ease 0.15s;
}
.timeline.show { opacity: 1; }

/* Center vertical line */
.timeline-line {
  position: absolute;
  left: 50%; top: 0; bottom: 0;
  width: 1px;
  background: linear-gradient(to bottom,
    transparent,
    rgba(91,143,168,0.3) 10%,
    rgba(91,143,168,0.3) 90%,
    transparent
  );
  transform: translateX(-50%);
}

/* Timeline item */
.timeline-item {
  position: relative;
  display: flex;
  justify-content: flex-end;
  padding-right: calc(50% + 24px);
  margin-bottom: 32px;
  opacity: 0; transform: translateX(-24px);
  transition: all 0.7s cubic-bezier(0.34,1.56,0.64,1);
}
.timeline-item.show { opacity: 1; transform: translateX(0); }

/* Right side items */
.timeline-item.item-right {
  justify-content: flex-start;
  padding-right: 0;
  padding-left: calc(50% + 24px);
  transform: translateX(24px);
}
.timeline-item.item-right.show { transform: translateX(0); }

/* Center dot */
.timeline-dot {
  position: absolute;
  left: 50%; top: 20px;
  transform: translateX(-50%);
  width: 14px; height: 14px;
  border-radius: 50%;
  background: white;
  border: 2px solid rgba(91,143,168,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 2;
}
.dot-inner {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #5b8fa8;
}

/* Connector line from card to dot */
.item-connector {
  position: absolute;
  top: 26px;
  width: 20px; height: 1px;
  background: rgba(91,143,168,0.3);
  right: calc(50% + 7px);
}
.item-right .item-connector {
  right: auto;
  left: calc(50% + 7px);
}

/* Story card */
.story-card {
  background: rgba(255,255,255,0.65);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(91,143,168,0.15);
  border-radius: 16px;
  padding: 18px 16px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(91,143,168,0.1);
  max-width: 148px;
  transition: transform 0.3s, box-shadow 0.3s;
}
.story-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 28px rgba(91,143,168,0.18);
}

/* Photo */
.story-photo-wrap {
  margin-bottom: 10px;
}
.story-photo {
  width: 80px; height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(91,143,168,0.2);
}

/* Icon */
.story-icon {
  font-size: 28px;
  margin-bottom: 10px;
  line-height: 1;
}

.story-year {
  font-family: 'DM Mono', monospace;
  font-size: 11px; letter-spacing: 2px;
  color: #5b8fa8; margin-bottom: 5px;
}
.story-title {
  font-family: 'Cormorant Garamond', serif;
  font-size: 15px; font-weight: 600; font-style: italic;
  color: #1e4a63; margin-bottom: 8px; line-height: 1.3;
}
.story-desc {
  font-family: 'Cormorant Garamond', serif;
  font-size: 12px; color: rgba(44,95,122,0.7);
  line-height: 1.55;
}

/* Closing quote */
.closing-quote {
  max-width: 300px; text-align: center;
  margin-top: 16px;
  opacity: 0; transform: translateY(16px);
  transition: all 0.8s ease 0.3s;
}
.closing-quote.show { opacity: 1; transform: translateY(0); }

.quote-mark { margin-bottom: 14px; }

.closing-quote p {
  font-family: 'Cormorant Garamond', serif;
  font-size: 15px; font-style: italic;
  color: rgba(44,95,122,0.7); line-height: 1.7;
  margin-bottom: 12px;
}
.quote-names {
  font-family: 'Cormorant Garamond', serif;
  font-size: 20px !important;
  font-style: italic !important;
  color: #1e4a63 !important;
  margin-bottom: 0 !important;
}
</style>
