'use client'
import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

// ...

export default function AccountForm({ user }) {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [fullname, setFullname] = useState(null)
  const [username, setUsername] = useState(null)
  const [website, setWebsite] = useState(null)
  const [avatar_url, setAvatarUrl] = useState(null)

  const getProfile = useCallback(async () => {
    try {
      setLoading(true)

      const { data, error, status } = await supabase
        .from('profiles')
        .select(`full_name, username, website, avatar_url`)
        .eq('id', user?.id)
        .single()

      if (error && status !== 406) {
        console.log(error)
        throw error
      }

      if (data) {
        setFullname(data.full_name)
        setUsername(data.username)
        setWebsite(data.website)
        setAvatarUrl(data.avatar_url)
      }
    } catch (error) {
      alert('Error loading user data!')
    } finally {
      setLoading(false)
    }
  }, [user, supabase])

  useEffect(() => {
    getProfile()
  }, [user, getProfile])

  async function updateProfile({
    username,
    website,
    avatar_url,
  }) {
    try {
      setLoading(true)

      const { error } = await supabase.from('profiles').upsert({
        id: user?.id ,
        full_name: fullname,
        username,
        website,
        avatar_url,
        updated_at: new Date().toISOString(),
      })
      if (error) throw error
      alert('Profile updated!')
    } catch (error) {
      alert('Error updating the data!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_18%_18%,rgba(255,64,243,0.16),transparent_34%),radial-gradient(circle_at_78%_8%,rgba(33,246,255,0.2),transparent_36%),radial-gradient(circle_at_50%_80%,rgba(10,8,28,0.4),transparent_48%),#040008] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl">
        <div className="card glass px-6 py-8 md:px-10">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Profile</p>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Account settings</h1>
              <p className="text-sm text-slate-600 dark:text-slate-400">Manage your personal information</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#ffe6fb] text-[#b500b4] dark:bg-[#2b123d] dark:text-[#ff7afc] text-sm font-semibold shadow-[0_0_14px_rgba(255,64,243,0.45)]">
              {loading ? 'Syncing…' : 'Synced'}
            </span>
          </div>

          <div className="flex flex-col gap-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Email</label>
                <input
                  id="email"
                  type="text"
                  value={user?.email || ''}
                  disabled
                  className="w-full rounded-lg border border-slate-200/70 dark:border-slate-700/70 bg-slate-50/80 dark:bg-slate-900/60 px-4 py-3 text-slate-900 dark:text-white shadow-inner"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="fullName" className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Full Name</label>
                <input
                  id="fullName"
                  type="text"
                  value={fullname || ''}
                  onChange={(e) => setFullname(e.target.value)}
                  placeholder="Your full name"
                  className="w-full rounded-lg border border-[#ff40f3]/60 dark:border-[#b500b4]/70 bg-white/95 dark:bg-black px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:border-[#21f6ff] focus:ring-2 focus:ring-[#21f6ff55] dark:focus:ring-[#21f6ff33]"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="username" className="text-xs uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Username</label>
                <input
                  id="username"
                  type="text"
                  value={username || ''}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="yourhandle"
                  className="w-full rounded-lg border border-[#ff40f3]/60 dark:border-[#b500b4]/70 bg-white/95 dark:bg-black px-4 py-3 text-slate-900 dark:text-white placeholder-slate-500 focus:border-[#21f6ff] focus:ring-2 focus:ring-[#21f6ff55] dark:focus:ring-[#21f6ff33]"
                />
              </div>

  
            </div>

            <div className="space-y-3">
              <button
                className="w-full rounded-lg bg-gradient-to-r from-[#ff40f3] to-[#21f6ff] text-black font-semibold px-4 py-3 shadow-[0_0_24px_rgba(255,64,243,0.55)] hover:shadow-[0_0_32px_rgba(33,246,255,0.5)] transition"
                onClick={() => updateProfile({ fullname, username, website, avatar_url })}
                disabled={loading}
              >
                {loading ? 'Loading ...' : 'Save changes'}
              </button>
              <form action="/auth/signout" method="post">
                <button className="w-full justify-center rounded-lg border-2 border-[#21f6ff] px-4 py-3 font-semibold text-[#21b8ff] dark:text-[#21f6ff] hover:shadow-[0_0_18px_rgba(33,246,255,0.45)] transition neon-link" type="submit">
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}