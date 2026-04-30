import { LandingNavbar } from '@/components/landing/navbar'
import { Button } from '@/components/animate-ui/components/buttons/button'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNavbar />
      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 text-center">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            CEO Planner
          </h1>
          <p className="mx-auto max-w-md text-lg text-muted-foreground">
            Your daily operating system for intentional leadership, wellness, and growth.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button size="lg" asChild>
            <Link href="/auth/signup">Get Started Free</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </div>
      </main>
    </div>
  )
}
