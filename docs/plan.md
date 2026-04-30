# CEO Planner — Implementation Plan

## Stack
- Next.js 16 (App Router) + TypeScript
- Supabase (Auth + DB + RLS)
- Tailwind v4 + shadcn/ui + Radix UI
- Motion (animations)

---

## Phase 1 — Foundation

### 1.1 Auth
- [ ] Sign up page (`/auth/signup`) — email + password + full_name
- [ ] Login page (`/auth/login`)
- [ ] Supabase middleware: protect all `/app/**` routes, redirect unauthenticated → `/auth/login`
- [ ] Auth callback route (`/auth/callback`) for email confirmation
- [ ] Logout action

### 1.2 Onboarding
- [ ] Onboarding flow (`/onboarding`) — runs once after signup
  - Step 1: Name + business name + role
  - Step 2: Timezone + theme
  - Step 3: Annual income goal (writes to `permanent_data`)
- [ ] On complete: set `profiles.onboarding_completed = true`, redirect → `/app`

### 1.3 App Shell
- [ ] Root layout (`/app/layout.tsx`)
  - Sidebar navigation (collapsible)
  - Top bar: date display + user avatar menu
  - Date picker in sidebar (sets active `entry_date` in context/URL param)
- [ ] Global `DateContext` — active date drives all daily reads/writes
- [ ] Supabase client/server helpers (already scaffolded in `utils/supabase/`)
- [ ] Theme toggle (light/dark) wired to `profiles.theme`

---

## Phase 2 — Dashboard (Daily)

### 2.1 Morning Glance
- [ ] Page: `/app/dashboard`
- [ ] Fields: `feel`, `priorities`, `energy`
- [ ] Auto-save on blur (upsert `daily_entries`)

### 2.2 End of Day Reflection
- [ ] Fields: `eod_worked`, `eod_celebrate`, `eod_release`
- [ ] Same page, below fold or tab

### 2.3 Daily Tasks
- [ ] Page section or tab: task checklist
- [ ] Categories: `admin` / `sales` / `connect` / `visibility`
- [ ] Seed default tasks from JS template on first access per day
- [ ] Check/uncheck → update `daily_tasks.is_done`
- [ ] Expand note per task → update `daily_tasks.note`
- [ ] Add custom task per category

---

## Phase 3 — Wellness

### 3.1 Mind
- [ ] Page: `/app/wellness`
- [ ] Fields: `w_grat`, `w_journal`, `w_aff`, `w_mental`
- [ ] Mood picker: emoji grid → `mood_emoji` + `mood_label`

### 3.2 Body
- [ ] Checkbox row: water, move, meals, walk, sleep, cycle → `b_*` fields
- [ ] Notes field: `w_bnotes`

### 3.3 Spirit
- [ ] Checkbox row: prayer, meditation, scripture, breath, visualization, intuition → `s_*` fields
- [ ] Notes: `w_snotes`
- [ ] Scripture/devotional text: `w_scrip_text`

---

## Phase 4 — Visibility

### 4.1 Content Plan
- [ ] Page: `/app/visibility`
- [ ] Fields: `vis_promo`, `vis_idea`, `vis_cta`
- [ ] Platform multi-select: FB / IG / LI / TT / YT → `vis_platforms` (text[])

### 4.2 Content Reflection
- [ ] Fields: `vis_pillar`, `vis_aud`, `vis_convo`, `vis_engage`
- [ ] Pillar selector: Educational / Storytelling / Promotional / Inspirational / Other

---

## Phase 5 — Money

### 5.1 Daily Money Log
- [ ] Page: `/app/money`
- [ ] Revenue today: `m_rev`, `m_offer`, `m_client`, `m_snotes`
- [ ] Expense today: `m_exp`, `m_expdesc`, `m_tax`
- [ ] Revenue activity: `m_ract`, `m_cash`

### 5.2 Revenue Tracker
- [ ] Tab: Revenue log → list/add/delete `revenue_entries`
- [ ] Summary: total this month vs `permanent_data.p_month_goal`
- [ ] Progress bar toward monthly goal

### 5.3 Expense Tracker
- [ ] Tab: Expense log → list/add/delete `expense_entries`
- [ ] Summary: total this month

### 5.4 Debt Tracker
- [ ] Tab: Debt list → CRUD on `debt_entries`
- [ ] Total balance display

---

## Phase 6 — Networking

### 6.1 Contacts
- [ ] Page: `/app/networking/contacts`
- [ ] Table: list all contacts, filterable by `type` / `status`
- [ ] Add/edit/delete modal → `contacts` table
- [ ] Follow-up date highlight (overdue = red)

### 6.2 Opportunities
- [ ] Page: `/app/networking/opportunities`
- [ ] Table: list by `status` (Kanban or list view)
- [ ] Add/edit/delete modal → `opportunities` table

---

## Phase 7 — Vision & Identity (Permanent)

### 7.1 CEO Identity
- [ ] Page: `/app/vision`
- [ ] Fields: `p_word`, `p_becoming`, `p_mission`, `p_why`

### 7.2 Dream Life
- [ ] Fields: `p_vision`, `p_lifestyle`, `p_income`, `p_client`, `p_offer`

### 7.3 Business Values
- [ ] Up to 6 value cards: `p_v1`–`p_v6`

### 7.4 Goals
- [ ] Annual: `p_annual`, `p_personal`, `p_bizgoal`, `p_midyear`, `p_yearend`
- [ ] Quarterly: `p_q1`–`p_q4`

### 7.5 Money Goals & Budget
- [ ] Income + sales goals: `p_income_goal`, `p_month_goal`, `p_clients`, `p_rev_act`, `p_offer_goal`
- [ ] Essential living budget: `p_rent`, `p_food`, `p_transport`, `p_insurance`, `p_internet`, `p_other_bills`
- [ ] Business expenses: `p_website`, `p_email_mkt`, `p_subs`, `p_coaching`, `p_ads`, `p_other_biz`

---

## Phase 8 — Wins & Reflection (Daily)

- [ ] Page section or sidebar widget
- [ ] Fields: `g_win`, `g_proud`, `g_lesson`
- [ ] Month-end panel (last day of month): `g_worked`, `g_drained`, `g_release`, `g_celeb`

---

## Phase 9 — Profile & Settings

- [ ] Page: `/app/settings`
- [ ] Edit: full_name, business_name, role, avatar (upload to Supabase Storage)
- [ ] Timezone selector
- [ ] Theme toggle
- [ ] Change password (Supabase Auth)
- [ ] Danger zone: delete account

---

## Cross-Cutting Concerns

| Concern | Approach |
|---|---|
| Auto-save | Debounced upsert on input blur (all daily fields) |
| Optimistic UI | Local state → sync to DB in background |
| Loading states | Skeleton components per section |
| Empty states | Prompt/CTA when no data for selected date |
| Mobile | Responsive sidebar (drawer on mobile) |
| Error handling | Toast notifications for save failures |

---

## Build Order (Recommended)

```
Phase 1 → Phase 2 → Phase 3 → Phase 8 → Phase 4 → Phase 5 → Phase 6 → Phase 7 → Phase 9
```

Rationale: Daily loop (1→2→3→8) ships usable product fast. Money + networking add value next. Vision/permanent data is setup-once. Settings last.
