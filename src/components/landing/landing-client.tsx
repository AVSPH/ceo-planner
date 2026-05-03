'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, type Variants, useScroll, useTransform } from 'motion/react'
import {
  LayoutDashboard, CheckSquare, DollarSign, Eye, Target, BarChart2,
  ArrowRight, Zap, RotateCcw, TrendingUp, Sparkles, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const fadeUp = {
  hidden:   { opacity: 0, y: 24 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const fadeUpDelay = (delay: number) => ({
  hidden:   { opacity: 0, y: 24 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: 'easeOut' } },
})

const stagger = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.09 } },
}

const scaleIn = {
  hidden:   { opacity: 0, scale: 0.95 },
  visible:  { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
}

function Reveal({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={stagger}
      className={className}
    >
      {children}
    </motion.div>
  )
}

const TESTIMONIALS = [
  {
    name: 'Alex Chen',
    role: 'Founder & CEO',
    quote: 'Finally stopped spinning and started shipping. The daily loop is exactly how I needed to work.',
    avatar: '👤',
  },
  {
    name: 'Jordan Smith',
    role: 'Solo Entrepreneur',
    quote: 'Revenue tracking + task execution in one place. The energy tracking actually changed how I work.',
    avatar: '👤',
  },
  {
    name: 'Taylor Brown',
    role: 'Digital Creator',
    quote: 'Content planning with revenue insights. This is the system every content founder should use.',
    avatar: '👤',
  },
]

const FEATURES = [
  {
    icon: LayoutDashboard,
    title: 'Today',
    tag: 'Daily loop',
    desc: 'Morning energy check-in, mood log, wellness habits, and a structured evening close. Run the same ritual every day.',
    gradient: 'from-indigo-500 to-violet-600',
    glow: 'shadow-indigo-500/20',
    ring: 'border-indigo-500/20',
    iconBg: 'bg-indigo-500/15',
  },
  {
    icon: CheckSquare,
    title: 'Tasks',
    tag: 'Execution',
    desc: 'Priority tasks with recurring patterns. CEO, sales, admin, visibility — organized by what actually moves your business.',
    gradient: 'from-sky-500 to-cyan-500',
    glow: 'shadow-sky-500/20',
    ring: 'border-sky-500/20',
    iconBg: 'bg-sky-500/15',
  },
  {
    icon: DollarSign,
    title: 'Money',
    tag: 'Revenue',
    desc: 'Daily revenue log, expense tracker, debt overview, and goal progress ring. Your numbers, visible and honest every day.',
    gradient: 'from-emerald-500 to-teal-500',
    glow: 'shadow-emerald-500/20',
    ring: 'border-emerald-500/20',
    iconBg: 'bg-emerald-500/15',
  },
  {
    icon: Eye,
    title: 'Visibility',
    tag: 'Content',
    desc: "What you're promoting, your content idea, your CTA, which platforms. Plus reflection on what resonated.",
    gradient: 'from-pink-500 to-rose-500',
    glow: 'shadow-pink-500/20',
    ring: 'border-pink-500/20',
    iconBg: 'bg-pink-500/15',
  },
  {
    icon: Target,
    title: 'Vision',
    tag: 'Identity',
    desc: 'CEO identity, word of year, dream life, values, annual goals, quarterly focus, and income targets. Your north star, always visible.',
    gradient: 'from-amber-500 to-orange-500',
    glow: 'shadow-amber-500/20',
    ring: 'border-amber-500/20',
    iconBg: 'bg-amber-500/15',
  },
  {
    icon: BarChart2,
    title: 'Insights',
    tag: 'Intelligence',
    desc: 'Energy trends, mood frequency, habit heatmap, task velocity, revenue vs goal. Thirty days of your life, made legible.',
    gradient: 'from-purple-500 to-fuchsia-500',
    glow: 'shadow-purple-500/20',
    ring: 'border-purple-500/20',
    iconBg: 'bg-purple-500/15',
  },
]

const PILLARS = [
  {
    icon: Zap,
    title: 'Input becomes output',
    desc: 'Every log feeds your Insights. Habits become data. Data becomes decisions. Nothing you enter disappears.',
    accent: 'text-indigo-400',
    bg: 'bg-indigo-500/8 border-indigo-500/20',
  },
  {
    icon: RotateCcw,
    title: 'One loop, every day',
    desc: 'Morning intent → task execution → evening close. A complete operating rhythm built for founders who lead themselves first.',
    accent: 'text-violet-400',
    bg: 'bg-violet-500/8 border-violet-500/20',
  },
  {
    icon: TrendingUp,
    title: 'Solo-first',
    desc: 'Built for one founder, not a team. No collaboration bloat, no noise. Just you, running your business with intention.',
    accent: 'text-emerald-400',
    bg: 'bg-emerald-500/8 border-emerald-500/20',
  },
]

const LOOP_STEPS = [
  {
    num: '01', phase: 'Morning', title: 'Set your intent',
    desc: 'Energy, mood, top priorities, wellness. Own the first hour before the day owns you.',
    accent: 'text-indigo-400', border: 'border-indigo-500/25', bg: 'bg-indigo-500/6',
  },
  {
    num: '02', phase: 'During', title: 'Execute',
    desc: 'Work your tasks. Log revenue. Plan content. Every action tied back to your vision.',
    accent: 'text-emerald-400', border: 'border-emerald-500/25', bg: 'bg-emerald-500/6',
  },
  {
    num: '03', phase: 'Evening', title: 'Close strong',
    desc: 'What worked. What to release. Your win of the day. End with reflection, not collapse.',
    accent: 'text-violet-400', border: 'border-violet-500/25', bg: 'bg-violet-500/6',
  },
]

export function LandingClient() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0.3])

  return (
    <div ref={containerRef} className="flex min-h-screen flex-col bg-white text-gray-900 overflow-x-hidden">

      {/* ── Navbar ── */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/70 backdrop-blur-2xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="size-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="size-4 text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight">CEO Planner</span>
          </motion.div>
          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="rounded-lg px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Sign in
            </Link>
            <Link href="/auth/signup" className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors">
              Get started
            </Link>
          </div>
        </nav>
      </header>

      {/* ── Hero ── */}
      <motion.section style={{ opacity: heroOpacity }} className="relative flex min-h-screen items-center justify-center px-6 pt-16">
        {/* bg decorations */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] h-[700px] w-[700px] rounded-full bg-indigo-200/40 blur-[130px]" />
          <div className="absolute top-1/3 right-1/4 h-72 w-72 rounded-full bg-violet-200/30 blur-[90px]" />
          <div className="absolute bottom-1/4 left-1/4 h-64 w-64 rounded-full bg-sky-200/25 blur-[80px]" />
          <div className="absolute top-1/4 right-1/3 h-96 w-96 rounded-full bg-emerald-200/20 blur-[100px]" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative z-10 mx-auto max-w-4xl text-center"
        >
          <motion.div variants={fadeUp} className="mb-8 flex justify-center">
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/60 px-4 py-2 text-xs font-medium text-indigo-700 backdrop-blur-sm cursor-pointer"
            >
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              Daily operating system for solo founders
            </motion.span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mb-6 text-6xl font-black leading-[1.1] tracking-tight sm:text-7xl lg:text-8xl text-gray-900"
          >
            Not a journal.{' '}
            <br className="hidden sm:block" />
            <span className="text-indigo-700">
              A daily OS.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg"
          >
            CEO Planner combines task management, wellbeing tracking, content planning, and business intelligence into one focused daily rhythm — built for founders who run alone.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <Link
              href="/auth/signup"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-indigo-600 transition-all duration-200 hover:shadow-indigo-600/50"
            >
              Start for free
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-8 py-4 text-sm font-semibold text-gray-900 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              Explore features
              <ChevronRight className="size-4" />
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs font-medium text-gray-500">
            {['6 integrated modules', 'Habit streaks', 'Revenue tracking', 'Mood trends', 'Content planner'].map((s, i) => (
              <span key={s} className="flex items-center gap-2">
                {i > 0 && <span className="size-1 rounded-full bg-gray-300" />}
                {s}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ── Visual Demo Preview ── */}
      <section className="relative px-6 py-20 border-y border-gray-200 bg-gradient-to-b from-white to-gray-50">
        <div className="mx-auto max-w-6xl">
          <Reveal className="text-center space-y-6 mb-12">
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
              See it in action
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl font-bold tracking-tight sm:text-5xl text-gray-900">
              Your day visualized
            </motion.h2>
          </Reveal>

          <Reveal className="relative">
            <motion.div
              variants={scaleIn}
              className="relative rounded-2xl overflow-hidden border-2 border-gray-200 bg-white p-1 shadow-xl shadow-indigo-500/10"
            >
              <div className="relative bg-gradient-to-br from-gray-50 to-white rounded-xl overflow-hidden h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/20 to-violet-100/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="space-y-4"
                    >
                      <LayoutDashboard className="size-16 mx-auto text-indigo-500/40" />
                      <p className="text-gray-400 text-sm">Interactive dashboard preview</p>
                    </motion.div>
                  </div>
                </div>
                {/* Grid overlay */}
                <div
                  className="absolute inset-0 opacity-[0.02]"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)',
                    backgroundSize: '32px 32px',
                  }}
                />
              </div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-6 py-28 bg-white">
        <div className="mx-auto max-w-6xl space-y-16">
          <Reveal className="text-center space-y-4">
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
              What's inside
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl font-bold tracking-tight sm:text-5xl text-gray-900">
              Everything you need.{' '}
              <span className="text-gray-400">Nothing you don't.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto max-w-xl text-gray-600">
              Six purpose-built modules that cover every dimension of running your business and your life.
            </motion.p>
          </Reveal>

          <Reveal className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, tag, desc, gradient, glow, ring, iconBg }, idx) => (
              <motion.div
                key={title}
                variants={fadeUpDelay(idx * 0.05)}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative rounded-2xl border-2 border-gray-100 bg-gradient-to-br from-white to-gray-50 p-6 space-y-5 transition-all duration-300 hover:border-gray-200 hover:shadow-xl shadow-indigo-500/10 cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="rounded-xl p-3 bg-gradient-to-br from-indigo-100 to-violet-100">
                    <div className={cn('rounded-lg bg-gradient-to-br p-2.5', gradient)}>
                      <Icon className="size-5 text-white" />
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 pt-1">
                    {tag}
                  </span>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{desc}</p>
                </div>
                <div className={cn(
                  'absolute -bottom-px left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                  gradient
                )} />
              </motion.div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── Built different ── */}
      <section className="border-y border-gray-200 bg-gray-50 px-6 py-24">
        <div className="mx-auto max-w-6xl space-y-16">
          <Reveal className="text-center space-y-4">
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-violet-600">
              The philosophy
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl font-bold tracking-tight sm:text-5xl text-gray-900">
              Your day has a shape.{' '}
              <span className="text-gray-400">We built the frame.</span>
            </motion.h2>
          </Reveal>

          <Reveal className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {PILLARS.map(({ icon: Icon, title, desc, accent, bg }, idx) => (
              <motion.div
                key={title}
                variants={fadeUpDelay(idx * 0.1)}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="rounded-2xl border-2 border-gray-200 bg-white p-8 space-y-4 cursor-pointer hover:border-gray-300 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <Icon className={cn('size-7', accent)} />
                <div className="space-y-3">
                  <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{desc}</p>
                </div>
              </motion.div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── The Loop ── */}
      <section className="px-6 py-28 bg-white">
        <div className="mx-auto max-w-5xl space-y-16">
          <Reveal className="text-center space-y-4">
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
              The ritual
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl font-bold tracking-tight sm:text-5xl text-gray-900">
              One loop. Every day.
            </motion.h2>
            <motion.p variants={fadeUp} className="mx-auto max-w-lg text-gray-600">
              Three moments that close the gap between who you are and who you're becoming.
            </motion.p>
          </Reveal>

          <Reveal className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {LOOP_STEPS.map(({ num, phase, title, desc, accent, border, bg }, idx) => (
              <motion.div
                key={num}
                variants={fadeUpDelay(idx * 0.1)}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="rounded-2xl border-2 border-gray-100 bg-gradient-to-br from-white to-gray-50 p-8 space-y-5 cursor-pointer hover:border-gray-200 transition-all duration-300 relative overflow-hidden shadow-md hover:shadow-lg"
              >
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent opacity-50" />
                <div className="flex items-start justify-between">
                  <span className={cn('text-xs font-bold uppercase tracking-widest', accent)}>{phase}</span>
                  <span className="text-5xl font-black text-gray-100 leading-none">{num}</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                  <p className="text-sm leading-relaxed text-gray-600">{desc}</p>
                </div>
              </motion.div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="border-y border-gray-200 bg-gray-50 px-6 py-24">
        <div className="mx-auto max-w-6xl space-y-12">
          <Reveal className="text-center space-y-4">
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-pink-600">
              Loved by founders
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl font-bold tracking-tight sm:text-5xl text-gray-900">
              Join the daily loop
            </motion.h2>
          </Reveal>

          <Reveal className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {TESTIMONIALS.map(({ name, role, quote, avatar }, idx) => (
              <motion.div
                key={name}
                variants={fadeUpDelay(idx * 0.1)}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                className="rounded-2xl border-2 border-gray-200 bg-white p-8 space-y-4 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-gray-900">{name}</h3>
                    <p className="text-xs text-gray-500">{role}</p>
                  </div>
                  <span className="text-2xl">{avatar}</span>
                </div>
                <p className="text-sm leading-relaxed text-gray-700 italic">"{quote}"</p>
              </motion.div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="px-6 py-24 bg-white">
        <div className="mx-auto max-w-5xl">
          <Reveal className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[
              { label: 'Daily Users', value: '2.5K+' },
              { label: 'Tasks Tracked', value: '50K+' },
              { label: 'Avg Streak', value: '34 days' },
              { label: 'Uptime', value: '99.9%' },
            ].map(({ label, value }, idx) => (
              <motion.div key={label} variants={fadeUpDelay(idx * 0.1)} className="text-center space-y-2">
                <p className="text-3xl font-black text-indigo-700">
                  {value}
                </p>
                <p className="text-xs font-medium text-gray-500">{label}</p>
              </motion.div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden border-t border-gray-200 bg-gradient-to-b from-white to-gray-50 px-6 py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-indigo-200/40 blur-[120px]" />
          <div className="absolute top-1/4 right-1/3 h-96 w-96 rounded-full bg-violet-200/30 blur-[90px]" />
        </div>
        <Reveal className="relative z-10 mx-auto max-w-3xl text-center space-y-10">
          <motion.div variants={fadeUp} className="space-y-4">
            <h2 className="text-5xl font-black tracking-tight sm:text-6xl text-gray-900">
              Ready to run{' '}
              <span className="text-indigo-700">
                your day?
              </span>
            </h2>
            <p className="text-lg text-gray-600">
              Join founders who've stopped reacting and started leading — one daily loop at a time.
            </p>
          </motion.div>
          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              asChild
            >
              <Link
                href="/auth/signup"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-indigo-600/30 hover:from-indigo-500 hover:to-indigo-600 transition-all duration-200"
              >
                Start your daily loop
                <ArrowRight className="size-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
            </motion.div>
            <Link
              href="/auth/login"
              className="inline-flex items-center rounded-xl border-2 border-gray-300 px-8 py-4 text-base font-semibold text-gray-900 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
            >
              Sign in
            </Link>
          </motion.div>
        </Reveal>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 px-6 py-12 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <Zap className="size-3 text-white" />
                </div>
                <span className="font-bold text-sm text-gray-900">CEO Planner</span>
              </div>
              <p className="text-xs text-gray-500">Your daily operating system</p>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-700">Product</p>
              <ul className="space-y-2 text-xs text-gray-600 hover:[&_a]:text-gray-900">
                <li><Link href="#features">Features</Link></li>
                <li><Link href="#pricing">Pricing</Link></li>
                <li><Link href="#blog">Blog</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-700">Company</p>
              <ul className="space-y-2 text-xs text-gray-600 hover:[&_a]:text-gray-900">
                <li><Link href="#about">About</Link></li>
                <li><Link href="#contact">Contact</Link></li>
                <li><Link href="#status">Status</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-700">Legal</p>
              <ul className="space-y-2 text-xs text-gray-600 hover:[&_a]:text-gray-900">
                <li><Link href="#privacy">Privacy</Link></li>
                <li><Link href="#terms">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500">
            <span>© 2026 CEO Planner. All rights reserved.</span>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <Link href="#twitter" className="hover:text-gray-900 transition-colors">Twitter</Link>
              <Link href="#linkedin" className="hover:text-gray-900 transition-colors">LinkedIn</Link>
              <Link href="#discord" className="hover:text-gray-900 transition-colors">Discord</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
