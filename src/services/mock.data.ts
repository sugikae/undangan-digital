// ============================================================
// MOCK DATA — Dipakai saat VITE_USE_MOCK=true
// Ganti dengan data asli dari Supabase kalau sudah konek DB
// ============================================================

import type { Invitation, Guest, Message, Gallery } from '@/types'

export const mockInvitation: Invitation = {
  id: 'mock-inv-001',
  user_id: 'mock-user-001',
  slug: 'elok-faryd-2025',
  theme: 'floral',
  is_published: true,
  event_date: '2026-09-20T09:00:00+07:00',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  config: {
    bride_name: 'Elok Rahayu',
    groom_name: 'Faryd Santoso',
    bride_photo: 'https://i.pravatar.cc/300?img=47',
    groom_photo: 'https://i.pravatar.cc/300?img=68',
    cover_photo: '',
    music_url: '/sounds/obito.mp3',
    music_autoplay: false,
    countdown_enabled: true,
    rsvp_enabled: true,
    wishes_enabled: true,
    gallery_enabled: true,
    gift_enabled: true,
    qr_enabled: false,
    flower_animation: true,
    flower_color: '#a8c5d8',
    venues: [
      {
        name: 'Akad Nikah',
        location: 'Masjid Agung Al-Azhar, Jl. Sisingamangaraja, Jakarta Selatan',
        date: '2026-09-20T08:00:00+07:00',
        maps_url: 'https://maps.google.com/?q=-6.2297,106.8231',
      },
      {
        name: 'Resepsi',
        location: 'Gedung Serbaguna Graha Utama, Jl. Gatot Subroto No.1, Jakarta',
        date: '2026-09-20T11:00:00+07:00',
        maps_url: 'https://maps.google.com/?q=-6.2297,106.8231',
      },
    ],
    bank_accounts: [
      { bank: 'BCA', number: '1234567890', name: 'Faryd Santoso' },
      { bank: 'Mandiri', number: '0987654321', name: 'Elok Rahayu' },
    ],
    love_story: [
      {
        year: '2019',
        title: 'Pertama Bertemu',
        description: 'Kami bertemu pertama kali di sebuah acara seminar kampus. Tak disangka pertemuan singkat itu menjadi awal dari segalanya.',
      },
      {
        year: '2020',
        title: 'Mulai Dekat',
        description: 'Pandemi membuat kami semakin sering berkomunikasi. Dari obrolan ringan hingga akhirnya saling mengenal lebih dalam.',
      },
      {
        year: '2022',
        title: 'Resmi Berpacaran',
        description: 'Di bawah langit senja tepi pantai, akhirnya kami resmi menjalin hubungan yang lebih serius.',
      },
      {
        year: '2025',
        title: 'Lamaran',
        description: 'Dengan restu kedua keluarga, kami melangkah ke jenjang yang lebih suci. Menuju pelaminan bersama.',
      },
    ],
    // ── Animasi config ──
    opening_animation: 'envelope',//'flower',   // ganti ke 'envelope' untuk test amplop
    bg_animation_stars: true,
    hero_parallax: true,
    confetti_on_rsvp: true,
  },
}

export const mockGuests: Guest[] = [
  {
    id: 'g-001', invitation_id: 'mock-inv-001',
    name: 'Mas Sugiono Askaf', phone: '081234567890',
    group_name: 'Keluarga', token: 'tok-abc123',
    is_opened: false, created_at: new Date().toISOString(),
  },
  {
    id: 'g-002', invitation_id: 'mock-inv-001',
    name: 'Budi Santoso', phone: '082345678901',
    group_name: 'Rekan Kerja', token: 'tok-def456',
    is_opened: true, opened_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
]

export const mockMessages: Message[] = [
  {
    id: 'm-001', invitation_id: 'mock-inv-001',
    guest_name: 'Siti Aminah',
    content: 'Selamat menempuh hidup baru! Semoga menjadi keluarga yang sakinah, mawaddah, warahmah. Bahagia selalu ya kak Elok & kak Faryd 🌸',
    is_approved: true, created_at: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'm-002', invitation_id: 'mock-inv-001',
    guest_name: 'Ahmad Fauzi',
    content: 'Alhamdulillah, akhirnya jadian juga kalian 😄 Selamat ya, semoga langgeng sampai kakek nenek!',
    is_approved: true, created_at: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'm-003', invitation_id: 'mock-inv-001',
    guest_name: 'Dewi Kartika',
    content: 'Barakallah atas pernikahannya. Semoga Allah memberkahi kalian berdua dan segera dikaruniai keturunan yang sholeh/sholehah 🤲',
    is_approved: true, created_at: new Date(Date.now() - 10800000).toISOString(),
  },
]

export const mockGalleries: Gallery[] = [
  { id: 'gal-001', invitation_id: 'mock-inv-001', url: 'https://picsum.photos/seed/wedding1/600/800', thumbnail_url: 'https://picsum.photos/seed/wedding1/300/400', caption: 'Foto Prewedding', sort_order: 0 },
  { id: 'gal-002', invitation_id: 'mock-inv-001', url: 'https://picsum.photos/seed/wedding2/600/800', thumbnail_url: 'https://picsum.photos/seed/wedding2/300/400', caption: 'Foto Berdua', sort_order: 1 },
  { id: 'gal-003', invitation_id: 'mock-inv-001', url: 'https://picsum.photos/seed/wedding3/800/600', thumbnail_url: 'https://picsum.photos/seed/wedding3/400/300', caption: 'Momen Spesial', sort_order: 2 },
  { id: 'gal-004', invitation_id: 'mock-inv-001', url: 'https://picsum.photos/seed/wedding4/600/800', thumbnail_url: 'https://picsum.photos/seed/wedding4/300/400', caption: 'Kenangan Indah', sort_order: 3 },
  { id: 'gal-005', invitation_id: 'mock-inv-001', url: 'https://picsum.photos/seed/wedding5/600/800', thumbnail_url: 'https://picsum.photos/seed/wedding5/300/400', caption: 'Bersama Selamanya', sort_order: 4 },
  { id: 'gal-006', invitation_id: 'mock-inv-001', url: 'https://picsum.photos/seed/wedding6/800/600', thumbnail_url: 'https://picsum.photos/seed/wedding6/400/300', caption: 'Cinta Abadi', sort_order: 5 },
]
