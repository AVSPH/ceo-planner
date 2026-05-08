import { redirect } from 'next/navigation'
import { verifyAdminSession } from '@/lib/actions/admin'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const admin = await verifyAdminSession()
  if (!admin) redirect('/admin/login')

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AdminSidebar adminEmail={admin.email} />
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
