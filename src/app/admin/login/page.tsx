import { AdminLoginForm } from '@/components/admin/admin-login-form'

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Admin Login</h1>
          <p className="text-sm text-muted-foreground">CEO Planner Administration</p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  )
}
