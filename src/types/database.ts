export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_audit_logs: {
        Row: {
          action: string
          admin_email: string
          admin_id: string | null
          created_at: string | null
          id: string
          target_email: string | null
          target_id: string | null
        }
        Insert: {
          action: string
          admin_email: string
          admin_id?: string | null
          created_at?: string | null
          id?: string
          target_email?: string | null
          target_id?: string | null
        }
        Update: {
          action?: string
          admin_email?: string
          admin_id?: string | null
          created_at?: string | null
          id?: string
          target_email?: string | null
          target_id?: string | null
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          failed_attempts: number
          full_name: string | null
          id: string
          locked_until: string | null
          password_hash: string
        }
        Insert: {
          created_at?: string | null
          email: string
          failed_attempts?: number
          full_name?: string | null
          id?: string
          locked_until?: string | null
          password_hash: string
        }
        Update: {
          created_at?: string | null
          email?: string
          failed_attempts?: number
          full_name?: string | null
          id?: string
          locked_until?: string | null
          password_hash?: string
        }
        Relationships: []
      }
      contacts: {
        Row: {
          contact_info: string | null
          created_at: string | null
          follow_up_date: string | null
          id: string
          name: string
          next_action: string | null
          notes: string | null
          platform: string | null
          status: string | null
          type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          contact_info?: string | null
          created_at?: string | null
          follow_up_date?: string | null
          id?: string
          name: string
          next_action?: string | null
          notes?: string | null
          platform?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          contact_info?: string | null
          created_at?: string | null
          follow_up_date?: string | null
          id?: string
          name?: string
          next_action?: string | null
          notes?: string | null
          platform?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      daily_entries: {
        Row: {
          b_cycle: boolean | null
          b_meals: boolean | null
          b_move: boolean | null
          b_sleep: boolean | null
          b_walk: boolean | null
          b_water: boolean | null
          created_at: string | null
          energy: string | null
          entry_date: string
          eod_celebrate: string | null
          eod_release: string | null
          eod_worked: string | null
          feel: string | null
          g_celeb: string | null
          g_drained: string | null
          g_lesson: string | null
          g_proud: string | null
          g_release: string | null
          g_win: string | null
          g_worked: string | null
          id: string
          m_cash: string | null
          m_client: string | null
          m_exp: number | null
          m_expdesc: string | null
          m_offer: string | null
          m_ract: string | null
          m_rev: number | null
          m_snotes: string | null
          m_tax: string | null
          mood_emoji: string | null
          mood_label: string | null
          priorities: string | null
          s_breath: boolean | null
          s_intuit: boolean | null
          s_med: boolean | null
          s_prayer: boolean | null
          s_scrip: boolean | null
          s_viz: boolean | null
          updated_at: string | null
          user_id: string
          vis_aud: string | null
          vis_convo: string | null
          vis_cta: string | null
          vis_engage: string | null
          vis_idea: string | null
          vis_pillar: string | null
          vis_platforms: string[] | null
          vis_promo: string | null
          w_aff: string | null
          w_bnotes: string | null
          w_grat: string | null
          w_journal: string | null
          w_mental: string | null
          w_scrip_text: string | null
          w_snotes: string | null
        }
        Insert: {
          b_cycle?: boolean | null
          b_meals?: boolean | null
          b_move?: boolean | null
          b_sleep?: boolean | null
          b_walk?: boolean | null
          b_water?: boolean | null
          created_at?: string | null
          energy?: string | null
          entry_date: string
          eod_celebrate?: string | null
          eod_release?: string | null
          eod_worked?: string | null
          feel?: string | null
          g_celeb?: string | null
          g_drained?: string | null
          g_lesson?: string | null
          g_proud?: string | null
          g_release?: string | null
          g_win?: string | null
          g_worked?: string | null
          id?: string
          m_cash?: string | null
          m_client?: string | null
          m_exp?: number | null
          m_expdesc?: string | null
          m_offer?: string | null
          m_ract?: string | null
          m_rev?: number | null
          m_snotes?: string | null
          m_tax?: string | null
          mood_emoji?: string | null
          mood_label?: string | null
          priorities?: string | null
          s_breath?: boolean | null
          s_intuit?: boolean | null
          s_med?: boolean | null
          s_prayer?: boolean | null
          s_scrip?: boolean | null
          s_viz?: boolean | null
          updated_at?: string | null
          user_id: string
          vis_aud?: string | null
          vis_convo?: string | null
          vis_cta?: string | null
          vis_engage?: string | null
          vis_idea?: string | null
          vis_pillar?: string | null
          vis_platforms?: string[] | null
          vis_promo?: string | null
          w_aff?: string | null
          w_bnotes?: string | null
          w_grat?: string | null
          w_journal?: string | null
          w_mental?: string | null
          w_scrip_text?: string | null
          w_snotes?: string | null
        }
        Update: {
          b_cycle?: boolean | null
          b_meals?: boolean | null
          b_move?: boolean | null
          b_sleep?: boolean | null
          b_walk?: boolean | null
          b_water?: boolean | null
          created_at?: string | null
          energy?: string | null
          entry_date?: string
          eod_celebrate?: string | null
          eod_release?: string | null
          eod_worked?: string | null
          feel?: string | null
          g_celeb?: string | null
          g_drained?: string | null
          g_lesson?: string | null
          g_proud?: string | null
          g_release?: string | null
          g_win?: string | null
          g_worked?: string | null
          id?: string
          m_cash?: string | null
          m_client?: string | null
          m_exp?: number | null
          m_expdesc?: string | null
          m_offer?: string | null
          m_ract?: string | null
          m_rev?: number | null
          m_snotes?: string | null
          m_tax?: string | null
          mood_emoji?: string | null
          mood_label?: string | null
          priorities?: string | null
          s_breath?: boolean | null
          s_intuit?: boolean | null
          s_med?: boolean | null
          s_prayer?: boolean | null
          s_scrip?: boolean | null
          s_viz?: boolean | null
          updated_at?: string | null
          user_id?: string
          vis_aud?: string | null
          vis_convo?: string | null
          vis_cta?: string | null
          vis_engage?: string | null
          vis_idea?: string | null
          vis_pillar?: string | null
          vis_platforms?: string[] | null
          vis_promo?: string | null
          w_aff?: string | null
          w_bnotes?: string | null
          w_grat?: string | null
          w_journal?: string | null
          w_mental?: string | null
          w_scrip_text?: string | null
          w_snotes?: string | null
        }
        Relationships: []
      }
      daily_tasks: {
        Row: {
          category: string
          created_at: string | null
          entry_date: string
          id: string
          is_done: boolean | null
          note: string | null
          sort_order: number | null
          task_key: string
          task_label: string | null
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string | null
          entry_date: string
          id?: string
          is_done?: boolean | null
          note?: string | null
          sort_order?: number | null
          task_key: string
          task_label?: string | null
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          entry_date?: string
          id?: string
          is_done?: boolean | null
          note?: string | null
          sort_order?: number | null
          task_key?: string
          task_label?: string | null
          user_id?: string
        }
        Relationships: []
      }
      debt_entries: {
        Row: {
          balance: number | null
          created_at: string | null
          id: string
          monthly_payment: number | null
          name: string
          notes: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          id?: string
          monthly_payment?: number | null
          name: string
          notes?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          id?: string
          monthly_payment?: number | null
          name?: string
          notes?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      expense_entries: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          entry_date: string
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          entry_date: string
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          entry_date?: string
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      opportunities: {
        Row: {
          contact_info: string | null
          created_at: string | null
          follow_up_date: string | null
          id: string
          name: string
          next_action: string | null
          notes: string | null
          platform: string | null
          status: string | null
          type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          contact_info?: string | null
          created_at?: string | null
          follow_up_date?: string | null
          id?: string
          name: string
          next_action?: string | null
          notes?: string | null
          platform?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          contact_info?: string | null
          created_at?: string | null
          follow_up_date?: string | null
          id?: string
          name?: string
          next_action?: string | null
          notes?: string | null
          platform?: string | null
          status?: string | null
          type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      permanent_data: {
        Row: {
          id: string
          p_ads: number | null
          p_annual: string | null
          p_becoming: string | null
          p_bizgoal: string | null
          p_client: string | null
          p_clients: string | null
          p_coaching: number | null
          p_email_mkt: number | null
          p_food: number | null
          p_income: string | null
          p_income_goal: number | null
          p_insurance: number | null
          p_internet: number | null
          p_lifestyle: string | null
          p_midyear: string | null
          p_mission: string | null
          p_month_goal: number | null
          p_offer: string | null
          p_offer_goal: string | null
          p_other_bills: string | null
          p_other_biz: string | null
          p_personal: string | null
          p_q1: string | null
          p_q2: string | null
          p_q3: string | null
          p_q4: string | null
          p_rent: number | null
          p_rev_act: string | null
          p_subs: number | null
          p_transport: number | null
          p_v1: string | null
          p_v2: string | null
          p_v3: string | null
          p_v4: string | null
          p_v5: string | null
          p_v6: string | null
          p_vision: string | null
          p_website: number | null
          p_why: string | null
          p_word: string | null
          p_yearend: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          p_ads?: number | null
          p_annual?: string | null
          p_becoming?: string | null
          p_bizgoal?: string | null
          p_client?: string | null
          p_clients?: string | null
          p_coaching?: number | null
          p_email_mkt?: number | null
          p_food?: number | null
          p_income?: string | null
          p_income_goal?: number | null
          p_insurance?: number | null
          p_internet?: number | null
          p_lifestyle?: string | null
          p_midyear?: string | null
          p_mission?: string | null
          p_month_goal?: number | null
          p_offer?: string | null
          p_offer_goal?: string | null
          p_other_bills?: string | null
          p_other_biz?: string | null
          p_personal?: string | null
          p_q1?: string | null
          p_q2?: string | null
          p_q3?: string | null
          p_q4?: string | null
          p_rent?: number | null
          p_rev_act?: string | null
          p_subs?: number | null
          p_transport?: number | null
          p_v1?: string | null
          p_v2?: string | null
          p_v3?: string | null
          p_v4?: string | null
          p_v5?: string | null
          p_v6?: string | null
          p_vision?: string | null
          p_website?: number | null
          p_why?: string | null
          p_word?: string | null
          p_yearend?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          p_ads?: number | null
          p_annual?: string | null
          p_becoming?: string | null
          p_bizgoal?: string | null
          p_client?: string | null
          p_clients?: string | null
          p_coaching?: number | null
          p_email_mkt?: number | null
          p_food?: number | null
          p_income?: string | null
          p_income_goal?: number | null
          p_insurance?: number | null
          p_internet?: number | null
          p_lifestyle?: string | null
          p_midyear?: string | null
          p_mission?: string | null
          p_month_goal?: number | null
          p_offer?: string | null
          p_offer_goal?: string | null
          p_other_bills?: string | null
          p_other_biz?: string | null
          p_personal?: string | null
          p_q1?: string | null
          p_q2?: string | null
          p_q3?: string | null
          p_q4?: string | null
          p_rent?: number | null
          p_rev_act?: string | null
          p_subs?: number | null
          p_transport?: number | null
          p_v1?: string | null
          p_v2?: string | null
          p_v3?: string | null
          p_v4?: string | null
          p_v5?: string | null
          p_v6?: string | null
          p_vision?: string | null
          p_website?: number | null
          p_why?: string | null
          p_word?: string | null
          p_yearend?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          business_name: string | null
          created_at: string | null
          full_name: string | null
          id: string
          is_active: boolean
          onboarding_completed: boolean | null
          role: string | null
          theme: string | null
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          business_name?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          is_active?: boolean
          onboarding_completed?: boolean | null
          role?: string | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          business_name?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          is_active?: boolean
          onboarding_completed?: boolean | null
          role?: string | null
          theme?: string | null
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      revenue_entries: {
        Row: {
          amount: number
          client_offer: string | null
          created_at: string | null
          entry_date: string
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          amount: number
          client_offer?: string | null
          created_at?: string | null
          entry_date: string
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          client_offer?: string | null
          created_at?: string | null
          entry_date?: string
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          category: string
          completed_at: string | null
          created_at: string
          due_date: string | null
          id: string
          is_done: boolean
          is_recurring: boolean
          note: string | null
          priority: string
          recur_pattern: string | null
          sort_order: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          completed_at?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          is_done?: boolean
          is_recurring?: boolean
          note?: string | null
          priority?: string
          recur_pattern?: string | null
          sort_order?: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          completed_at?: string | null
          created_at?: string
          due_date?: string | null
          id?: string
          is_done?: boolean
          is_recurring?: boolean
          note?: string | null
          priority?: string
          recur_pattern?: string | null
          sort_order?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: { [_ in never]: never }
    CompositeTypes: { [_ in never]: never }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends { Row: infer R }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends { Row: infer R }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends { Insert: infer I }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends { Insert: infer I }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends { Update: infer U }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends { Update: infer U }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof DatabaseWithoutInternals }
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: { Enums: {} },
} as const
