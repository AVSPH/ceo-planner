'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { createAdminClient } from '@/utils/supabase/admin'
import { sendApprovalEmail } from '@/lib/email'

const JWT_SECRET = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET!)
const COOKIE_NAME = 'admin_session'
const MAX_ATTEMPTS = 5
const LOCK_MINUTES = 15

export type AdminState = { error?: string; success?: string } | null

async function audit(
  session: { adminId: string; email: string },
  action: string,
  targetId?: string,
  targetEmail?: string,
) {
  const supabase = createAdminClient()
  await supabase.from('admin_audit_logs').insert({
    admin_id: session.adminId,
    admin_email: session.email,
    action,
    target_id: targetId ?? null,
    target_email: targetEmail ?? null,
  })
}

export async function adminSignIn(prevState: AdminState, formData: FormData): Promise<AdminState> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('admin_users')
    .select('id, email, password_hash, failed_attempts, locked_until')
    .eq('email', email)
    .single()

  if (error || !data) return { error: 'Invalid credentials' }

  if (data.locked_until && new Date(data.locked_until) > new Date()) {
    const mins = Math.ceil((new Date(data.locked_until).getTime() - Date.now()) / 60000)
    return { error: `Account locked. Try again in ${mins} minute(s).` }
  }

  const valid = await bcrypt.compare(password, data.password_hash)
  if (!valid) {
    const attempts = data.failed_attempts + 1
    const locked_until =
      attempts >= MAX_ATTEMPTS
        ? new Date(Date.now() + LOCK_MINUTES * 60 * 1000).toISOString()
        : null
    await supabase
      .from('admin_users')
      .update({ failed_attempts: attempts, locked_until })
      .eq('id', data.id)

    if (attempts >= MAX_ATTEMPTS)
      return { error: `Too many failed attempts. Account locked for ${LOCK_MINUTES} minutes.` }
    return { error: `Invalid credentials. ${MAX_ATTEMPTS - attempts} attempt(s) remaining.` }
  }

  await supabase
    .from('admin_users')
    .update({ failed_attempts: 0, locked_until: null })
    .eq('id', data.id)

  const token = await new SignJWT({ adminId: data.id, email: data.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('8h')
    .sign(JWT_SECRET)

  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
    path: '/',
  })

  redirect('/admin')
}

export async function adminSignOut() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
  redirect('/admin/login')
}

export async function verifyAdminSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as { adminId: string; email: string }
  } catch {
    return null
  }
}

export async function approveUser(userId: string) {
  const session = await verifyAdminSession()
  if (!session) redirect('/admin/login')

  const supabase = createAdminClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', userId)
    .single()

  const { data: authUser } = await supabase.auth.admin.getUserById(userId)
  const userEmail = authUser.user?.email ?? ''

  await supabase.from('profiles').update({ is_active: true }).eq('id', userId)
  await sendApprovalEmail(userEmail, profile?.full_name)
  await audit(session, 'approve_user', userId, userEmail)

  revalidatePath('/admin/users')
  revalidatePath('/admin')
}

export async function deactivateUser(userId: string) {
  const session = await verifyAdminSession()
  if (!session) redirect('/admin/login')

  const supabase = createAdminClient()
  const { data: authUser } = await supabase.auth.admin.getUserById(userId)
  const userEmail = authUser.user?.email ?? ''

  await supabase.from('profiles').update({ is_active: false }).eq('id', userId)
  await audit(session, 'deactivate_user', userId, userEmail)

  revalidatePath('/admin/users')
  revalidatePath('/admin')
}

export async function bulkApproveUsers(userIds: string[]) {
  const session = await verifyAdminSession()
  if (!session) redirect('/admin/login')

  const supabase = createAdminClient()
  await supabase.from('profiles').update({ is_active: true }).in('id', userIds)

  await Promise.all(
    userIds.map(async (id) => {
      const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', id).single()
      const { data: authUser } = await supabase.auth.admin.getUserById(id)
      const email = authUser.user?.email ?? ''
      await sendApprovalEmail(email, profile?.full_name)
      await audit(session, 'approve_user', id, email)
    }),
  )

  revalidatePath('/admin/users')
  revalidatePath('/admin')
}

