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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          action: string
          created_at: string
          entity_id: string | null
          entity_name: string | null
          entity_type: string
          id: string
          ip_address: string | null
          metadata: Json | null
          new_data: Json | null
          old_data: Json | null
          user_agent: string | null
          user_email: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity_id?: string | null
          entity_name?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity_id?: string | null
          entity_name?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          new_data?: Json | null
          old_data?: Json | null
          user_agent?: string | null
          user_email?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      admin_presence: {
        Row: {
          is_online: boolean | null
          last_seen: string | null
          user_id: string
        }
        Insert: {
          is_online?: boolean | null
          last_seen?: string | null
          user_id: string
        }
        Update: {
          is_online?: boolean | null
          last_seen?: string | null
          user_id?: string
        }
        Relationships: []
      }
      ai_trip_config: {
        Row: {
          config_key: string
          config_value: Json
          created_at: string
          description: string | null
          id: string
          updated_at: string
        }
        Insert: {
          config_key: string
          config_value?: Json
          created_at?: string
          description?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          config_key?: string
          config_value?: Json
          created_at?: string
          description?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author_id: string | null
          category_id: string | null
          content: string | null
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          meta_description: string | null
          meta_keywords: string[] | null
          meta_title: string | null
          published_at: string | null
          reading_time: number | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          author_id?: string | null
          category_id?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          published_at?: string | null
          reading_time?: number | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          author_id?: string | null
          category_id?: string | null
          content?: string | null
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          published_at?: string | null
          reading_time?: number | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          adults: number
          booking_date: string
          booking_source: string | null
          booking_type: string | null
          children: number
          created_at: string
          customer_email: string
          customer_name: string
          customer_phone: string
          id: string
          infants: number
          service_id: string | null
          special_requests: string | null
          status: string
          total_price: number
          tour_id: string
          tour_name: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          adults?: number
          booking_date: string
          booking_source?: string | null
          booking_type?: string | null
          children?: number
          created_at?: string
          customer_email: string
          customer_name: string
          customer_phone: string
          id?: string
          infants?: number
          service_id?: string | null
          special_requests?: string | null
          status?: string
          total_price: number
          tour_id: string
          tour_name: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          adults?: number
          booking_date?: string
          booking_source?: string | null
          booking_type?: string | null
          children?: number
          created_at?: string
          customer_email?: string
          customer_name?: string
          customer_phone?: string
          id?: string
          infants?: number
          service_id?: string | null
          special_requests?: string | null
          status?: string
          total_price?: number
          tour_id?: string
          tour_name?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      canned_responses: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          is_active: boolean | null
          shortcut: string | null
          sort_order: number | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          content: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          shortcut?: string | null
          sort_order?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          shortcut?: string | null
          sort_order?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      car_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      car_rentals: {
        Row: {
          brand: string
          category_id: string | null
          created_at: string
          daily_price: number
          deposit: number | null
          description: string | null
          driver_available: boolean | null
          features: string[] | null
          fuel_type: string | null
          gallery: string[] | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          long_description: string | null
          meta_description: string | null
          meta_title: string | null
          model: string
          monthly_price: number | null
          requirements: string[] | null
          seats: number | null
          self_drive: boolean | null
          slug: string
          sort_order: number | null
          title: string
          transmission: string | null
          updated_at: string
          weekly_price: number | null
          year: number
        }
        Insert: {
          brand: string
          category_id?: string | null
          created_at?: string
          daily_price: number
          deposit?: number | null
          description?: string | null
          driver_available?: boolean | null
          features?: string[] | null
          fuel_type?: string | null
          gallery?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          long_description?: string | null
          meta_description?: string | null
          meta_title?: string | null
          model: string
          monthly_price?: number | null
          requirements?: string[] | null
          seats?: number | null
          self_drive?: boolean | null
          slug: string
          sort_order?: number | null
          title: string
          transmission?: string | null
          updated_at?: string
          weekly_price?: number | null
          year: number
        }
        Update: {
          brand?: string
          category_id?: string | null
          created_at?: string
          daily_price?: number
          deposit?: number | null
          description?: string | null
          driver_available?: boolean | null
          features?: string[] | null
          fuel_type?: string | null
          gallery?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          long_description?: string | null
          meta_description?: string | null
          meta_title?: string | null
          model?: string
          monthly_price?: number | null
          requirements?: string[] | null
          seats?: number | null
          self_drive?: boolean | null
          slug?: string
          sort_order?: number | null
          title?: string
          transmission?: string | null
          updated_at?: string
          weekly_price?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "car_rentals_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "car_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          agent_id: string | null
          closed_at: string | null
          created_at: string
          current_page: string | null
          id: string
          is_agent_connected: boolean | null
          status: string
          travel_date: string | null
          updated_at: string
          visitor_email: string | null
          visitor_id: string
          visitor_name: string | null
          visitor_phone: string | null
        }
        Insert: {
          agent_id?: string | null
          closed_at?: string | null
          created_at?: string
          current_page?: string | null
          id?: string
          is_agent_connected?: boolean | null
          status?: string
          travel_date?: string | null
          updated_at?: string
          visitor_email?: string | null
          visitor_id: string
          visitor_name?: string | null
          visitor_phone?: string | null
        }
        Update: {
          agent_id?: string | null
          closed_at?: string | null
          created_at?: string
          current_page?: string | null
          id?: string
          is_agent_connected?: boolean | null
          status?: string
          travel_date?: string | null
          updated_at?: string
          visitor_email?: string | null
          visitor_id?: string
          visitor_name?: string | null
          visitor_phone?: string | null
        }
        Relationships: []
      }
      chat_leads: {
        Row: {
          conversation_id: string | null
          created_at: string
          email: string
          id: string
          message: string | null
          name: string
          phone: string | null
          source: string | null
          travel_date: string | null
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string
          email: string
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          source?: string | null
          travel_date?: string | null
        }
        Update: {
          conversation_id?: string | null
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          source?: string | null
          travel_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_leads_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          metadata: Json | null
          sender_name: string | null
          sender_type: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          sender_name?: string | null
          sender_type: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          sender_name?: string | null
          sender_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      combo_ai_rules: {
        Row: {
          combo_id: string
          conditions: Json
          created_at: string
          id: string
          is_active: boolean | null
          max_discount_percent: number | null
          priority: number
          rule_name: string
          updated_at: string
          upsell_combos: string[] | null
        }
        Insert: {
          combo_id: string
          conditions?: Json
          created_at?: string
          id?: string
          is_active?: boolean | null
          max_discount_percent?: number | null
          priority?: number
          rule_name: string
          updated_at?: string
          upsell_combos?: string[] | null
        }
        Update: {
          combo_id?: string
          conditions?: Json
          created_at?: string
          id?: string
          is_active?: boolean | null
          max_discount_percent?: number | null
          priority?: number
          rule_name?: string
          updated_at?: string
          upsell_combos?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "combo_ai_rules_combo_id_fkey"
            columns: ["combo_id"]
            isOneToOne: false
            referencedRelation: "combo_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      combo_package_items: {
        Row: {
          combo_id: string
          created_at: string
          day_number: number
          description: string | null
          end_time: string | null
          id: string
          is_flexible: boolean | null
          is_mandatory: boolean | null
          item_id: string | null
          item_type: string
          metadata: Json | null
          price_aed: number
          sort_order: number | null
          start_time: string | null
          title: string
        }
        Insert: {
          combo_id: string
          created_at?: string
          day_number?: number
          description?: string | null
          end_time?: string | null
          id?: string
          is_flexible?: boolean | null
          is_mandatory?: boolean | null
          item_id?: string | null
          item_type: string
          metadata?: Json | null
          price_aed?: number
          sort_order?: number | null
          start_time?: string | null
          title: string
        }
        Update: {
          combo_id?: string
          created_at?: string
          day_number?: number
          description?: string | null
          end_time?: string | null
          id?: string
          is_flexible?: boolean | null
          is_mandatory?: boolean | null
          item_id?: string | null
          item_type?: string
          metadata?: Json | null
          price_aed?: number
          sort_order?: number | null
          start_time?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "combo_package_items_combo_id_fkey"
            columns: ["combo_id"]
            isOneToOne: false
            referencedRelation: "combo_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      combo_package_types: {
        Row: {
          color: string | null
          created_at: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      combo_packages: {
        Row: {
          base_price_aed: number
          blackout_dates: Json | null
          combo_type: string
          created_at: string
          description: string | null
          discount_percent: number
          duration_days: number
          duration_nights: number
          final_price_aed: number
          gallery: string[] | null
          highlights: string[] | null
          hotel_star_rating: number | null
          id: string
          image_url: string | null
          includes_hotel: boolean | null
          includes_transport: boolean | null
          includes_visa: boolean | null
          is_active: boolean | null
          is_featured: boolean | null
          long_description: string | null
          meta_description: string | null
          meta_title: string | null
          name: string
          seasonal_pricing: Json | null
          slug: string
          sort_order: number | null
          transport_type: string | null
          updated_at: string
        }
        Insert: {
          base_price_aed?: number
          blackout_dates?: Json | null
          combo_type?: string
          created_at?: string
          description?: string | null
          discount_percent?: number
          duration_days?: number
          duration_nights?: number
          final_price_aed?: number
          gallery?: string[] | null
          highlights?: string[] | null
          hotel_star_rating?: number | null
          id?: string
          image_url?: string | null
          includes_hotel?: boolean | null
          includes_transport?: boolean | null
          includes_visa?: boolean | null
          is_active?: boolean | null
          is_featured?: boolean | null
          long_description?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          seasonal_pricing?: Json | null
          slug: string
          sort_order?: number | null
          transport_type?: string | null
          updated_at?: string
        }
        Update: {
          base_price_aed?: number
          blackout_dates?: Json | null
          combo_type?: string
          created_at?: string
          description?: string | null
          discount_percent?: number
          duration_days?: number
          duration_nights?: number
          final_price_aed?: number
          gallery?: string[] | null
          highlights?: string[] | null
          hotel_star_rating?: number | null
          id?: string
          image_url?: string | null
          includes_hotel?: boolean | null
          includes_transport?: boolean | null
          includes_visa?: boolean | null
          is_active?: boolean | null
          is_featured?: boolean | null
          long_description?: string | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          seasonal_pricing?: Json | null
          slug?: string
          sort_order?: number | null
          transport_type?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      currency_rates: {
        Row: {
          created_at: string
          currency_code: string
          currency_name: string
          currency_symbol: string
          id: string
          is_enabled: boolean
          margin_percent: number
          rate_to_aed: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          currency_code: string
          currency_name: string
          currency_symbol?: string
          id?: string
          is_enabled?: boolean
          margin_percent?: number
          rate_to_aed?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          currency_code?: string
          currency_name?: string
          currency_symbol?: string
          id?: string
          is_enabled?: boolean
          margin_percent?: number
          rate_to_aed?: number
          updated_at?: string
        }
        Relationships: []
      }
      discounts: {
        Row: {
          applicable_tour_ids: string[] | null
          code: string
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          min_order_amount: number | null
          name: string
          starts_at: string | null
          type: string
          updated_at: string | null
          used_count: number | null
          value: number
        }
        Insert: {
          applicable_tour_ids?: string[] | null
          code: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_order_amount?: number | null
          name: string
          starts_at?: string | null
          type: string
          updated_at?: string | null
          used_count?: number | null
          value: number
        }
        Update: {
          applicable_tour_ids?: string[] | null
          code?: string
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_order_amount?: number | null
          name?: string
          starts_at?: string | null
          type?: string
          updated_at?: string | null
          used_count?: number | null
          value?: number
        }
        Relationships: []
      }
      email_templates: {
        Row: {
          body_html: string
          body_text: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          subject: string
          template_key: string
          updated_at: string | null
          variables: string[] | null
        }
        Insert: {
          body_html: string
          body_text?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          subject: string
          template_key: string
          updated_at?: string | null
          variables?: string[] | null
        }
        Update: {
          body_html?: string
          body_text?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          subject?: string
          template_key?: string
          updated_at?: string | null
          variables?: string[] | null
        }
        Relationships: []
      }
      faqs: {
        Row: {
          answer: string
          category: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          question: string
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          question: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          question?: string
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      gallery: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          image_url: string
          sort_order: number | null
          title: string | null
          tour_id: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          image_url: string
          sort_order?: number | null
          title?: string | null
          tour_id?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          image_url?: string
          sort_order?: number | null
          title?: string | null
          tour_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gallery_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      hotel_rooms: {
        Row: {
          amenities: string[] | null
          beds: string | null
          created_at: string
          description: string | null
          gallery: string[] | null
          hotel_id: string
          id: string
          image_url: string | null
          is_available: boolean | null
          max_guests: number | null
          name: string
          price_per_night: number
          size_sqm: number | null
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          amenities?: string[] | null
          beds?: string | null
          created_at?: string
          description?: string | null
          gallery?: string[] | null
          hotel_id: string
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          max_guests?: number | null
          name: string
          price_per_night: number
          size_sqm?: number | null
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          amenities?: string[] | null
          beds?: string | null
          created_at?: string
          description?: string | null
          gallery?: string[] | null
          hotel_id?: string
          id?: string
          image_url?: string | null
          is_available?: boolean | null
          max_guests?: number | null
          name?: string
          price_per_night?: number
          size_sqm?: number | null
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "hotel_rooms_hotel_id_fkey"
            columns: ["hotel_id"]
            isOneToOne: false
            referencedRelation: "hotels"
            referencedColumns: ["id"]
          },
        ]
      }
      hotels: {
        Row: {
          address: string | null
          amenities: string[] | null
          category: string | null
          check_in_time: string | null
          check_out_time: string | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          gallery: string[] | null
          highlights: string[] | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_featured: boolean | null
          latitude: number | null
          location: string | null
          long_description: string | null
          longitude: number | null
          meta_description: string | null
          meta_title: string | null
          name: string
          price_from: number | null
          slug: string
          sort_order: number | null
          star_rating: number | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          amenities?: string[] | null
          category?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          gallery?: string[] | null
          highlights?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          latitude?: number | null
          location?: string | null
          long_description?: string | null
          longitude?: number | null
          meta_description?: string | null
          meta_title?: string | null
          name: string
          price_from?: number | null
          slug: string
          sort_order?: number | null
          star_rating?: number | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          amenities?: string[] | null
          category?: string | null
          check_in_time?: string | null
          check_out_time?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          gallery?: string[] | null
          highlights?: string[] | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          latitude?: number | null
          location?: string | null
          long_description?: string | null
          longitude?: number | null
          meta_description?: string | null
          meta_title?: string | null
          name?: string
          price_from?: number | null
          slug?: string
          sort_order?: number | null
          star_rating?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      inquiries: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string
          subject: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string
          subject?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string
          subject?: string | null
        }
        Relationships: []
      }
      locations: {
        Row: {
          address: string | null
          coordinates: Json | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          coordinates?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          coordinates?: Json | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_subscribers: {
        Row: {
          created_at: string | null
          email: string
          id: string
          is_active: boolean | null
          source: string | null
          subscribed_at: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          is_active?: boolean | null
          source?: string | null
          subscribed_at?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          is_active?: boolean | null
          source?: string | null
          subscribed_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          link_url: string | null
          message: string
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link_url?: string | null
          message: string
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link_url?: string | null
          message?: string
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      permissions: {
        Row: {
          action: string
          allowed: boolean
          created_at: string
          id: string
          resource: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          action: string
          allowed?: boolean
          created_at?: string
          id?: string
          resource: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          action?: string
          allowed?: boolean
          created_at?: string
          id?: string
          resource?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      promotional_banners: {
        Row: {
          bg_color: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          link_text: string | null
          link_url: string | null
          position: string | null
          sort_order: number | null
          starts_at: string | null
          subtitle: string | null
          text_color: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          bg_color?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          link_text?: string | null
          link_url?: string | null
          position?: string | null
          sort_order?: number | null
          starts_at?: string | null
          subtitle?: string | null
          text_color?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          bg_color?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          link_text?: string | null
          link_url?: string | null
          position?: string | null
          sort_order?: number | null
          starts_at?: string | null
          subtitle?: string | null
          text_color?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      review_photos: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          image_url: string
          review_id: string | null
          sort_order: number | null
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url: string
          review_id?: string | null
          sort_order?: number | null
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          image_url?: string
          review_id?: string | null
          sort_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "review_photos_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          booking_id: string | null
          created_at: string | null
          customer_email: string | null
          customer_name: string
          id: string
          rating: number
          review_text: string | null
          status: string | null
          tour_id: string | null
        }
        Insert: {
          booking_id?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_name: string
          id?: string
          rating: number
          review_text?: string | null
          status?: string | null
          tour_id?: string | null
        }
        Update: {
          booking_id?: string | null
          created_at?: string | null
          customer_email?: string | null
          customer_name?: string
          id?: string
          rating?: number
          review_text?: string | null
          status?: string | null
          tour_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      service_categories: {
        Row: {
          created_at: string
          description: string | null
          icon: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          slug: string
          sort_order: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          booking_type: string | null
          cancellation_policy: string | null
          category_id: string | null
          created_at: string | null
          description: string | null
          duration: string | null
          excluded: string[] | null
          faqs: Json | null
          gallery: string[] | null
          highlights: string[] | null
          hotel_pickup: boolean | null
          id: string
          image_alt: string | null
          image_url: string | null
          included: string[] | null
          instant_confirmation: boolean | null
          is_active: boolean | null
          is_featured: boolean | null
          itinerary: Json | null
          location: string | null
          long_description: string | null
          max_participants: number | null
          meeting_point: string | null
          meta_description: string | null
          meta_keywords: string[] | null
          meta_title: string | null
          min_participants: number | null
          original_price: number | null
          price: number
          rating: number | null
          review_count: number | null
          slug: string
          sort_order: number | null
          subtitle: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          booking_type?: string | null
          cancellation_policy?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          excluded?: string[] | null
          faqs?: Json | null
          gallery?: string[] | null
          highlights?: string[] | null
          hotel_pickup?: boolean | null
          id?: string
          image_alt?: string | null
          image_url?: string | null
          included?: string[] | null
          instant_confirmation?: boolean | null
          is_active?: boolean | null
          is_featured?: boolean | null
          itinerary?: Json | null
          location?: string | null
          long_description?: string | null
          max_participants?: number | null
          meeting_point?: string | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          min_participants?: number | null
          original_price?: number | null
          price: number
          rating?: number | null
          review_count?: number | null
          slug: string
          sort_order?: number | null
          subtitle?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          booking_type?: string | null
          cancellation_policy?: string | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          excluded?: string[] | null
          faqs?: Json | null
          gallery?: string[] | null
          highlights?: string[] | null
          hotel_pickup?: boolean | null
          id?: string
          image_alt?: string | null
          image_url?: string | null
          included?: string[] | null
          instant_confirmation?: boolean | null
          is_active?: boolean | null
          is_featured?: boolean | null
          itinerary?: Json | null
          location?: string | null
          long_description?: string | null
          max_participants?: number | null
          meeting_point?: string | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          min_participants?: number | null
          original_price?: number | null
          price?: number
          rating?: number | null
          review_count?: number | null
          slug?: string
          sort_order?: number | null
          subtitle?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "services_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "service_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          id: string
          key: string
          updated_at: string | null
          value: Json
        }
        Insert: {
          id?: string
          key: string
          updated_at?: string | null
          value: Json
        }
        Update: {
          id?: string
          key?: string
          updated_at?: string | null
          value?: Json
        }
        Relationships: []
      }
      tour_availability: {
        Row: {
          created_at: string
          date: string
          id: string
          is_available: boolean
          service_id: string | null
          slots_booked: number
          slots_total: number
          special_price: number | null
          tour_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          is_available?: boolean
          service_id?: string | null
          slots_booked?: number
          slots_total?: number
          special_price?: number | null
          tour_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          is_available?: boolean
          service_id?: string | null
          slots_booked?: number
          slots_total?: number
          special_price?: number | null
          tour_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_availability_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tour_availability_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tours: {
        Row: {
          booking_features: Json | null
          capacity: string | null
          category: string
          category_id: string | null
          created_at: string | null
          description: string | null
          duration: string | null
          excluded: string[] | null
          faqs: Json | null
          featured: boolean | null
          full_yacht_price: number | null
          gallery: string[] | null
          gallery_data: Json | null
          highlights: string[] | null
          id: string
          image_alt: string | null
          image_url: string | null
          included: string[] | null
          itinerary: Json | null
          location: string | null
          long_description: string | null
          meta_description: string | null
          meta_keywords: string[] | null
          meta_title: string | null
          original_price: number | null
          price: number
          pricing_type: string | null
          rating: number | null
          review_count: number | null
          seo_slug: string | null
          slug: string
          status: string | null
          subtitle: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          booking_features?: Json | null
          capacity?: string | null
          category: string
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          excluded?: string[] | null
          faqs?: Json | null
          featured?: boolean | null
          full_yacht_price?: number | null
          gallery?: string[] | null
          gallery_data?: Json | null
          highlights?: string[] | null
          id?: string
          image_alt?: string | null
          image_url?: string | null
          included?: string[] | null
          itinerary?: Json | null
          location?: string | null
          long_description?: string | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          original_price?: number | null
          price: number
          pricing_type?: string | null
          rating?: number | null
          review_count?: number | null
          seo_slug?: string | null
          slug: string
          status?: string | null
          subtitle?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          booking_features?: Json | null
          capacity?: string | null
          category?: string
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          excluded?: string[] | null
          faqs?: Json | null
          featured?: boolean | null
          full_yacht_price?: number | null
          gallery?: string[] | null
          gallery_data?: Json | null
          highlights?: string[] | null
          id?: string
          image_alt?: string | null
          image_url?: string | null
          included?: string[] | null
          itinerary?: Json | null
          location?: string | null
          long_description?: string | null
          meta_description?: string | null
          meta_keywords?: string[] | null
          meta_title?: string | null
          original_price?: number | null
          price?: number
          pricing_type?: string | null
          rating?: number | null
          review_count?: number | null
          seo_slug?: string | null
          slug?: string
          status?: string | null
          subtitle?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tours_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_items: {
        Row: {
          created_at: string
          day_number: number
          description: string | null
          end_time: string | null
          id: string
          is_included: boolean
          is_optional: boolean
          item_id: string | null
          item_type: string
          metadata: Json | null
          price_aed: number
          quantity: number
          sort_order: number
          start_time: string | null
          title: string
          trip_id: string
        }
        Insert: {
          created_at?: string
          day_number: number
          description?: string | null
          end_time?: string | null
          id?: string
          is_included?: boolean
          is_optional?: boolean
          item_id?: string | null
          item_type: string
          metadata?: Json | null
          price_aed?: number
          quantity?: number
          sort_order?: number
          start_time?: string | null
          title: string
          trip_id: string
        }
        Update: {
          created_at?: string
          day_number?: number
          description?: string | null
          end_time?: string | null
          id?: string
          is_included?: boolean
          is_optional?: boolean
          item_id?: string | null
          item_type?: string
          metadata?: Json | null
          price_aed?: number
          quantity?: number
          sort_order?: number
          start_time?: string | null
          title?: string
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trip_items_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trip_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      trip_leads: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          notes: string | null
          phone: string | null
          status: string
          travel_date: string | null
          trip_id: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          status?: string
          travel_date?: string | null
          trip_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          status?: string
          travel_date?: string | null
          trip_id?: string | null
        }
        Relationships: []
      }
      trip_plans: {
        Row: {
          arrival_date: string
          budget_tier: string
          created_at: string
          departure_date: string
          destination: string
          display_currency: string | null
          display_price: number | null
          hotel_preference: string | null
          id: string
          metadata: Json | null
          nationality: string
          pdf_url: string | null
          special_occasion: string | null
          status: string
          total_days: number | null
          total_price_aed: number | null
          travel_style: string
          travelers_adults: number
          travelers_children: number
          updated_at: string
          user_id: string | null
          visitor_id: string
        }
        Insert: {
          arrival_date: string
          budget_tier?: string
          created_at?: string
          departure_date: string
          destination?: string
          display_currency?: string | null
          display_price?: number | null
          hotel_preference?: string | null
          id?: string
          metadata?: Json | null
          nationality: string
          pdf_url?: string | null
          special_occasion?: string | null
          status?: string
          total_days?: number | null
          total_price_aed?: number | null
          travel_style?: string
          travelers_adults?: number
          travelers_children?: number
          updated_at?: string
          user_id?: string | null
          visitor_id: string
        }
        Update: {
          arrival_date?: string
          budget_tier?: string
          created_at?: string
          departure_date?: string
          destination?: string
          display_currency?: string | null
          display_price?: number | null
          hotel_preference?: string | null
          id?: string
          metadata?: Json | null
          nationality?: string
          pdf_url?: string | null
          special_occasion?: string | null
          status?: string
          total_days?: number | null
          total_price_aed?: number | null
          travel_style?: string
          travelers_adults?: number
          travelers_children?: number
          updated_at?: string
          user_id?: string | null
          visitor_id?: string
        }
        Relationships: []
      }
      url_redirects: {
        Row: {
          created_at: string
          hits: number | null
          id: string
          new_path: string
          old_path: string
          redirect_type: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          hits?: number | null
          id?: string
          new_path: string
          old_path: string
          redirect_type?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          hits?: number | null
          id?: string
          new_path?: string
          old_path?: string
          redirect_type?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invited_by: string | null
          roles: Database["public"]["Enums"]["app_role"][]
          status: string
          token: string
          updated_at: string
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          roles?: Database["public"]["Enums"]["app_role"][]
          status?: string
          token?: string
          updated_at?: string
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invited_by?: string | null
          roles?: Database["public"]["Enums"]["app_role"][]
          status?: string
          token?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      visa_nationality_rules: {
        Row: {
          country_code: string
          country_name: string
          created_at: string
          documents_required: string[] | null
          id: string
          is_active: boolean
          notes: string | null
          recommended_visa_id: string | null
          updated_at: string
          visa_on_arrival: boolean
          visa_required: boolean
        }
        Insert: {
          country_code: string
          country_name: string
          created_at?: string
          documents_required?: string[] | null
          id?: string
          is_active?: boolean
          notes?: string | null
          recommended_visa_id?: string | null
          updated_at?: string
          visa_on_arrival?: boolean
          visa_required?: boolean
        }
        Update: {
          country_code?: string
          country_name?: string
          created_at?: string
          documents_required?: string[] | null
          id?: string
          is_active?: boolean
          notes?: string | null
          recommended_visa_id?: string | null
          updated_at?: string
          visa_on_arrival?: boolean
          visa_required?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "visa_nationality_rules_recommended_visa_id_fkey"
            columns: ["recommended_visa_id"]
            isOneToOne: false
            referencedRelation: "visa_services"
            referencedColumns: ["id"]
          },
        ]
      }
      visa_services: {
        Row: {
          created_at: string
          description: string | null
          duration_days: number | null
          excluded: string[] | null
          faqs: Json | null
          id: string
          image_url: string | null
          included: string[] | null
          is_active: boolean | null
          is_express: boolean | null
          is_featured: boolean | null
          long_description: string | null
          meta_description: string | null
          meta_title: string | null
          original_price: number | null
          price: number
          processing_time: string | null
          requirements: string[] | null
          slug: string
          sort_order: number | null
          title: string
          updated_at: string
          validity: string | null
          visa_type: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_days?: number | null
          excluded?: string[] | null
          faqs?: Json | null
          id?: string
          image_url?: string | null
          included?: string[] | null
          is_active?: boolean | null
          is_express?: boolean | null
          is_featured?: boolean | null
          long_description?: string | null
          meta_description?: string | null
          meta_title?: string | null
          original_price?: number | null
          price: number
          processing_time?: string | null
          requirements?: string[] | null
          slug: string
          sort_order?: number | null
          title: string
          updated_at?: string
          validity?: string | null
          visa_type: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_days?: number | null
          excluded?: string[] | null
          faqs?: Json | null
          id?: string
          image_url?: string | null
          included?: string[] | null
          is_active?: boolean | null
          is_express?: boolean | null
          is_featured?: boolean | null
          long_description?: string | null
          meta_description?: string | null
          meta_title?: string | null
          original_price?: number | null
          price?: number
          processing_time?: string | null
          requirements?: string[] | null
          slug?: string
          sort_order?: number | null
          title?: string
          updated_at?: string
          validity?: string | null
          visa_type?: string
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          alert_price: number | null
          created_at: string
          id: string
          notified_at: string | null
          price_alert: boolean
          service_id: string | null
          tour_id: string | null
          user_id: string
        }
        Insert: {
          alert_price?: number | null
          created_at?: string
          id?: string
          notified_at?: string | null
          price_alert?: boolean
          service_id?: string | null
          tour_id?: string | null
          user_id: string
        }
        Update: {
          alert_price?: number | null
          created_at?: string
          id?: string
          notified_at?: string | null
          price_alert?: boolean
          service_id?: string | null
          tour_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlists_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_categories_with_tour_counts: {
        Args: never
        Returns: {
          created_at: string
          description: string
          icon: string
          id: string
          is_active: boolean
          name: string
          slug: string
          sort_order: number
          tour_count: number
          updated_at: string
        }[]
      }
      has_permission: {
        Args: { _action: string; _resource: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "manager" | "editor"
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
      app_role: ["admin", "moderator", "user", "manager", "editor"],
    },
  },
} as const
