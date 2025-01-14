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
      admin_users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          last_login: string | null
          password_hash: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          last_login?: string | null
          password_hash: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          last_login?: string | null
          password_hash?: string
        }
        Relationships: []
      }
      blog_analytics: {
        Row: {
          avg_time_on_page: unknown | null
          blog_id: string | null
          bounce_rate: number | null
          comments: number | null
          id: string
          last_updated: string | null
          likes: number | null
          unique_views: number | null
          views: number | null
        }
        Insert: {
          avg_time_on_page?: unknown | null
          blog_id?: string | null
          bounce_rate?: number | null
          comments?: number | null
          id?: string
          last_updated?: string | null
          likes?: number | null
          unique_views?: number | null
          views?: number | null
        }
        Update: {
          avg_time_on_page?: unknown | null
          blog_id?: string | null
          bounce_rate?: number | null
          comments?: number | null
          id?: string
          last_updated?: string | null
          likes?: number | null
          unique_views?: number | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_analytics_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_bookmarks: {
        Row: {
          blog_id: string | null
          created_at: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          blog_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          blog_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_bookmarks_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_comments: {
        Row: {
          author_id: string | null
          author_name: string
          blog_id: string | null
          content: string
          created_at: string | null
          id: string
          likes: number | null
          parent_id: string | null
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          author_name: string
          blog_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          likes?: number | null
          parent_id?: string | null
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          author_name?: string
          blog_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          likes?: number | null
          parent_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_likes: {
        Row: {
          blog_id: string
          created_at: string | null
          user_id: string
        }
        Insert: {
          blog_id: string
          created_at?: string | null
          user_id: string
        }
        Update: {
          blog_id?: string
          created_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_likes_blog_id_fkey"
            columns: ["blog_id"]
            isOneToOne: false
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          },
        ]
      }
      blogs: {
        Row: {
          author: string | null
          author_avatar: string | null
          category: string | null
          comment_count: number | null
          content: string
          coverimage: string | null
          created_at: string | null
          excerpt: string | null
          hasliked: boolean | null
          id: string
          image_url: string | null
          like_count: number | null
          likes: number | null
          published: boolean | null
          publishedat: string | null
          reading_time: string | null
          slug: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          view_count: number | null
          viewcount: number | null
        }
        Insert: {
          author?: string | null
          author_avatar?: string | null
          category?: string | null
          comment_count?: number | null
          content: string
          coverimage?: string | null
          created_at?: string | null
          excerpt?: string | null
          hasliked?: boolean | null
          id?: string
          image_url?: string | null
          like_count?: number | null
          likes?: number | null
          published?: boolean | null
          publishedat?: string | null
          reading_time?: string | null
          slug?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          view_count?: number | null
          viewcount?: number | null
        }
        Update: {
          author?: string | null
          author_avatar?: string | null
          category?: string | null
          comment_count?: number | null
          content?: string
          coverimage?: string | null
          created_at?: string | null
          excerpt?: string | null
          hasliked?: boolean | null
          id?: string
          image_url?: string | null
          like_count?: number | null
          likes?: number | null
          published?: boolean | null
          publishedat?: string | null
          reading_time?: string | null
          slug?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
          viewcount?: number | null
        }
        Relationships: []
      }
      comment_likes: {
        Row: {
          comment_id: string
          created_at: string | null
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string | null
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "blog_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_submissions: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          read: boolean | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          read?: boolean | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          read?: boolean | null
        }
        Relationships: []
      }
      education: {
        Row: {
          created_at: string | null
          degree: string
          id: string
          institution: string
          type: string
          updated_at: string | null
          year_end: string | null
          year_start: string
        }
        Insert: {
          created_at?: string | null
          degree: string
          id?: string
          institution: string
          type: string
          updated_at?: string | null
          year_end?: string | null
          year_start: string
        }
        Update: {
          created_at?: string | null
          degree?: string
          id?: string
          institution?: string
          type?: string
          updated_at?: string | null
          year_end?: string | null
          year_start?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          event_name: string
          id: string
          page_path: string | null
          properties: Json | null
          session_id: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          event_name: string
          id?: string
          page_path?: string | null
          properties?: Json | null
          session_id?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          event_name?: string
          id?: string
          page_path?: string | null
          properties?: Json | null
          session_id?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      experiences: {
        Row: {
          achievements: string[] | null
          color: string | null
          company: string
          created_at: string | null
          description: string
          icon_key: string | null
          id: string
          technologies: string[] | null
          title: string
          updated_at: string | null
          year: string
        }
        Insert: {
          achievements?: string[] | null
          color?: string | null
          company: string
          created_at?: string | null
          description: string
          icon_key?: string | null
          id?: string
          technologies?: string[] | null
          title: string
          updated_at?: string | null
          year: string
        }
        Update: {
          achievements?: string[] | null
          color?: string | null
          company?: string
          created_at?: string | null
          description?: string
          icon_key?: string | null
          id?: string
          technologies?: string[] | null
          title?: string
          updated_at?: string | null
          year?: string
        }
        Relationships: []
      }
      page_views: {
        Row: {
          browser: string | null
          country: string | null
          device_type: string | null
          id: string
          ip_address: string | null
          path: string
          referrer: string | null
          session_id: string | null
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          browser?: string | null
          country?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          path: string
          referrer?: string | null
          session_id?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          browser?: string | null
          country?: string | null
          device_type?: string | null
          id?: string
          ip_address?: string | null
          path?: string
          referrer?: string | null
          session_id?: string | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profile_data: {
        Row: {
          about_text: string | null
          id: string
          profile_image_url: string | null
          resume_url: string | null
          updated_at: string | null
        }
        Insert: {
          about_text?: string | null
          id?: string
          profile_image_url?: string | null
          resume_url?: string | null
          updated_at?: string | null
        }
        Update: {
          about_text?: string | null
          id?: string
          profile_image_url?: string | null
          resume_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          category: string
          created_at: string | null
          demo_link: string | null
          description: string | null
          github_link: string | null
          id: string
          image_url: string | null
          live_link: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          demo_link?: string | null
          description?: string | null
          github_link?: string | null
          id?: string
          image_url?: string | null
          live_link?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          demo_link?: string | null
          description?: string | null
          github_link?: string | null
          id?: string
          image_url?: string | null
          live_link?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Relationships: []
      }
      skills: {
        Row: {
          category: string
          created_at: string | null
          id: string
          name: string
          proficiency_level: number | null
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          id?: string
          name: string
          proficiency_level?: number | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          id?: string
          name?: string
          proficiency_level?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      technical_proficiency: {
        Row: {
          created_at: string | null
          id: string
          proficiency: number
          skill: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          proficiency: number
          skill: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          proficiency?: number
          skill?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      technical_skills: {
        Row: {
          category: string
          created_at: string | null
          icon_key: string
          id: string
          skills: string[]
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          icon_key?: string
          id?: string
          skills?: string[]
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          icon_key?: string
          id?: string
          skills?: string[]
          updated_at?: string | null
        }
        Relationships: []
      }
      visitors: {
        Row: {
          browser: string | null
          city: string | null
          country: string | null
          device_type: string | null
          first_seen: string | null
          id: string
          last_seen: string | null
          os: string | null
          session_id: string | null
          user_id: string | null
          visit_count: number | null
        }
        Insert: {
          browser?: string | null
          city?: string | null
          country?: string | null
          device_type?: string | null
          first_seen?: string | null
          id?: string
          last_seen?: string | null
          os?: string | null
          session_id?: string | null
          user_id?: string | null
          visit_count?: number | null
        }
        Update: {
          browser?: string | null
          city?: string | null
          country?: string | null
          device_type?: string | null
          first_seen?: string | null
          id?: string
          last_seen?: string | null
          os?: string | null
          session_id?: string | null
          user_id?: string | null
          visit_count?: number | null
        }
        Relationships: []
      }
      hobbies: {
        Row: {
          id: string
          name: string
          category: string
          icon_key: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          category: string
          icon_key?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          category?: string
          icon_key?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_analytics_access: {
        Args: Record<PropertyKey, never>
        Returns: {
          can_view: boolean
          can_edit: boolean
        }[]
      }
      get_blog_performance: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_dashboard_analytics: {
        Args: {
          start_date: string
          end_date: string
        }
        Returns: Json
      }
      get_device_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      get_geo_stats: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      increment_blog_view_count: {
        Args: {
          blog_id: string
        }
        Returns: undefined
      }
      increment_comment_count: {
        Args: {
          post_id: string
        }
        Returns: undefined
      }
      increment_view_count: {
        Args: {
          post_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
