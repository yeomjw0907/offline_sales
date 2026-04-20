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
      admin_activity_logs: {
        Row: {
          action_type: string
          admin_user_id: string
          after_data: Json | null
          before_data: Json | null
          created_at: string
          id: string
          target_id: string | null
          target_type: string
        }
        Insert: {
          action_type: string
          admin_user_id: string
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          id?: string
          target_id?: string | null
          target_type: string
        }
        Update: {
          action_type?: string
          admin_user_id?: string
          after_data?: Json | null
          before_data?: Json | null
          created_at?: string
          id?: string
          target_id?: string | null
          target_type?: string
        }
        Relationships: []
      }
      integration_events: {
        Row: {
          created_at: string
          error_message: string | null
          event_id: string
          event_type: string
          failed_at: string | null
          id: string
          linked_merchant_lead_id: string | null
          merchant_external_id: string | null
          payload: Json
          processed_at: string | null
          provider: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          event_id: string
          event_type: string
          failed_at?: string | null
          id?: string
          linked_merchant_lead_id?: string | null
          merchant_external_id?: string | null
          payload: Json
          processed_at?: string | null
          provider: string
          status: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          event_id?: string
          event_type?: string
          failed_at?: string | null
          id?: string
          linked_merchant_lead_id?: string | null
          merchant_external_id?: string | null
          payload?: Json
          processed_at?: string | null
          provider?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      merchant_leads: {
        Row: {
          contact_phone: string
          created_at: string
          created_by: string
          id: string
          partner_profile_id: string | null
          pilot_started_at: string
          referral_code: string
          region: string
          status: Database["public"]["Enums"]["merchant_lead_status"]
          store_name: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          contact_phone: string
          created_at?: string
          created_by: string
          id?: string
          partner_profile_id?: string | null
          pilot_started_at: string
          referral_code: string
          region: string
          status?: Database["public"]["Enums"]["merchant_lead_status"]
          store_name: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          contact_phone?: string
          created_at?: string
          created_by?: string
          id?: string
          partner_profile_id?: string | null
          pilot_started_at?: string
          referral_code?: string
          region?: string
          status?: Database["public"]["Enums"]["merchant_lead_status"]
          store_name?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      partner_materials: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_published: boolean
          sort_order: number
          title: string
          type: Database["public"]["Enums"]["material_type"]
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          sort_order?: number
          title: string
          type: Database["public"]["Enums"]["material_type"]
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_published?: boolean
          sort_order?: number
          title?: string
          type?: Database["public"]["Enums"]["material_type"]
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      partner_payout_accounts: {
        Row: {
          account_holder_name: string
          account_number_encrypted: string
          bank_name: string
          created_at: string
          id: string
          is_active: boolean
          partner_profile_id: string
          updated_at: string
        }
        Insert: {
          account_holder_name: string
          account_number_encrypted: string
          bank_name: string
          created_at?: string
          id?: string
          is_active?: boolean
          partner_profile_id: string
          updated_at?: string
        }
        Update: {
          account_holder_name?: string
          account_number_encrypted?: string
          bank_name?: string
          created_at?: string
          id?: string
          is_active?: boolean
          partner_profile_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      partner_profiles: {
        Row: {
          acquisition_channel: string | null
          activity_region: string | null
          activity_type: string | null
          approved_at: string | null
          approved_by: string | null
          created_at: string
          deactivated_at: string | null
          id: string
          intro: string | null
          referral_code: string | null
          status: Database["public"]["Enums"]["partner_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          acquisition_channel?: string | null
          activity_region?: string | null
          activity_type?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          deactivated_at?: string | null
          id?: string
          intro?: string | null
          referral_code?: string | null
          status?: Database["public"]["Enums"]["partner_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          acquisition_channel?: string | null
          activity_region?: string | null
          activity_type?: string | null
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          deactivated_at?: string | null
          id?: string
          intro?: string | null
          referral_code?: string | null
          status?: Database["public"]["Enums"]["partner_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      settlement_items: {
        Row: {
          case_amount: number
          created_at: string
          id: string
          merchant_lead_id: string
          settlement_id: string
        }
        Insert: {
          case_amount: number
          created_at?: string
          id?: string
          merchant_lead_id: string
          settlement_id: string
        }
        Update: {
          case_amount?: number
          created_at?: string
          id?: string
          merchant_lead_id?: string
          settlement_id?: string
        }
        Relationships: []
      }
      settlements: {
        Row: {
          created_at: string
          gross_amount: number
          id: string
          net_amount: number
          paid_at: string | null
          partner_profile_id: string
          processed_by: string | null
          settlement_month: string
          status: Database["public"]["Enums"]["settlement_status"]
          total_cases: number
          updated_at: string
          withholding_tax_amount: number
        }
        Insert: {
          created_at?: string
          gross_amount?: number
          id?: string
          net_amount?: number
          paid_at?: string | null
          partner_profile_id: string
          processed_by?: string | null
          settlement_month: string
          status?: Database["public"]["Enums"]["settlement_status"]
          total_cases?: number
          updated_at?: string
          withholding_tax_amount?: number
        }
        Update: {
          created_at?: string
          gross_amount?: number
          id?: string
          net_amount?: number
          paid_at?: string | null
          partner_profile_id?: string
          processed_by?: string | null
          settlement_month?: string
          status?: Database["public"]["Enums"]["settlement_status"]
          total_cases?: number
          updated_at?: string
          withholding_tax_amount?: number
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string
          email: string | null
          id: string
          kakao_id: string
          name: string | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          kakao_id: string
          name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          kakao_id?: string
          name?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      material_type: "link" | "file" | "note"
      merchant_lead_status: "pilot_started" | "settlement_ready" | "paid"
      partner_status: "pending" | "active" | "inactive"
      settlement_status: "scheduled" | "paid"
      user_role: "partner" | "admin" | "super_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"]

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"]

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T]

// Convenience type aliases
export type User = Tables<"users">
export type PartnerProfile = Tables<"partner_profiles">
export type PartnerPayoutAccount = Tables<"partner_payout_accounts">
export type PartnerMaterial = Tables<"partner_materials">
export type IntegrationEvent = Tables<"integration_events">
export type MerchantLead = Tables<"merchant_leads">
export type Settlement = Tables<"settlements">
export type SettlementItem = Tables<"settlement_items">
export type AdminActivityLog = Tables<"admin_activity_logs">

export type UserRole = Enums<"user_role">
export type PartnerStatus = Enums<"partner_status">
export type MaterialType = Enums<"material_type">
export type MerchantLeadStatus = Enums<"merchant_lead_status">
export type SettlementStatus = Enums<"settlement_status">
