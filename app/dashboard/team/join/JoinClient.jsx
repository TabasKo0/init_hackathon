'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import { createClient } from '@/lib/supabase/client'

export default function JoinClient({ user, team, teamId, alreadyOnTeam }) {
  const supabase = createClient()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [teamState, setTeamState] = useState(team)
  const [teamIdState, setTeamIdState] = useState(teamId)
  const [isWorking, setIsWorking] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (teamId) {
      setTeamIdState(teamId)
      return
    }

    const idFromQuery = searchParams.get('teamId') || searchParams.get('team') || searchParams.get('id')
    if (idFromQuery) {
      setTeamIdState(idFromQuery)
    }
  }, [searchParams, teamId])

  useEffect(() => {
    let isMounted = true

    async function loadTeam() {
      if (!teamIdState || teamState) return

      const { data } = await supabase
        .from('teams')
        .select('id, name, team_members')
        .eq('id', teamIdState)
        .single()

      if (isMounted) {
        setTeamState(data || null)
      }
    }

    loadTeam()

    return () => {
      isMounted = false
    }
  }, [supabase, teamIdState, teamState])

  async function handleJoin() {
    if (!teamIdState) return
    setError('')

    try {
      setIsWorking(true)
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ team_id: teamIdState, team_role: 'member' })
        .eq('id', user.id)

      if (profileError) throw profileError

      const existingMembers = Array.isArray(teamState?.team_members)
        ? teamState.team_members
        : []

      if (!existingMembers.includes(user.id)) {
        const { error: membersError } = await supabase
          .from('teams')
          .update({ team_members: [...existingMembers, user.id] })
          .eq('id', teamIdState)

        if (membersError) throw membersError
      }

      router.push('/dashboard/team')
    } catch (joinError) {
      setError(joinError.message || 'Unable to join this team right now.')
    } finally {
      setIsWorking(false)
    }
  }

  return (
    <DashboardLayout user={user}>
      <div className="min-h-screen p-4 md:p-8 lg:p-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#ff2fd3] to-[#23e6ff] bg-clip-text text-transparent mb-4">
            Join Team
          </h1>

          {!teamIdState ? (
            <div className="card glass p-6 text-slate-300">
              Team UUID is missing. Please check your link.
            </div>
          ) : !teamState ? (
            <div className="card glass p-6 text-slate-300">
              Team not found. Please check the UUID.
            </div>
          ) : (
            <div className="card glass p-6 space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.15em] text-slate-500">Team</p>
                <p className="text-xl font-semibold text-white">{teamState.name}</p>
                <p className="text-sm text-slate-400">UUID: {teamState.id}</p>
              </div>

              {alreadyOnTeam ? (
                <div className="rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-emerald-200">
                  You are already on a team. Visit your team page to manage it.
                </div>
              ) : (
                <button
                  onClick={handleJoin}
                  disabled={isWorking}
                  className="w-full rounded-md bg-gradient-to-r from-[#ff2fd3] to-[#23e6ff] py-3 text-sm font-bold text-white disabled:opacity-60"
                >
                  {isWorking ? 'Joining...' : 'Join this team'}
                </button>
              )}

              {error ? (
                <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
                  {error}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
