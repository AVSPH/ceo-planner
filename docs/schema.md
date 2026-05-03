# CEO Planner — Supabase Schema

## Overview

| Mode | Tables | Scope |
|---|---|---|
| Daily | `daily_entries`, `tasks` | Per-date, resets/accumulates each day |
| Permanent | `permanent_data` | Single row per user, setup-once |
| Trackers | `revenue_entries`, `expense_entries`, `debt_entries` | Append-only logs |

Dropped: `contacts`, `opportunities`

---

## Tables

### 0. `profiles`
Auto-created on signup via trigger.

| Column | Type | Notes |
|---|---|---|
| id | UUID PK → auth.users | |
| full_name | TEXT | |
| business_name | TEXT | |
| role | TEXT | e.g. "CEO", "Founder" |
| avatar_url | TEXT | |
| timezone | TEXT | DEFAULT 'UTC' |
| theme | TEXT | DEFAULT 'light' |
| onboarding_completed | BOOLEAN | DEFAULT false |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | auto-trigger |

---

### 1. `daily_entries`
One row per `(user_id, entry_date)`. All daily log fields.

**Constraint:** `UNIQUE(user_id, entry_date)`

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| user_id | UUID → auth.users | |
| entry_date | DATE | |
| **Morning Check-In** | | |
| feel | TEXT | How I want to feel today |
| priorities | TEXT | Top 3 priorities |
| energy_score | SMALLINT | 1–5 scale |
| mood_emoji | TEXT | Selected mood emoji |
| mood_label | TEXT | e.g. "Joyful", "Calm" |
| **Wellness — Mind** | | |
| w_grat | TEXT | Gratitude (3 things) |
| w_journal | TEXT | Journal prompt response |
| w_aff | TEXT | Daily affirmation |
| **Wellness — Body** | | |
| b_water | BOOLEAN | |
| b_move | BOOLEAN | |
| b_meals | BOOLEAN | |
| b_walk | BOOLEAN | |
| b_sleep | BOOLEAN | |
| b_cycle | BOOLEAN | |
| w_bnotes | TEXT | Body notes |
| **Wellness — Spirit** | | |
| s_prayer | BOOLEAN | |
| s_med | BOOLEAN | |
| s_scrip | BOOLEAN | |
| s_breath | BOOLEAN | |
| s_viz | BOOLEAN | |
| s_intuit | BOOLEAN | |
| w_snotes | TEXT | Spirit notes |
| w_scrip_text | TEXT | Scripture/devotional text |
| **End of Day** | | |
| eod_worked | TEXT | What worked today? |
| eod_celebrate | TEXT | What deserves celebrating? |
| eod_release | TEXT | What will I release? |
| **Wins & Reflection** | | |
| g_win | TEXT | Win of the day |
| g_proud | TEXT | What I'm proud of |
| g_lesson | TEXT | Lesson learned |
| **Month-End** (last day of month only) | | |
| g_worked | TEXT | What worked this month? |
| g_drained | TEXT | What drained me? |
| g_release | TEXT | What to release |
| g_celeb | TEXT | Celebrations |
| **Visibility — Content Plan** | | |
| vis_promo | TEXT | What am I promoting today? |
| vis_idea | TEXT | Content idea/topic |
| vis_platforms | TEXT[] | e.g. `['fb','ig','li']` |
| vis_cta | TEXT | Call-to-action today |
| **Visibility — Content Reflection** | | |
| vis_pillar | TEXT | Educational/Storytelling/Promotional/Inspirational/Other |
| vis_aud | TEXT | What does my audience need to hear? |
| vis_convo | TEXT | What conversation am I leading? |
| vis_engage | TEXT | Engagement notes |
| **Money — Daily** | | |
| m_rev | NUMERIC(12,2) | Revenue received today |
| m_offer | TEXT | Offer/service sold |
| m_client | TEXT | Client payment from |
| m_snotes | TEXT | Sales activity notes |
| m_exp | NUMERIC(12,2) | Business expense today |
| m_expdesc | TEXT | What was it for? |
| m_tax | TEXT | Tax write-off note |
| m_ract | TEXT | Revenue-creating activity |
| m_cash | TEXT | Cash flow note |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | auto-trigger |

---

