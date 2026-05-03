'use client'
import { useRouter } from 'next/navigation'
import { signOut } from '@/lib/actions/auth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/animate-ui/components/radix/dropdown-menu'
import { Button } from '@/components/animate-ui/components/buttons/button'
import type { Tables } from '@/types/database'

type Profile = Tables<'profiles'>

export function Topbar({ profile }: { profile: Profile }) {
  const router = useRouter()
  const initials = (profile.full_name ?? 'U')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b px-6">
      <p className="text-sm text-muted-foreground">{today}</p>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-full" hoverScale={1.03}>
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt={initials} className="size-8 rounded-full object-cover" />
            ) : (
              <span className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {initials}
              </span>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <div className="px-2 py-2">
            <p className="text-sm font-medium leading-none">{profile.full_name}</p>
            {profile.business_name && (
              <p className="mt-1 text-xs text-muted-foreground">{profile.business_name}</p>
            )}
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => router.push('/app/settings')}>
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onSelect={() => signOut()}
          >
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
