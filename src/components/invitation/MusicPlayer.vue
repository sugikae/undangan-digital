<template>
  <Teleport to="body">
    <div class="music-player" v-if="musicUrl">
      <audio ref="audioRef" :src="musicUrl" loop preload="none" />

      <button class="music-btn" @click="toggle" :title="isPlaying ? 'Pause musik' : 'Play musik'">
        <div class="music-ripple" v-if="isPlaying" />
        <div class="music-ripple ripple-2" v-if="isPlaying" />

        <!-- Play icon -->
        <svg v-if="!isPlaying" width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M8 5l11 7-11 7V5z" fill="currentColor"/>
        </svg>

        <!-- Pause icon -->
        <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor"/>
          <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor"/>
        </svg>

        <!-- Music note animation -->
        <TransitionGroup name="note">
          <span
            v-for="note in visibleNotes"
            :key="note.id"
            class="music-note"
            :style="{ left: note.x + 'px', animationDuration: note.duration + 's' }"
          >♪</span>
        </TransitionGroup>
      </button>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  musicUrl: string
  autoplay?: boolean
}>()

const audioRef = ref<HTMLAudioElement>()
const isPlaying = ref(false)
const visibleNotes = ref<{ id: number; x: number; duration: number }[]>([])
let noteTimer: ReturnType<typeof setInterval>
let noteId = 0

function toggle() {
  if (!audioRef.value) return
  if (isPlaying.value) {
    audioRef.value.pause()
    isPlaying.value = false
    clearInterval(noteTimer)
    visibleNotes.value = []
  } else {
    audioRef.value.play().then(() => {
      isPlaying.value = true
      startNotes()
    }).catch(() => {})
  }
}

function startNotes() {
  noteTimer = setInterval(() => {
    const note = { id: noteId++, x: Math.random() * 20 - 10, duration: 1.5 + Math.random() }
    visibleNotes.value.push(note)
    setTimeout(() => {
      visibleNotes.value = visibleNotes.value.filter(n => n.id !== note.id)
    }, note.duration * 1000)
  }, 800)
}

onMounted(() => {
  if (props.autoplay && audioRef.value) {
    audioRef.value.play().then(() => {
      isPlaying.value = true
      startNotes()
    }).catch(() => {})
  }
})

onUnmounted(() => {
  clearInterval(noteTimer)
  audioRef.value?.pause()
})
</script>

<style scoped>
.music-player {
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 200;
}

.music-btn {
  position: relative;
  width: 48px; height: 48px;
  border-radius: 50%;
  border: none;
  background: rgba(45,85,112,0.85);
  backdrop-filter: blur(8px);
  color: #e8f4fa;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 16px rgba(30,74,99,0.35);
  transition: transform 0.2s, box-shadow 0.2s;
  overflow: visible;
}

.music-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 20px rgba(30,74,99,0.45);
}

/* Ripple effect saat playing */
.music-ripple {
  position: absolute;
  inset: -4px;
  border-radius: 50%;
  border: 1.5px solid rgba(91,143,168,0.5);
  animation: rippleAnim 2s ease-out infinite;
  pointer-events: none;
}
.ripple-2 {
  inset: -10px;
  animation-delay: 0.6s;
  border-color: rgba(91,143,168,0.3);
}

/* Floating music notes */
.music-note {
  position: absolute;
  bottom: 52px;
  font-size: 14px;
  color: #5b8fa8;
  pointer-events: none;
  animation: noteFloat linear forwards;
}

/* TransitionGroup */
.note-enter-active { animation: noteFloat linear forwards; }
.note-leave-active { display: none; }

@keyframes rippleAnim {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(1.5); opacity: 0; }
}

@keyframes noteFloat {
  0% { transform: translateY(0) scale(1); opacity: 0.8; }
  100% { transform: translateY(-50px) scale(0.7); opacity: 0; }
}
</style>
