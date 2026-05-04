'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, useScroll, useTransform } from 'motion/react'
import {
  Calendar, CheckSquare, DollarSign, RotateCcw, BookOpen,
  ArrowRight, Sparkles, ChevronRight, Heart, Star,
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

const PAIN_POINTS = [
  'Your life feels all over the place and you don\'t know where to start',
  'You keep starting things but can\'t stay consistent',
  'You want to make money, but don\'t have a clear plan',
  'You\'ve spent years in survival mode and feel stuck',
  'You\'re ready for change, but overwhelmed by how',
]

const FEATURES = [
  {
    icon: Calendar,
    title: 'Daily Structure Pages',
    tag: 'Daily',
    desc: 'No more guessing what to do. Start each day with a clear, structured plan that tells you exactly where to focus.',
    gradient: 'from-rose-500 to-pink-600',
  },
  {
    icon: CheckSquare,
    title: 'Weekly Planning System',
    tag: 'Weekly',
    desc: 'Stay focused, not scattered. Map your week with intention so every day builds toward your bigger goals.',
    gradient: 'from-violet-500 to-purple-600',
  },
  {
    icon: DollarSign,
    title: 'Income Planning + Tracking',
    tag: 'Money',
    desc: 'Turn effort into money. Track your income goals, log progress daily, and watch your financial picture get clearer.',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    icon: RotateCcw,
    title: 'Consistency System',
    tag: 'Habits',
    desc: 'So you actually follow through. Built-in systems that keep you on track even when life feels heavy.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: BookOpen,
    title: 'Simple Routines',
    tag: 'Stability',
    desc: 'Create stability through simplicity. Morning and evening rituals that calm your nervous system and ground your day.',
    gradient: 'from-sky-500 to-cyan-500',
  },
]

const WHY_WORKS = [
  { label: 'Not hustle-based', desc: 'Progress without burning out' },
  { label: 'Not overwhelming', desc: 'One step at a time, always' },
  { label: 'Built for women rebuilding', desc: 'Designed for your real life' },
  { label: 'Structure + emotional stability', desc: 'Head and heart, together' },
  { label: 'Real life, not perfect routines', desc: 'Works even on hard days' },
]

const PRICING = [
  {
    id: 'planner',
    name: 'Planner',
    price: '$29.99',
    period: 'one-time',
    badge: 'Free for one week',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    highlight: false,
    features: ['Instant access', 'Lifetime use', 'Daily structure pages', 'Weekly planning system', 'All 5 modules'],
  },
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$22.22',
    period: 'per month',
    badge: null,
    badgeColor: '',
    highlight: false,
    features: ['Everything in Planner', 'Monthly subscription', 'New content drops', 'Priority support'],
  },
  {
    id: '6months',
    name: '6 Months',
    price: '$130',
    period: '6 months',
    badge: 'Most popular',
    badgeColor: 'bg-violet-100 text-violet-700',
    highlight: true,
    features: ['Everything in Monthly', 'Save vs monthly', '6 months of access', 'Bonus resources'],
  },
  {
    id: '12months',
    name: '12 Months',
    price: '$260',
    period: 'per year',
    badge: 'Best value',
    badgeColor: 'bg-rose-100 text-rose-700',
    highlight: false,
    features: ['Everything in 6 Months', 'Full year access', 'Maximum savings', 'VIP support'],
  },
]

