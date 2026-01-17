'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TeamCard({ team }) {
  const supabase = createClient()
  const [memberCount, setMemberCount] = useState(0)

  useEffect(() => {
    getMemberCount()
  }, [team.id])

  async function getMemberCount() {
    try {
      const { count } = await supabase
        .from('team_members')
        .select('*', { count: 'exact', head: true })
        .eq('team_id', team.id)

      setMemberCount(count || 0)
    } catch (error) {
      console.error('Error fetching members:', error)
    }
  }

  return (
    <div className="team-card">
      <h3>{team.name}</h3>
      <div className="team-info">
        <p>
          <strong>Track:</strong> {team.track || 'Not selected'}
        </p>
        <p>
          <strong>Members:</strong> {memberCount}
        </p>
        <p>
          <strong>Status:</strong>{' '}
          <span className={`status ${team.submission_status || 'pending'}`}>
            {team.submission_status || 'Pending'}
          </span>
        </p>
      </div>
      <button className="btn btn-primary">View Details</button>
    </div>
  )
}