export async function createAdmin(prevState: AdminState, formData: FormData): Promise<AdminState> {
  const session = await verifyAdminSession()
  if (!session) redirect('/admin/login')

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string

  if (!email || !password || !fullName) return { error: 'All fields required' }
  if (password.length < 8) return { error: 'Password must be at least 8 characters' }

  const supabase = createAdminClient()
  const { data: existing } = await supabase
    .from('admin_users')
    .select('id')
    .eq('email', email)
    .single()

  if (existing) return { error: 'Admin with that email already exists' }

  const password_hash = await bcrypt.hash(password, 10)
  const { error } = await supabase
    .from('admin_users')
    .insert({ email, password_hash, full_name: fullName })

  if (error) return { error: 'Failed to create admin' }

  await audit(session, 'create_admin', undefined, email)
  revalidatePath('/admin/admins')
  return { success: 'Co-admin created successfully' }
}

export async function removeAdmin(adminId: string) {
  const session = await verifyAdminSession()
  if (!session) redirect('/admin/login')
  if (session.adminId === adminId) return

  const supabase = createAdminClient()
  const { data } = await supabase
    .from('admin_users')
    .select('email')
    .eq('id', adminId)
    .single()

  await supabase.from('admin_users').delete().eq('id', adminId)
  await audit(session, 'remove_admin', adminId, data?.email ?? '')
  revalidatePath('/admin/admins')
}

export async function resetUserPassword(
  userId: string,
  prevState: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const session = await verifyAdminSession()
  if (!session) redirect('/admin/login')

  const password = formData.get('password') as string
  if (!password) return { error: 'Password required' }
  if (password.length < 8) return { error: 'Password must be at least 8 characters' }

  const supabase = createAdminClient()
  const { data: authUser } = await supabase.auth.admin.getUserById(userId)
  if (!authUser.user) return { error: 'User not found' }

  const { error } = await supabase.auth.admin.updateUserById(userId, { password })
  if (error) return { error: error.message }

  await audit(session, 'reset_user_password', userId, authUser.user.email ?? '')
  revalidatePath('/admin/users')
  return { success: 'Password updated' }
}

export async function resetAdminPassword(
  adminId: string,
  prevState: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const session = await verifyAdminSession()
  if (!session) redirect('/admin/login')

  const password = formData.get('password') as string
  if (!password) return { error: 'Password required' }
  if (password.length < 8) return { error: 'Password must be at least 8 characters' }

  const supabase = createAdminClient()
  const { data: target } = await supabase
    .from('admin_users')
    .select('email')
    .eq('id', adminId)
    .single()

  if (!target) return { error: 'Admin not found' }

  const password_hash = await bcrypt.hash(password, 10)
  const { error } = await supabase
    .from('admin_users')
    .update({ password_hash, failed_attempts: 0, locked_until: null })
    .eq('id', adminId)

  if (error) return { error: 'Failed to update password' }

  await audit(session, 'reset_admin_password', adminId, target.email)
  revalidatePath('/admin/admins')
  return { success: 'Password updated' }
}

export async function changeAdminPassword(
  prevState: AdminState,
  formData: FormData,
): Promise<AdminState> {
  const session = await verifyAdminSession()
  if (!session) redirect('/admin/login')

  const currentPassword = formData.get('current_password') as string
  const newPassword = formData.get('new_password') as string

  if (!currentPassword || !newPassword) return { error: 'All fields required' }
  if (newPassword.length < 8) return { error: 'New password must be at least 8 characters' }

  const supabase = createAdminClient()
  const { data } = await supabase
    .from('admin_users')
    .select('password_hash')
    .eq('id', session.adminId)
    .single()

  if (!data) return { error: 'Admin not found' }

  const valid = await bcrypt.compare(currentPassword, data.password_hash)
  if (!valid) return { error: 'Current password is incorrect' }

  const password_hash = await bcrypt.hash(newPassword, 10)
  await supabase.from('admin_users').update({ password_hash }).eq('id', session.adminId)
  await audit(session, 'change_password')

  return { success: 'Password updated successfully' }
}
