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
      client_deliverables: {
        Row: {
          created_at: string
          download_count: number
          event_id: string
          file_name: string
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          is_approved: boolean
          is_watermarked: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          download_count?: number
          event_id: string
          file_name: string
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          is_approved?: boolean
          is_watermarked?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          download_count?: number
          event_id?: string
          file_name?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          is_approved?: boolean
          is_watermarked?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      client_feedback: {
        Row: {
          created_at: string
          deliverable_id: string | null
          event_id: string
          feedback_text: string | null
          id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          deliverable_id?: string | null
          event_id: string
          feedback_text?: string | null
          id?: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          deliverable_id?: string | null
          event_id?: string
          feedback_text?: string | null
          id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_feedback_deliverable_id_fkey"
            columns: ["deliverable_id"]
            isOneToOne: false
            referencedRelation: "client_deliverables"
            referencedColumns: ["id"]
          },
        ]
      }
      client_portal_access: {
        Row: {
          access_code: string
          client_email: string | null
          client_name: string
          created_at: string
          event_id: string
          expires_at: string | null
          id: string
          is_active: boolean
          password_hash: string | null
          updated_at: string
        }
        Insert: {
          access_code: string
          client_email?: string | null
          client_name: string
          created_at?: string
          event_id: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          password_hash?: string | null
          updated_at?: string
        }
        Update: {
          access_code?: string
          client_email?: string | null
          client_name?: string
          created_at?: string
          event_id?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          password_hash?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      companies: {
        Row: {
          address: string | null
          city: string | null
          country: string | null
          created_at: string
          email: string | null
          gst_number: string | null
          id: string
          logo_url: string | null
          name: string
          phone: string | null
          pincode: string | null
          state: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          gst_number?: string | null
          id?: string
          logo_url?: string | null
          name: string
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          email?: string | null
          gst_number?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          phone?: string | null
          pincode?: string | null
          state?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      faces: {
        Row: {
          bounding_box: Json | null
          created_at: string
          embedding: Json | null
          id: string
          person_name: string | null
          photo_id: string
          updated_at: string
        }
        Insert: {
          bounding_box?: Json | null
          created_at?: string
          embedding?: Json | null
          id?: string
          person_name?: string | null
          photo_id: string
          updated_at?: string
        }
        Update: {
          bounding_box?: Json | null
          created_at?: string
          embedding?: Json | null
          id?: string
          person_name?: string | null
          photo_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "faces_photo_id_fkey"
            columns: ["photo_id"]
            isOneToOne: false
            referencedRelation: "photos"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      finance_subcategories: {
        Row: {
          category_id: string
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          category_id: string
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          category_id?: string
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "finance_subcategories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "finance_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_transactions: {
        Row: {
          amount: number
          category_id: string
          created_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          payment_method: string | null
          source_id: string | null
          source_type: string | null
          subcategory_id: string | null
          transaction_date: string
          transaction_type: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          category_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          source_id?: string | null
          source_type?: string | null
          subcategory_id?: string | null
          transaction_date: string
          transaction_type: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          category_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          payment_method?: string | null
          source_id?: string | null
          source_type?: string | null
          subcategory_id?: string | null
          transaction_date?: string
          transaction_type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "finance_transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "finance_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "finance_transactions_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "finance_subcategories"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: string
          balance_amount: string
          client: string
          client_email: string | null
          created_at: string
          date: string
          display_number: string | null
          estimate_id: string | null
          gst_rate: string | null
          id: string
          items: Json
          notes: string | null
          paid_amount: string
          payment_date: string | null
          payment_method: string | null
          payments: Json | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: string
          balance_amount?: string
          client: string
          client_email?: string | null
          created_at?: string
          date: string
          display_number?: string | null
          estimate_id?: string | null
          gst_rate?: string | null
          id?: string
          items?: Json
          notes?: string | null
          paid_amount?: string
          payment_date?: string | null
          payment_method?: string | null
          payments?: Json | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: string
          balance_amount?: string
          client?: string
          client_email?: string | null
          created_at?: string
          date?: string
          display_number?: string | null
          estimate_id?: string | null
          gst_rate?: string | null
          id?: string
          items?: Json
          notes?: string | null
          paid_amount?: string
          payment_date?: string | null
          payment_method?: string | null
          payments?: Json | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      photo_galleries: {
        Row: {
          client_name: string
          created_at: string
          event_id: string
          id: string
          is_folder: boolean | null
          name: string
          parent_id: string | null
          updated_at: string
        }
        Insert: {
          client_name: string
          created_at?: string
          event_id: string
          id?: string
          is_folder?: boolean | null
          name: string
          parent_id?: string | null
          updated_at?: string
        }
        Update: {
          client_name?: string
          created_at?: string
          event_id?: string
          id?: string
          is_folder?: boolean | null
          name?: string
          parent_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "photo_galleries_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "photo_galleries"
            referencedColumns: ["id"]
          },
        ]
      }
      photos: {
        Row: {
          created_at: string
          favorite: boolean
          gallery_id: string
          id: string
          selected: boolean
          thumbnail: string
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          favorite?: boolean
          gallery_id: string
          id?: string
          selected?: boolean
          thumbnail: string
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          favorite?: boolean
          gallery_id?: string
          id?: string
          selected?: boolean
          thumbnail?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "photos_gallery_id_fkey"
            columns: ["gallery_id"]
            isOneToOne: false
            referencedRelation: "photo_galleries"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          plan_type: string | null
          storage_limit: number | null
          storage_used: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          plan_type?: string | null
          storage_limit?: number | null
          storage_used?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          plan_type?: string | null
          storage_limit?: number | null
          storage_used?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      realtime_messages: {
        Row: {
          created_at: string
          id: string
          message: string
          user_id: string
          user_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          user_id: string
          user_name: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          user_id?: string
          user_name?: string
        }
        Relationships: []
      }
      recognized_people: {
        Row: {
          created_at: string
          gallery_id: string
          id: string
          name: string
          reference_photo_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          gallery_id: string
          id?: string
          name: string
          reference_photo_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          gallery_id?: string
          id?: string
          name?: string
          reference_photo_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recognized_people_gallery_id_fkey"
            columns: ["gallery_id"]
            isOneToOne: false
            referencedRelation: "photo_galleries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recognized_people_reference_photo_id_fkey"
            columns: ["reference_photo_id"]
            isOneToOne: false
            referencedRelation: "photos"
            referencedColumns: ["id"]
          },
        ]
      }
      scheduled_events: {
        Row: {
          assignments: Json
          clientemail: string | null
          clientname: string
          clientphone: string
          clientrequirements: string | null
          created_at: string
          datacopied: boolean | null
          date: string
          deliverables: Json | null
          endtime: string
          estimateid: string
          estimatepackage: string | null
          guestcount: string | null
          id: string
          location: string
          name: string
          notes: string | null
          photographerscount: number
          reference_images: string[] | null
          stage: string
          starttime: string
          timetracking: Json | null
          updated_at: string
          videographerscount: number
        }
        Insert: {
          assignments?: Json
          clientemail?: string | null
          clientname: string
          clientphone: string
          clientrequirements?: string | null
          created_at?: string
          datacopied?: boolean | null
          date: string
          deliverables?: Json | null
          endtime: string
          estimateid: string
          estimatepackage?: string | null
          guestcount?: string | null
          id: string
          location: string
          name: string
          notes?: string | null
          photographerscount: number
          reference_images?: string[] | null
          stage: string
          starttime: string
          timetracking?: Json | null
          updated_at?: string
          videographerscount: number
        }
        Update: {
          assignments?: Json
          clientemail?: string | null
          clientname?: string
          clientphone?: string
          clientrequirements?: string | null
          created_at?: string
          datacopied?: boolean | null
          date?: string
          deliverables?: Json | null
          endtime?: string
          estimateid?: string
          estimatepackage?: string | null
          guestcount?: string | null
          id?: string
          location?: string
          name?: string
          notes?: string | null
          photographerscount?: number
          reference_images?: string[] | null
          stage?: string
          starttime?: string
          timetracking?: Json | null
          updated_at?: string
          videographerscount?: number
        }
        Relationships: []
      }
      settings: {
        Row: {
          created_at: string | null
          id: number
          settings: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: number
          settings?: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          settings?: Json
          updated_at?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          availability: Json | null
          created_at: string
          email: string | null
          id: string
          is_freelancer: boolean | null
          name: string
          phone: string | null
          role: string
          updated_at: string
          whatsapp: string | null
        }
        Insert: {
          availability?: Json | null
          created_at?: string
          email?: string | null
          id?: string
          is_freelancer?: boolean | null
          name: string
          phone?: string | null
          role: string
          updated_at?: string
          whatsapp?: string | null
        }
        Update: {
          availability?: Json | null
          created_at?: string
          email?: string | null
          id?: string
          is_freelancer?: boolean | null
          name?: string
          phone?: string | null
          role?: string
          updated_at?: string
          whatsapp?: string | null
        }
        Relationships: []
      }
      vendors: {
        Row: {
          address: string | null
          contact_person: string | null
          created_at: string
          email: string | null
          gst_number: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          service_type: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          gst_number?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          service_type?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          contact_person?: string | null
          created_at?: string
          email?: string | null
          gst_number?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          service_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_user_profile: {
        Args: Record<PropertyKey, never> | { profile_data: Json }
        Returns: undefined
      }
      get_user_profile: {
        Args: Record<PropertyKey, never> | { user_id: string }
        Returns: {
          id: string
          email: string
          full_name: string
          avatar_url: string
          storage_used: number
          storage_limit: number
          plan_type: string
          created_at: string
          updated_at: string
        }[]
      }
      update_user_profile: {
        Args: { profile_id: string; updates: Json }
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
    Enums: {},
  },
} as const
