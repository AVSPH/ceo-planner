'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

type AuthState = { error?: string; message?: string } | null

export async function signUp(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  })

  if (error) return { error: error.message }

  if (data.user && !data.session) {
    return { message: 'Check your email to confirm your account.' }
  }

  if (data.user) {
    await supabase
      .from('profiles')
      .update({ full_name: fullName })
      .eq('id', data.user.id)
  }

  redirect('/onboarding')
}

export async function signIn(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }

  redirect('/app')
}

export async function signOut() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  await supabase.auth.signOut()
  redirect('/auth/login')
}
