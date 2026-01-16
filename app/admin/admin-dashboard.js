'use client'
import { useState } from 'react'
import Link from 'next/link'
import AdminStats from '@/components/AdminStats'

export default function AdminDashboard({ user }) {
  const [hackathonActive, setHackathonActive] = useState(true)

  const toggleHackathon = async () => {
    try {
      const response = await fetch('/api/admin/hackathon-status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ active: !hackathonActive }),
      })

      if (response.ok) {
        setHackathonActive(!hackathonActive)
      }
    } catch (error) {
      console.error('Error toggling hackathon status:', error)
    }
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p className="admin-subtitle">Manage your hackathon event</p>
      </div>

      <div className="admin-grid">
        <div className="status-card">
          <h2>Hackathon Status</h2>
          <div className="status-content">
            <div className="status-badge" data-active={hackathonActive}>
              {hackathonActive ? 'LIVE' : 'OFFLINE'}
            </div>
            <button
              onClick={toggleHackathon}
              className="toggle-button"
            >
              {hackathonActive ? 'Go Offline' : 'Go Live'}
            </button>
          </div>
        </div>

        <AdminStats />
      </div>

      <nav className="admin-nav">
        <h3>Management</h3>
        <div className="nav-links">
          <Link href="/admin/updates" className="nav-card">
            <h4>📢 Updates</h4>
            <p>Manage announcements & notifications</p>
          </Link>
          <Link href="/admin/teams" className="nav-card">
            <h4>👥 Teams</h4>
            <p>View and manage teams</p>
          </Link>
          <Link href="/admin/tracks" className="nav-card">
            <h4>🎯 Tracks</h4>
            <p>Manage competition tracks</p>
          </Link>
          <Link href="/admin/settings" className="nav-card">
            <h4>⚙️ Settings</h4>
            <p>Configure hackathon settings</p>
          </Link>
        </div>
      </nav>
    </div>
  )
}
