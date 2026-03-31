import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/services/supabase'
import { useAuthStore } from './auth.store'
import type { Invitation } from '@/types'

export const useDashboardStore = defineStore('dashboard', () => {
  const invitations = ref<Invitation[]>([])
  const isLoading = ref(false)
  const stats = ref<Record<string, any>>({})

  async function loadInvitations() {
    const authStore = useAuthStore()
    if (!authStore.user) return

    isLoading.value = true
    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('user_id', authStore.user.id)
        .order('created_at', { ascending: false })

      if (!error) invitations.value = data ?? []
    } finally {
      isLoading.value = false
    }
  }

  async function loadStats(invitationId: string) {
    const [rsvpRes, msgRes, guestRes] = await Promise.all([
      supabase.from('rsvp').select('status, pax').eq('invitation_id', invitationId),
      supabase.from('messages').select('id').eq('invitation_id', invitationId),
      supabase.from('guests').select('id, is_opened').eq('invitation_id', invitationId),
    ])

    const rsvpData = rsvpRes.data ?? []
    stats.value[invitationId] = {
      total_hadir: rsvpData.filter(r => r.status === 'hadir').length,
      total_tidak_hadir: rsvpData.filter(r => r.status === 'tidak_hadir').length,
      total_mungkin: rsvpData.filter(r => r.status === 'mungkin').length,
      total_tamu: rsvpData.filter(r => r.status === 'hadir').reduce((s, r) => s + r.pax, 0),
      total_ucapan: msgRes.data?.length ?? 0,
      total_tamu_list: guestRes.data?.length ?? 0,
      total_buka: guestRes.data?.filter(g => g.is_opened).length ?? 0,
    }
  }

  async function togglePublish(id: string, current: boolean) {
    const { error } = await supabase
      .from('invitations')
      .update({ is_published: !current })
      .eq('id', id)

    if (!error) {
      const inv = invitations.value.find(i => i.id === id)
      if (inv) inv.is_published = !current
    }
  }

  async function deleteInvitation(id: string) {
    const { error } = await supabase
      .from('invitations')
      .delete()
      .eq('id', id)

    if (!error) {
      invitations.value = invitations.value.filter(i => i.id !== id)
    }
  }

  return {
    invitations, isLoading, stats,
    loadInvitations, loadStats, togglePublish, deleteInvitation
  }
})
