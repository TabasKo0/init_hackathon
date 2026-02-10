import { NextResponse } from 'next/server'
import { createClient as createServerClient } from '@/lib/supabase/server'

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}))
    const reassign = body?.reassign === true

    // Use server client which uses the request cookies (signed-in user session)
    const supabase = await createServerClient()

    // Ensure there's a signed-in user
    const { data: { user } = {} } = await supabase.auth.getUser().catch(() => ({}))
    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Optional admin check: if `profiles.is_admin` exists, require it
    try {
      const { data: profile, error: pErr } = await supabase.from('profiles').select('is_admin').eq('id', user.id).maybeSingle()
      if (pErr) {
        console.warn('Profile check error (ignored):', pErr)
      } else if (profile && profile.hasOwnProperty('is_admin')) {
        if (!profile.is_admin) {
          return NextResponse.json({ error: 'Forbidden: admin only' }, { status: 403 })
        }
      }
    } catch (e) {
      console.warn('Profile admin check failed, continuing:', e)
    }

    // Get enabled tracks
    const { data: enabledTracks, error: tErr } = await supabase.from('tracks').select('id').eq('enabled', true)
    if (tErr) throw tErr
    if (!enabledTracks || enabledTracks.length === 0) {
      return NextResponse.json({ error: 'No enabled tracks found' }, { status: 400 })
    }
    const trackIds = enabledTracks.map((t) => t.id)

    // Fetch teams to assign
    let teamsQuery = supabase.from('teams').select('id, track')
    if (!reassign) teamsQuery = teamsQuery.is('track', null)
    const { data: teams, error: teamsErr } = await teamsQuery
    if (teamsErr) throw teamsErr
    if (!teams || teams.length === 0) {
      return NextResponse.json({ updated: 0, message: 'No teams to assign' })
    }

    // Get all current team assignments to compute distribution baseline
    const { data: allTeams } = await supabase.from('teams').select('id, track')
    const counts = {}
    trackIds.forEach((id) => (counts[id] = 0))
    if (allTeams && Array.isArray(allTeams)) {
      allTeams.forEach((tm) => {
        if (tm.track && counts[tm.track] !== undefined) counts[tm.track]++
      })
    }

    // Assign each team to the track with the smallest count to balance
    const updates = []
    for (const team of teams) {
      // pick track with minimum count
      const sorted = Object.entries(counts).sort((a, b) => a[1] - b[1])
      const chosen = sorted[0][0]
      counts[chosen]++
      updates.push({ id: team.id, track: chosen })
    }

    // Perform updates sequentially (simple and safe)
    for (const u of updates) {
      const { error: upErr } = await supabase.from('teams').update({ track: u.track }).eq('id', u.id)
      if (upErr) console.error('Failed to update team', u.id, upErr)
    }

    return NextResponse.json({ updated: updates.length })
  } catch (err) {
    console.error('Distribute error:', err)
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 })
  }
}
