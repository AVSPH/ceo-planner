// Seeds an admin_users row. Run: node --env-file=.env.local scripts/seed-admin.mjs <email> [full_name]
import { randomBytes } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'

const email = process.argv[2]
const fullName = process.argv[3] ?? 'Admin'

if (!email) {
  console.error('Usage: node --env-file=.env.local scripts/seed-admin.mjs <email> [full_name]')
  process.exit(1)
}

const { NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env
if (!NEXT_PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const password = randomBytes(18).toString('base64url')
const password_hash = await bcrypt.hash(password, 10)

const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const { data, error } = await supabase
  .from('admin_users')
  .upsert(
    { email, password_hash, full_name: fullName, failed_attempts: 0, locked_until: null },
    { onConflict: 'email' },
  )
  .select('id, email, full_name')
  .single()

if (error) {
  console.error('Seed failed:', error.message)
  process.exit(1)
}

console.log('Admin seeded:', data)
console.log('\n  email:    %s\n  password: %s\n', email, password)
console.log('Log in at /admin/login, then change the password from the admin UI.')
