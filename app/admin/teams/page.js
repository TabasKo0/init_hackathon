import TeamsPage from './teams-page'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Teams() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <TeamsPage user={user} />
}
