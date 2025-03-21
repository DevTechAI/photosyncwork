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
