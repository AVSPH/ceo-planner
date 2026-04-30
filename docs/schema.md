# CEO Planner — Supabase Schema Plan

## Overview

Two data modes in the app:
- **Daily** (`ceo_daily_<date>`) — per-date entries, resets each day
- **Permanent** (`ceo_permanent`) — single record per user, never date-bound

Plus 5 tracker tables for relational/list data.

---

## Tables

### 1. `daily_entries`
One row per `(user_id, entry_date)`.

| Column | Type | Source |
|---|---|---|
| id | UUID PK | |
| user_id | UUID → auth.users | |
| entry_date | DATE | sidebar date picker |
| **Dashboard — Glance** | | |
| feel | TEXT | "How I want to feel today" |
| priorities | TEXT | "Top 3 Priorities" |
| energy | TEXT | "Energy I'm bringing today" |
| **Dashboard — End of Day** | | |
| eod_worked | TEXT | "What worked today?" |
| eod_celebrate | TEXT | "What deserves celebrating?" |
| eod_release | TEXT | "What will I release?" |
| **Wellness — Mind** | | |
| w_grat | TEXT | Gratitude (3 things) |
| w_journal | TEXT | Journal Prompt |
| w_aff | TEXT | Daily Affirmation |
| w_mental | TEXT | Mental Check-In |
| mood_emoji | TEXT | Selected mood emoji |
| mood_label | TEXT | e.g. "Joyful", "Calm" |
| **Wellness — Body** | | |
| b_water | BOOLEAN | Water intake checkbox |
| b_move | BOOLEAN | Movement checkbox |
| b_meals | BOOLEAN | Nutritious meals checkbox |
| b_walk | BOOLEAN | Walk/Exercise checkbox |
| b_sleep | BOOLEAN | Rest/Sleep checkbox |
| b_cycle | BOOLEAN | Cycle awareness checkbox |
| w_bnotes | TEXT | Body notes |
| **Wellness — Spirit** | | |
| s_prayer | BOOLEAN | Prayer checkbox |
| s_med | BOOLEAN | Meditation checkbox |
| s_scrip | BOOLEAN | Scripture checkbox |
| s_breath | BOOLEAN | Breath work checkbox |
| s_viz | BOOLEAN | Visualization checkbox |
| s_intuit | BOOLEAN | Intuition check-in checkbox |
| w_snotes | TEXT | Spirit notes |
| w_scrip_text | TEXT | Scripture/Devotional text |
| **Visibility — Content Plan** | | |
| vis_promo | TEXT | What am I promoting today? |
| vis_idea | TEXT | Content idea/topic |
| vis_platforms | TEXT[] | Active platforms e.g. `['fb','ig','li']` |
| vis_cta | TEXT | Call-to-action today |
| **Visibility — Content Reflection** | | |
| vis_pillar | TEXT | Content pillar (Educational/Storytelling/…) |
| vis_aud | TEXT | What does my audience need to hear? |
| vis_convo | TEXT | What conversation am I leading? |
| vis_engage | TEXT | Engagement notes |
| **Money — Today** | | |
| m_rev | NUMERIC(12,2) | Revenue received today |
| m_offer | TEXT | Offer/service sold |
| m_client | TEXT | Client payment from |
| m_snotes | TEXT | Sales activity notes |
| m_exp | NUMERIC(12,2) | Business expense today |
| m_expdesc | TEXT | What was it for? |
| m_tax | TEXT | Tax write-off note |
| m_ract | TEXT | Revenue-creating activity |
| m_cash | TEXT | Cash flow note |
| **Wins & Reflection** | | |
| g_win | TEXT | My win today |
| g_proud | TEXT | What I'm proud of |
| g_lesson | TEXT | Lesson learned today |
| **Monthly Reflection** (last day of month) | | |
| g_worked | TEXT | What worked this month? |
| g_drained | TEXT | What drained me? |
| g_release | TEXT | What do I need to release? |
| g_celeb | TEXT | Celebrations |
| created_at | TIMESTAMPTZ | |
| updated_at | TIMESTAMPTZ | auto-trigger |

**Constraint:** `UNIQUE(user_id, entry_date)`

---

### 2. `daily_tasks`
Checklist items per category per day. Allows checking/unchecking and adding notes per task.

| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| user_id | UUID → auth.users | |
| entry_date | DATE | |
| category | TEXT | `admin` / `sales` / `connect` / `visibility` |
| task_key | TEXT | stable key e.g. `email_inbox` |
| task_label | TEXT | display text |
| is_done | BOOLEAN | |
| note | TEXT | expand note per item |
| sort_order | INTEGER | |
| created_at | TIMESTAMPTZ | |

**Constraint:** `UNIQUE(user_id, entry_date, category, task_key)`

---

### 3. `permanent_data`
One row per user. Never date-bound.

