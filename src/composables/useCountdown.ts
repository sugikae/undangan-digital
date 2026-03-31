import { ref, computed, onMounted, onUnmounted } from 'vue'

export function useCountdown(targetDate: string) {
  const now = ref(Date.now())
  let timer: ReturnType<typeof setInterval>

  onMounted(() => {
    timer = setInterval(() => { now.value = Date.now() }, 1000)
  })

  onUnmounted(() => clearInterval(timer))

  const diff = computed(() => {
    const target = new Date(targetDate).getTime()
    return Math.max(0, target - now.value)
  })

  const days = computed(() => Math.floor(diff.value / (1000 * 60 * 60 * 24)))
  const hours = computed(() => Math.floor((diff.value % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)))
  const minutes = computed(() => Math.floor((diff.value % (1000 * 60 * 60)) / (1000 * 60)))
  const seconds = computed(() => Math.floor((diff.value % (1000 * 60)) / 1000))
  const isPast = computed(() => diff.value === 0)

  return { days, hours, minutes, seconds, isPast }
}
