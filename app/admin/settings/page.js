import SettingsPage from './settings-page'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Settings() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <SettingsPage user={user} />
}
