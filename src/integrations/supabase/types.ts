export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      accounts: {
        Row: {
          account_id: string
          account_name: string
          account_type: string
          created_at: string | null
          parent_account_id: string | null
          unit_id: string | null
          updated_at: string | null
        }
        Insert: {
          account_id?: string
          account_name: string
          account_type: string
          created_at?: string | null
          parent_account_id?: string | null
          unit_id?: string | null
          updated_at?: string | null
        }
        Update: {
          account_id?: string
          account_name?: string
          account_type?: string
          created_at?: string | null
          parent_account_id?: string | null
          unit_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_parent_account_id_fkey"
            columns: ["parent_account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "accounts_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      cash_flow: {
        Row: {
          category: string
          date: string
          description: string | null
          id: string
          type: string
          unit_id: string | null
          value: number
        }
        Insert: {
          category: string
          date: string
          description?: string | null
          id?: string
          type: string
          unit_id?: string | null
          value: number
        }
        Update: {
          category?: string
          date?: string
          description?: string | null
          id?: string
          type?: string
          unit_id?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "cash_flow_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      chart_of_accounts: {
        Row: {
          code: string
          id: string
          name: string
          parent_id: string | null
          type: string
          unit_id: string | null
        }
        Insert: {
          code: string
          id?: string
          name: string
          parent_id?: string | null
          type: string
          unit_id?: string | null
        }
        Update: {
          code?: string
          id?: string
          name?: string
          parent_id?: string | null
          type?: string
          unit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chart_of_accounts_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "chart_of_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chart_of_accounts_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      cost_center_categories: {
        Row: {
          category_id: string
          category_name: string
          created_at: string | null
          description: string | null
          updated_at: string | null
        }
        Insert: {
          category_id?: string
          category_name: string
          created_at?: string | null
          description?: string | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string
          category_name?: string
          created_at?: string | null
          description?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      cost_centers: {
        Row: {
          category_id: string | null
          cost_center_id: string
          cost_center_name: string
          created_at: string | null
          description: string | null
          unit_id: string | null
          updated_at: string | null
        }
        Insert: {
          category_id?: string | null
          cost_center_id?: string
          cost_center_name: string
          created_at?: string | null
          description?: string | null
          unit_id?: string | null
          updated_at?: string | null
        }
        Update: {
          category_id?: string | null
          cost_center_id?: string
          cost_center_name?: string
          created_at?: string | null
          description?: string | null
          unit_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cost_centers_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "cost_center_categories"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "cost_centers_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      dre_structure_items: {
        Row: {
          account_id: string | null
          calculation_logic: string | null
          created_at: string | null
          is_subtotal: boolean | null
          item_id: string
          item_level: number
          item_name: string
          order_index: number
          structure_id: string
          updated_at: string | null
        }
        Insert: {
          account_id?: string | null
          calculation_logic?: string | null
          created_at?: string | null
          is_subtotal?: boolean | null
          item_id?: string
          item_level?: number
          item_name: string
          order_index: number
          structure_id: string
          updated_at?: string | null
        }
        Update: {
          account_id?: string | null
          calculation_logic?: string | null
          created_at?: string | null
          is_subtotal?: boolean | null
          item_id?: string
          item_level?: number
          item_name?: string
          order_index?: number
          structure_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "dre_structure_items_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["account_id"]
          },
          {
            foreignKeyName: "dre_structure_items_structure_id_fkey"
            columns: ["structure_id"]
            isOneToOne: false
            referencedRelation: "dre_structures"
            referencedColumns: ["structure_id"]
          },
        ]
      }
      dre_structures: {
        Row: {
          created_at: string | null
          description: string | null
          structure_id: string
          structure_name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          structure_id?: string
          structure_name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          structure_id?: string
          structure_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      financial_periods: {
        Row: {
          end_date: string
          period_id: string
          period_name: string
          period_type: string
          start_date: string
        }
        Insert: {
          end_date: string
          period_id?: string
          period_name: string
          period_type: string
          start_date: string
        }
        Update: {
          end_date?: string
          period_id?: string
          period_name?: string
          period_type?: string
          start_date?: string
        }
        Relationships: []
      }
      goal_history: {
        Row: {
          goal_id: string | null
          id: string
          recorded_at: string
          recorded_value: number | null
        }
        Insert: {
          goal_id?: string | null
          id?: string
          recorded_at: string
          recorded_value?: number | null
        }
        Update: {
          goal_id?: string | null
          id?: string
          recorded_at?: string
          recorded_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "goal_history_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      goals: {
        Row: {
          current_value: number | null
          description: string | null
          end_date: string | null
          id: string
          kpi_name_ref: string | null
          name: string
          start_date: string | null
          status: string | null
          target_value: number
          unit_id: string | null
        }
        Insert: {
          current_value?: number | null
          description?: string | null
          end_date?: string | null
          id?: string
          kpi_name_ref?: string | null
          name: string
          start_date?: string | null
          status?: string | null
          target_value: number
          unit_id?: string | null
        }
        Update: {
          current_value?: number | null
          description?: string | null
          end_date?: string | null
          id?: string
          kpi_name_ref?: string | null
          name?: string
          start_date?: string | null
          status?: string | null
          target_value?: number
          unit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "goals_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          config_json: Json | null
          created_at: string | null
          integration_id: string
          is_active: boolean | null
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          config_json?: Json | null
          created_at?: string | null
          integration_id?: string
          is_active?: boolean | null
          name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          config_json?: Json | null
          created_at?: string | null
          integration_id?: string
          is_active?: boolean | null
          name?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      kpi_data: {
        Row: {
          captured_at: string | null
          kpi_data_id: string
          kpi_id: string
          period_id: string
          value: number
        }
        Insert: {
          captured_at?: string | null
          kpi_data_id?: string
          kpi_id: string
          period_id: string
          value: number
        }
        Update: {
          captured_at?: string | null
          kpi_data_id?: string
          kpi_id?: string
          period_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "kpi_data_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "kpis"
            referencedColumns: ["kpi_id"]
          },
          {
            foreignKeyName: "kpi_data_period_id_fkey"
            columns: ["period_id"]
            isOneToOne: false
            referencedRelation: "financial_periods"
            referencedColumns: ["period_id"]
          },
        ]
      }
      kpi_goals: {
        Row: {
          created_at: string | null
          goal_value: number
          kpi_goal_id: string
          kpi_id: string
          period_id: string
          set_by_user_id: string | null
          target_date: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          goal_value: number
          kpi_goal_id?: string
          kpi_id: string
          period_id: string
          set_by_user_id?: string | null
          target_date?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          goal_value?: number
          kpi_goal_id?: string
          kpi_id?: string
          period_id?: string
          set_by_user_id?: string | null
          target_date?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kpi_goals_kpi_id_fkey"
            columns: ["kpi_id"]
            isOneToOne: false
            referencedRelation: "kpis"
            referencedColumns: ["kpi_id"]
          },
          {
            foreignKeyName: "kpi_goals_period_id_fkey"
            columns: ["period_id"]
            isOneToOne: false
            referencedRelation: "financial_periods"
            referencedColumns: ["period_id"]
          },
          {
            foreignKeyName: "kpi_goals_set_by_user_id_fkey"
            columns: ["set_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      kpis: {
        Row: {
          created_at: string | null
          description: string | null
          kpi_id: string
          kpi_name: string
          unit_of_measure: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          kpi_id?: string
          kpi_name: string
          unit_of_measure?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          kpi_id?: string
          kpi_name?: string
          unit_of_measure?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      kpis_data: {
        Row: {
          date_ref: string
          goal_value: number | null
          id: string
          kpi_name: string
          previous_month_value: number | null
          unit_id: string | null
          value: number | null
        }
        Insert: {
          date_ref: string
          goal_value?: number | null
          id?: string
          kpi_name: string
          previous_month_value?: number | null
          unit_id?: string | null
          value?: number | null
        }
        Update: {
          date_ref?: string
          goal_value?: number | null
          id?: string
          kpi_name?: string
          previous_month_value?: number | null
          unit_id?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "kpis_data_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      logs: {
        Row: {
          details_json: Json | null
          log_id: string
          log_type: string
          message: string
          timestamp: string | null
        }
        Insert: {
          details_json?: Json | null
          log_id?: string
          log_type: string
          message: string
          timestamp?: string | null
        }
        Update: {
          details_json?: Json | null
          log_id?: string
          log_type?: string
          message?: string
          timestamp?: string | null
        }
        Relationships: []
      }
      manager_notes: {
        Row: {
          created_at: string | null
          created_by_user_id: string
          note_content: string
          note_id: string
          period_id: string
          unit_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by_user_id: string
          note_content: string
          note_id?: string
          period_id: string
          unit_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by_user_id?: string
          note_content?: string
          note_id?: string
          period_id?: string
          unit_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "manager_notes_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "manager_notes_period_id_fkey"
            columns: ["period_id"]
            isOneToOne: false
            referencedRelation: "financial_periods"
            referencedColumns: ["period_id"]
          },
          {
            foreignKeyName: "manager_notes_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      observations: {
        Row: {
          author_name: string | null
          content: string | null
          date: string | null
          id: string
          priority: string | null
          status_color: string | null
          tag: string | null
          title: string
        }
        Insert: {
          author_name?: string | null
          content?: string | null
          date?: string | null
          id?: string
          priority?: string | null
          status_color?: string | null
          tag?: string | null
          title: string
        }
        Update: {
          author_name?: string | null
          content?: string | null
          date?: string | null
          id?: string
          priority?: string | null
          status_color?: string | null
          tag?: string | null
          title?: string
        }
        Relationships: []
      }
      projections: {
        Row: {
          id: string
          period_start_date: string
          probability_pct: number | null
          projected_revenue: number
          scenario: string
          unit_id: string | null
        }
        Insert: {
          id?: string
          period_start_date: string
          probability_pct?: number | null
          projected_revenue: number
          scenario: string
          unit_id?: string | null
        }
        Update: {
          id?: string
          period_start_date?: string
          probability_pct?: number | null
          projected_revenue?: number
          scenario?: string
          unit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projections_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      reports: {
        Row: {
          file_url: string | null
          generated_at: string | null
          generated_by_user_id: string | null
          period_id: string
          report_id: string
          report_name: string
          report_type: string
          unit_id: string
        }
        Insert: {
          file_url?: string | null
          generated_at?: string | null
          generated_by_user_id?: string | null
          period_id: string
          report_id?: string
          report_name: string
          report_type: string
          unit_id: string
        }
        Update: {
          file_url?: string | null
          generated_at?: string | null
          generated_by_user_id?: string | null
          period_id?: string
          report_id?: string
          report_name?: string
          report_type?: string
          unit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reports_generated_by_user_id_fkey"
            columns: ["generated_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "reports_period_id_fkey"
            columns: ["period_id"]
            isOneToOne: false
            referencedRelation: "financial_periods"
            referencedColumns: ["period_id"]
          },
          {
            foreignKeyName: "reports_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          current_status: string
          email: string
          engagement_score: number | null
          enrollment_date: string
          id: string
          is_uti_active: boolean | null
          last_activity_date: string | null
          name: string
          nps_score: number | null
          unit_id: string | null
        }
        Insert: {
          current_status: string
          email: string
          engagement_score?: number | null
          enrollment_date: string
          id?: string
          is_uti_active?: boolean | null
          last_activity_date?: string | null
          name: string
          nps_score?: number | null
          unit_id?: string | null
        }
        Update: {
          current_status?: string
          email?: string
          engagement_score?: number | null
          enrollment_date?: string
          id?: string
          is_uti_active?: boolean | null
          last_activity_date?: string | null
          name?: string
          nps_score?: number | null
          unit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "students_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
        ]
      }
      system_settings: {
        Row: {
          created_at: string | null
          description: string | null
          setting_key: string
          setting_value: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          setting_key: string
          setting_value?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          setting_key?: string
          setting_value?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      units: {
        Row: {
          alunos: number | null
          capacidade: number | null
          despesa: number | null
          id: string
          is_active: boolean | null
          location: string | null
          matriculas: number | null
          name: string
          ocupacao: number | null
          receita: number | null
          ticket_medio: number | null
        }
        Insert: {
          alunos?: number | null
          capacidade?: number | null
          despesa?: number | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          matriculas?: number | null
          name: string
          ocupacao?: number | null
          receita?: number | null
          ticket_medio?: number | null
        }
        Update: {
          alunos?: number | null
          capacidade?: number | null
          despesa?: number | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          matriculas?: number | null
          name?: string
          ocupacao?: number | null
          receita?: number | null
          ticket_medio?: number | null
        }
        Relationships: []
      }
      user_units: {
        Row: {
          role: string
          unit_id: string
          user_id: string
        }
        Insert: {
          role: string
          unit_id: string
          user_id: string
        }
        Update: {
          role?: string
          unit_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_units_unit_id_fkey"
            columns: ["unit_id"]
            isOneToOne: false
            referencedRelation: "units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_units_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          password_hash: string
          updated_at: string | null
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string | null
          email: string
          password_hash: string
          updated_at?: string | null
          user_id?: string
          username: string
        }
        Update: {
          created_at?: string | null
          email?: string
          password_hash?: string
          updated_at?: string | null
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      webhooks: {
        Row: {
          created_at: string | null
          event_type: string
          is_active: boolean | null
          name: string
          updated_at: string | null
          url: string
          webhook_id: string
        }
        Insert: {
          created_at?: string | null
          event_type: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
          url: string
          webhook_id?: string
        }
        Update: {
          created_at?: string | null
          event_type?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
          url?: string
          webhook_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_latest_kpi_data_for_unit: {
        Args: { p_unit_id: string } | { p_unit_id: string; p_date_ref: string }
        Returns: {
          kpi_name: string
          value: number
          date_ref: string
        }[]
      }
    }
    Enums: {
      account_type: "revenue" | "expense" | "liability" | "equity"
      credential_status: "valid" | "expired" | "invalid"
      credential_type:
        | "API_KEY"
        | "TOKEN"
        | "OAUTH"
        | "DATABASE"
        | "CERTIFICATE"
      dre_line_item_type: "revenue" | "expense" | "subtotal" | "total"
      insight_impact: "high" | "medium" | "low"
      insight_type: "recommendation" | "alert" | "opportunity"
      integration_status: "connected" | "disconnected" | "error"
      integration_type:
        | "ERP"
        | "CRM"
        | "Payment"
        | "Analytics"
        | "Email"
        | "Other"
      log_level: "info" | "warning" | "error" | "success"
      parameter_type: "string" | "number" | "boolean" | "json"
      sync_frequency: "realtime" | "hourly" | "daily" | "weekly" | "monthly"
      sync_status: "active" | "paused" | "error"
      unit_alert_category: "financial" | "operational" | "strategic"
      unit_alert_severity: "low" | "medium" | "high"
      unit_alert_type: "warning" | "danger" | "info" | "success"
      webhook_method: "POST" | "GET" | "PUT" | "DELETE"
      webhook_status: "active" | "inactive" | "error"
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_type: ["revenue", "expense", "liability", "equity"],
      credential_status: ["valid", "expired", "invalid"],
      credential_type: ["API_KEY", "TOKEN", "OAUTH", "DATABASE", "CERTIFICATE"],
      dre_line_item_type: ["revenue", "expense", "subtotal", "total"],
      insight_impact: ["high", "medium", "low"],
      insight_type: ["recommendation", "alert", "opportunity"],
      integration_status: ["connected", "disconnected", "error"],
      integration_type: [
        "ERP",
        "CRM",
        "Payment",
        "Analytics",
        "Email",
        "Other",
      ],
      log_level: ["info", "warning", "error", "success"],
      parameter_type: ["string", "number", "boolean", "json"],
      sync_frequency: ["realtime", "hourly", "daily", "weekly", "monthly"],
      sync_status: ["active", "paused", "error"],
      unit_alert_category: ["financial", "operational", "strategic"],
      unit_alert_severity: ["low", "medium", "high"],
      unit_alert_type: ["warning", "danger", "info", "success"],
      webhook_method: ["POST", "GET", "PUT", "DELETE"],
      webhook_status: ["active", "inactive", "error"],
    },
  },
} as const