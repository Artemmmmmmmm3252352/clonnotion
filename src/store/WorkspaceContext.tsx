import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Page, Block, Database } from './types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface Workspace {
  id: string;
  name: string;
  icon: string;
  owner_id: string;
}

interface WorkspaceContextType {
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  currentPageId: string | null;
  setCurrentPageId: (id: string | null) => void;
  createPage: (title: string, parentId?: string | null) => Promise<Page | null>;
  updatePage: (id: string, updates: Partial<Page>) => Promise<void>;
  deletePage: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  addBlock: (pageId: string, type: string, content: string, position: number) => Promise<void>;
  updateBlock: (blockId: string, updates: { content?: string; type?: string }) => Promise<void>;
  deleteBlock: (blockId: string) => Promise<void>;
  getPage: (id: string) => Promise<Page | null>;
  getPagePath: (id: string) => Promise<Page[]>;
  getRootPages: () => Promise<Page[]>;
  getChildPages: (parentId: string) => Promise<Page[]>;
  getFavoritePages: () => Promise<Page[]>;
  getArchivedPages: () => Promise<Page[]>;
  switchWorkspace: (workspaceId: string) => Promise<void>;
  createWorkspace: (name: string, icon?: string) => Promise<Workspace | null>;
  inviteMember: (email: string, role: 'admin' | 'member' | 'viewer') => Promise<void>;
  getWorkspaceMembers: () => Promise<any[]>;
  loading: boolean;
}

