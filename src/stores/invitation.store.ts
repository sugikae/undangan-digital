import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Invitation, Message, Gallery } from '@/types'
import {
  getInvitationBySlug,
  getMessages,
  getGalleries,
  submitMessage,
  submitRSVP,
  markOpened,
} from '@/services/invitation.service'

export const useInvitationStore = defineStore('invitation', () => {
  // ── State ────────────────────────────────────────────────
  const invitation = ref<Invitation | null>(null)
  const messages = ref<Message[]>([])
  const galleries = ref<Gallery[]>([])
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const guestToken = ref<string | null>(null)
  const guestName = ref<string>('Tamu Undangan')
  const isOpened = ref(false)
  const rsvpSubmitted = ref(false)

  // ── Computed ─────────────────────────────────────────────
  const config = computed(() => invitation.value?.config ?? null)
  const brideName = computed(() => config.value?.bride_name ?? '')
  const groomName = computed(() => config.value?.groom_name ?? '')
  const eventDate = computed(() => invitation.value?.event_date ?? '')
  const isFlowerEnabled = computed(() => config.value?.flower_animation ?? true)

  // ── Actions ──────────────────────────────────────────────
  async function loadInvitation(slug: string) {
    isLoading.value = true
    error.value = null
    try {
      invitation.value = await getInvitationBySlug(slug)
      if (!invitation.value) error.value = 'Undangan tidak ditemukan'
    } catch (e) {
      error.value = 'Gagal memuat undangan'
    } finally {
      isLoading.value = false
    }
  }

  async function loadMessages() {
    if (!invitation.value) return
    messages.value = await getMessages(invitation.value.id)
  }

  async function loadGalleries() {
    if (!invitation.value) return
    galleries.value = await getGalleries(invitation.value.id)
  }

  async function sendMessage(name: string, content: string): Promise<boolean> {
    if (!invitation.value) return false
    const ok = await submitMessage(invitation.value.id, name, content)
    if (ok) await loadMessages()
    return ok
  }

async function sendRSVP(
  status: 'hadir' | 'tidak_hadir' | 'mungkin',
  pax: number,
  note?: string,
  name?: string        // ← tambah ini
): Promise<boolean> {
  const token = guestToken.value ?? ''
  const ok = await submitRSVP(
    token,
    status,
    pax,
    note,
    name ?? guestName.value,           // ← kirim nama
    invitation.value?.id ?? undefined  // ← kirim invitation id
  )
  if (ok) rsvpSubmitted.value = true
  return ok
}

async function openInvitation() {
    isOpened.value = true
    if (guestToken.value) await markOpened(guestToken.value)
  }

  function setGuest(token: string, name: string) {  // ← tambah ini
    guestToken.value = token
    guestName.value = name
  }

  return {                                           // ← sampai sini
    invitation, messages, galleries,
    isLoading, error,
    guestToken, guestName, isOpened, rsvpSubmitted,
    config, brideName, groomName, eventDate, isFlowerEnabled,
    loadInvitation, loadMessages, loadGalleries,
    sendMessage, sendRSVP, openInvitation, setGuest,
  }
})
