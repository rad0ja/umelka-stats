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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      chat_messages: {
        Row: {
          id: string
          user_id: string
          content: string
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      event_participants: {
        Row: {
          created_at: string | null
          event_id: string | null
          id: string
          status: Database["public"]["Enums"]["participation_status"]
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          status: Database["public"]["Enums"]["participation_status"]
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_id?: string | null
          id?: string
          status?: Database["public"]["Enums"]["participation_status"]
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_participants_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "player_users_view"
            referencedColumns: ["user_id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string | null
          id: string
          max_players: number
          start_time: string
          title: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          max_players: number
          start_time: string
          title: string
        }
        Update: {
          created_at?: string | null
          id?: string
          max_players?: number
          start_time?: string
          title?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          id: string
          message: string
          name: string | null
          submitted_at: string | null
        }
        Insert: {
          id?: string
          message: string
          name?: string | null
          submitted_at?: string | null
        }
        Update: {
          id?: string
          message?: string
          name?: string | null
          submitted_at?: string | null
        }
        Relationships: []
      }
      matches: {
        Row: {
          date: string
          goals: Json
          id: string
          score_a: number
          score_b: number
          season_id: number | null
          team_a: string[]
          team_b: string[]
        }
        Insert: {
          date: string
          goals: Json
          id?: string
          score_a: number
          score_b: number
          season_id?: number | null
          team_a: string[]
          team_b: string[]
        }
        Update: {
          date?: string
          goals?: Json
          id?: string
          score_a?: number
          score_b?: number
          season_id?: number | null
          team_a?: string[]
          team_b?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "matches_season_id_fkey"
            columns: ["season_id"]
            isOneToOne: false
            referencedRelation: "seasons"
            referencedColumns: ["id"]
          },
        ]
      }
      player_creation_errors: {
        Row: {
          error_detail: string | null
          error_message: string | null
          id: string
          occurred_at: string | null
          user_email: string | null
          user_id: string | null
          user_metadata: Json | null
        }
        Insert: {
          error_detail?: string | null
          error_message?: string | null
          id?: string
          occurred_at?: string | null
          user_email?: string | null
          user_id?: string | null
          user_metadata?: Json | null
        }
        Update: {
          error_detail?: string | null
          error_message?: string | null
          id?: string
          occurred_at?: string | null
          user_email?: string | null
          user_id?: string | null
          user_metadata?: Json | null
        }
        Relationships: []
      }
      players: {
        Row: {
          goal_target: number | null
          id: string
          name: string
          user_id: string | null
        }
        Insert: {
          goal_target?: number | null
          id?: string
          name: string
          user_id?: string | null
        }
        Update: {
          goal_target?: number | null
          id?: string
          name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "players_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "player_users_view"
            referencedColumns: ["user_id"]
          },
        ]
      }
      push_subscriptions: {
        Row: {
          created_at: string | null
          id: string
          subscription: Json
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          subscription: Json
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          subscription?: Json
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "push_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "players"
            referencedColumns: ["id"]
          },
        ]
      }
      seasons: {
        Row: {
          end_date: string | null
          id: number
          name: string
          start_date: string | null
        }
        Insert: {
          end_date?: string | null
          id?: number
          name: string
          start_date?: string | null
        }
        Update: {
          end_date?: string | null
          id?: number
          name?: string
          start_date?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      player_users_view: {
        Row: {
          email: string | null
          user_id: string | null
        }
        Insert: {
          email?: string | null
          user_id?: string | null
        }
        Update: {
          email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      join_event: {
        Args: {
          p_event_id: string
          p_status: Database["public"]["Enums"]["participation_status"]
          p_user_id: string
        }
        Returns: Database["public"]["Enums"]["participation_status"]
      }
    }
    Enums: {
      participation_status: "yes" | "tentative" | "no" | "queued"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      participation_status: ["yes", "tentative", "no", "queued"],
    },
  },
} as const
