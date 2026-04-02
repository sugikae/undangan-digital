<template>
  <section class="schedule-section" ref="sectionRef">

    <div class="top-connector">
      <div class="connector-line" />
      <div class="connector-dot" />
      <div class="connector-line" />
    </div>

    <p class="section-label" :class="{ show: visible }">Waktu &amp; Tempat</p>

    <div class="venues-list">
      <div
        v-for="(venue, i) in venues"
        :key="i"
        class="venue-card"
        :class="{ show: visible }"
        :style="{ transitionDelay: `${0.1 + i * 0.15}s` }"
      >
        <p class="venue-type">{{ venue.name }}</p>

        <div class="venue-datetime">
          <div class="datetime-item">
            <span class="dt-icon">📅</span>
            <span>{{ formatDate(venue.date) }}</span>
          </div>
          <div class="datetime-item">
            <span class="dt-icon">🕐</span>
            <span>{{ formatTime(venue.date) }} WIB</span>
          </div>
        </div>

        <div class="venue-location">
          <span class="dt-icon">📍</span>
          <p>{{ venue.location }}</p>
        </div>

        <div class="btn-group">

        <a
          :href="venue.maps_url"
          target="_blank"
          rel="noopener noreferrer"
          class="maps-btn">
          Buka Google Maps
        </a>

        <button class="calendar-btn" @click="addToCalendar(venue)">
          Tambah ke Kalender
        </button>
      </div>

      </div>
    </div>

  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Venue } from '@/types'
import dayjs from 'dayjs'
import 'dayjs/locale/id'
dayjs.locale('id')

const props = defineProps<{ venues: Venue[] }>()

const sectionRef = ref<HTMLElement>()
const visible = ref(false)
const venues = computed(() => props.venues ?? [])


function formatDate(dateStr: string) {
  return dayjs(dateStr).format('dddd, DD MMMM YYYY')
}

function formatTime(dateStr: string) {
  return dayjs(dateStr).format('HH.mm')
}

function addToCalendar(venue: Venue) {
  const start = dayjs(venue.date).format('YYYYMMDDTHHmmss')
  const end = dayjs(venue.date).add(3, 'hour').format('YYYYMMDDTHHmmss')
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(venue.name)}&dates=${start}/${end}&location=${encodeURIComponent(venue.location)}`
  window.open(url, '_blank')
}

let observer: IntersectionObserver
onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => { const entry = entries[0]; if (entry?.isIntersecting) {
        visible.value = true
        observer.disconnect()
      }
    },
    { threshold: 0.15 }
  )
  if (sectionRef.value) observer.observe(sectionRef.value)
})
onUnmounted(() => observer?.disconnect())
</script>


<!-- <style scoped>
.schedule-section {
  padding: 20px 24px 64px;
  background: linear-gradient(180deg, #e8f4fa 0%, #dff0f8 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
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
.connector-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  border: 1px solid rgba(91,143,168,0.4);
}

.section-label {
  font-family: 'Cormorant Garamond', serif;
  font-size: 11px;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: rgba(44,95,122,0.6);
  margin-bottom: 32px;
  opacity: 0;
  transform: translateY(14px);
  transition: all 0.7s ease;
}
.section-label.show { opacity: 1; transform: translateY(0); }

.venues-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 360px;
}

.venue-card {
  background: rgba(255,255,255,0.65);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(91,143,168,0.18);
  border-radius: 20px;
  padding: 28px 24px;
  text-align: center;
  box-shadow: 0 4px 24px rgba(91,143,168,0.1);
  opacity: 0;
  transform: translateY(24px);
  transition: all 0.7s cubic-bezier(0.34,1.56,0.64,1);
}
.venue-card.show { opacity: 1; transform: translateY(0); }

.venue-type {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  font-weight: 600;
  font-style: italic;
  color: #1e4a63;
  margin-bottom: 16px;
}

.venue-datetime {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}
.datetime-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 14px;
  color: #2d5570;
  font-weight: 600;
}
.dt-icon { font-size: 13px; }

.venue-location {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  justify-content: center;
  margin-bottom: 20px;
}
.venue-location p {
  font-family: 'Cormorant Garamond', serif;
  font-size: 13px;
  color: rgba(44,95,122,0.7);
  line-height: 1.5;
  text-align: left;
}

.btn-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.maps-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 24px;
  border-radius: 100px;
  background: #2d5570;
  color: #e8f4fa;
  font-family: 'Cormorant Garamond', serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1px;
  text-decoration: none;
  transition: all 0.25s;
}
.maps-btn:hover { background: #1e4a63; transform: translateY(-2px); }

.calendar-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 20px;
  border-radius: 100px;
  border: 1px solid rgba(91,143,168,0.35);
  background: transparent;
  color: #5b8fa8;
  font-family: 'Cormorant Garamond', serif;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.25s;
}
.calendar-btn:hover {
  background: rgba(91,143,168,0.08);
  border-color: #5b8fa8;
}
</style> -->
<style scoped>
.schedule-section {
  padding: 20px 24px 64px;
  background: var(--theme-gradient);
  display: flex;
  flex-direction: column;
  align-items: center;
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
.connector-dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  border: 1px solid rgba(91,143,168,0.4);
}

.section-label {
  font-family: 'Cormorant Garamond', serif;
  font-size: 11px;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: rgba(44,95,122,0.6);
  margin-bottom: 32px;
  opacity: 0;
  transform: translateY(14px);
  transition: all 0.7s ease;
}
.section-label.show { opacity: 1; transform: translateY(0); }

.venues-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 360px;
}

.venue-card {
  background: rgba(255,255,255,0.65);
  backdrop-filter: blur(12px);
  border: 1px solid var(--theme-border);
  border-radius: 20px;
  padding: 28px 24px;
  text-align: center;
  box-shadow: 0 4px 24px var(--theme-shadow);
  opacity: 0;
  transform: translateY(24px);
  transition: all 0.7s cubic-bezier(0.34,1.56,0.64,1);
}
.venue-card.show { opacity: 1; transform: translateY(0); }

.venue-type {
  font-family: 'Cormorant Garamond', serif;
  font-size: 22px;
  font-weight: 700;
  font-style: italic;
  color: var(--theme-darker);
  margin-bottom: 16px;
}

.venue-datetime {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 14px;
  flex-wrap: wrap;
}
.datetime-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'Cormorant Garamond', serif;
  font-size: 14px;
  color: var(--theme-darker);
  font-weight: 700;
}
.dt-icon { font-size: 13px; }

.venue-location {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  justify-content: center;
  margin-bottom: 20px;
}
.venue-location p {
  font-family: 'Cormorant Garamond', serif;
  font-size: 13px;
  color: var(--theme-text-muted);
  line-height: 1.5;
  text-align: left;
  font-weight: 500;
}

.btn-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.maps-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 24px;
  border-radius: 100px;
  background: var(--theme-btn-bg);
  color: var(--theme-btn-text);
  font-family: 'Cormorant Garamond', serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1px;
  text-decoration: none;
  transition: all 0.25s;
}
.maps-btn:hover { transform: translateY(-2px); }

.calendar-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 20px;
  border-radius: 100px;
  border: 1px solid var(--theme-border);
  background: transparent;
  color: var(--theme-dark);
  font-family: 'Cormorant Garamond', serif;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.25s;
}
.calendar-btn:hover {
  background: rgba(91,143,168,0.08);
  border-color: var(--theme-border);
}
</style>
