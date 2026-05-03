# CEO Planner — Implementation Plan

## Stack
- Next.js 16 (App Router) + TypeScript
- Supabase (Auth + DB + RLS)
- Tailwind v4 + shadcn/ui + Radix UI
- Motion (animations)
- Recharts (Insights charts)

---

## Design Philosophy

Not a journal. A daily operating system.

- **Interactive > Forms** — sliders, toggles, emoji pickers, progress rings — not text fields
- **Mobile-first daily log** — Today page must be fast on phone
- **Data comes back** — every entry feeds Insights. Input has output
- **One daily loop** — morning intent → task execution → evening close

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
  - Step 3: Annual income goal + monthly goal
- [ ] On complete: set `profiles.onboarding_completed = true`, redirect → `/app`

### 1.3 App Shell
- [ ] Root layout (`/app/layout.tsx`)
  - Sidebar navigation (collapsible, 6 items)
  - Top bar: today's date + user avatar menu
  - Date picker in sidebar (sets active `entry_date` in context/URL param)
- [ ] Global `DateContext` — active date drives all daily reads/writes
- [ ] Supabase client/server helpers
- [ ] Theme toggle (light/dark) wired to `profiles.theme`

**Nav items:** Today · Tasks · Money · Visibility · Vision · Insights

---

## Phase 2 — Today (Daily Loop)

Single page `/app/today`. Three sections, same scroll.

### 2.1 Morning Check-In
- [ ] Energy slider 1–5 (visual, not a number input) → `energy_score`
- [ ] Mood picker: emoji grid → `mood_emoji` + `mood_label`
- [ ] "How I want to feel today" → `feel`
- [ ] Top 3 priorities → `priorities`
- [ ] Auto-save on blur/change (upsert `daily_entries`)

### 2.2 Wellness Trackers
- [ ] Body row: water / move / meals / walk / sleep / cycle → `b_*` booleans (toggle chips, not checkboxes)
- [ ] Spirit row: prayer / meditation / scripture / breath / visualization / intuition → `s_*` booleans
- [ ] Optional notes per row → `w_bnotes`, `w_snotes`
- [ ] Mind: gratitude (3 lines) + affirmation + journal prompt → `w_grat`, `w_aff`, `w_journal`

### 2.3 End of Day Close
- [ ] "What worked?" → `eod_worked`
- [ ] "What deserves celebrating?" → `eod_celebrate`
- [ ] "What will I release?" → `eod_release`
- [ ] Win of the day → `g_win`
- [ ] What I'm proud of → `g_proud`
- [ ] Lesson learned → `g_lesson`
- [ ] Month-end panel (last day of month only): `g_worked`, `g_drained`, `g_release`, `g_celeb`

---

## Phase 3 — Tasks

Page: `/app/tasks`

### 3.1 Task List
- [ ] Default view: Today's tasks (due_date = today + overdue)
- [ ] Tabs: Today / Upcoming / Completed
- [ ] Task card: title + priority badge + due date + category + recurring indicator
- [ ] Check off → `completed_at` timestamp
- [ ] Expand note per task

### 3.2 Add / Edit Task
- [ ] Modal or inline form
- [ ] Fields: title, category (`admin`/`sales`/`connect`/`visibility`/`other`), priority (`high`/`medium`/`low`), due_date, note
- [ ] Recurring toggle: daily / weekdays / weekly — sets `is_recurring` + `recur_pattern`
- [ ] Delete task

### 3.3 Recurring Task Engine
- [ ] On date change (DateContext), auto-generate today's instance of recurring tasks if not yet created
- [ ] Seed default task templates on first login (e.g. "Check inbox", "Revenue activity")

---

## Phase 4 — Money

Page: `/app/money`

### 4.1 Daily Money Log
- [ ] Revenue today: amount + offer + client + notes → `m_rev`, `m_offer`, `m_client`, `m_snotes`
- [ ] Expense today: amount + description + tax note → `m_exp`, `m_expdesc`, `m_tax`
- [ ] Revenue activity log: `m_ract`, `m_cash`

