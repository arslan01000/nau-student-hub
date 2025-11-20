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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      playbooks: {
        Row: {
          author_grad_year: string | null
          author_id: string
          author_major: string | null
          author_name: string
          body: string
          created_at: string
          description: string
          external_links: string[] | null
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          tags: string[]
          title: string
          updated_at: string
          views: number
        }
        Insert: {
          author_grad_year?: string | null
          author_id: string
          author_major?: string | null
          author_name: string
          body: string
          created_at?: string
          description: string
          external_links?: string[] | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          tags: string[]
          title: string
          updated_at?: string
          views?: number
        }
        Update: {
          author_grad_year?: string | null
          author_id?: string
          author_major?: string | null
          author_name?: string
          body?: string
          created_at?: string
          description?: string
          external_links?: string[] | null
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          tags?: string[]
          title?: string
          updated_at?: string
          views?: number
        }
        Relationships: []
      }
      posts: {
        Row: {
          category: Database["public"]["Enums"]["post_category"]
          content: string
          created_at: string | null
          id: string
          is_anonymous: boolean | null
          title: string
          upvotes: number | null
          user_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["post_category"]
          content: string
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          title: string
          upvotes?: number | null
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["post_category"]
          content?: string
          created_at?: string | null
          id?: string
          is_anonymous?: boolean | null
          title?: string
          upvotes?: number | null
          user_id?: string
        }
        Relationships: []
      }
      professors: {
        Row: {
          created_at: string
          department: string
          full_name: string
          id: string
          school: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department: string
          full_name: string
          id?: string
          school?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string
          full_name?: string
          id?: string
          school?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          display_name: string | null
          id: string
          username: string
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          id: string
          username: string
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          id?: string
          username?: string
        }
        Relationships: []
      }
      replies: {
        Row: {
          content: string
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts_view"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          course_code: string
          created_at: string | null
          difficulty_rating: number | null
          grade_received: string | null
          id: string
          is_anonymous: boolean | null
          overall_rating: number | null
          professor_id: string | null
          professor_name: string
          rating: number
          text: string
          user_id: string
          would_take_again: boolean | null
        }
        Insert: {
          course_code: string
          created_at?: string | null
          difficulty_rating?: number | null
          grade_received?: string | null
          id?: string
          is_anonymous?: boolean | null
          overall_rating?: number | null
          professor_id?: string | null
          professor_name: string
          rating: number
          text: string
          user_id: string
          would_take_again?: boolean | null
        }
        Update: {
          course_code?: string
          created_at?: string | null
          difficulty_rating?: number | null
          grade_received?: string | null
          id?: string
          is_anonymous?: boolean | null
          overall_rating?: number | null
          professor_id?: string | null
          professor_name?: string
          rating?: number
          text?: string
          user_id?: string
          would_take_again?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_professor_id_fkey"
            columns: ["professor_id"]
            isOneToOne: false
            referencedRelation: "professors"
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
    }
    Views: {
      posts_view: {
        Row: {
          category: Database["public"]["Enums"]["post_category"] | null
          content: string | null
          created_at: string | null
          id: string | null
          is_anonymous: boolean | null
          title: string | null
          upvotes: number | null
          user_id: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["post_category"] | null
          content?: string | null
          created_at?: string | null
          id?: string | null
          is_anonymous?: boolean | null
          title?: string | null
          upvotes?: number | null
          user_id?: never
        }
        Update: {
          category?: Database["public"]["Enums"]["post_category"] | null
          content?: string | null
          created_at?: string | null
          id?: string | null
          is_anonymous?: boolean | null
          title?: string | null
          upvotes?: number | null
          user_id?: never
        }
        Relationships: []
      }
      reviews_view: {
        Row: {
          course_code: string | null
          created_at: string | null
          id: string | null
          is_anonymous: boolean | null
          professor_name: string | null
          rating: number | null
          text: string | null
          user_id: string | null
        }
        Insert: {
          course_code?: string | null
          created_at?: string | null
          id?: string | null
          is_anonymous?: boolean | null
          professor_name?: string | null
          rating?: number | null
          text?: string | null
          user_id?: never
        }
        Update: {
          course_code?: string | null
          created_at?: string | null
          id?: string | null
          is_anonymous?: boolean | null
          professor_name?: string | null
          rating?: number | null
          text?: string | null
          user_id?: never
        }
        Relationships: []
      }
    }
    Functions: {
      create_post: {
        Args: {
          p_category: Database["public"]["Enums"]["post_category"]
          p_content: string
          p_is_anonymous?: boolean
          p_title: string
        }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_playbook_views: {
        Args: { playbook_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      post_category:
        | "professors"
        | "courses"
        | "internships"
        | "opt_cpt"
        | "campus_life"
        | "buy_sell"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
      post_category: [
        "professors",
        "courses",
        "internships",
        "opt_cpt",
        "campus_life",
        "buy_sell",
      ],
    },
  },
} as const
