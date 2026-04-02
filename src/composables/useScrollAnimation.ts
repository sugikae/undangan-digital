import { ref, onMounted, onUnmounted } from 'vue'

export type ScrollEffect =
  | 'fade-up'      // Fade dari bawah ke atas
  | 'zoom-in'      // Zoom masuk dari kecil
  | 'bounce'       // Bounce masuk
  | 'slide-left'   // Geser dari kiri
  | 'flip-up'      // Flip dari bawah

export function useScrollAnimation(effect: ScrollEffect = 'fade-up', threshold = 0.15) {
  const el = ref<HTMLElement>()
  const visible = ref(false)

  let observer: IntersectionObserver

  onMounted(() => {
    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        if (entry?.isIntersecting) {
          visible.value = true
          observer.disconnect()
        }
      },
      { threshold }
    )
    if (el.value) observer.observe(el.value)
  })

  onUnmounted(() => observer?.disconnect())

  return { el, visible, effect }
}
