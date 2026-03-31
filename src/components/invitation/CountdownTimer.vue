<template>
  <section class="countdown-section">
    <div class="countdown-inner">

      <p class="section-label">Menuju Hari Bahagia</p>

      <div v-if="!isPast" class="countdown-grid">
        <div v-for="item in items" :key="item.label" class="countdown-item">
          <div class="countdown-number">
            <span :key="item.value" class="number-text">{{ String(item.value).padStart(2,'0') }}</span>
          </div>
          <p class="countdown-label">{{ item.label }}</p>
        </div>
      </div>

      <div v-else class="already-text">
        <p>Hari yang dinantikan telah tiba 🌸</p>
      </div>

      <!-- Date display -->
      <div class="event-date-display">
        <span class="line" />
        <p>{{ formattedDate }}</p>
        <span class="line" />
      </div>

    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCountdown } from '@/composables/useCountdown'
import dayjs from 'dayjs'
import 'dayjs/locale/id'
dayjs.locale('id')

const props = defineProps<{ eventDate: string }>()

const { days, hours, minutes, seconds, isPast } = useCountdown(props.eventDate)

const items = computed(() => [
  { label: 'Hari',   value: days.value },
  { label: 'Jam',    value: hours.value },
  { label: 'Menit',  value: minutes.value },
  { label: 'Detik',  value: seconds.value },
])

const formattedDate = computed(() =>
  dayjs(props.eventDate).format('dddd, DD MMMM YYYY')
)
</script>

<style scoped>
.countdown-section {
  padding: 64px 24px;
  background: linear-gradient(180deg, #1e4a63 0%, #2d6e8f 100%);
  position: relative;
  overflow: hidden;
}

/* Decorative circles */
.countdown-section::before {
  content: '';
  position: absolute;
  top: -80px; right: -80px;
  width: 300px; height: 300px;
  border-radius: 50%;
  background: rgba(255,255,255,0.04);
  pointer-events: none;
}
.countdown-section::after {
  content: '';
  position: absolute;
  bottom: -60px; left: -60px;
  width: 240px; height: 240px;
  border-radius: 50%;
  background: rgba(255,255,255,0.03);
  pointer-events: none;
}

.countdown-section::before {
  content: '';
  position: absolute;
  top: 0; left: 50%; transform: translateX(-50%);
  width: 1px; height: 48px;
  background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.2));
}

.countdown-inner {
  max-width: 440px;
  margin: 0 auto;
  text-align: center;
  position: relative;
  z-index: 1;
}

.section-label {
  font-family: 'Cormorant Garamond', serif;
  font-size: 11px;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.5);
  margin-bottom: 32px;
}

.countdown-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 28px;
}

.countdown-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.countdown-number {
  width: 72px; height: 72px;
  border-radius: 16px;
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 4px 16px rgba(0,0,0,0.2),
    0 0 0 1px rgba(255,255,255,0.05) inset;
}

.number-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 30px;
  font-weight: 600;
  color: #ffffff;
  line-height: 1;
}

.countdown-label {
  font-family: 'Cormorant Garamond', serif;
  font-size: 11px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.5);
}

.already-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 20px;
  color: rgba(255,255,255,0.8);
  margin-bottom: 28px;
  font-style: italic;
}

.event-date-display {
  display: flex;
  align-items: center;
  gap: 14px;
  justify-content: center;
}
.event-date-display p {
  font-family: 'Cormorant Garamond', serif;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1.5px;
  color: rgba(255,255,255,0.7);
  text-transform: capitalize;
  white-space: nowrap;
}
.event-date-display .line {
  height: 1px; flex: 1;
  background: rgba(255,255,255,0.15);
  max-width: 60px;
}
</style>
