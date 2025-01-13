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
      blogs: {
        Row: {
          author: string | null
          content: string
          coverimage: string | null
          created_at: string | null
          excerpt: string | null
          id: string
          image_url: string | null
          published: boolean | null
          publishedat: string | null
          slug: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author?: string | null
          content: string
          coverimage?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          publishedat?: string | null
          slug?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author?: string | null
          content?: string
          coverimage?: string | null
          created_at?: string | null
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published?: boolean | null
          publishedat?: string | null
          slug?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
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
          title?: string
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
      page_views: {
        Row: {
          id: string
          path: string
          user_agent: string | null
          referrer: string | null
          timestamp: string
          session_id: string | null
          user_id: string | null
          ip_address: string | null
          country: string | null
          device_type: string | null
          browser: string | null
        }
        Insert: {
          id?: string
          path: string
          user_agent?: string | null
          referrer?: string | null
          timestamp?: string
          session_id?: string | null
          user_id?: string | null
          ip_address?: string | null
          country?: string | null
          device_type?: string | null
          browser?: string | null
        }
        Update: {
          id?: string
          path?: string
          user_agent?: string | null
          referrer?: string | null
          timestamp?: string
          session_id?: string | null
          user_id?: string | null
          ip_address?: string | null
          country?: string | null
          device_type?: string | null
          browser?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "page_views_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      blog_analytics: {
        Row: {
          id: string
          blog_id: string
          views: number
          unique_views: number
          likes: number
          comments: number
          avg_time_on_page: string | null
          bounce_rate: number | null
          last_updated: string
        }
        Insert: {
          id?: string
          blog_id: string
          views?: number
          unique_views?: number
          likes?: number
          comments?: number
          avg_time_on_page?: string | null
          bounce_rate?: number | null
          last_updated?: string
        }
        Update: {
          id?: string
          blog_id?: string
          views?: number
          unique_views?: number
          likes?: number
          comments?: number
          avg_time_on_page?: string | null
          bounce_rate?: number | null
          last_updated?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_analytics_blog_id_fkey"
            columns: ["blog_id"]
            referencedRelation: "blogs"
            referencedColumns: ["id"]
          }
        ]
      }
      events: {
        Row: {
          id: string
          event_name: string
          properties: Json
          timestamp: string
          session_id: string | null
          user_id: string | null
          page_path: string | null
        }
        Insert: {
          id?: string
          event_name: string
          properties?: Json
          timestamp?: string
          session_id?: string | null
          user_id?: string | null
          page_path?: string | null
        }
        Update: {
          id?: string
          event_name?: string
          properties?: Json
          timestamp?: string
          session_id?: string | null
          user_id?: string | null
          page_path?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_analytics_access: {
        Args: Record<string, never>;
        Returns: {
          can_view: boolean;
          can_edit: boolean;
        }[];
      };
      get_dashboard_analytics: {
        Args: {
          start_date: string;
          end_date: string;
        };
        Returns: {
          visitorTrends: {
            dates: string[];
            visitors: number[];
            pageViews: number[];
          };
          blogPerformance: Array<{
            title: string;
            views: number;
            likes: number;
            comments: number;
          }>;
          deviceStats: {
            desktop: number;
            mobile: number;
            tablet: number;
          };
        };
      };
      get_blog_performance: {
        Args: Record<string, never>;
        Returns: Array<{
          title: string;
          views: number;
          likes: number;
          comments: number;
        }>;
      };
      get_geo_stats: {
        Args: Record<string, never>;
        Returns: Array<{
          country: string;
          value: number;
          code: string;
          trend: number;
        }>;
      };
      get_device_stats: {
        Args: Record<string, never>;
        Returns: {
          desktop: number;
          mobile: number;
          tablet: number;
        };
      };
    };
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
    : never = never,
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
