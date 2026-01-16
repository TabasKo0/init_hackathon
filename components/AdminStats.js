'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function AdminStats() {
  const supabase = createClient()
  const [stats, setStats] = useState({
    totalTeams: 0,
    trackDistribution: {},
    totalSubmissions: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStats()
  }, [])

  async function getStats() {
    try {
      setLoading(true)

      // Get total teams
      const { count: teamCount } = await supabase
        .from('teams')
        .select('*', { count: 'exact', head: true })

      // Get track distribution
      const { data: trackData } = await supabase
        .from('teams')
        .select('track')

      const distribution = {}
      trackData?.forEach((item) => {
        distribution[item.track] = (distribution[item.track] || 0) + 1
      })

      // Get total submissions
      const { count: submissionCount } = await supabase
        .from('submissions')
        .select('*', { count: 'exact', head: true })

      setStats({
        totalTeams: teamCount || 0,
        trackDistribution: distribution,
        totalSubmissions: submissionCount || 0,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="stat-card">Loading stats...</div>
  }

  return (
    <>
      <div className="stat-card">
        <h3>Total Teams</h3>
        <div className="stat-number">{stats.totalTeams}</div>
      </div>

      <div className="stat-card">
        <h3>Submissions</h3>
        <div className="stat-number">{stats.totalSubmissions}</div>
      </div>

      <div className="stat-card">
        <h3>Track Distribution</h3>
        <div className="track-stats">
          {Object.entries(stats.trackDistribution).map(([track, count]) => (
            <div key={track} className="track-stat">
              <span className="track-name">{track}</span>
              <span className="track-count">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
