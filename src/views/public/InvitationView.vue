<template>
  <div class="invitation-page">

    <!-- ══ OPENING ANIMATION ══════════════════════════════════ -->
    <!-- Pilih salah satu berdasarkan config -->

    <!-- Option 1: Flower (default) -->
    <FlowerPetals
      v-if="openingAnim === 'flower'"
      :guest-name="store.guestName"
      :auto-open="false"
      @opened="onOpened"
    />

    <!-- Option 2: Envelope -->
    <EnvelopeOpening
      v-else-if="openingAnim === 'envelope'"
      :guest-name="store.guestName"
      :bride-name="store.brideName"
      :groom-name="store.groomName"
      @opened="onOpened"
    />

    <!-- ══ BACKGROUND ANIMATIONS (selalu di atas konten) ══════ -->
    <!-- Bintang berkelip -->
    <StarField v-if="store.isOpened && store.config?.bg_animation_stars" />

    <!-- ══ MAIN CONTENT ════════════════════════════════════════ -->
    <Transition name="page-reveal">
      <div v-if="store.isOpened">

        <div v-if="store.isLoading" class="loading-screen">
          <div class="loading-dot" />
          <p>Memuat undangan...</p>
        </div>

        <div v-else-if="store.error" class="error-screen">
          <p class="font-cormorant text-2xl text-dusty-400">{{ store.error }}</p>
        </div>

        <template v-else-if="store.invitation">
          <HeroSection
            :bride-name="store.brideName"
            :groom-name="store.groomName"
            :event-date="store.eventDate"
            :config="store.config"
            :enable-parallax="store.config?.hero_parallax ?? true"
          />
          <CountdownTimer
            v-if="store.config?.countdown_enabled"
            :event-date="store.eventDate"
          />
          <BrideGroom
            :bride-name="store.brideName"
            :groom-name="store.groomName"
            :config="store.config"
          />
          <LoveStory
            v-if="store.config?.love_story?.length"
            :bride-name="store.brideName"
            :groom-name="store.groomName"
            :config="store.config"
          />
          <EventSchedule
            v-if="store.config?.venues?.length"
            :venues="store.config.venues"
          />
          <PhotoGallery
            v-if="store.config?.gallery_enabled && store.galleries.length"
            :galleries="store.galleries"
          />
          <RSVPForm
            v-if="store.config?.rsvp_enabled"
            :enable-confetti="store.config?.confetti_on_rsvp ?? true"
          />
          <WishesWall v-if="store.config?.wishes_enabled" />
          <GiftSection
            v-if="store.config?.gift_enabled && store.config.bank_accounts?.length"
            :accounts="store.config.bank_accounts"
            :bride-name="store.brideName"
            :groom-name="store.groomName"
          />
          <MusicPlayer
            v-if="store.config?.music_url"
            :music-url="store.config.music_url"
            :autoplay="store.config?.music_autoplay ?? false"
          />
        </template>

      </div>
    </Transition>

    <BaseToast ref="toast" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useInvitationStore } from '@/stores/invitation.store'

// Opening animations
import FlowerPetals from '@/components/animations/FlowerPetals.vue'
import EnvelopeOpening from '@/components/animations/EnvelopeOpening.vue'

// Background animations
import StarField from '@/components/animations/StarField.vue'

// Sections
import HeroSection from '@/components/invitation/HeroSection.vue'
import CountdownTimer from '@/components/invitation/CountdownTimer.vue'
import BrideGroom from '@/components/invitation/BrideGroom.vue'
import LoveStory from '@/components/invitation/LoveStory.vue'
import EventSchedule from '@/components/invitation/EventSchedule.vue'
import PhotoGallery from '@/components/invitation/PhotoGallery.vue'
import RSVPForm from '@/components/invitation/RSVPForm.vue'
import WishesWall from '@/components/invitation/WishesWall.vue'
import GiftSection from '@/components/invitation/GiftSection.vue'
import MusicPlayer from '@/components/invitation/MusicPlayer.vue'
import BaseToast from '@/components/ui/BaseToast.vue'

defineProps<{ slug?: string; token?: string }>()

const route = useRoute()
const store = useInvitationStore()
const toast = ref()

// Opening animation — dari config, default 'flower'
const openingAnim = computed(() =>
  store.config?.opening_animation ?? 'flower'
)

onMounted(async () => {
  const slug = route.params.slug as string
  const token = route.params.token as string | undefined
  const guestQuery = route.query.to as string | undefined

  if (guestQuery) store.setGuest(token ?? '', decodeURIComponent(guestQuery))
  else if (token) store.setGuest(token, 'Tamu Undangan')

  await store.loadInvitation(slug)
  if (store.invitation) {
    await Promise.all([store.loadMessages(), store.loadGalleries()])
  }
})

function onOpened() {
  store.openInvitation()
}
</script>

<style scoped>
.invitation-page { min-height: 100vh; background: #e8f4fa; }
.loading-screen {
  min-height: 100vh; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 16px;
  background: linear-gradient(160deg, #c8dde8, #daeef8);
}
.loading-screen p {
  font-family: 'Cormorant Garamond', serif;
  font-size: 16px; letter-spacing: 2px; color: rgba(44,95,122,0.7);
}
.loading-dot {
  width: 10px; height: 10px; border-radius: 50%;
  background: #5b8fa8; animation: dotPulse 1.2s ease-in-out infinite;
}
.error-screen {
  min-height: 100vh; display: flex;
  align-items: center; justify-content: center;
}
.page-reveal-enter-active { transition: opacity 1s ease 0.3s; }
.page-reveal-enter-from { opacity: 0; }
@keyframes dotPulse {
  0%,100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.6); opacity: 1; }
}
</style>
