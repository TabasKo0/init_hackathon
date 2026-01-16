'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TrackCard({ track, onToggle }) {
  const supabase = createClient()
  const [teamCount, setTeamCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTeamCount()
  }, [track.id])

  async function getTeamCount() {
    try {
      const { count } = await supabase
        .from('teams')
        .select('*', { count: 'exact', head: true })
        .eq('track', track.id)

      setTeamCount(count || 0)
    } catch (error) {
      console.error('Error fetching team count:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`track-card ${!track.enabled ? 'disabled' : ''}`}>
      <h3>{track.name}</h3>
      <div className="track-info">
        <p className="team-count">
          <strong>{teamCount}</strong> team{teamCount !== 1 ? 's' : ''}
        </p>
        <p className={`status ${track.enabled ? 'enabled' : 'disabled'}`}>
          {track.enabled ? '✓ Enabled' : '✗ Disabled'}
        </p>
      </div>
      <button
        onClick={onToggle}
        className={`btn ${track.enabled ? 'btn-danger' : 'btn-success'}`}
      >
        {track.enabled ? 'Disable' : 'Enable'}
      </button>
    </div>
  )
}