| Column | Type | Source |
|---|---|---|
| id | UUID PK | |
| user_id | UUID → auth.users UNIQUE | |
| **Vision & Identity — CEO Identity** | | |
| p_word | TEXT | Word of the year |
| p_becoming | TEXT | Who am I becoming this season? |
| p_mission | TEXT | Business mission |
| p_why | TEXT | My why |
| **Vision & Identity — Dream Life** | | |
| p_vision | TEXT | Vision for this year |
| p_lifestyle | TEXT | Dream lifestyle |
| p_income | TEXT | Yearly income goal (display) |
| p_client | TEXT | Ideal client profile |
| p_offer | TEXT | Signature offer/service |
| **Business Values** | | |
| p_v1 … p_v6 | TEXT | Up to 6 values |
| **Goals — Annual Vision** | | |
| p_annual | TEXT | Annual revenue goal |
| p_personal | TEXT | Annual personal goal |
| p_bizgoal | TEXT | Annual business goal |
| p_midyear | TEXT | Mid-year reflection |
| p_yearend | TEXT | Year-end reflection |
| **Goals — Quarterly** | | |
| p_q1 … p_q4 | TEXT | Q1–Q4 goals |
| **Money — Income & Sales Goals** | | |
| p_income_goal | NUMERIC(12,2) | Annual income goal |
| p_month_goal | NUMERIC(12,2) | Monthly sales goal |
| p_clients | TEXT | Clients needed to hit goal |
| p_rev_act | TEXT | Revenue-creating activities |
| p_offer_goal | TEXT | Offer sales goal |
| **Money — Essential Living Budget** | | |
| p_rent | NUMERIC(12,2) | |
| p_food | NUMERIC(12,2) | |
| p_transport | NUMERIC(12,2) | |
| p_insurance | NUMERIC(12,2) | |
| p_internet | NUMERIC(12,2) | |
| p_other_bills | TEXT | |
| **Money — Recurring Business Expenses** | | |
| p_website | NUMERIC(12,2) | |
| p_email_mkt | NUMERIC(12,2) | Email marketing |
| p_subs | NUMERIC(12,2) | |
| p_coaching | NUMERIC(12,2) | |
| p_ads | NUMERIC(12,2) | |
| p_other_biz | TEXT | |
| updated_at | TIMESTAMPTZ | auto-trigger |

---

### 4. `contacts`
Lead & Contact Tracker (Networking section).

| Column | Type | Values |
|---|---|---|
| id | UUID PK | |
| user_id | UUID → auth.users | |
| name | TEXT NOT NULL | |
| type | TEXT | Lead / Client / Referral Partner / Speaking Opp / Collaborator / Networking |
| status | TEXT | New Lead / Warm / Hot / Discovery Call / Proposal Sent / Client / Follow Up / Speaking / Collab / Closed |
| platform | TEXT | Where you met |
| follow_up_date | DATE | |
| contact_info | TEXT | email/DM/phone |
| notes | TEXT | |
| next_action | TEXT | |
| created_at / updated_at | TIMESTAMPTZ | |

---

### 5. `opportunities`
Speaking & Visibility Opportunities.

| Column | Type | Values |
|---|---|---|
| id | UUID PK | |
| user_id | UUID → auth.users | |
| name | TEXT NOT NULL | |
| type | TEXT | Podcast / Radio / Webinar / Workshop / Summit / Panel / Collaboration / Guest Feature / Other |
| status | TEXT | Idea / To Pitch / Pitched / Follow Up / Booked / Completed / Passed |
| platform | TEXT | Host/publication/event |
| follow_up_date | DATE | |
| contact_info | TEXT | email/DM/booking link |
| notes | TEXT | pitch history |
| next_action | TEXT | |
| created_at / updated_at | TIMESTAMPTZ | |

---

### 6. `revenue_entries`
Individual revenue log entries (Money Tracker — Revenue tab).

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

### 7. `expense_entries`
Individual expense log entries (Money Tracker — Expense tab).

| Column | Type | |
|---|---|---|
| id | UUID PK | |
| user_id | UUID → auth.users | |
| entry_date | DATE | |
| amount | NUMERIC(12,2) NOT NULL | |
| description | TEXT | category/description |
| notes | TEXT | |
| created_at | TIMESTAMPTZ | |

---

### 8. `debt_entries`
Debt Tracker.

| Column | Type | |
|---|---|---|
| id | UUID PK | |
| user_id | UUID → auth.users | |
| name | TEXT NOT NULL | e.g. "Credit Card" |
| balance | NUMERIC(12,2) | |
| monthly_payment | NUMERIC(12,2) | |
| notes | TEXT | |
| created_at / updated_at | TIMESTAMPTZ | |

---

## Security

- RLS enabled on all tables
- Single policy per table: `auth.uid() = user_id` for ALL operations
- No public reads — auth required

## Indexes

```
daily_entries   (user_id, entry_date)
daily_tasks     (user_id, entry_date)
contacts        (user_id, follow_up_date)
opportunities   (user_id, follow_up_date)
revenue_entries (user_id, entry_date)
expense_entries (user_id, entry_date)
```

---

## Open Questions

1. **Task defaults** — seed `daily_tasks` rows from template on first access per day, or create on demand?
2. **Multi-user** — single user for now or full multi-tenant from day 1?
3. **Affirmations** — currently hardcoded in JS. Store custom ones in DB?
4. **Theme preference** — store in `permanent_data` or Supabase user metadata?
