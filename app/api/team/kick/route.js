import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const runtime = 'nodejs'

function normalizeMemberEmails(rawEmails) {
  if (Array.isArray(rawEmails)) return rawEmails
  if (typeof rawEmails === 'string') {
    try {
      const parsed = JSON.parse(rawEmails)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  if (rawEmails && Array.isArray(rawEmails.emails)) return rawEmails.emails
  return []
}

export async function POST(request) {
  try {
    let payload = null

    try {
      payload = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 })
    }

    const teamId = String(payload?.teamId || '').trim()
    const memberId = String(payload?.memberId || '').trim()

    if (!teamId || !memberId) {
      return NextResponse.json({ error: 'Missing teamId or memberId.' }, { status: 400 })
    }

    const supabase = await createClient()

    // Get current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
    }

    // Get team details
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('id, name, owner_id, team_members, member_emails')
      .eq('id', teamId)
      .single()

    if (teamError || !team) {
      return NextResponse.json({ error: 'Team not found.' }, { status: 404 })
    }

    // Check if current user is the team leader
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('team_id, team_role')
      .eq('id', user.id)
      .single()

    const isLeader =
      userProfile?.team_id === teamId &&
      (userProfile?.team_role === 'leader' || team.owner_id === user.id)

    if (!isLeader) {
      return NextResponse.json({ error: 'Only team leaders can kick members.' }, { status: 403 })
    }

    // Prevent kicking yourself
    if (user.id === memberId) {
      return NextResponse.json({ error: 'Cannot kick yourself. Use disband team instead.' }, { status: 400 })
    }

    // Get member to be kicked
    const { data: memberProfile, error: memberError } = await supabase
      .from('profiles')
      .select('id, email, team_id')
      .eq('id', memberId)
      .single()

    if (memberError || !memberProfile) {
      return NextResponse.json({ error: 'Member not found.' }, { status: 404 })
    }

    // Verify member is on the team
    if (memberProfile.team_id !== teamId) {
      return NextResponse.json({ error: 'Member is not on this team.' }, { status: 400 })
    }

    // Remove member from team
    const currentMembers = Array.isArray(team.team_members) ? team.team_members : []
    const currentEmails = normalizeMemberEmails(team.member_emails)

    const updatedMembers = currentMembers.filter((id) => id !== memberId)
    const updatedEmails = currentEmails.filter((email) => email !== memberProfile.email)

    // Update team members array
    const { error: teamUpdateError } = await supabase
      .from('teams')
      .update({
        team_members: updatedMembers,
        member_emails: updatedEmails,
      })
      .eq('id', teamId)

    if (teamUpdateError) {
      return NextResponse.json({ error: 'Unable to update team.' }, { status: 500 })
    }

    // Clear member's team_id and team_role
    const { error: profileUpdateError } = await supabase
      .from('profiles')
      .update({
        team_id: null,
        team_role: null,
      })
      .eq('id', memberId)

    if (profileUpdateError) {
      return NextResponse.json({ error: 'Unable to update member profile.' }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      message: 'Member kicked successfully.',
      memberCount: updatedMembers.length,
    })
  } catch (unexpectedError) {
    return NextResponse.json(
      { error: unexpectedError.message || 'Unexpected error in kick member API.' },
      { status: 500 }
    )
  }
}
