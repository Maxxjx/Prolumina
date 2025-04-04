
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
      users: {
        Row: {
          id: string
          created_at: string
          email: string
          name: string
          role: 'admin' | 'team' | 'client'
          avatar_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          email: string
          name: string
          role: 'admin' | 'team' | 'client'
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          email?: string
          name?: string
          role?: 'admin' | 'team' | 'client'
          avatar_url?: string | null
        }
      }
      projects: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string
          status: string
          deadline: string
          progress: number
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description: string
          status: string
          deadline: string
          progress: number
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string
          status?: string
          deadline?: string
          progress?: number
        }
      }
      project_members: {
        Row: {
          id: string
          created_at: string
          project_id: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          project_id: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          project_id?: string
          user_id?: string
        }
      }
      tasks: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string
          project_id: string
          status: string
          priority: string
          due_date: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description: string
          project_id: string
          status: string
          priority: string
          due_date: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string
          project_id?: string
          status?: string
          priority?: string
          due_date?: string
        }
      }
      task_assignees: {
        Row: {
          id: string
          created_at: string
          task_id: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          task_id: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          task_id?: string
          user_id?: string
        }
      }
      task_comments: {
        Row: {
          id: string
          created_at: string
          task_id: string
          user_id: string
          text: string
        }
        Insert: {
          id?: string
          created_at?: string
          task_id: string
          user_id: string
          text: string
        }
        Update: {
          id?: string
          created_at?: string
          task_id?: string
          user_id?: string
          text?: string
        }
      }
      activity_logs: {
        Row: {
          id: string
          created_at: string
          user_id: string
          user_name: string
          action: string
          entity_type: string
          entity_id: string | null
          details: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          user_name: string
          action: string
          entity_type: string
          entity_id?: string | null
          details?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          user_name?: string
          action?: string
          entity_type?: string
          entity_id?: string | null
          details?: string | null
        }
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
  }
}
