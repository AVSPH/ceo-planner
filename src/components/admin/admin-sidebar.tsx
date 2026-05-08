'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { adminSignOut } from '@/lib/actions/admin'
import { LuLayoutDashboard, LuUsers, LuShield, LuScrollText, LuLogOut } from 'react-icons/lu'

const NAV = [
  { href: '/admin', label: 'Overview', icon: LuLayoutDashboard, exact: true },
  { href: '/admin/users', label: 'Users', icon: LuUsers, exact: false },
  { href: '/admin/admins', label: 'Admins', icon: LuShield, exact: false },
  { href: '/admin/logs', label: 'Audit Log', icon: LuScrollText, exact: false },
]

export function AdminSidebar({ adminEmail }: { adminEmail: string }) {
  const pathname = usePathname()

  return (
    <aside className="w-56 shrink-0 flex flex-col h-screen border-r border-border bg-muted/30 sticky top-0">
      <div className="px-5 py-5 border-b border-border">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CEO Planner</p>
        <p className="text-sm font-semibold mt-0.5">Admin</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }`}
            >
              <Icon size={15} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-5 py-4 border-t border-border space-y-2">
        <p className="text-xs text-muted-foreground truncate">{adminEmail}</p>
        <form action={adminSignOut}>
          <button type="submit" className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <LuLogOut size={13} />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  )
}
