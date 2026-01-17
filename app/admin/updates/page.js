import UpdatesPage from './updates-page'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Updates() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <UpdatesPage user={user} />
}
