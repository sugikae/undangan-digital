// ============================================================
// TYPES — Undangan Digital
// ============================================================

export interface Invitation {
  id: string
  user_id: string
  slug: string
  theme: string
  is_published: boolean
  event_date: string
  config: InvitationConfig
  created_at: string
  updated_at: string
}

export interface InvitationConfig {
  bride_name: string
  groom_name: string
  bride_parents?: string    // ← tambah ini
  groom_parents?: string    // ← tambah ini
  bride_photo?: string
  groom_photo?: string
  cover_photo?: string
  music_url?: string
  music_autoplay: boolean
  countdown_enabled: boolean
  rsvp_enabled: boolean
  wishes_enabled: boolean
  gallery_enabled: boolean
  gift_enabled: boolean
  qr_enabled: boolean
  flower_animation: boolean
  flower_color: string
  password?: string
  venues: Venue[]
  bank_accounts: BankAccount[]
  love_story?: LoveStory[]
  // ── Animasi config (baru) ─────────────────────────
  opening_animation: 'flower' | 'envelope'  // pilih salah satu
  bg_animation_stars: boolean               // bintang berkelip
  hero_parallax: boolean                    // parallax di hero
  confetti_on_rsvp: boolean                 // confetti saat RSVP
  // Tambahkan setelah confetti_on_rsvp
  bg_animation_glitter?: boolean
  bg_animation_botanical?: boolean
  bg_animation_ribbon?: boolean
  bg_animation_glow?: boolean
  bg_animation_butterflies?: boolean
  bg_animation_rings?: boolean
  scroll_effect?: 'fade-up' | 'zoom-in' | 'bounce' | 'slide-left' | 'flip-up'
}

export interface Venue {
  name: string
  location: string
  date: string
  maps_url: string
}

export interface BankAccount {
  bank: string
  number: string
  name: string
  logo?: string
}

export interface LoveStory {
  year: string
  title: string
  description: string
  photo?: string
}

export interface Guest {
  id: string
  invitation_id: string
  name: string
  phone?: string
  email?: string
  group_name?: string
  token: string
  is_opened: boolean
  opened_at?: string
  created_at: string
}

export interface RSVP {
  id: string
  guest_id: string
  invitation_id: string
  status: 'hadir' | 'tidak_hadir' | 'mungkin'
  pax: number
  note?: string
  responded_at: string
}

export interface Message {
  id: string
  invitation_id: string
  guest_id?: string
  guest_name: string
  content: string
  is_approved: boolean
  created_at: string
}

export interface GiftConfirmation {
  id: string
  invitation_id: string
  sender_name: string
  amount?: number
  bank_name?: string
  method: 'transfer' | 'qris' | 'tunai'
  note?: string
  confirmed_at: string
}

export interface Gallery {
  id: string
  invitation_id: string
  url: string
  thumbnail_url?: string
  caption?: string
  sort_order: number
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}
