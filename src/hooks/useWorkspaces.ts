import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Workspace {
  id: string;
  name: string;
  slug: string;
  owner_id: string;
  is_personal: boolean;
  created_at: string;
  updated_at: string;
  role?: string;
}

interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: string;
  joined_at: string;
  profile: {
    email: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export const useWorkspaces = () => {
  const { user } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadWorkspaces();
    }
  }, [user]);

  const loadWorkspaces = async () => {
    if (!user) {
      console.log('[useWorkspaces] No user, skipping load');
      setLoading(false);
      return;
    }

    console.log('[useWorkspaces] Loading workspaces for user:', user.email);

    try {
      const { data: memberships, error } = await supabase
        .from('workspace_members')
        .select('workspace_id, role, workspaces(*)')
        .eq('user_id', user.id);

      if (error) {
        console.error('[useWorkspaces] Error loading workspaces:', error);
        setLoading(false);
        return;
      }

      console.log('[useWorkspaces] Memberships:', memberships);

      const workspaceList = memberships?.map((m: any) => ({
        ...m.workspaces,
        role: m.role,
      })) || [];

      console.log('[useWorkspaces] Workspace list:', workspaceList);

      setWorkspaces(workspaceList);

      if (workspaceList.length > 0 && !currentWorkspace) {
        const personal = workspaceList.find((w: Workspace) => w.is_personal);
        const selected = personal || workspaceList[0];
        console.log('[useWorkspaces] Setting current workspace:', selected);
        setCurrentWorkspace(selected);
      } else if (workspaceList.length === 0) {
        console.warn('[useWorkspaces] No workspaces found for user');
      }
    } catch (error) {
      console.error('[useWorkspaces] Exception loading workspaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const createWorkspace = async (name: string, slug: string) => {
    if (!user) {
      console.error('[useWorkspaces] No user logged in');
      return { error: new Error('No user logged in') };
    }

    // Check session
    const { data: { session } } = await supabase.auth.getSession();
    console.log('[useWorkspaces] Current session:', {
      user_id: session?.user?.id,
      has_token: !!session?.access_token,
      token_preview: session?.access_token?.substring(0, 30) + '...',
      expires_at: session?.expires_at
    });

    if (!session) {
      console.error('[useWorkspaces] No active session');
      return { error: new Error('No active session. Please log in again.') };
    }

    // Test auth.uid() by calling a test function
    try {
      const { data: testAuth, error: testError } = await supabase.rpc('get_current_user_id');
      console.log('[useWorkspaces] Test auth.uid():', testAuth, 'Error:', testError);
    } catch (e) {
      console.log('[useWorkspaces] Test function not available (this is OK)');
    }

    console.log('[useWorkspaces] Creating workspace:', { name, slug, owner_id: user.id });

    try {
      // Create workspace - trigger will automatically add owner to workspace_members
      const { data: workspace, error: workspaceError } = await supabase
        .from('workspaces')
        .insert({
          name,
          slug,
          owner_id: user.id,
          is_personal: false,
        })
        .select()
        .single();

      if (workspaceError) {
        console.error('[useWorkspaces] Error creating workspace:', workspaceError);
        throw workspaceError;
      }

      console.log('[useWorkspaces] Workspace created successfully:', workspace);
      console.log('[useWorkspaces] Trigger should have added owner to workspace_members');

      // Reload workspaces to get the new one
      await loadWorkspaces();
      console.log('[useWorkspaces] Workspaces reloaded');
      return { data: workspace, error: null };
    } catch (error) {
      console.error('[useWorkspaces] Exception in createWorkspace:', error);
      return { error: error as Error };
    }
  };

  const switchWorkspace = (workspace: Workspace) => {
    setCurrentWorkspace(workspace);
  };

  const getWorkspaceMembers = async (workspaceId: string): Promise<WorkspaceMember[]> => {
    try {
      const { data, error } = await supabase
        .from('workspace_members')
        .select(`
          id,
          workspace_id,
          user_id,
          role,
          joined_at,
          profiles:user_id (
            email,
            full_name,
            avatar_url
          )
        `)
        .eq('workspace_id', workspaceId);

      if (error) throw error;

      return data.map((m: any) => ({
        ...m,
        profile: m.profiles,
      })) || [];
    } catch (error) {
      console.error('Error loading workspace members:', error);
      return [];
    }
  };

  const updateMemberRole = async (memberId: string, role: string) => {
    try {
      const { error } = await supabase
        .from('workspace_members')
        .update({ role })
        .eq('id', memberId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const removeMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('workspace_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const inviteMember = async (workspaceId: string, email: string, role: string) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-invitation`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          role,
          workspaceId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send invitation');
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  return {
    workspaces,
    currentWorkspace,
    loading,
    loadWorkspaces,
    createWorkspace,
    switchWorkspace,
    getWorkspaceMembers,
    updateMemberRole,
    removeMember,
    inviteMember,
  };
};
