import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import ScannerClient from './ScannerClient'

export default async function ScannerPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin' && profile?.role !== 'oc') {
    redirect('/')
  }

  return <ScannerClient user={user} />
}
