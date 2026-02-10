'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export async function login(formData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') ,
    password: formData.get('password') ,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    if (error.message.includes('Invalid login credentials')) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', data.email)
        .maybeSingle()

      if (!profile) {
        return { error: 'Account not found. Please sign up first.' }
      }

      return { error: 'Incorrect password' }
    }

    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function signup(formData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email'),
    password: formData.get('password') ,
  }

  const { data: signupData, error } = await supabase.auth.signUp(data)

  if (error) {
    return { error: error.message }
  }

  const userId = signupData?.user?.id
  const email = signupData?.user?.email || data.email
  if (userId && email) {
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({ id: userId, email }, { onConflict: 'id' })

    if (profileError) {
      return { error: 'Unable to save profile information.' }
    }
  }

  revalidatePath('/', 'layout')
  return { ok: true }
}