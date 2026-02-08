import AccountForm from './account-form'
import { createClient } from '@/lib/supabase/server'
import DashboardLayout from '@/components/DashboardLayout'

export default async function Account() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return <DashboardLayout><AccountForm user={user} /></DashboardLayout>
}