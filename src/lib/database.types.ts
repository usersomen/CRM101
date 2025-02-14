export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      contacts: {
        Row: {
          id: string
          user_id: string
          name: string
          email: string
          company: string | null
          last_contacted: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email: string
          company?: string | null
          last_contacted?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string
          company?: string | null
          last_contacted?: string | null
        }
      }
      meetings: {
        Row: {
          id: string
          user_id: string
          title: string
          participants: string[]
          scheduled_time: string
          duration: number
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          participants: string[]
          scheduled_time: string
          duration: number
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          participants?: string[]
          scheduled_time?: string
          duration?: number
        }
      }
      users: {
        Row: {
          id: string
          email: string | null
          display_name: string | null
          photo_url: string | null
          provider: string | null
          created_at: string
          last_sign_in: string | null
        }
        Insert: {
          id: string
          email?: string | null
          display_name?: string | null
          photo_url?: string | null
          provider?: string | null
          created_at?: string
          last_sign_in?: string | null
        }
        Update: {
          id?: string
          email?: string | null
          display_name?: string | null
          photo_url?: string | null
          provider?: string | null
          created_at?: string
          last_sign_in?: string | null
        }
      }
      wellness_logs: {
        Row: {
          user_id: string
          last_check: string
          score: number
          recommendations: string[]
        }
        Insert: {
          user_id: string
          last_check: string
          score: number
          recommendations: string[]
        }
        Update: {
          user_id?: string
          last_check?: string
          score?: number
          recommendations?: string[]
        }
      }
    }
  }
}