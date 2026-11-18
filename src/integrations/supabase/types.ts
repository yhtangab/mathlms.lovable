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
      chapter_self_checks: {
        Row: {
          chapter: number;
          checked_at: string;
          objective_id: string;
          student_id: string;
        };
        Insert: {
          chapter: number;
          checked_at?: string;
          objective_id: string;
          student_id: string;
        };
        Update: {
          chapter?: number;
          checked_at?: string;
          objective_id?: string;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "chapter_self_checks_student_id_fkey";
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
      daily_checkins: {
        Row: {
          checkin_date: string;
          correct: boolean;
          created_at: string;
          question_id: string;
          student_id: string;
        };
        Insert: {
          checkin_date: string;
          correct: boolean;
          created_at?: string;
          question_id: string;
          student_id: string;
        };
        Update: {
          checkin_date?: string;
          correct?: boolean;
          created_at?: string;
          question_id?: string;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "daily_checkins_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
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
      exam_dates: {
        Row: {
          created_at: string;
          id: string;
          kind: string;
          math_set: string;
          starts_at: string;
          title: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          kind?: string;
          math_set?: string;
          starts_at: string;
          title: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          kind?: string;
          math_set?: string;
          starts_at?: string;
          title?: string;
        };
        Relationships: [];
      };
      game_leaderboards: {
        Row: {
          generated_at: string;
          id: string;
          metric: string;
          payload: Json;
          scope: string;
          term: number | null;
        };
        Insert: {
          generated_at?: string;
          id: string;
          metric: string;
          payload: Json;
          scope: string;
          term?: number | null;
        };
        Update: {
          generated_at?: string;
          id?: string;
          metric?: string;
          payload?: Json;
          scope?: string;
          term?: number | null;
        };
        Relationships: [];
      };
      game_rewards: {
        Row: {
          awarded_at: string;
          base_mc: number;
          description: string;
          exp: number;
          mc: number;
          multiplier: number;
          quiz_id: string | null;
          reason: string;
          source_key: string;
          student_id: string;
        };
        Insert: {
          awarded_at?: string;
          base_mc: number;
          description?: string;
          exp?: number;
          mc: number;
          multiplier?: number;
          quiz_id?: string | null;
          reason: string;
          source_key: string;
          student_id: string;
        };
        Update: {
          awarded_at?: string;
          base_mc?: number;
          description?: string;
          exp?: number;
          mc?: number;
          multiplier?: number;
          quiz_id?: string | null;
          reason?: string;
          source_key?: string;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "game_rewards_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      game_snapshots: {
        Row: {
          generated_at: string;
          math_set: string;
          payload: Json;
          student_id: string;
        };
        Insert: {
          generated_at?: string;
          math_set: string;
          payload: Json;
          student_id: string;
        };
        Update: {
          generated_at?: string;
          math_set?: string;
          payload?: Json;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "game_snapshots_student_id_fkey";
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
      homework_checks: {
        Row: {
          homework_id: string;
          status: string;
          student_id: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          homework_id: string;
          status: string;
          student_id: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          homework_id?: string;
          status?: string;
          student_id?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      mistakes: {
        Row: {
          chapter: number;
          created_at: string;
          error_type: string;
          id: string;
          image_path: string | null;
          question: string;
          solution: string;
          status: string;
          student_id: string;
          updated_at: string;
        };
        Insert: {
          chapter: number;
          created_at?: string;
          error_type: string;
          id?: string;
          image_path?: string | null;
          question?: string;
          solution?: string;
          status?: string;
          student_id: string;
          updated_at?: string;
        };
        Update: {
          chapter?: number;
          created_at?: string;
          error_type?: string;
          id?: string;
          image_path?: string | null;
          question?: string;
          solution?: string;
          status?: string;
          student_id?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "mistakes_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
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
      subject_captains: {
        Row: {
          appointed_at: string;
          appointed_by: string | null;
          student_id: string;
        };
        Insert: {
          appointed_at?: string;
          appointed_by?: string | null;
          student_id: string;
        };
        Update: {
          appointed_at?: string;
          appointed_by?: string | null;
          student_id?: string;
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
      shop_items: {
        Row: {
          active: boolean;
          description: string;
          emoji: string;
          grants: string[];
          id: string;
          ink: string;
          kind: string;
          name: string;
          paper: string;
          position: number;
          price: number;
          style: string | null;
        };
        Insert: {
          active?: boolean;
          description?: string;
          emoji?: string;
          grants: string[];
          id: string;
          ink?: string;
          kind?: string;
          name: string;
          paper?: string;
          position?: number;
          price: number;
          style?: string | null;
        };
        Update: {
          active?: boolean;
          description?: string;
          emoji?: string;
          grants?: string[];
          id?: string;
          ink?: string;
          kind?: string;
          name?: string;
          paper?: string;
          position?: number;
          price?: number;
          style?: string | null;
        };
        Relationships: [];
      };
      badge_defs: {
        Row: {
          bronze: number;
          description: string;
          diamond: number;
          emoji: string;
          gold: number;
          id: string;
          name: string;
          position: number;
          published: boolean;
          silver: number;
          unit: string;
        };
        Insert: {
          bronze: number;
          description?: string;
          diamond: number;
          emoji: string;
          gold: number;
          id: string;
          name: string;
          position?: number;
          published?: boolean;
          silver: number;
          unit: string;
        };
        Update: {
          bronze?: number;
          description?: string;
          diamond?: number;
          emoji?: string;
          gold?: number;
          id?: string;
          name?: string;
          position?: number;
          published?: boolean;
          silver?: number;
          unit?: string;
        };
        Relationships: [];
      };
      badge_days: {
        Row: {
          badge_id: string;
          day: string;
          student_id: string;
        };
        Insert: {
          badge_id: string;
          day: string;
          student_id: string;
        };
        Update: {
          badge_id?: string;
          day?: string;
          student_id?: string;
        };
        Relationships: [];
      };
      shop_purchases: {
        Row: {
          item_id: string;
          price: number;
          purchased_at: string;
          student_id: string;
        };
        Insert: {
          item_id: string;
          price: number;
          purchased_at?: string;
          student_id: string;
        };
        Update: {
          item_id?: string;
          price?: number;
          purchased_at?: string;
          student_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "shop_purchases_item_id_fkey";
            columns: ["item_id"];
            isOneToOne: false;
            referencedRelation: "shop_items";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "shop_purchases_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
      };
      student_cosmetics: {
        Row: {
          avatar_id: string;
          frame_id: string | null;
          student_id: string;
          title_id: string | null;
          title_id_2: string | null;
          updated_at: string;
        };
        Insert: {
          avatar_id?: string;
          frame_id?: string | null;
          student_id: string;
          title_id?: string | null;
          title_id_2?: string | null;
          updated_at?: string;
        };
        Update: {
          avatar_id?: string;
          frame_id?: string | null;
          student_id?: string;
          title_id?: string | null;
          title_id_2?: string | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "student_cosmetics_student_id_fkey";
            columns: ["student_id"];
            isOneToOne: false;
            referencedRelation: "students";
            referencedColumns: ["id"];
          },
        ];
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
          leaderboard_show_all: boolean;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          double_mc_event_active?: boolean;
          id?: boolean;
          leaderboard_show_all?: boolean;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          double_mc_event_active?: boolean;
          id?: boolean;
          leaderboard_show_all?: boolean;
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
          checkin_earned: number | null;
          daily_earned: number | null;
          reward_earned: number | null;
          shop_spent: number | null;
          spent: number | null;
          student_id: string | null;
          video_earned: number | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      buy_shop_item: { Args: { _item_id: string }; Returns: undefined };
      captain_classmates: {
        Args: never;
        Returns: {
          class_name: string;
          class_no: string;
          id: string;
          math_set: string;
          name: string;
        }[];
      };
      grant_homework_streak: {
        Args: {
          _description: string;
          _homework_id: string;
          _multiplier: number;
          _student_id: string;
        };
        Returns: undefined;
      };
      claim_student: { Args: never; Returns: undefined };
      complete_chapter_video: { Args: { _video_id: string }; Returns: boolean };
      complete_video: { Args: { _chapter: number }; Returns: undefined };
      equip_cosmetics: {
        Args: {
          _avatar: string;
          _frame: string | null;
          _title: string | null;
          _title2: string | null;
        };
        Returns: undefined;
      };
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"];
          _user_id: string;
        };
        Returns: boolean;
      };
      is_demo_user: { Args: never; Returns: boolean };
      redeem_reward: { Args: { _reward_id: string }; Returns: string };
      submit_daily_checkin: { Args: { _question_id: string; _correct: boolean }; Returns: number };
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