export function LandingClient() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0.3])

  return (
    <div ref={containerRef} className="flex min-h-screen flex-col bg-white text-gray-900 overflow-x-hidden">

      {/* ── Navbar ── */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-rose-100 bg-white/70 backdrop-blur-2xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <div className="size-8 rounded-lg bg-gradient-to-br from-rose-500 to-violet-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
              <Sparkles className="size-4 text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight">Life & CEO Planner</span>
          </motion.div>
          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="rounded-lg px-3 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Sign in
            </Link>
            <Link href="/auth/signup" className="rounded-lg bg-gradient-to-r from-rose-500 to-violet-600 px-3 py-2 text-xs font-semibold text-white hover:opacity-90 transition-opacity">
              Get The Planner
            </Link>
          </div>
        </nav>
      </header>

      {/* ── Hero ── */}
      <motion.section style={{ opacity: heroOpacity }} className="relative flex min-h-screen items-center justify-center px-6 pt-16">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] h-[700px] w-[700px] rounded-full bg-rose-200/40 blur-[130px]" />
          <div className="absolute top-1/3 right-1/4 h-72 w-72 rounded-full bg-violet-200/30 blur-[90px]" />
          <div className="absolute bottom-1/4 left-1/4 h-64 w-64 rounded-full bg-pink-200/25 blur-[80px]" />
          <div
            className="absolute inset-0 opacity-[0.025]"
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
              className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50/60 px-4 py-2 text-xs font-medium text-rose-700 backdrop-blur-sm cursor-pointer"
            >
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              For women 30+ ready to create real change
            </motion.span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="mb-6 text-5xl font-black leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl text-gray-900"
          >
            Turn chaos into structure —{' '}
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-rose-600 to-violet-600 bg-clip-text text-transparent">
              and structure into income.
            </span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="mx-auto mb-6 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg"
          >
            Simple, step-by-step systems to help you stay consistent, get organized, and finally see real progress.
          </motion.p>

          <motion.p
            variants={fadeUp}
            className="mx-auto mb-10 max-w-xl text-sm italic text-gray-500"
          >
            Your life doesn't change from thinking about it. It changes when you have a system you actually follow.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3 mb-12">
            <Link
              href="/auth/signup"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-violet-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-rose-500/30 hover:opacity-90 transition-all duration-200"
            >
              Get The Planner
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-300 bg-white px-8 py-4 text-sm font-semibold text-gray-900 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
            >
              See pricing
              <ChevronRight className="size-4" />
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs font-medium text-gray-500">
            {['Instant access', 'Lifetime use', 'Income tracking', 'Daily structure', 'Consistency system'].map((s, i) => (
              <span key={s} className="flex items-center gap-2">
                {i > 0 && <span className="size-1 rounded-full bg-gray-300" />}
                {s}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ── Pain Points ── */}
      <section className="relative px-6 py-24 border-y border-rose-100 bg-gradient-to-b from-white to-rose-50/30">
        <div className="mx-auto max-w-3xl">
          <Reveal className="space-y-10">
            <motion.div variants={fadeUp} className="text-center space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-rose-600">If you've been feeling like this…</p>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-gray-900">
                You're not alone.
              </h2>
            </motion.div>

            <motion.ul variants={stagger} className="space-y-4">
              {PAIN_POINTS.map((point, idx) => (
                <motion.li
                  key={idx}
                  variants={fadeUpDelay(idx * 0.07)}
                  className="flex items-start gap-4 rounded-2xl border border-rose-100 bg-white p-5 shadow-sm"
                >
                  <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-rose-100">
                    <span className="size-2 rounded-full bg-rose-500" />
                  </span>
                  <p className="text-gray-700 leading-relaxed">{point}</p>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div variants={fadeUp} className="text-center pt-4">
              <p className="text-xl font-bold text-gray-900">You don't need more motivation.</p>
              <p className="text-xl font-bold bg-gradient-to-r from-rose-600 to-violet-600 bg-clip-text text-transparent">You need structure.</p>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ── This isn't a discipline problem ── */}
      <section className="px-6 py-24 bg-white">
        <div className="mx-auto max-w-3xl">
          <Reveal className="space-y-10">
            <motion.div variants={fadeUp} className="text-center space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-600">The real reason</p>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-gray-900">
                This isn't a{' '}
                <span className="italic">discipline</span> problem.
              </h2>
              <p className="mx-auto max-w-xl text-gray-600 leading-relaxed">
                You were never given a system that works for your life.
              </p>
            </motion.div>

            <motion.div variants={stagger} className="space-y-4">
              {[
                { label: 'Your nervous system is overwhelmed', icon: '🧠' },
                { label: 'Your focus is scattered', icon: '🌀' },
                { label: 'Consistency feels impossible', icon: '⚡' },
              ].map(({ label, icon }, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUpDelay(idx * 0.08)}
                  className="flex items-center gap-4 rounded-2xl border border-violet-100 bg-violet-50/40 p-5"
                >
                  <span className="text-2xl">{icon}</span>
                  <p className="font-medium text-gray-800">{label}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="rounded-2xl border-2 border-violet-200 bg-gradient-to-br from-violet-50 to-rose-50 p-8 text-center space-y-3">
              <p className="text-gray-700 leading-relaxed">
                So you don't follow through — not because you can't…
              </p>
              <p className="text-lg font-bold text-gray-900">
                but because you don't have a structure that holds you.
              </p>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ── What the planner does ── */}
      <section className="border-y border-gray-100 bg-gradient-to-b from-gray-50 to-white px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <Reveal className="space-y-10">
            <motion.div variants={fadeUp} className="text-center space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">The solution</p>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-gray-900">
                This is where the{' '}
                <span className="bg-gradient-to-r from-rose-600 to-violet-600 bg-clip-text text-transparent">
                  Life & CEO Planner
                </span>{' '}
                changes everything.
              </h2>
              <p className="mx-auto max-w-xl text-gray-600">
                This isn't just a planner. It's a simple daily system that helps you:
              </p>
            </motion.div>

            <motion.ul variants={stagger} className="space-y-4">
              {[
                'Organize your life without overwhelm',
                'Know exactly what to focus on each day',
                'Stay consistent (even when life feels heavy)',
                'Start building income step by step',
              ].map((item, idx) => (
                <motion.li
                  key={idx}
                  variants={fadeUpDelay(idx * 0.07)}
                  className="flex items-center gap-4 rounded-xl border border-emerald-100 bg-white p-5 shadow-sm"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500">
                    <svg className="size-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <p className="font-medium text-gray-800">{item}</p>
                </motion.li>
              ))}
            </motion.ul>
          </Reveal>
        </div>
      </section>

      {/* ── Features / What you get ── */}
      <section id="features" className="px-6 py-28 bg-white">
        <div className="mx-auto max-w-6xl space-y-16">
          <Reveal className="text-center space-y-4">
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-rose-600">
              What you get
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl font-bold tracking-tight sm:text-5xl text-gray-900">
              Inside the Life & CEO Planner
            </motion.h2>
          </Reveal>

          <Reveal className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, tag, desc, gradient }, idx) => (
              <motion.div
                key={title}
                variants={fadeUpDelay(idx * 0.05)}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative rounded-2xl border-2 border-gray-100 bg-gradient-to-br from-white to-gray-50 p-6 space-y-5 transition-all duration-300 hover:border-gray-200 hover:shadow-xl cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className={cn('rounded-xl bg-gradient-to-br p-3', gradient)}>
                    <Icon className="size-5 text-white" />
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

      {/* ── Before / After ── */}
      <section className="border-y border-gray-100 bg-gray-50 px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <Reveal className="space-y-12">
            <motion.div variants={fadeUp} className="text-center space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-600">The transformation</p>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-gray-900">
                From chaos → to calm
              </h2>
            </motion.div>

            <motion.div variants={stagger} className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <motion.div variants={scaleIn} className="rounded-2xl border-2 border-red-100 bg-red-50/50 p-8 space-y-5">
                <p className="text-xs font-bold uppercase tracking-widest text-red-500">Before</p>
                <ul className="space-y-3">
                  {['Overwhelmed', 'Inconsistent', 'Stuck in survival mode', 'No clear direction'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                      <span className="text-red-400 font-bold">✗</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div variants={scaleIn} className="rounded-2xl border-2 border-emerald-100 bg-emerald-50/50 p-8 space-y-5">
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">After</p>
                <ul className="space-y-3">
                  {['Structured days', 'Clear focus', 'Consistent action', 'Building income + stability'].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700">
                      <span className="text-emerald-500 font-bold">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ── Founder Story ── */}
      <section className="px-6 py-24 bg-white">
        <div className="mx-auto max-w-3xl">
          <Reveal className="space-y-8">
            <motion.div variants={fadeUp} className="text-center space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-rose-600">Why I Created This</p>
            </motion.div>

            <motion.div
              variants={scaleIn}
              className="relative rounded-2xl border-2 border-rose-100 bg-gradient-to-br from-rose-50 to-violet-50 p-8 md:p-10 space-y-6"
            >
              <div className="absolute -top-4 left-8 text-5xl opacity-20 font-black text-rose-400">"</div>
              <div className="flex items-start gap-4">
                <div className="size-12 shrink-0 rounded-full bg-gradient-to-br from-rose-400 to-violet-500 flex items-center justify-center">
                  <Heart className="size-5 text-white" />
                </div>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    I was a solo mom in survival mode — overwhelmed, inconsistent, and trying to rebuild my life from scratch.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Nothing worked until I created a simple system that gave me structure, clarity, and direction.
                  </p>
                  <p className="font-semibold text-gray-900 leading-relaxed">
                    This planner helped me move from chaos to consistency — and start making real progress.
                  </p>
                  <p className="text-rose-700 font-semibold">
                    If that's where you are right now… this is for you.
                  </p>
                </div>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ── Why this works ── */}
      <section className="border-y border-gray-100 bg-gray-50 px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <Reveal className="space-y-12">
            <motion.div variants={fadeUp} className="text-center space-y-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-violet-600">The difference</p>
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl text-gray-900">
                Why this works when other things haven't
              </h2>
            </motion.div>

            <motion.div variants={stagger} className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              {WHY_WORKS.map(({ label, desc }, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUpDelay(idx * 0.06)}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="rounded-2xl border-2 border-violet-100 bg-white p-6 space-y-2 hover:border-violet-200 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-violet-500">
                      <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <p className="font-semibold text-gray-900 text-sm">{label}</p>
                  </div>
                  <p className="text-xs text-gray-500 pl-7">{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="px-6 py-28 bg-white">
        <div className="mx-auto max-w-6xl space-y-16">
          <Reveal className="text-center space-y-4">
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-rose-600">
              Pricing
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl font-bold tracking-tight sm:text-5xl text-gray-900">
              Get your life structured so you can build income
            </motion.h2>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              The Life & CEO Digital Planner is Free for One Week
            </motion.div>
          </Reveal>

          <Reveal className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {PRICING.map(({ id, name, price, period, badge, badgeColor, highlight, features }, idx) => (
              <motion.div
                key={id}
                variants={fadeUpDelay(idx * 0.07)}
                whileHover={{ y: -8, transition: { duration: 0.25 } }}
                className={cn(
                  'relative rounded-2xl border-2 p-6 space-y-6 transition-all duration-300 cursor-pointer flex flex-col',
                  highlight
                    ? 'border-violet-400 bg-gradient-to-br from-violet-50 to-rose-50 shadow-xl shadow-violet-500/15'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
                )}
              >
                {badge && (
                  <span className={cn('absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap', badgeColor)}>
                    {badge}
                  </span>
                )}

                <div className="space-y-1 pt-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">{name}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-gray-900">{price}</span>
                    <span className="text-xs text-gray-500">/ {period}</span>
                  </div>
                </div>

                <ul className="space-y-2 flex-1">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className={cn('shrink-0 size-4 rounded-full flex items-center justify-center', highlight ? 'bg-violet-500' : 'bg-gray-200')}>
                        <svg className="size-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/auth/signup"
                  className={cn(
                    'block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all duration-200',
                    highlight
                      ? 'bg-gradient-to-r from-rose-500 to-violet-600 text-white shadow-md shadow-violet-500/25 hover:opacity-90'
                      : 'border-2 border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-gray-300'
                  )}
                >
                  Get started
                </Link>
              </motion.div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="relative overflow-hidden border-t border-rose-100 bg-gradient-to-b from-rose-50/40 to-violet-50/40 px-6 py-32">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-rose-200/40 blur-[120px]" />
          <div className="absolute top-1/4 right-1/3 h-96 w-96 rounded-full bg-violet-200/30 blur-[90px]" />
        </div>
        <Reveal className="relative z-10 mx-auto max-w-3xl text-center space-y-10">
          <motion.div variants={fadeUp} className="space-y-6">
            <div className="flex justify-center">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
            <h2 className="text-4xl font-black tracking-tight sm:text-5xl text-gray-900">
              If you're waiting to feel{' '}
              <span className="italic">"ready"</span>
              {' '}…
              <br />
              <span className="bg-gradient-to-r from-rose-600 to-violet-600 bg-clip-text text-transparent">
                this is your sign.
              </span>
            </h2>
            <p className="text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
              You don't need to have it all figured out. You just need a system that helps you take the next step.
            </p>
            <p className="font-semibold text-gray-800">Start simple. Start structured. Start now.</p>
          </motion.div>
          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-violet-600 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-rose-500/30 hover:opacity-90 transition-all duration-200"
            >
              Get The Planner
              <ArrowRight className="size-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              href="#pricing"
              className="inline-flex items-center rounded-xl border-2 border-gray-300 px-8 py-4 text-base font-semibold text-gray-900 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
            >
              View pricing
            </Link>
          </motion.div>
          <motion.p variants={fadeUp} className="text-sm text-gray-500">
            Free for one week · Instant access · Lifetime use
          </motion.p>
        </Reveal>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 px-6 py-12 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-lg bg-gradient-to-br from-rose-500 to-violet-600 flex items-center justify-center">
                  <Sparkles className="size-3 text-white" />
                </div>
                <span className="font-bold text-sm text-gray-900">Life & CEO Planner</span>
              </div>
              <p className="text-xs text-gray-500">Helping women 30+ turn chaos into structure — and structure into income.</p>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-700">Product</p>
              <ul className="space-y-2 text-xs text-gray-600 hover:[&_a]:text-gray-900">
                <li><Link href="#features">Features</Link></li>
                <li><Link href="#pricing">Pricing</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-700">Company</p>
              <ul className="space-y-2 text-xs text-gray-600 hover:[&_a]:text-gray-900">
                <li><Link href="#about">About</Link></li>
                <li><Link href="#contact">Contact</Link></li>
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
            <span>© 2026 Life & CEO Planner. All rights reserved.</span>
            <div className="flex items-center gap-6 mt-4 md:mt-0">
              <Link href="#instagram" className="hover:text-gray-900 transition-colors">Instagram</Link>
              <Link href="#facebook" className="hover:text-gray-900 transition-colors">Facebook</Link>
              <Link href="#tiktok" className="hover:text-gray-900 transition-colors">TikTok</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
