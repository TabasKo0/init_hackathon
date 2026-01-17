'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import TeamCard from '@/components/TeamCard'

export default function TeamsPage({ user }) {
  const supabase = createClient()
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTrack, setFilterTrack] = useState('all')

  useEffect(() => {
    getTeams()
  }, [])

  async function getTeams() {
    try {
      setLoading(true)
      let query = supabase.from('profiles').select('*')

      if (filterTrack !== 'all') {
        query = query.eq('track', filterTrack)
      }

      const { data, error } = await query.order('updated_at', {
        ascending: false,
      })

      if (error) throw error
      setTeams(data || [])
    } catch (error) {
      console.error('Error fetching teams:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTeams = teams.filter((team) =>
    team.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return <div className="admin-page">Loading...</div>
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>👥 Teams Management</h1>
        <p className="admin-subtitle">
          Total teams: <strong>{teams.length}</strong>
        </p>
      </div>

      <div className="admin-content">
        <div className="filters">
          <input
            type="text"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <select
            value={filterTrack}
            onChange={(e) => {
              setFilterTrack(e.target.value)
              getTeams()
            }}
            className="filter-select"
          >
            <option value="all">All Tracks</option>
            <option value="web">Web</option>
            <option value="mobile">Mobile</option>
            <option value="ai">AI/ML</option>
            <option value="hardware">Hardware</option>
          </select>
        </div>

        <div className="teams-grid">
          {filteredTeams.length === 0 ? (
            <p className="empty-message">No teams found</p>
          ) : (
            filteredTeams.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
