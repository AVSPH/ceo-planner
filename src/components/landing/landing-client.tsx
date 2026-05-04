'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useInView, useScroll, useTransform, type Variants } from 'motion/react'
import {
  Calendar, CheckSquare, DollarSign, RotateCcw, BookOpen,
  ArrowRight, Heart, Star, Sparkles
} from 'lucide-react'
import Image from 'next/image'
import { BentoCard, BentoGrid } from '@/components/ui/bento-grid'
import CardNav, { type CardNavItem } from '@/components/CardNav'

const NAV_ITEMS: CardNavItem[] = [
  {
    label: 'Features',
    bgColor: '#F4F0F8',
    textColor: '#2E2E3A',
    links: [
      { label: 'What you get', href: '#features', ariaLabel: 'View features' },
      { label: 'Pricing', href: '#pricing', ariaLabel: 'View pricing' },
    ],
  },
  {
    label: 'Our Story',
    bgColor: '#FDFBFF',
    textColor: '#2E2E3A',
    links: [
      { label: 'Why it works', href: '#why', ariaLabel: 'Why it works' },
      { label: 'About', href: '#about', ariaLabel: 'About us' },
    ],
  },
  {
    label: 'Get Access',
    bgColor: '#b186e0',
    textColor: '#ffffff',
    links: [
      { label: 'Sign in', href: '/auth/login', ariaLabel: 'Sign in to your account' },
      { label: 'Get the planner', href: '/auth/signup', ariaLabel: 'Sign up for the planner' },
    ],
  },
]

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
      <div className="absolute inset-0 bg-gradient-to-t from-brand-bg-main via-brand-bg-main/80 to-transparent" />
    </div>
  )
}

const FEATURES = [
  {
    Icon: Calendar,
    name: 'Daily Structure Pages',
    description: 'No more guessing what to do. Start each day with a clear plan that tells you exactly where to focus.',
    href: '/auth/signup',
    cta: 'Get started',
    className: 'col-span-3 lg:col-span-2',
    background: <BentoBackground src="/assets/Angelic D Planner.png" position="object-top" />,
  },
  {
    Icon: CheckSquare,
    name: 'Weekly Planning System',
    description: 'Stay focused, not scattered. Map your week so every day builds toward your bigger goals.',
    href: '/auth/signup',
    cta: 'Get started',
    className: 'col-span-3 lg:col-span-1',
    background: <BentoBackground src="/assets/Angelic D CEO Planners.png" />,
  },
  {
    Icon: DollarSign,
    name: 'Income Planning + Tracking',
    description: 'Turn effort into money. Track income goals and log progress daily.',
    href: '/auth/signup',
    cta: 'Get started',
    className: 'col-span-3 lg:col-span-1',
    background: <BentoBackground src="/assets/Angelic B Digital table.png" />,
  },
  {
    Icon: RotateCcw,
    name: 'Consistency System',
    description: 'Built-in systems that keep you on track even when life feels heavy.',
    href: '/auth/signup',
    cta: 'Get started',
    className: 'col-span-3 lg:col-span-1',
    background: <BentoBackground src="/assets/Angelic Bus My Plan Story (1).png" position="object-top" />,
  },
  {
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
    href: 'https://stan.store/genxbirthmentor/p/the-life--ceo-digital-planner--7q2v4ziy',
    features: ['Instant access', 'Lifetime use', 'All 5 modules', 'Step-by-step structure system'],
  },
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$22.22',
    period: 'per month',
    badge: null,
    highlight: false,
    href: 'https://stan.store/genxbirthmentor/p/the-life--ceo-digital-planner-',
    features: ['Everything in Planner', 'Monthly subscription', 'New content drops', 'Support'],
  },
  {
    id: '6months',
    name: '6 Months',
    price: '$111',
    period: '6 months',
    badge: 'Most popular',
    highlight: true,
    href: 'https://stan.store/genxbirthmentor/p/life--ceo-digital-planner-',
    features: ['Everything in Monthly', 'Save vs monthly', '6 months access', 'Bonus resources'],
  },
  {
    id: '12months',
    name: '12 Months',
    price: '$197',
    period: 'per year',
    badge: 'Best value',
    highlight: false,
    href: 'https://stan.store/genxbirthmentor/p/the-life--ceo-digital-planner--5nzm7jv1',
    features: ['Everything in 6 Months', 'Full year access', 'Maximum savings', 'VIP support'],
  },
]