const WorkspaceContext = createContext<WorkspaceContextType | null>(null);

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadWorkspaces();
    }
  }, [user]);

  const loadWorkspaces = async () => {
    if (!user) return;

    try {
      const { data: memberData, error: memberError } = await supabase
        .from('workspace_members')
        .select('workspace_id')
        .eq('user_id', user.id);

      if (memberError) throw memberError;

      const workspaceIds = memberData.map((m: any) => m.workspace_id);

      const { data: workspacesData, error: workspacesError } = await supabase
        .from('workspaces')
        .select('*')
        .in('id', workspaceIds);

      if (workspacesError) throw workspacesError;

      setWorkspaces(workspacesData || []);
      if (workspacesData && workspacesData.length > 0) {
        setCurrentWorkspace(workspacesData[0]);
      }
    } catch (error) {
      console.error('Error loading workspaces:', error);
    } finally {
      setLoading(false);
    }
  };

  const switchWorkspace = async (workspaceId: string) => {
    const workspace = workspaces.find(w => w.id === workspaceId);
    if (workspace) {
      setCurrentWorkspace(workspace);
      setCurrentPageId(null);
    }
  };

  const createWorkspace = async (name: string, icon: string = '🏢'): Promise<Workspace | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('workspaces')
        .insert({
          name,
          icon,
          owner_id: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setWorkspaces(prev => [...prev, data]);
      if (!currentWorkspace) {
        setCurrentWorkspace(data);
      }

      return data;
    } catch (error) {
      console.error('Error creating workspace:', error);
      return null;
    }
  };

  const createPage = async (title: string, parentId: string | null = null): Promise<Page | null> => {
    if (!user || !currentWorkspace) return null;

    try {
      const { data: pageData, error: pageError } = await supabase
        .from('pages')
        .insert({
          workspace_id: currentWorkspace.id,
          parent_id: parentId,
          title: title || 'Без названия',
          icon: '📄',
          created_by: user.id
        })
        .select()
        .single();

      if (pageError) throw pageError;

      const { error: blockError } = await supabase
        .from('blocks')
        .insert({
          page_id: pageData.id,
          type: 'text',
          content: '',
          position: 0
        });

      if (blockError) throw blockError;

      return {
        id: pageData.id,
        title: pageData.title,
        icon: pageData.icon,
        cover: pageData.cover,
        parentId: pageData.parent_id,
        blocks: [],
        isFavorite: pageData.is_favorite,
        isArchived: pageData.is_archived,
        createdAt: new Date(pageData.created_at),
        updatedAt: new Date(pageData.updated_at)
      };
    } catch (error) {
      console.error('Error creating page:', error);
      return null;
    }
  };

  const updatePage = async (id: string, updates: Partial<Page>) => {
    try {
      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.icon !== undefined) dbUpdates.icon = updates.icon;
      if (updates.cover !== undefined) dbUpdates.cover = updates.cover;
      if (updates.isFavorite !== undefined) dbUpdates.is_favorite = updates.isFavorite;
      if (updates.isArchived !== undefined) dbUpdates.is_archived = updates.isArchived;

      const { error } = await supabase
        .from('pages')
        .update(dbUpdates)
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating page:', error);
    }
  };

  const deletePage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('pages')
        .update({ is_deleted: true, is_archived: true })
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  const toggleFavorite = async (id: string) => {
    try {
      const { data: pageData } = await supabase
        .from('pages')
        .select('is_favorite')
        .eq('id', id)
        .single();

      if (pageData) {
        const { error } = await supabase
          .from('pages')
          .update({ is_favorite: !pageData.is_favorite })
          .eq('id', id);

        if (error) throw error;
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const addBlock = async (pageId: string, type: string, content: string, position: number) => {
    try {
      const { error } = await supabase
        .from('blocks')
        .insert({
          page_id: pageId,
          type,
          content,
          position
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error adding block:', error);
    }
  };

  const updateBlock = async (blockId: string, updates: { content?: string; type?: string }) => {
    try {
      const { error } = await supabase
        .from('blocks')
        .update(updates)
        .eq('id', blockId);

      if (error) throw error;
    } catch (error) {
      console.error('Error updating block:', error);
    }
  };

  const deleteBlock = async (blockId: string) => {
    try {
      const { error } = await supabase
        .from('blocks')
        .delete()
        .eq('id', blockId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting block:', error);
    }
  };

  const getPage = async (id: string): Promise<Page | null> => {
    if (!currentWorkspace) return null;

    try {
      const { data: pageData, error: pageError } = await supabase
        .from('pages')
        .select('*')
        .eq('id', id)
        .eq('workspace_id', currentWorkspace.id)
        .single();

      if (pageError) throw pageError;

      const { data: blocksData, error: blocksError } = await supabase
        .from('blocks')
        .select('*')
        .eq('page_id', id)
        .order('position');

      if (blocksError) throw blocksError;

      return {
        id: pageData.id,
        title: pageData.title,
        icon: pageData.icon,
        cover: pageData.cover,
        parentId: pageData.parent_id,
        blocks: blocksData.map((b: any) => ({
          id: b.id,
          type: b.type,
          content: b.content
        })),
        isFavorite: pageData.is_favorite,
        isArchived: pageData.is_archived,
        createdAt: new Date(pageData.created_at),
        updatedAt: new Date(pageData.updated_at)
      };
    } catch (error) {
      console.error('Error getting page:', error);
      return null;
    }
  };

  const getPagePath = async (id: string): Promise<Page[]> => {
    const path: Page[] = [];
    let currentId: string | null = id;

    while (currentId) {
      const page = await getPage(currentId);
      if (!page) break;
      path.unshift(page);
      currentId = page.parentId;
    }

    return path;
  };

  const getRootPages = async (): Promise<Page[]> => {
    if (!currentWorkspace) return [];

    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('workspace_id', currentWorkspace.id)
        .is('parent_id', null)
        .eq('is_archived', false)
        .eq('is_deleted', false)
        .order('created_at');

      if (error) throw error;

      return (data || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        icon: p.icon,
        cover: p.cover,
        parentId: p.parent_id,
        blocks: [],
        isFavorite: p.is_favorite,
        isArchived: p.is_archived,
        createdAt: new Date(p.created_at),
        updatedAt: new Date(p.updated_at)
      }));
    } catch (error) {
      console.error('Error getting root pages:', error);
      return [];
    }
  };

  const getChildPages = async (parentId: string): Promise<Page[]> => {
    if (!currentWorkspace) return [];

    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('workspace_id', currentWorkspace.id)
        .eq('parent_id', parentId)
        .eq('is_archived', false)
        .eq('is_deleted', false)
        .order('created_at');

      if (error) throw error;

      return (data || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        icon: p.icon,
        cover: p.cover,
        parentId: p.parent_id,
        blocks: [],
        isFavorite: p.is_favorite,
        isArchived: p.is_archived,
        createdAt: new Date(p.created_at),
        updatedAt: new Date(p.updated_at)
      }));
    } catch (error) {
      console.error('Error getting child pages:', error);
      return [];
    }
  };

  const getFavoritePages = async (): Promise<Page[]> => {
    if (!currentWorkspace) return [];

    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('workspace_id', currentWorkspace.id)
        .eq('is_favorite', true)
        .eq('is_archived', false)
        .eq('is_deleted', false)
        .order('created_at');

      if (error) throw error;

      return (data || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        icon: p.icon,
        cover: p.cover,
        parentId: p.parent_id,
        blocks: [],
        isFavorite: p.is_favorite,
        isArchived: p.is_archived,
        createdAt: new Date(p.created_at),
        updatedAt: new Date(p.updated_at)
      }));
    } catch (error) {
      console.error('Error getting favorite pages:', error);
      return [];
    }
  };

  const getArchivedPages = async (): Promise<Page[]> => {
    if (!currentWorkspace) return [];

    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('workspace_id', currentWorkspace.id)
        .eq('is_archived', true)
        .order('created_at');

      if (error) throw error;

      return (data || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        icon: p.icon,
        cover: p.cover,
        parentId: p.parent_id,
        blocks: [],
        isFavorite: p.is_favorite,
        isArchived: p.is_archived,
        createdAt: new Date(p.created_at),
        updatedAt: new Date(p.updated_at)
      }));
    } catch (error) {
      console.error('Error getting archived pages:', error);
      return [];
    }
  };

  const inviteMember = async (email: string, role: 'admin' | 'member' | 'viewer') => {
    if (!user || !currentWorkspace) return;

    try {
      const { error } = await supabase
        .from('workspace_invites')
        .insert({
          workspace_id: currentWorkspace.id,
          email,
          role,
          invited_by: user.id
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error inviting member:', error);
    }
  };

  const getWorkspaceMembers = async () => {
    if (!currentWorkspace) return [];

    try {
      const { data, error } = await supabase
        .from('workspace_members')
        .select(`
          *,
          profiles:user_id (
            email,
            full_name,
            avatar_url
          )
        `)
        .eq('workspace_id', currentWorkspace.id);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting workspace members:', error);
      return [];
    }
  };

  return (
    <WorkspaceContext.Provider value={{
      currentWorkspace,
      workspaces,
      currentPageId,
      setCurrentPageId,
      createPage,
      updatePage,
      deletePage,
      toggleFavorite,
      addBlock,
      updateBlock,
      deleteBlock,
      getPage,
      getPagePath,
      getRootPages,
      getChildPages,
      getFavoritePages,
      getArchivedPages,
      switchWorkspace,
      createWorkspace,
      inviteMember,
      getWorkspaceMembers,
      loading
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
};
