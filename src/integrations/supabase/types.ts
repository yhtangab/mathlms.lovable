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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      assessment_scores: {
        Row: {
          absent: boolean
          category: string
          full_marks: number | null
          kind: string
          label: string
          position: number
          score: number | null
          student_id: string
          synced_at: string
          term: number
        }
        Insert: {
          absent?: boolean
          category: string
          full_marks?: number | null
          kind: string
          label: string
          position?: number
          score?: number | null
          student_id: string
          synced_at?: string
          term: number
        }
        Update: {
          absent?: boolean
          category?: string
          full_marks?: number | null
          kind?: string
          label?: string
          position?: number
          score?: number | null
          student_id?: string
          synced_at?: string
          term?: number
        }
        Relationships: [
          {
            foreignKeyName: "assessment_scores_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      chapter_content: {
        Row: {
          chapter: number
          notes: string
          quiz: string
          updated_at: string
          video: string
        }
        Insert: {
          chapter: number
          notes?: string
          quiz?: string
          updated_at?: string
          video?: string
        }
        Update: {
          chapter?: number
          notes?: string
          quiz?: string
          updated_at?: string
          video?: string
        }
        Relationships: []
      }
      chapter_scores: {
        Row: {
          chapter: number
          score: number | null
          student_id: string
        }
        Insert: {
          chapter: number
          score?: number | null
          student_id: string
        }
        Update: {
          chapter?: number
          score?: number | null
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chapter_scores_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_marks: {
        Row: {
          awarded_by: string
          created_at: string
          id: string
          lesson_date: string
          marks: number
          reason: string
          student_id: string
        }
        Insert: {
          awarded_by: string
          created_at?: string
          id?: string
          lesson_date?: string
          marks: number
          reason: string
          student_id: string
        }
        Update: {
          awarded_by?: string
          created_at?: string
          id?: string
          lesson_date?: string
          marks?: number
          reason?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "daily_marks_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          display_name: string
          id: string
          preferences: Json
        }
        Insert: {
          display_name?: string
          id: string
          preferences?: Json
        }
        Update: {
          display_name?: string
          id?: string
          preferences?: Json
        }
        Relationships: []
      }
      sheet_syncs: {
        Row: {
          created_at: string
          id: string
          scores: number
          students: number
          synced_by: string
        }
        Insert: {
          created_at?: string
          id?: string
          scores?: number
          students?: number
          synced_by: string
        }
        Update: {
          created_at?: string
          id?: string
          scores?: number
          students?: number
          synced_by?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          class_name: string
          class_no: string
          email: string
          hlc_no: string | null
          id: string
          last_month_avg: number
          last_month_form_rank: number
          math_set: string
          name: string
          streak: number
          user_id: string | null
          xp: number
        }
        Insert: {
          class_name?: string
          class_no?: string
          email: string
          hlc_no?: string | null
          id?: string
          last_month_avg?: number
          last_month_form_rank?: number
          math_set: string
          name: string
          streak?: number
          user_id?: string | null
          xp?: number
        }
        Update: {
          class_name?: string
          class_no?: string
          email?: string
          hlc_no?: string | null
          id?: string
          last_month_avg?: number
          last_month_form_rank?: number
          math_set?: string
          name?: string
          streak?: number
          user_id?: string | null
          xp?: number
        }
        Relationships: [
          {
            foreignKeyName: "students_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      video_completions: {
        Row: {
          chapter: number
          completed_at: string
          marks: number
          student_id: string
          video_url: string
        }
        Insert: {
          chapter: number
          completed_at?: string
          marks?: number
          student_id: string
          video_url: string
        }
        Update: {
          chapter?: number
          completed_at?: string
          marks?: number
          student_id?: string
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_completions_chapter_fkey"
            columns: ["chapter"]
            isOneToOne: false
            referencedRelation: "chapter_content"
            referencedColumns: ["chapter"]
          },
          {
            foreignKeyName: "video_completions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_student: { Args: never; Returns: undefined }
      complete_video: { Args: { _chapter: number }; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "teacher" | "student"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["teacher", "student"],
    },
  },
} as const
