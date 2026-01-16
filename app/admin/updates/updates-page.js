'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import UpdateCard from '@/components/UpdateCard'

export default function UpdatesPage({ user }) {
  const supabase = createClient()
  const [updates, setUpdates] = useState([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isImportant, setIsImportant] = useState(false)
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    getUpdates()
  }, [])

  async function getUpdates() {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('updates')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setUpdates(data || [])
    } catch (error) {
      console.error('Error fetching updates:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()

    try {
      if (editingId) {
        const { error } = await supabase
          .from('updates')
          .update({
            title,
            content,
            is_important: isImportant,
            updated_at: new Date().toISOString(),
          })
          .eq('id', editingId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('updates')
          .insert([
            {
              title,
              content,
              is_important: isImportant,
              created_by: user.id,
            },
          ])

        if (error) throw error
      }

      resetForm()
      getUpdates()
    } catch (error) {
      console.error('Error saving update:', error)
      alert('Error saving update')
    }
  }

  async function handleDelete(id) {
    if (!confirm('Are you sure?')) return

    try {
      const { error } = await supabase
        .from('updates')
        .delete()
        .eq('id', id)

      if (error) throw error
      getUpdates()
    } catch (error) {
      console.error('Error deleting update:', error)
    }
  }

  async function handlePushNotification(update) {
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: update.title,
          message: update.content,
          updateId: update.id,
        }),
      })

      if (response.ok) {
        alert('Notification pushed successfully')
      }
    } catch (error) {
      console.error('Error pushing notification:', error)
    }
  }

  function resetForm() {
    setTitle('')
    setContent('')
    setIsImportant(false)
    setEditingId(null)
  }

  function startEdit(update) {
    setTitle(update.title)
    setContent(update.content)
    setIsImportant(update.is_important)
    setEditingId(update.id)
  }

  if (loading) {
    return <div className="admin-page">Loading...</div>
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>📢 Updates & Announcements</h1>
      </div>

      <div className="admin-content">
        <div className="form-section">
          <h2>{editingId ? 'Edit Update' : 'Create New Update'}</h2>
          <form onSubmit={handleSubmit} className="update-form">
            <div className="form-group">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Update title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Update content"
                rows="5"
                required
              />
            </div>

            <div className="form-group checkbox">
              <label>
                <input
                  type="checkbox"
                  checked={isImportant}
                  onChange={(e) => setIsImportant(e.target.checked)}
                />
                Mark as important
              </label>
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update' : 'Create'} Update
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="updates-list">
          <h2>Recent Updates</h2>
          {updates.length === 0 ? (
            <p className="empty-message">No updates yet</p>
          ) : (
            <div className="updates-grid">
              {updates.map((update) => (
                <UpdateCard
                  key={update.id}
                  update={update}
                  onEdit={() => startEdit(update)}
                  onDelete={() => handleDelete(update.id)}
                  onPushNotification={() => handlePushNotification(update)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
