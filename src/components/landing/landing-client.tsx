'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, useScroll, useTransform, type Variants } from 'motion/react'
import {
  Calendar, CheckSquare, DollarSign, RotateCcw, BookOpen,
  ArrowRight, Heart, Star, Sparkles,
} from 'lucide-react'
import Image from 'next/image'
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid'

const fadeUp: Variants = {
  hidden:   { opacity: 0, y: 20 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const fadeUpDelay = (delay: number): Variants => ({
  hidden:   { opacity: 0, y: 20 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.5, delay, ease: 'easeOut' } },
})

const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const scaleIn: Variants = {
  hidden:   { opacity: 0, scale: 0.97 },
  visible:  { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
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

function BentoBackground({ src, position = 'object-center' }: { src: string; position?: string }) {
  return (
    <div className="absolute inset-0">
      <Image src={src} alt="" fill className={`object-cover ${position} opacity-70`} />
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
    </div>
  )
}

const FEATURES = [
  {
    // Row 1 — card 1 (wide)
    Icon: Calendar,
    name: 'Daily Structure Pages',
    description: 'No more guessing what to do. Start each day with a clear plan that tells you exactly where to focus.',
    href: '/auth/signup',
    cta: 'Get started',
    className: 'col-span-3 lg:col-span-2',
    background: <BentoBackground src="/assets/Angelic D Planner.png" position="object-top" />,
  },
  {
    // Row 1 — card 2 (narrow)
    Icon: CheckSquare,
    name: 'Weekly Planning System',
    description: 'Stay focused, not scattered. Map your week so every day builds toward your bigger goals.',
    href: '/auth/signup',
    cta: 'Get started',
    className: 'col-span-3 lg:col-span-1',
    background: <BentoBackground src="/assets/Angelic D CEO Planners.png" />,
  },
  {
    // Row 2 — card 1
    Icon: DollarSign,
    name: 'Income Planning + Tracking',
    description: 'Turn effort into money. Track income goals and log progress daily.',
    href: '/auth/signup',
    cta: 'Get started',
    className: 'col-span-3 lg:col-span-1',
    background: <BentoBackground src="/assets/Angelic B Digital table.png" />,
  },
  {
    // Row 2 — card 2
    Icon: RotateCcw,
    name: 'Consistency System',
    description: 'Built-in systems that keep you on track even when life feels heavy.',
    href: '/auth/signup',
    cta: 'Get started',
    className: 'col-span-3 lg:col-span-1',
    background: <BentoBackground src="/assets/Angelic Bus My Plan Story (1).png" position="object-top" />,
  },
  {
    // Row 2 — card 3
    Icon: BookOpen,
    name: 'Simple Routines',
    description: 'Morning and evening rituals that calm your nervous system and ground your day.',
    href: '/auth/signup',
    cta: 'Get started',
    className: 'col-span-3 lg:col-span-1',
    background: <BentoBackground src="/assets/Angelic D 1st Image.png" />,
  },
]

const PRICING = [
  {
    id: 'planner',
    name: 'Planner',
    price: '$29.99',
    period: 'one-time',
    badge: 'Free for 1 week',
    highlight: false,
    features: ['Instant access', 'Lifetime use', 'All 5 modules', 'Step-by-step structure system'],
  },
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$22.22',
    period: 'per month',
    badge: null,
    highlight: false,
    features: ['Everything in Planner', 'Monthly subscription', 'New content drops', 'Support'],
  },
  {
    id: '6months',
    name: '6 Months',
    price: '$130',
    period: '6 months',
    badge: 'Most popular',
    highlight: true,
    features: ['Everything in Monthly', 'Save vs monthly', '6 months access', 'Bonus resources'],
  },
  {
    id: '12months',
    name: '12 Months',
    price: '$260',
    period: 'per year',
    badge: 'Best value',
    highlight: false,
    features: ['Everything in 6 Months', 'Full year access', 'Maximum savings', 'VIP support'],
  },
]

export function LandingClient() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0.4])

  return (
    <div ref={containerRef} className="flex min-h-screen flex-col bg-white text-gray-900 overflow-x-hidden">

      {/* ── Navbar ── */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
            <div className="size-7 rounded-md bg-rose-600 flex items-center justify-center">
              <Sparkles className="size-3.5 text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight">Life & CEO Planner</span>
          </motion.div>
          <div className="flex items-center gap-2">
            <Link href="/auth/login" className="rounded-lg px-3 py-2 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors">
              Sign in
            </Link>
            <Link href="/auth/signup" className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700 transition-colors">
              Get The Planner
            </Link>
          </div>
        </nav>
      </header>

      {/* ── Hero ── */}
      <motion.section style={{ opacity: heroOpacity }} className="relative flex min-h-screen items-center justify-center px-6 pt-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative z-10 mx-auto max-w-3xl text-center"
        >
          <motion.p variants={fadeUp} className="mb-4 text-xs font-semibold uppercase tracking-widest text-rose-600">
            For women 30+ ready to create real change
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="mb-6 text-5xl font-black leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl text-gray-900"
          >
            Helping women 30+ turn chaos into structure —
            <span className="block text-rose-600"> and structure into income.</span>
          </motion.h1>

          <motion.p variants={fadeUp} className="mx-auto mb-3 max-w-2xl text-base leading-relaxed text-gray-600 sm:text-lg">
            Simple, step-by-step systems to help you stay consistent, get organized, and finally see real progress.
          </motion.p>

          <motion.p variants={fadeUp} className="mx-auto mb-10 max-w-xl text-sm text-gray-400 italic">
            Your life doesn't change from thinking about it. It changes when you have a system you actually follow.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/auth/signup"
              className="group inline-flex items-center gap-2 rounded-xl bg-rose-600 px-8 py-4 text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
            >
              Get The Planner
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              href="#pricing"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-8 py-4 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              See pricing
            </Link>
          </motion.div>

          <motion.p variants={fadeUp} className="mt-6 text-xs text-gray-400">
            Free for one week · Instant access · Lifetime use
          </motion.p>
        </motion.div>
      </motion.section>

      {/* ── Pain Points ── */}
      <section className="px-6 py-24 border-t border-gray-100 bg-gray-50">
        <div className="mx-auto max-w-2xl">
          <Reveal className="space-y-10">
            <motion.div variants={fadeUp} className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-rose-600">If you've been feeling like this…</p>
              <h2 className="text-3xl font-bold text-gray-900">You're not alone.</h2>
            </motion.div>

            <motion.ul variants={stagger} className="space-y-3">
              {PAIN_POINTS.map((point, idx) => (
                <motion.li
                  key={idx}
                  variants={fadeUpDelay(idx * 0.06)}
                  className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4"
                >
                  <span className="mt-1 size-2 shrink-0 rounded-full bg-rose-400" />
                  <p className="text-gray-700 text-sm leading-relaxed">{point}</p>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div variants={fadeUp} className="border-l-4 border-rose-600 pl-5">
              <p className="text-lg font-bold text-gray-900">You don't need more motivation.</p>
              <p className="text-lg font-bold text-rose-600">You need structure.</p>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ── Not a discipline problem ── */}
      <section className="px-6 py-24 bg-white border-t border-gray-100">
        <div className="mx-auto max-w-2xl">
          <Reveal className="space-y-8">
            <motion.div variants={fadeUp} className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">The real reason</p>
              <h2 className="text-3xl font-bold text-gray-900">
                This isn't a <em>discipline</em> problem.
              </h2>
              <p className="text-gray-600">You were never given a system that works for your life.</p>
            </motion.div>

            <motion.div variants={stagger} className="space-y-3">
              {[
                'Your nervous system is overwhelmed',
                'Your focus is scattered',
                'Consistency feels impossible',
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUpDelay(idx * 0.08)}
                  className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-3"
                >
                  <span className="size-1.5 shrink-0 rounded-full bg-gray-400" />
                  <p className="text-gray-700 text-sm">{item}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <p className="text-gray-600 text-sm leading-relaxed">
                So you don't follow through — not because you can't…
              </p>
              <p className="mt-1 font-semibold text-gray-900">
                but because you don't have a structure that holds you.
              </p>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ── What the planner does ── */}
      <section className="px-6 py-24 bg-gray-50 border-t border-gray-100">
        <div className="mx-auto max-w-2xl">
          <Reveal className="space-y-8">
            <motion.div variants={fadeUp} className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-rose-600">The solution</p>
              <h2 className="text-3xl font-bold text-gray-900">
                This is where the Life & CEO Planner changes everything.
              </h2>
              <p className="text-gray-600">This isn't just a planner. It's a simple daily system that helps you:</p>
            </motion.div>

            <motion.ul variants={stagger} className="space-y-3">
              {[
                'Organize your life without overwhelm',
                'Know exactly what to focus on each day',
                'Stay consistent (even when life feels heavy)',
                'Start building income step by step',
              ].map((item, idx) => (
                <motion.li
                  key={idx}
                  variants={fadeUpDelay(idx * 0.07)}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4"
                >
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-rose-600">
                    <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <p className="text-gray-800 text-sm font-medium">{item}</p>
                </motion.li>
              ))}
            </motion.ul>
          </Reveal>
        </div>
      </section>

      {/* ── Features / Bento ── */}
      <section id="features" className="px-6 py-28 bg-white border-t border-gray-100">
        <div className="mx-auto max-w-6xl space-y-12">
          <Reveal className="space-y-3">
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-rose-600">
              What you get
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-gray-900">
              Inside the Life & CEO Planner
            </motion.h2>
          </Reveal>

          <BentoGrid>
            {FEATURES.map((feature) => (
              <BentoCard key={feature.name} {...feature} />
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* ── Before / After ── */}
      <section className="px-6 py-24 bg-gray-50 border-t border-gray-100">
        <div className="mx-auto max-w-3xl">
          <Reveal className="space-y-10">
            <motion.div variants={fadeUp} className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">The transformation</p>
              <h2 className="text-3xl font-bold text-gray-900">From chaos → to calm</h2>
            </motion.div>

            <motion.div variants={stagger} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <motion.div variants={scaleIn} className="rounded-xl border border-red-100 bg-red-50 p-6 space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-red-500">Before</p>
                <ul className="space-y-2">
                  {['Overwhelmed', 'Inconsistent', 'Stuck in survival mode', 'No clear direction'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-red-400">✗</span> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div variants={scaleIn} className="rounded-xl border border-emerald-100 bg-emerald-50 p-6 space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">After</p>
                <ul className="space-y-2">
                  {['Structured days', 'Clear focus', 'Consistent action', 'Building income + stability'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="text-emerald-500">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ── Founder Story ── */}
      <section className="px-6 py-24 bg-white border-t border-gray-100">
        <div className="mx-auto max-w-2xl">
          <Reveal className="space-y-8">
            <motion.div variants={fadeUp} className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-rose-600">Why I created this</p>
            </motion.div>

            <motion.div variants={scaleIn} className="rounded-xl border border-gray-200 bg-gray-50 p-8 space-y-4">
              <div className="flex items-start gap-4">
                <div className="size-10 shrink-0 rounded-full bg-rose-100 flex items-center justify-center">
                  <Heart className="size-5 text-rose-600" />
                </div>
                <div className="space-y-3">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    I was a solo mom in survival mode — overwhelmed, inconsistent, and trying to rebuild my life from scratch.
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Nothing worked until I created a simple system that gave me structure, clarity, and direction.
                  </p>
                  <p className="font-semibold text-gray-900 text-sm">
                    This planner helped me move from chaos to consistency — and start making real progress.
                  </p>
                  <p className="text-rose-600 font-semibold text-sm">
                    If that's where you are right now… this is for you.
                  </p>
                </div>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ── Why this works ── */}
      <section className="px-6 py-24 bg-gray-50 border-t border-gray-100">
        <div className="mx-auto max-w-3xl">
          <Reveal className="space-y-10">
            <motion.div variants={fadeUp} className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">The difference</p>
              <h2 className="text-3xl font-bold text-gray-900">Why this works when other things haven't</h2>
            </motion.div>

            <motion.div variants={stagger} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { label: 'Not hustle-based', desc: 'Progress without burning out' },
                { label: 'Not overwhelming', desc: 'One step at a time, always' },
                { label: 'Built for women rebuilding', desc: 'Designed for your real life' },
                { label: 'Structure + emotional stability', desc: 'Head and heart, together' },
                { label: 'Real life, not perfect routines', desc: 'Works even on hard days' },
              ].map(({ label, desc }, idx) => (
                <motion.div
                  key={idx}
                  variants={fadeUpDelay(idx * 0.05)}
                  className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4"
                >
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-rose-100">
                    <svg className="size-3 text-rose-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{label}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="px-6 py-28 bg-white border-t border-gray-100">
        <div className="mx-auto max-w-5xl space-y-12">
          <Reveal className="space-y-4">
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-rose-600">
              Pricing
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-gray-900">
              Get your life structured so you can build income
            </motion.h2>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Free for one week
            </motion.div>
          </Reveal>

          <Reveal className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PRICING.map(({ id, name, price, period, badge, highlight, features }, idx) => (
              <motion.div
                key={id}
                variants={fadeUpDelay(idx * 0.07)}
                className={[
                  'relative rounded-xl border p-6 space-y-5 flex flex-col transition-shadow hover:shadow-md',
                  highlight ? 'border-rose-300 bg-rose-50' : 'border-gray-200 bg-white',
                ].join(' ')}
              >
                {badge && (
                  <span className={[
                    'absolute -top-3 left-4 rounded-full px-3 py-0.5 text-xs font-semibold',
                    highlight ? 'bg-rose-600 text-white' : 'bg-gray-900 text-white',
                  ].join(' ')}>
                    {badge}
                  </span>
                )}

                <div className="pt-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">{name}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-gray-900">{price}</span>
                    <span className="text-xs text-gray-400">/ {period}</span>
                  </div>
                </div>

                <ul className="space-y-2 flex-1">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="size-1 shrink-0 rounded-full bg-gray-400" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/auth/signup"
                  className={[
                    'block w-full rounded-lg py-2.5 text-center text-xs font-semibold transition-colors',
                    highlight
                      ? 'bg-rose-600 text-white hover:bg-rose-700'
                      : 'border border-gray-300 text-gray-900 hover:bg-gray-50',
                  ].join(' ')}
                >
                  Get started
                </Link>
              </motion.div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="px-6 py-32 bg-gray-50 border-t border-gray-100">
        <Reveal className="mx-auto max-w-2xl text-center space-y-8">
          <motion.div variants={fadeUp} className="flex justify-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-4">
            <h2 className="text-4xl font-black tracking-tight text-gray-900">
              If you're waiting to feel <em>"ready"</em>…<br />
              this is your sign.
            </h2>
            <p className="text-gray-600 leading-relaxed">
              You don't need to have it all figured out. You just need a system that helps you take the next step.
            </p>
            <p className="font-semibold text-gray-900">Start simple. Start structured. Start now.</p>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/auth/signup"
              className="group inline-flex items-center gap-2 rounded-xl bg-rose-600 px-8 py-4 text-sm font-semibold text-white hover:bg-rose-700 transition-colors"
            >
              Get The Planner
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              href="#pricing"
              className="inline-flex items-center rounded-xl border border-gray-300 px-8 py-4 text-sm font-semibold text-gray-700 hover:bg-white transition-colors"
            >
              View pricing
            </Link>
          </motion.div>

          <motion.p variants={fadeUp} className="text-xs text-gray-400">
            Free for one week · Instant access · Lifetime use
          </motion.p>
        </Reveal>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-200 px-6 py-12 bg-white">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-md bg-rose-600 flex items-center justify-center">
                  <Sparkles className="size-3 text-white" />
                </div>
                <span className="font-bold text-sm text-gray-900">Life & CEO Planner</span>
              </div>
              <p className="text-xs text-gray-500">Helping women 30+ turn chaos into structure — and structure into income.</p>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-700">Product</p>
              <ul className="space-y-2 text-xs text-gray-500">
                <li><Link href="#features" className="hover:text-gray-900 transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-700">Company</p>
              <ul className="space-y-2 text-xs text-gray-500">
                <li><Link href="#about" className="hover:text-gray-900 transition-colors">About</Link></li>
                <li><Link href="#contact" className="hover:text-gray-900 transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-700">Legal</p>
              <ul className="space-y-2 text-xs text-gray-500">
                <li><Link href="#privacy" className="hover:text-gray-900 transition-colors">Privacy</Link></li>
                <li><Link href="#terms" className="hover:text-gray-900 transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400">
            <span>© 2026 Life & CEO Planner. All rights reserved.</span>
            <div className="flex items-center gap-5 mt-4 md:mt-0">
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
