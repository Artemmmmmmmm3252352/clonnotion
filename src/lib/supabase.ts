import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      workspaces: {
        Row: {
          id: string;
          name: string;
          slug: string;
          owner_id: string;
          is_personal: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          owner_id: string;
          is_personal?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          owner_id?: string;
          is_personal?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      workspace_members: {
        Row: {
          id: string;
          workspace_id: string;
          user_id: string;
          role: 'owner' | 'editor' | 'commenter' | 'viewer';
          joined_at: string;
        };
      };
      boards: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          type: 'kanban' | 'list' | 'calendar' | 'table';
          access_type: 'private' | 'invite_only' | 'public_read';
          icon: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
      };
      pages: {
        Row: {
          id: string;
          workspace_id: string;
          board_id: string | null;
          parent_id: string | null;
          title: string;
          icon: string;
          access_type: 'private' | 'invite_only' | 'public_read';
          is_favorite: boolean;
          is_archived: boolean;
          is_deleted: boolean;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
};
