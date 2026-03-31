// ============================================================
// SUPABASE CLIENT
// Aktifkan dengan set VITE_USE_MOCK=false di .env
// dan isi VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY
// ============================================================

// import { createClient } from '@supabase/supabase-js'  // ← uncomment kalau pakai DB

// const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
// const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
// export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── DUMMY export supaya tidak error saat mock mode ──
//export const supabase = null as any
//komenan atas untuk settingan statis tanpa supabase, kalau mau pakai DB tinggal uncomment dan isi .env dengan benar
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase credentials tidak ditemukan di .env!')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
