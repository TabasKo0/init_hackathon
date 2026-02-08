import { redirect } from 'next/navigation'
import DashboardClient from './DashboardClient'

import { createClient } from '@/lib/supabase/server'
import {
  getUserProfile,
  getTeamData,
  getTeamMembers,
  getHackathonStatus,
} from '@/lib/dashboardHelpers'

async function getDashboardData(supabase, user) {
  const profile = await getUserProfile(supabase, user.id)
  const hackathonMeta = await getHackathonStatus(supabase)
  const hackathonStatus = hackathonMeta?.status || 'not_started'

  let team = null
  let members = []

  if (profile?.team_id) {
    team = await getTeamData(supabase, profile.team_id)
    if (team) {
      members = await getTeamMembers(supabase, team.id)
    }
  }

  return {
    user,
    team,
    members,
    hackathonStatus,
  }
}

export default async function Dashboard() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const dashboardData = await getDashboardData(supabase, user)

  return <DashboardClient user={user} dashboardData={dashboardData} />
}
