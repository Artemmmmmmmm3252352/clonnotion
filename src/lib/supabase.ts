import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
        };
      };
      workspaces: {
        Row: {
          id: string;
          name: string;
          icon: string;
          owner_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          icon?: string;
          owner_id: string;
        };
        Update: {
          name?: string;
          icon?: string;
        };
      };
      workspace_members: {
        Row: {
          id: string;
          workspace_id: string;
          user_id: string;
          role: 'owner' | 'admin' | 'member' | 'viewer';
          created_at: string;
        };
      };
      pages: {
        Row: {
          id: string;
          workspace_id: string;
          parent_id: string | null;
          title: string;
          icon: string;
          cover: string | null;
          is_favorite: boolean;
          is_archived: boolean;
          is_deleted: boolean;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      blocks: {
        Row: {
          id: string;
          page_id: string;
          type: string;
          content: string;
          position: number;
          created_at: string;
          updated_at: string;
        };
      };
      workspace_invites: {
        Row: {
          id: string;
          workspace_id: string;
          email: string;
          role: 'admin' | 'member' | 'viewer';
          invited_by: string;
          status: 'pending' | 'accepted' | 'declined';
          created_at: string;
          expires_at: string;
        };
      };
    };
  };
};
