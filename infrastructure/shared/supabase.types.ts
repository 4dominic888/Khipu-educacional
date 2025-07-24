export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          operationName?: string
          extensions?: Json
          variables?: Json
          query?: string
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
      acquisition: {
        Row: {
          date: string
          id: string
          number: string
          price: number
          type: string
        }
        Insert: {
          date: string
          id?: string
          number: string
          price: number
          type: string
        }
        Update: {
          date?: string
          id?: string
          number?: string
          price?: number
          type?: string
        }
        Relationships: []
      }
      catalog_item: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      inventory_group: {
        Row: {
          description: string | null
          id: string
          name: string
          period: string
          updated_at: string | null
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
          period: string
          updated_at?: string | null
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
          period?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_group_period_fkey"
            columns: ["period"]
            isOneToOne: false
            referencedRelation: "period_time"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_item: {
        Row: {
          catalog_item_id: string
          group_id: string
          id: string
          total: number
          updated_at: string | null
        }
        Insert: {
          catalog_item_id: string
          group_id: string
          id?: string
          total: number
          updated_at?: string | null
        }
        Update: {
          catalog_item_id?: string
          group_id?: string
          id?: string
          total?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_item_catalog_item_id_fkey"
            columns: ["catalog_item_id"]
            isOneToOne: false
            referencedRelation: "catalog_item"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_item_catalog_item_id_fkey"
            columns: ["catalog_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_item_summary"
            referencedColumns: ["catalog_item_id"]
          },
          {
            foreignKeyName: "inventory_item_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "inventory_group"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_item_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "inventory_group_info"
            referencedColumns: ["id"]
          },
        ]
      }
      period_time: {
        Row: {
          description: string | null
          id: string
          name: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      variant_inventory_item: {
        Row: {
          acquisition_id: string
          brand: string | null
          caracteristic: string | null
          color: string
          conservation_status: string
          count: number
          height: number
          id: string
          images: string[] | null
          inventory_item_id: string
          length: number
          model: string | null
          notes: string | null
          serial_number: string | null
          updated_at: string | null
          width: number
        }
        Insert: {
          acquisition_id: string
          brand?: string | null
          caracteristic?: string | null
          color: string
          conservation_status: string
          count: number
          height: number
          id?: string
          images?: string[] | null
          inventory_item_id: string
          length: number
          model?: string | null
          notes?: string | null
          serial_number?: string | null
          updated_at?: string | null
          width: number
        }
        Update: {
          acquisition_id?: string
          brand?: string | null
          caracteristic?: string | null
          color?: string
          conservation_status?: string
          count?: number
          height?: number
          id?: string
          images?: string[] | null
          inventory_item_id?: string
          length?: number
          model?: string | null
          notes?: string | null
          serial_number?: string | null
          updated_at?: string | null
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: "variant_inventory_item_acquisition_id_fkey"
            columns: ["acquisition_id"]
            isOneToOne: true
            referencedRelation: "acquisition"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "variant_inventory_item_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_item"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "variant_inventory_item_inventory_item_id_fkey"
            columns: ["inventory_item_id"]
            isOneToOne: false
            referencedRelation: "inventory_item_summary"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      inventory_group_info: {
        Row: {
          count: number | null
          description: string | null
          id: string | null
          name: string | null
          period: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_group_period_fkey"
            columns: ["period"]
            isOneToOne: false
            referencedRelation: "period_time"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_item_summary: {
        Row: {
          catalog_item_id: string | null
          catalog_item_name: string | null
          id: string | null
          total: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_variant_with_acquisition: {
        Args: {
          _variant: Database["public"]["CompositeTypes"]["variant_input"]
          _acquisition: Database["public"]["CompositeTypes"]["acquisition_input"]
          _inventory_item_id: string
        }
        Returns: string
      }
      delete_variants: {
        Args: { item_id: string }
        Returns: undefined
      }
      duplicate_group: {
        Args: { original_group_id: string }
        Returns: string
      }
      duplicate_inventory_item: {
        Args: { original_item_id: string }
        Returns: string
      }
      edit_group: {
        Args: {
          inventory_group_id_to_edit: string
          group_value: Database["public"]["CompositeTypes"]["group_input"]
        }
        Returns: {
          description: string | null
          id: string
          name: string
          period: string
          updated_at: string | null
        }
      }
      update_variant_with_acquisition: {
        Args: {
          _acquisition: Database["public"]["CompositeTypes"]["acquisition_input"]
          _inventory_item_id: string
          _variant: Database["public"]["CompositeTypes"]["variant_input"]
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      acquisition_input: {
        type: string | null
        number: string | null
        date: string | null
        price: number | null
      }
      group_input: {
        name: string | null
        description: string | null
        period: string | null
      }
      variant_input: {
        color: string | null
        length: number | null
        width: number | null
        height: number | null
        serial_number: string | null
        brand: string | null
        model: string | null
        caracteristic: string | null
        conservation_status: string | null
        notes: string | null
        images: string[] | null
        count: number | null
      }
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const

