import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import JoinClient from './JoinClient'
import { getUserProfile } from '@/lib/dashboardHelpers'

export default async function JoinTeamPage({ searchParams }) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const resolvedSearchParams = await searchParams
  const rawTeamId = resolvedSearchParams?.teamId || resolvedSearchParams?.team || resolvedSearchParams?.id
  const teamId = Array.isArray(rawTeamId) ? rawTeamId[0] : rawTeamId || ''
  let team = null

  if (teamId) {
    const { data } = await supabase
      .from('teams')
      .select('id, name, team_members')
      .eq('id', teamId)
      .single()

    team = data || null
  }

  const profile = await getUserProfile(supabase, user.id)
  const alreadyOnTeam = !!profile?.team_id

  return <JoinClient user={user} team={team} teamId={teamId} alreadyOnTeam={alreadyOnTeam} />
}