### 4.2 Revenue Tracker
- [ ] Tab: list/add/delete `revenue_entries`
- [ ] Monthly total vs `p_month_goal` — progress ring
- [ ] YTD total vs `p_income_goal`

### 4.3 Expense Tracker
- [ ] Tab: list/add/delete `expense_entries`
- [ ] Monthly total summary

### 4.4 Debt Tracker
- [ ] Tab: CRUD on `debt_entries`
- [ ] Total balance + monthly payment summary

---

## Phase 5 — Vision & Identity (Permanent)

Page: `/app/vision`

### 5.1 CEO Identity
- [ ] Word of the year: `p_word`
- [ ] Who I'm becoming: `p_becoming`
- [ ] Mission + why: `p_mission`, `p_why`

### 5.2 Dream Life
- [ ] Vision, lifestyle, income, ideal client, signature offer: `p_vision`–`p_offer`

### 5.3 Business Values
- [ ] Up to 6 value cards: `p_v1`–`p_v6`

### 5.4 Goals
- [ ] Annual: revenue + personal + business goals
- [ ] Quarterly: Q1–Q4 focus

### 5.5 Money Goals & Budget
- [ ] Income goal, monthly goal, clients needed
- [ ] Living budget breakdown
- [ ] Business expense budget

---

## Phase 6 — Visibility (Content Planning)

Page: `/app/visibility`

### 6.1 Daily Content Plan
- [ ] What am I promoting? → `vis_promo`
- [ ] Content idea/topic → `vis_idea`
- [ ] Platform multi-select: FB / IG / LI / TT / YT → `vis_platforms`
- [ ] Call to action → `vis_cta`

### 6.2 Content Reflection
- [ ] Pillar selector (chip UI): Educational / Storytelling / Promotional / Inspirational / Other → `vis_pillar`
- [ ] Audience message, conversation leading, engagement notes → `vis_aud`, `vis_convo`, `vis_engage`

---

## Phase 7 — Insights

Page: `/app/insights`

### 7.1 Mood & Energy Trends
- [ ] Line chart: `mood_label` + `energy_score` over last 30 days
- [ ] Most frequent mood this month

### 7.2 Task Performance
- [ ] Bar chart: tasks completed vs created per week (last 4 weeks)
- [ ] Completion rate % this week

### 7.3 Revenue vs Goal
- [ ] Line chart: cumulative revenue this month vs goal pace
- [ ] Monthly totals last 6 months (bar chart)

### 7.4 Wellness Streaks
- [ ] Habit grid (GitHub-style): each `b_*` and `s_*` field → streak count + heatmap

---

## Phase 8 — Settings

Page: `/app/settings`

- [ ] Edit: full_name, business_name, role, avatar (upload to Supabase Storage)
- [ ] Timezone selector
- [ ] Theme toggle
- [ ] Change password
- [ ] Danger zone: delete account

---

## Cross-Cutting Concerns

| Concern | Approach |
|---|---|
| Auto-save | Debounced upsert on input change (300ms), all daily fields |
| Optimistic UI | Local state → sync DB in background |
| Loading states | Skeleton per section |
| Empty states | Contextual prompt/CTA (e.g. "Start your morning check-in") |
| Mobile | Mobile-first Today page. Sidebar = bottom nav on mobile |
| Error handling | Toast on save failure |
| Date navigation | Sidebar date picker + prev/next day arrows |

---

## Build Order

```
Phase 1 (Foundation)
→ Phase 2 (Today — daily loop, ships usable product)
→ Phase 3 (Tasks — core productivity)
→ Phase 4 (Money)
→ Phase 5 (Vision — setup once)
→ Phase 6 (Visibility)
→ Phase 7 (Insights — needs data from prior phases)
→ Phase 8 (Settings)
```
