'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import TrackCard from '@/components/TrackCard'

export default function TracksPage({ user }) {
  const supabase = createClient()
  const [tracks, setTracks] = useState([])
  const [loading, setLoading] = useState(true)
  const [distributing, setDistributing] = useState(false)

  const defaultTracks = [
    { id: 'web', name: 'Web Development', enabled: true },
    { id: 'mobile', name: 'Mobile App', enabled: true },
    { id: 'ai', name: 'AI/Machine Learning', enabled: true },
    { id: 'hardware', name: 'Hardware/IoT', enabled: true },
  ]

  useEffect(() => {
    getTracks()
  }, [])

  async function getTracks() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('tracks')
        .select('*')

      if (error) throw error
      setTracks(data || defaultTracks)
    } catch (error) {
      console.error('Error fetching tracks:', error)
      setTracks(defaultTracks)
    } finally {
      setLoading(false)
    }
  }

  async function toggleTrack(trackId) {
    try {
      const track = tracks.find((t) => t.id === trackId)
      const { error } = await supabase
        .from('tracks')
        .update({ enabled: !track.enabled })
        .eq('id', trackId)

      if (error) throw error
      getTracks()
    } catch (error) {
      console.error('Error updating track:', error)
    }
  }

  async function getTeamCountPerTrack(trackId) {
    try {
      const { count, error } = await supabase
        .from('teams')
        .select('*', { count: 'exact', head: true })
        .eq('track', trackId)

      if (error) throw error
      return count || 0
    } catch (error) {
      console.error('Error counting teams:', error)
      return 0
    }
  }

  if (loading) {
    return <div className="admin-page">Loading...</div>
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>🎯 Track Management</h1>
        <p className="admin-subtitle">Enable/disable tracks and manage team distribution</p>
        <div className="admin-actions" style={{ marginTop: 12 }}>
          <button
            className="btn btn-primary"
            disabled={distributing}
            onClick={async () => {
              const proceed = confirm('Proceed to distribute teams to enabled tracks?')
              if (!proceed) return
              const assignOnly = confirm('Assign only unassigned teams?\nOK = only unassigned teams, Cancel = reassign all teams')
              const reassign = assignOnly
              try {
                setDistributing(true)
                const res = await fetch('/api/admin/tracks/distribute', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ reassign }),
                })
                const json = await res.json()
                if (!res.ok) throw new Error(json?.error || 'Distribution failed')
                alert(`Assigned ${json.updated || 0} teams`)
                getTracks()
              } catch (err) {
                console.error('Distribution error:', err)
                alert('Error distributing teams: ' + (err.message || err))
              } finally {
                setDistributing(false)
              }
            }}
          >
            {distributing ? 'Distributing…' : 'Auto Distribute Teams'}
          </button>
        </div>
      </div>

      <div className="admin-content">
        <div className="tracks-grid">
          {tracks.map((track) => (
            <TrackCard
              key={track.id}
              track={track}
              onToggle={() => toggleTrack(track.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
