import TracksPage from './tracks-page'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Tracks() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <TracksPage user={user} />
}
