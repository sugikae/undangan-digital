import type { Invitation, Message, Gallery } from '@/types'
import { mockInvitation, mockMessages, mockGalleries } from './mock.data'
import { supabase } from './supabase'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

console.log('USE_MOCK value:', USE_MOCK)
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)

// ── GET INVITATION BY SLUG ───────────────────────────────────
export async function getInvitationBySlug(slug: string): Promise<Invitation | null> {
  if (USE_MOCK) {
    await delay(400)
    return mockInvitation
  }

  const { data, error } = await supabase
    .from('invitations')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  if (error) { console.error('getInvitationBySlug error:', error); return null }
  return data
}

// ── GET MESSAGES ─────────────────────────────────────────────
export async function getMessages(invitationId: string): Promise<Message[]> {
  if (USE_MOCK) {
    await delay(300)
    return mockMessages
  }

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('invitation_id', invitationId)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  if (error) { console.error('getMessages error:', error); return [] }
  return data ?? []
}

// ── SUBMIT MESSAGE ───────────────────────────────────────────
export async function submitMessage(
  invitationId: string,
  guestName: string,
  content: string
): Promise<boolean> {
  if (USE_MOCK) {
    await delay(500)
    mockMessages.unshift({
      id: `m-${Date.now()}`,
      invitation_id: invitationId,
      guest_name: guestName,
      content,
      is_approved: true,
      created_at: new Date().toISOString(),
    })
    return true
  }

  const { error } = await supabase
    .from('messages')
    .insert({
      invitation_id: invitationId,
      guest_name: guestName,
      content,
      is_approved: true,
    })

  if (error) { console.error('submitMessage error:', error); return false }
  return true
}

// ── GET GALLERIES ─────────────────────────────────────────────
export async function getGalleries(invitationId: string): Promise<Gallery[]> {
  if (USE_MOCK) {
    await delay(300)
    return mockGalleries
  }

  const { data, error } = await supabase
    .from('galleries')
    .select('*')
    .eq('invitation_id', invitationId)
    .order('sort_order')

  if (error) { console.error('getGalleries error:', error); return [] }
  return data ?? []
}

// ── SUBMIT RSVP ───────────────────────────────────────────────
export async function submitRSVP(
  guestToken: string,
  status: 'hadir' | 'tidak_hadir' | 'mungkin',
  pax: number,
  note?: string,
  guestName?: string,        // ← tambah param ini
  invitationId?: string      // ← tambah param ini
): Promise<boolean> {
  if (USE_MOCK) {
    await delay(600)
    return true
  }

  // Case 1: Ada token → cari guest by token
  if (guestToken && guestToken !== 'mock-token') {
    const { data: guest, error: guestError } = await supabase
      .from('guests')
      .select('id, invitation_id')
      .eq('token', guestToken)
      .single()

    if (guestError || !guest) {
      console.error('Guest not found:', guestError)
      // Fallback ke case 2
    } else {
      const { error } = await supabase
        .from('rsvp')
        .upsert({
          guest_id: guest.id,
          invitation_id: guest.invitation_id,
          status, pax, note,
          responded_at: new Date().toISOString(),
        }, { onConflict: 'guest_id' })

      if (error) { console.error('submitRSVP error:', error); return false }
      return true
    }
  }

  // Case 2: Tidak ada token → buat guest baru dulu
  if (invitationId && guestName) {
    // Buat guest anonymous
    const token = `anon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const { data: newGuest, error: createError } = await supabase
      .from('guests')
      .insert({
        invitation_id: invitationId,
        name: guestName,
        token,
        is_opened: true,
        opened_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (createError || !newGuest) {
      console.error('Create guest error:', createError)
      return false
    }

    const { error } = await supabase
      .from('rsvp')
      .insert({
        guest_id: newGuest.id,
        invitation_id: invitationId,
        status, pax, note,
        responded_at: new Date().toISOString(),
      })

    if (error) { console.error('submitRSVP error:', error); return false }
    return true
  }

  return false
}

// ── MARK INVITATION OPENED ────────────────────────────────────
export async function markOpened(guestToken: string): Promise<void> {
  if (USE_MOCK) return

  await supabase
    .from('guests')
    .update({ is_opened: true, opened_at: new Date().toISOString() })
    .eq('token', guestToken)
}

// Helper
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}


// ── BLAST WA ─────────────────────────────────────────────────
export async function blastWhatsApp(invitationId: string, token: string) {
  if (USE_MOCK) return { success: 0, failed: 0, total: 0 }
  const res = await axios.post(
    `${API_URL}/invitations/${invitationId}/blast/wa`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return res.data.data
}

// ── BLAST EMAIL ───────────────────────────────────────────────
export async function blastEmail(invitationId: string, token: string) {
  if (USE_MOCK) return { success: 0, failed: 0, total: 0 }
  const res = await axios.post(
    `${API_URL}/invitations/${invitationId}/blast/email`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  )
  return res.data.data
}
