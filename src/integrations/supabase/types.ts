export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      assessment_scores: {
        Row: {
          absent: boolean;
          category: string;
          full_marks: number | null;
          kind: string;
          label: string;
          position: number;
          score: number | null;
          student_id: string;
          synced_at: string;
          term: number;
        };
        Insert: {
          absent?: boolean;
          category: string;
          full_marks?: number | null;
          kind: string;
          label: string;
          position?: number;
          score?: number | null;
          student_id: string;
          synced_at?: string;
          term: number;
        };
        Update: {
          absent?: boolean;
          category?: string;
          full_marks?: number | null;
          kind?: string;
          label?: string;
          position?: number;
          score?: number | null;
          student_id?: string;
          synced_at?: string;
          term?: number;
        };
        Relationships: [
          {
            foreignKeyName: "assessment_scores_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      chapter_content: {
        Row: {
          chapter: number;
          notes: string;
          quiz: string;
          updated_at: string;
          video: string;
        };
        Insert: {
          chapter: number;
          notes?: string;
          quiz?: string;
          updated_at?: string;
          video?: string;
        };
        Update: {
          chapter?: number;
          notes?: string;
          quiz?: string;
          updated_at?: string;
          video?: string;
        };
        Relationships: [];
      };
      chapter_scores: {
        Row: {
          chapter: number;
          score: number | null;
          student_id: string;
        };
        Insert: {
          chapter: number;
          score?: number | null;
          student_id: string;
        };
        Update: {
          chapter?: number;
          score?: number | null;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chapter_scores_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      chapter_video_completions: {
        Row: {
          chapter: number;
          completed_at: string;
          id: string;
          marks: number;
          student_id: string;
          video_id: string | null;
          video_title: string;
        };
        Insert: {
          chapter: number;
          completed_at?: string;
          id?: string;
          marks?: number;
          student_id: string;
          video_id?: string | null;
          video_title: string;
        };
        Update: {
          chapter?: number;
          completed_at?: string;
          id?: string;
          marks?: number;
          student_id?: string;
          video_id?: string | null;
          video_title?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chapter_video_completions_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chapter_video_completions_video_id_fkey";
            columns: ["video_id"];
            isOneToOne: false;
            referencedRelation: "chapter_videos";
            referencedColumns: ["id"];
          },
        ];
      };
      chapter_videos: {
        Row: {
          chapter: number;
          created_at: string;
          id: string;
          position: number;
          title: string;
          url: string;
        };
        Insert: {
          chapter: number;
          created_at?: string;
          id?: string;
          position?: number;
          title: string;
          url: string;
        };
        Update: {
          chapter?: number;
          created_at?: string;
          id?: string;
          position?: number;
          title?: string;
          url?: string;
        };
        Relationships: [];
      };
      daily_marks: {
        Row: {
          awarded_by: string;
          batch_id: string | null;
          created_at: string;
          id: string;
          lesson_date: string;
          marks: number;
          note: string;
          reason: string;
          student_id: string;
        };
        Insert: {
          awarded_by: string;
          batch_id?: string | null;
          created_at?: string;
          id?: string;
          lesson_date?: string;
          marks: number;
          note?: string;
          reason: string;
          student_id: string;
        };
        Update: {
          awarded_by?: string;
          batch_id?: string | null;
          created_at?: string;
          id?: string;
          lesson_date?: string;
          marks?: number;
          note?: string;
          reason?: string;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "daily_marks_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      homework: {
        Row: {
          chapter: number | null;
          created_at: string;
          created_by: string;
          details: string;
          due_at: string;
          id: string;
          link: string;
          math_set: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          chapter?: number | null;
          created_at?: string;
          created_by?: string;
          details?: string;
          due_at: string;
          id?: string;
          link?: string;
          math_set: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          chapter?: number | null;
          created_at?: string;
          created_by?: string;
          details?: string;
          due_at?: string;
          id?: string;
          link?: string;
          math_set?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          display_name: string;
          id: string;
          preferences: Json;
        };
        Insert: {
          display_name?: string;
          id: string;
          preferences?: Json;
        };
        Update: {
          display_name?: string;
          id?: string;
          preferences?: Json;
        };
        Relationships: [];
      };
      reward_redemptions: {
        Row: {
          cost: number;
          created_at: string;
          decided_at: string | null;
          decided_by: string | null;
          id: string;
          reward_id: string | null;
          reward_name: string;
          status: string;
          student_id: string;
        };
        Insert: {
          cost: number;
          created_at?: string;
          decided_at?: string | null;
          decided_by?: string | null;
          id?: string;
          reward_id?: string | null;
          reward_name: string;
          status?: string;
          student_id: string;
        };
        Update: {
          cost?: number;
          created_at?: string;
          decided_at?: string | null;
          decided_by?: string | null;
          id?: string;
          reward_id?: string | null;
          reward_name?: string;
          status?: string;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "reward_redemptions_reward_id_fkey";
            columns: ["reward_id"];
            isOneToOne: false;
            referencedRelation: "rewards";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "reward_redemptions_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      rewards: {
        Row: {
          active: boolean;
          cooldown_days: number | null;
          cost: number;
          created_at: string;
          description: string;
          emoji: string;
          id: string;
          name: string;
          position: number;
        };
        Insert: {
          active?: boolean;
          cooldown_days?: number | null;
          cost: number;
          created_at?: string;
          description?: string;
          emoji?: string;
          id?: string;
          name: string;
          position?: number;
        };
        Update: {
          active?: boolean;
          cooldown_days?: number | null;
          cost?: number;
          created_at?: string;
          description?: string;
          emoji?: string;
          id?: string;
          name?: string;
          position?: number;
        };
        Relationships: [];
      };
      sheet_syncs: {
        Row: {
          created_at: string;
          id: string;
          scores: number;
          students: number;
          synced_by: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          scores?: number;
          students?: number;
          synced_by: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          scores?: number;
          students?: number;
          synced_by?: string;
        };
        Relationships: [];
      };
      students: {
        Row: {
          class_name: string;
          class_no: string;
          email: string;
          hlc_no: string | null;
          id: string;
          last_month_avg: number;
          last_month_form_rank: number;
          math_set: string;
          name: string;
          streak: number;
          user_id: string | null;
          xp: number;
        };
        Insert: {
          class_name?: string;
          class_no?: string;
          email: string;
          hlc_no?: string | null;
          id?: string;
          last_month_avg?: number;
          last_month_form_rank?: number;
          math_set: string;
          name: string;
          streak?: number;
          user_id?: string | null;
          xp?: number;
        };
        Update: {
          class_name?: string;
          class_no?: string;
          email?: string;
          hlc_no?: string | null;
          id?: string;
          last_month_avg?: number;
          last_month_form_rank?: number;
          math_set?: string;
          name?: string;
          streak?: number;
          user_id?: string | null;
          xp?: number;
        };
        Relationships: [
          {
            foreignKeyName: "students_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: true;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      system_config: {
        Row: {
          double_mc_event_active: boolean;
          id: boolean;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          double_mc_event_active?: boolean;
          id?: boolean;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          double_mc_event_active?: boolean;
          id?: boolean;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      user_roles: {
        Row: {
          id: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Insert: {
          id?: string;
          role: Database["public"]["Enums"]["app_role"];
          user_id: string;
        };
        Update: {
          id?: string;
          role?: Database["public"]["Enums"]["app_role"];
          user_id?: string;
        };
        Relationships: [];
      };
      video_completions: {
        Row: {
          chapter: number;
          completed_at: string;
          marks: number;
          student_id: string;
          video_url: string;
        };
        Insert: {
          chapter: number;
          completed_at?: string;
          marks?: number;
          student_id: string;
          video_url: string;
        };
        Update: {
          chapter?: number;
          completed_at?: string;
          marks?: number;
          student_id?: string;
          video_url?: string;
        };
        Relationships: [
          {
            foreignKeyName: "video_completions_chapter_fkey";
            columns: ["chapter"];
            isOneToOne: false;
            referencedRelation: "chapter_content";
            referencedColumns: ["chapter"];
          },
          {
            foreignKeyName: "video_completions_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      student_coin_totals: {
        Row: {
          daily_earned: number | null;
          spent: number | null;
          student_id: string | null;
          video_earned: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      claim_student: { Args: never; Returns: undefined };
      complete_chapter_video: { Args: { _video_id: string }; Returns: boolean };
      complete_video: { Args: { _chapter: number }; Returns: undefined };
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      redeem_reward: { Args: { _reward_id: string }; Returns: string };
    };
    Enums: {
      app_role: "teacher" | "student";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      app_role: ["teacher", "student"],
    },
  },
} as const;
