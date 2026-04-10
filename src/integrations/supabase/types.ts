export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          created_at: string
          date: string
          end_time: string
          id: string
          notes: string | null
          patient_id: string
          room_id: string
          start_time: string
          status: string
          therapist_id: string
          therapy_id: string
        }
        Insert: {
          created_at?: string
          date: string
          end_time: string
          id?: string
          notes?: string | null
          patient_id: string
          room_id: string
          start_time: string
          status?: string
          therapist_id: string
          therapy_id: string
        }
        Update: {
          created_at?: string
          date?: string
          end_time?: string
          id?: string
          notes?: string | null
          patient_id?: string
          room_id?: string
          start_time?: string
          status?: string
          therapist_id?: string
          therapy_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "rooms"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_therapist_id_fkey"
            columns: ["therapist_id"]
            isOneToOne: false
            referencedRelation: "therapists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_therapy_id_fkey"
            columns: ["therapy_id"]
            isOneToOne: false
            referencedRelation: "therapies"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory: {
        Row: {
          category: string
          cost_per_unit: number | null
          created_at: string
          id: string
          item_name: string
          last_restocked_at: string | null
          min_stock_level: number
          quantity: number
          supplier: string | null
          unit: string
          updated_at: string
        }
        Insert: {
          category: string
          cost_per_unit?: number | null
          created_at?: string
          id?: string
          item_name: string
          last_restocked_at?: string | null
          min_stock_level?: number
          quantity?: number
          supplier?: string | null
          unit?: string
          updated_at?: string
        }
        Update: {
          category?: string
          cost_per_unit?: number | null
          created_at?: string
          id?: string
          item_name?: string
          last_restocked_at?: string | null
          min_stock_level?: number
          quantity?: number
          supplier?: string | null
          unit?: string
          updated_at?: string
        }
        Relationships: []
      }
      patients: {
        Row: {
          abha_id: string | null
          address: string | null
          age: number
          blood_group: string | null
          chief_complaint: string | null
          contact: string
          created_at: string
          education: string | null
          gender: string
          id: string
          ipd_no: string | null
          name: string
          occupation: string | null
          opd_no: string | null
          registration_date: string | null
          resident_status: string | null
          serial_no: string | null
          socio_economic_status: string | null
          updated_at: string
        }
        Insert: {
          abha_id?: string | null
          address?: string | null
          age: number
          blood_group?: string | null
          chief_complaint?: string | null
          contact: string
          created_at?: string
          education?: string | null
          gender: string
          id?: string
          ipd_no?: string | null
          name: string
          occupation?: string | null
          opd_no?: string | null
          registration_date?: string | null
          resident_status?: string | null
          serial_no?: string | null
          socio_economic_status?: string | null
          updated_at?: string
        }
        Update: {
          abha_id?: string | null
          address?: string | null
          age?: number
          blood_group?: string | null
          chief_complaint?: string | null
          contact?: string
          created_at?: string
          education?: string | null
          gender?: string
          id?: string
          ipd_no?: string | null
          name?: string
          occupation?: string | null
          opd_no?: string | null
          registration_date?: string | null
          resident_status?: string | null
          serial_no?: string | null
          socio_economic_status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      prakriti_assessments: {
        Row: {
          assessment_date: string
          id: string
          kapha_score: number
          patient_id: string
          pitta_score: number
          responses: Json | null
          vata_score: number
        }
        Insert: {
          assessment_date?: string
          id?: string
          kapha_score?: number
          patient_id: string
          pitta_score?: number
          responses?: Json | null
          vata_score?: number
        }
        Update: {
          assessment_date?: string
          id?: string
          kapha_score?: number
          patient_id?: string
          pitta_score?: number
          responses?: Json | null
          vata_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "prakriti_assessments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      rooms: {
        Row: {
          created_at: string
          id: string
          room_number: string
          status: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          room_number: string
          status?: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          room_number?: string
          status?: string
          type?: string
        }
        Relationships: []
      }
      therapies: {
        Row: {
          base_cost: number
          created_at: string
          description: string | null
          duration_minutes: number
          gender_restriction: boolean
          id: string
          name: string
        }
        Insert: {
          base_cost?: number
          created_at?: string
          description?: string | null
          duration_minutes?: number
          gender_restriction?: boolean
          id?: string
          name: string
        }
        Update: {
          base_cost?: number
          created_at?: string
          description?: string | null
          duration_minutes?: number
          gender_restriction?: boolean
          id?: string
          name?: string
        }
        Relationships: []
      }
      therapists: {
        Row: {
          contact: string | null
          created_at: string
          gender: string
          id: string
          is_active: boolean
          name: string
          specialization: string | null
        }
        Insert: {
          contact?: string | null
          created_at?: string
          gender: string
          id?: string
          is_active?: boolean
          name: string
          specialization?: string | null
        }
        Update: {
          contact?: string | null
          created_at?: string
          gender?: string
          id?: string
          is_active?: boolean
          name?: string
          specialization?: string | null
        }
        Relationships: []
      }
      treatment_journey: {
        Row: {
          completed_at: string | null
          created_at: string
          day_number: number
          id: string
          notes: string | null
          patient_id: string
          prescribed_diet: string | null
          session_completed: boolean
          therapy_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          day_number: number
          id?: string
          notes?: string | null
          patient_id: string
          prescribed_diet?: string | null
          session_completed?: boolean
          therapy_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          day_number?: number
          id?: string
          notes?: string | null
          patient_id?: string
          prescribed_diet?: string | null
          session_completed?: boolean
          therapy_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "treatment_journey_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "treatment_journey_therapy_id_fkey"
            columns: ["therapy_id"]
            isOneToOne: false
            referencedRelation: "therapies"
            referencedColumns: ["id"]
          },
        ]
      }
      vitals: {
        Row: {
          appetite: string | null
          bp_diastolic: number | null
          bp_systolic: number | null
          day_number: number
          id: string
          notes: string | null
          patient_id: string
          pulse: number | null
          recorded_at: string
        }
        Insert: {
          appetite?: string | null
          bp_diastolic?: number | null
          bp_systolic?: number | null
          day_number: number
          id?: string
          notes?: string | null
          patient_id: string
          pulse?: number | null
          recorded_at?: string
        }
        Update: {
          appetite?: string | null
          bp_diastolic?: number | null
          bp_systolic?: number | null
          day_number?: number
          id?: string
          notes?: string | null
          patient_id?: string
          pulse?: number | null
          recorded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vitals_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
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
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
