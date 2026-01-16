'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function SettingsPage({ user }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState({
    startDate: '',
    endDate: '',
    submissionsLocked: false,
  })

  useEffect(() => {
    getSettings()
  }, [])

  async function getSettings() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('hackathon_settings')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setSettings({
          startDate: data.start_date || '',
          endDate: data.end_date || '',
          submissionsLocked: data.submissions_locked || false,
        })
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveSettings() {
    try {
      const { error } = await supabase
        .from('hackathon_settings')
        .upsert({
          id: 1,
          start_date: settings.startDate,
          end_date: settings.endDate,
          submissions_locked: settings.submissionsLocked,
          updated_at: new Date().toISOString(),
        })

      if (error) throw error
      alert('Settings saved successfully')
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('Error saving settings')
    }
  }

  async function handleEmergencyDisable() {
    if (
      !confirm(
        'This will disable the entire hackathon. Are you absolutely sure?'
      )
    ) {
      return
    }

    try {
      const response = await fetch('/api/admin/emergency-disable', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disabled: true }),
      })

      if (response.ok) {
        alert('Hackathon has been disabled')
      }
    } catch (error) {
      console.error('Error disabling hackathon:', error)
    }
  }

  if (loading) {
    return <div className="admin-page">Loading...</div>
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>⚙️ Hackathon Settings</h1>
      </div>

      <div className="admin-content">
        <div className="settings-section">
          <h2>Event Timing</h2>
          <div className="form-group">
            <label htmlFor="startDate">Start Date & Time</label>
            <input
              id="startDate"
              type="datetime-local"
              value={settings.startDate}
              onChange={(e) =>
                setSettings({ ...settings, startDate: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label htmlFor="endDate">End Date & Time</label>
            <input
              id="endDate"
              type="datetime-local"
              value={settings.endDate}
              onChange={(e) =>
                setSettings({ ...settings, endDate: e.target.value })
              }
            />
          </div>
        </div>

        <div className="settings-section">
          <h2>Submission Control</h2>
          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={settings.submissionsLocked}
                onChange={(e) =>
                  setSettings({ ...settings, submissionsLocked: e.target.checked })
                }
              />
              Lock all submissions
            </label>
            <p className="help-text">
              When locked, teams cannot submit or modify their submissions
            </p>
          </div>
        </div>

        <div className="settings-section">
          <h2>Emergency Controls</h2>
          <button
            onClick={handleEmergencyDisable}
            className="btn btn-danger"
          >
            🚨 Emergency Disable Hackathon
          </button>
          <p className="help-text">
            This will immediately disable all access to the hackathon platform
          </p>
        </div>

        <button onClick={handleSaveSettings} className="btn btn-primary">
          Save Settings
        </button>
      </div>
    </div>
  )
}