export function LandingClient() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0.4])

  return (
    <div ref={containerRef} className="flex min-h-screen flex-col bg-brand-bg-main text-brand-text overflow-x-hidden">

      {/* ── Hero ── */}
      <div className="relative">
        <CardNav
          items={NAV_ITEMS}
          baseColor="#FDFBFF"
          menuColor="#2E2E3A"
          buttonBgColor="#82c2b4"
          buttonTextColor="#ffffff"
        />

        <motion.section style={{ opacity: heroOpacity }} className="relative flex min-h-screen items-center justify-center px-6 pt-28">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="relative z-10 mx-auto max-w-3xl text-center"
          >
            <motion.p variants={fadeUp} className="mb-4 text-xs font-semibold uppercase tracking-widest text-brand">
              For women 30+ ready to create real change
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="mb-6 text-5xl font-display font-bold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl text-brand-text"
            >
              Helping women 30+ turn chaos into structure
              <span className="block text-brand-cta italic"> and structure into income.</span>
            </motion.h1>

            <motion.p variants={fadeUp} className="mx-auto mb-3 max-w-2xl text-base leading-relaxed text-brand-muted sm:text-lg">
              Simple, step-by-step systems to help you stay consistent, get organized, and finally see real progress.
            </motion.p>

            <motion.p variants={fadeUp} className="mx-auto mb-10 max-w-xl text-sm text-brand-muted italic">
              Your life doesn't change from thinking about it. It changes when you have a system you actually follow.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/auth/signup"
                className="group inline-flex items-center gap-2 rounded-xl bg-brand-cta px-8 py-4 text-sm font-semibold text-white hover:bg-brand-cta-hover transition-colors"
              >
                Get The Planner
                <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                href="#pricing"
                className="inline-flex items-center gap-2 rounded-xl border border-brand-accent px-8 py-4 text-sm font-semibold text-brand-text hover:bg-brand-bg-light transition-colors"
              >
                See pricing
              </Link>
            </motion.div>

            <motion.p variants={fadeUp} className="mt-6 text-xs text-brand-muted">
              Free for one week · Instant access · Lifetime use
            </motion.p>
          </motion.div>
        </motion.section>
      </div>

      {/* ── 01 · You're not alone ── */}
      <section className="px-6 py-24 border-t border-brand-accent/20 bg-brand-bg-light">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <motion.div variants={stagger} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div variants={fadeUp} className="space-y-2">
                <span className="block text-[7rem] leading-none font-display italic font-bold text-brand/20 select-none">01</span>
                <h2 className="text-4xl sm:text-5xl font-display italic font-bold text-brand-text leading-tight -mt-4">
                  You're not alone.
                </h2>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand pt-2">
                  If you've been feeling like this…
                </p>
              </motion.div>
              <motion.div variants={stagger} className="space-y-1">
                {PAIN_POINTS.map((point, i) => (
                  <motion.div key={i} variants={fadeUpDelay(i * 0.05)} className="flex items-start gap-3 py-3 border-b border-brand-accent/20 last:border-0">
                    <span className="text-brand-blush mt-0.5 shrink-0">—</span>
                    <p className="text-brand-text text-sm leading-relaxed">{point}</p>
                  </motion.div>
                ))}
                <motion.div variants={fadeUp} className="pt-5 border-l-4 border-brand pl-5">
                  <p className="text-sm font-semibold text-brand-text">You don't need more motivation.</p>
                  <p className="font-display italic text-xl text-brand-cta mt-0.5">You need structure.</p>
                </motion.div>
              </motion.div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ── 02 · The real reason ── */}
      <section className="px-6 py-24 bg-brand-text border-t border-brand-text/50">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <motion.div variants={stagger} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div variants={stagger} className="space-y-3 order-2 lg:order-1">
                {[
                  'Your nervous system is overwhelmed',
                  'Your focus is scattered',
                  'Consistency feels impossible',
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeUpDelay(i * 0.07)} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/8">
                    <span className="text-brand-muted text-xs font-mono mt-0.5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                    <p className="text-white/80 text-sm leading-relaxed">{item}</p>
                  </motion.div>
                ))}
                <motion.div variants={fadeUp} className="p-4 rounded-xl bg-brand/10 border border-brand/20 mt-2">
                  <p className="text-brand-muted text-sm">You don't follow through — not because you can't…</p>
                  <p className="font-semibold text-white text-sm mt-1">but because you don't have a structure that holds you.</p>
                </motion.div>
              </motion.div>
              <motion.div variants={fadeUp} className="space-y-2 order-1 lg:order-2">
                <span className="block text-[7rem] leading-none font-display italic font-bold text-white/5 select-none">02</span>
                <h2 className="text-4xl sm:text-5xl font-display italic font-bold text-white leading-tight -mt-4">
                  This isn't a discipline problem.
                </h2>
                <p className="text-brand-muted text-sm pt-2">
                  You were never given a system that works for your real life.
                </p>
              </motion.div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ── 03 · The solution ── */}
      <section className="px-6 py-24 bg-brand-bg-main border-t border-brand-accent/20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <motion.div variants={stagger} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div variants={fadeUp} className="space-y-2">
                <span className="block text-[7rem] leading-none font-display italic font-bold text-brand-cta/20 select-none">03</span>
                <h2 className="text-4xl sm:text-5xl font-display italic font-bold text-brand-text leading-tight -mt-4">
                  The Life & CEO Planner changes everything.
                </h2>
                <p className="text-brand-muted text-sm pt-2">
                  A simple daily system — not another thing to manage.
                </p>
              </motion.div>
              <motion.div variants={stagger} className="space-y-3">
                {[
                  'Organize your life without overwhelm',
                  'Know exactly what to focus on each day',
                  'Stay consistent — even when life feels heavy',
                  'Start building income step by step',
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeUpDelay(i * 0.06)} className="flex items-center gap-3 p-4 rounded-xl bg-brand-highlight border border-brand-cta/30">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-cta">
                      <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <p className="text-brand-text text-sm font-medium">{item}</p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ── Features / Bento ── */}
      <section id="features" className="px-6 py-28 bg-brand-bg-light border-t border-brand-accent/20">
        <div className="mx-auto max-w-6xl space-y-12">
          <Reveal className="space-y-3">
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-brand">
              What you get
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl font-display italic font-bold text-brand-text">
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
      {/* <section className="px-6 py-24 bg-brand-bg-main border-t border-brand-accent/20">
        <div className="mx-auto max-w-3xl">
          <Reveal className="space-y-10">
            <motion.div variants={fadeUp} className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-muted">The transformation</p>
              <h2 className="text-3xl font-display italic font-bold text-brand-text">From chaos → to calm</h2>
            </motion.div>

            <motion.div variants={stagger} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <motion.div variants={scaleIn} className="rounded-xl border border-red-100 bg-red-50 p-6 space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-red-500">Before</p>
                <ul className="space-y-2">
                  {['Overwhelmed', 'Inconsistent', 'Stuck in survival mode', 'No clear direction'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-brand-text">
                      <span className="text-red-400">✗</span> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div variants={scaleIn} className="rounded-xl border border-emerald-100 bg-emerald-50 p-6 space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">After</p>
                <ul className="space-y-2">
                  {['Structured days', 'Clear focus', 'Consistent action', 'Building income + stability'].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-brand-text">
                      <span className="text-emerald-500">✓</span> {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            </motion.div>
          </Reveal>
        </div>
      </section> */}

      {/* ── 04 · Why I created this ── */}
      <section id="about" className="px-6 py-24 bg-brand-bg-main border-t border-brand-accent/20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <motion.div variants={stagger} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div variants={fadeUp} className="space-y-2">
                <span className="block text-[7rem] leading-none font-display italic font-bold text-brand/20 select-none">04</span>
                <h2 className="text-4xl sm:text-5xl font-display italic font-bold text-brand-text leading-tight -mt-4">
                  Built from lived experience.
                </h2>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand pt-2">
                  Why I created this
                </p>
              </motion.div>
              <motion.div variants={stagger} className="space-y-1">
                {[
                  'I was a solo mom in survival mode — overwhelmed, inconsistent, and trying to rebuild my life from scratch.',
                  'Nothing worked until I created a simple system that gave me structure, clarity, and direction.',
                  'This planner helped me move from chaos to consistency — and start making real progress.',
                ].map((text, i) => (
                  <motion.div key={i} variants={fadeUpDelay(i * 0.07)} className="flex items-start gap-3 py-3 border-b border-brand-accent/20 last:border-0">
                    <span className="text-brand-blush mt-0.5 shrink-0">—</span>
                    <p className="text-brand-text text-sm leading-relaxed">{text}</p>
                  </motion.div>
                ))}
                <motion.div variants={fadeUp} className="pt-5 border-l-4 border-brand-cta pl-5">
                  <p className="font-display italic text-xl text-brand-cta">
                    If that's where you are right now… this is for you.
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ── 05 · Why this works ── */}
      <section id="why" className="px-6 py-24 bg-brand-bg-light border-t border-brand-accent/20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <motion.div variants={stagger} className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <motion.div variants={stagger} className="space-y-3 order-2 lg:order-1">
                {[
                  { label: 'Not hustle-based', desc: 'Progress without burning out' },
                  { label: 'Not overwhelming', desc: 'One step at a time, always' },
                  { label: 'Built for women rebuilding', desc: 'Designed for your real life' },
                  { label: 'Structure + emotional stability', desc: 'Head and heart, together' },
                  { label: 'Real life, not perfect routines', desc: 'Works even on hard days' },
                ].map(({ label, desc }, i) => (
                  <motion.div key={i} variants={fadeUpDelay(i * 0.06)} className="flex items-center gap-3 p-4 rounded-xl bg-brand-highlight border border-brand-cta/30">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-cta">
                      <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-brand-text">{label}</p>
                      <p className="text-xs text-brand-muted">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              <motion.div variants={fadeUp} className="space-y-2 order-1 lg:order-2">
                <span className="block text-[7rem] leading-none font-display italic font-bold text-brand-cta/20 select-none">05</span>
                <h2 className="text-4xl sm:text-5xl font-display italic font-bold text-brand-text leading-tight -mt-4">
                  Why this works when other things haven't.
                </h2>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand pt-2">
                  The difference
                </p>
              </motion.div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="px-6 py-28 bg-brand-bg-light border-t border-brand-accent/20">
        <div className="mx-auto max-w-5xl space-y-12">
          <Reveal className="space-y-4">
            <motion.p variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-brand">
              Pricing
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-3xl font-display italic font-bold text-brand-text">
              Get your life structured so you can build income
            </motion.h2>
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 rounded-full border border-brand-cta/30 bg-brand-highlight px-4 py-1.5 text-xs font-semibold text-brand-cta">
              <span className="size-1.5 rounded-full bg-brand-cta animate-pulse" />
              Free for one week
            </motion.div>
          </Reveal>

          <Reveal className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PRICING.map(({ id, name, price, period, badge, highlight, href, features }, idx) => (
              <motion.div
                key={id}
                variants={fadeUpDelay(idx * 0.07)}
                className={[
                  'relative rounded-xl border p-6 space-y-5 flex flex-col transition-shadow hover:shadow-md',
                  highlight ? 'border-brand bg-brand-bg-light' : 'border-brand-accent/30 bg-brand-bg-main',
                ].join(' ')}
              >
                {badge && (
                  <span className={[
                    'absolute -top-3 left-4 rounded-full px-3 py-0.5 text-xs font-semibold',
                    highlight ? 'bg-brand text-white' : 'bg-brand-text text-white',
                  ].join(' ')}>
                    {badge}
                  </span>
                )}

                <div className="pt-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-muted mb-1">{name}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-brand-text">{price}</span>
                    <span className="text-xs text-brand-muted">/ {period}</span>
                  </div>
                </div>

                <ul className="space-y-2 flex-1">
                  {features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-brand-muted">
                      <span className="size-1 shrink-0 rounded-full bg-brand-blush" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={[
                    'block w-full rounded-lg py-2.5 text-center text-xs font-semibold transition-colors',
                    highlight
                      ? 'bg-brand-cta text-white hover:bg-brand-cta-hover'
                      : 'border border-brand-accent text-brand-text hover:bg-brand-bg-light',
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
      <section className="px-6 py-32 bg-brand-bg-main border-t border-brand-accent/20">
        <Reveal className="mx-auto max-w-2xl text-center space-y-8">
          <motion.div variants={fadeUp} className="flex justify-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
            ))}
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-4">
            <h2 className="text-4xl font-display italic font-bold tracking-tight text-brand-text">
              If you're waiting to feel "ready"…<br />
              this is your sign.
            </h2>
            <p className="text-brand-muted leading-relaxed">
              You don't need to have it all figured out. You just need a system that helps you take the next step.
            </p>
            <p className="font-semibold text-brand-text">Start simple. Start structured. Start now.</p>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/auth/signup"
              className="group inline-flex items-center gap-2 rounded-xl bg-brand-cta px-8 py-4 text-sm font-semibold text-white hover:bg-brand-cta-hover transition-colors"
            >
              Get The Planner
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
            <Link
              href="#pricing"
              className="inline-flex items-center rounded-xl border border-brand-accent px-8 py-4 text-sm font-semibold text-brand-text hover:bg-brand-bg-light transition-colors"
            >
              View pricing
            </Link>
          </motion.div>

          <motion.p variants={fadeUp} className="text-xs text-brand-muted">
            Free for one week · Instant access · Lifetime use
          </motion.p>
        </Reveal>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-brand-accent/20 px-6 py-12 bg-brand-bg-light">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-md bg-brand flex items-center justify-center">
                  <Sparkles className="size-3 text-white" />
                </div>
                <span className="font-bold text-sm text-brand-text">Life & CEO Planner</span>
              </div>
              <p className="text-xs text-brand-muted">Helping women 30+ turn chaos into structure — and structure into income.</p>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-text">Product</p>
              <ul className="space-y-2 text-xs text-brand-muted">
                <li><Link href="#features" className="hover:text-brand-text transition-colors">Features</Link></li>
                <li><Link href="#pricing" className="hover:text-brand-text transition-colors">Pricing</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-text">Company</p>
              <ul className="space-y-2 text-xs text-brand-muted">
                <li><Link href="#about" className="hover:text-brand-text transition-colors">About</Link></li>
                <li><Link href="#contact" className="hover:text-brand-text transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-text">Legal</p>
              <ul className="space-y-2 text-xs text-brand-muted">
                <li><Link href="#privacy" className="hover:text-brand-text transition-colors">Privacy</Link></li>
                <li><Link href="#terms" className="hover:text-brand-text transition-colors">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-brand-accent/20 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-brand-muted">
            <span>© 2026 Life & CEO Planner. All rights reserved.</span>
            <div className="flex items-center gap-5 mt-4 md:mt-0">
              <Link href="#instagram" className="hover:text-brand-text transition-colors">Instagram</Link>
              <Link href="#facebook" className="hover:text-brand-text transition-colors">Facebook</Link>
              <Link href="#tiktok" className="hover:text-brand-text transition-colors">TikTok</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