### 2. `tasks`
Full task manager. Not locked to today.

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| user_id | UUID → auth.users | |
| title | TEXT NOT NULL | |
| category | TEXT | `admin` / `sales` / `connect` / `visibility` / `other` |
| priority | TEXT | `high` / `medium` / `low` DEFAULT 'medium' |
| due_date | DATE | nullable — no date = someday |
| note | TEXT | |
| is_done | BOOLEAN | DEFAULT false |
| completed_at | TIMESTAMPTZ | set when is_done → true |
| is_recurring | BOOLEAN | DEFAULT false |
| recur_pattern | TEXT | `daily` / `weekdays` / `weekly` |
| sort_order | INTEGER | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | auto-trigger |

---

### 3. `permanent_data`
One row per user. Never date-bound.

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| user_id | UUID → auth.users UNIQUE | |
| **CEO Identity** | | |
| p_word | TEXT | Word of the year |
| p_becoming | TEXT | Who am I becoming? |
| p_mission | TEXT | Business mission |
| p_why | TEXT | My why |
| **Dream Life** | | |
| p_vision | TEXT | Vision for this year |
| p_lifestyle | TEXT | Dream lifestyle |
| p_income | TEXT | Yearly income goal (display) |
| p_client | TEXT | Ideal client profile |
| p_offer | TEXT | Signature offer/service |
| **Business Values** | | |
| p_v1 … p_v6 | TEXT | Up to 6 values |
| **Goals — Annual** | | |
| p_annual | TEXT | Annual revenue goal |
| p_personal | TEXT | Annual personal goal |
| p_bizgoal | TEXT | Annual business goal |
| p_midyear | TEXT | Mid-year reflection |
| p_yearend | TEXT | Year-end reflection |
| **Goals — Quarterly** | | |
| p_q1 … p_q4 | TEXT | Q1–Q4 goals |
| **Money Goals** | | |
| p_income_goal | NUMERIC(12,2) | Annual income goal |
| p_month_goal | NUMERIC(12,2) | Monthly sales goal |
| p_clients | TEXT | Clients needed to hit goal |
| p_rev_act | TEXT | Revenue-creating activities |
| p_offer_goal | TEXT | Offer sales goal |
| **Living Budget** | | |
| p_rent | NUMERIC(12,2) | |
| p_food | NUMERIC(12,2) | |
| p_transport | NUMERIC(12,2) | |
| p_insurance | NUMERIC(12,2) | |
| p_internet | NUMERIC(12,2) | |
| p_other_bills | TEXT | |
| **Business Budget** | | |
| p_website | NUMERIC(12,2) | |
| p_email_mkt | NUMERIC(12,2) | |
| p_subs | NUMERIC(12,2) | |
| p_coaching | NUMERIC(12,2) | |
| p_ads | NUMERIC(12,2) | |
| p_other_biz | TEXT | |
| updated_at | TIMESTAMPTZ | auto-trigger |

---

### 4. `revenue_entries`

| Column | Type | |
|---|---|---|
| id | UUID PK | |
| user_id | UUID → auth.users | |
| entry_date | DATE | |
| amount | NUMERIC(12,2) NOT NULL | |
| client_offer | TEXT | |
| notes | TEXT | |
| created_at | TIMESTAMPTZ | |

---

### 5. `expense_entries`

| Column | Type | |
|---|---|---|
| id | UUID PK | |
| user_id | UUID → auth.users | |
| entry_date | DATE | |
| amount | NUMERIC(12,2) NOT NULL | |
| description | TEXT | |
| notes | TEXT | |
| created_at | TIMESTAMPTZ | |

---

### 6. `debt_entries`

| Column | Type | |
|---|---|---|
| id | UUID PK | |
| user_id | UUID → auth.users | |
| name | TEXT NOT NULL | e.g. "Credit Card" |
| balance | NUMERIC(12,2) | |
| monthly_payment | NUMERIC(12,2) | |
| notes | TEXT | |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | auto-trigger |

---

## Security

- RLS enabled on all tables
- Policy per table: `auth.uid() = user_id` for ALL operations
- No public reads

---

## Indexes

```sql
CREATE INDEX ON daily_entries (user_id, entry_date);
CREATE INDEX ON tasks (user_id, due_date);
CREATE INDEX ON tasks (user_id, is_recurring);
CREATE INDEX ON revenue_entries (user_id, entry_date);
CREATE INDEX ON expense_entries (user_id, entry_date);
```

---

## Open Questions

1. **Recurring task instances** — generate rows eagerly on day-change, or derive lazily on query?
2. **Affirmations** — hardcoded in JS or user-editable in DB?
3. **Task templates** — seed defaults from JS on first login or let user build from scratch?
