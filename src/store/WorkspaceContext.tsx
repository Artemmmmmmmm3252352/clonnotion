import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { Page, Block, Database } from './types';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface WorkspaceContextType {
  currentWorkspaceId: string | null;
  currentPageId: string | null;
  pages: Page[];
  loading: boolean;
  setCurrentPageId: (id: string | null) => void;
  createPage: (title: string, parentId?: string | null) => Promise<Page | null>;
  updatePage: (id: string, updates: Partial<Page>) => Promise<void>;
  deletePage: (id: string) => Promise<void>;
  duplicatePage: (id: string) => Promise<Page | null>;
  restorePage: (id: string) => Promise<void>;
  permanentlyDeletePage: (id: string) => Promise<void>;
  movePage: (id: string, newParentId: string | null) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  addBlock: (pageId: string, block: Omit<Block, 'id'>, afterBlockId?: string) => Promise<void>;
  updateBlock: (pageId: string, blockId: string, updates: Partial<Block>) => Promise<void>;
  deleteBlock: (pageId: string, blockId: string) => Promise<void>;
  duplicateBlock: (pageId: string, blockId: string) => Promise<void>;
  moveBlock: (pageId: string, blockId: string, newIndex: number) => Promise<void>;
  getPage: (id: string) => Page | undefined;
  getPagePath: (id: string) => Page[];
  getRootPages: () => Page[];
  getChildPages: (parentId: string) => Page[];
  getFavoritePages: () => Page[];
  getArchivedPages: () => Page[];
  loadPages: () => Promise<void>;
  loadBlocks: (pageId: string) => Promise<Block[]>;
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
  const { currentWorkspace } = useWorkspaces();
  const [pages, setPages] = useState<Page[]>([]);
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load pages when workspace changes
  const loadPages = useCallback(async () => {
    if (!currentWorkspace || !user) {
      setPages([]);
      setLoading(false);
      return;
    }

    console.log('[WorkspaceContext] Loading pages for workspace:', currentWorkspace.id);
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('pages')
        .select('*')
        .eq('workspace_id', currentWorkspace.id)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('[WorkspaceContext] Error loading pages:', error);
        throw error;
      }

      console.log('[WorkspaceContext] Loaded pages:', data?.length);

      const transformedPages: Page[] = (data || []).map(p => ({
        id: p.id,
        title: p.title || 'Без названия',
        icon: p.icon || '📄',
        parentId: p.parent_id,
        blocks: [],
        isFavorite: p.is_favorite || false,
        isArchived: p.is_archived || false,
        createdAt: new Date(p.created_at),
        updatedAt: new Date(p.updated_at),
      }));

      setPages(transformedPages);
    } catch (error) {
      console.error('[WorkspaceContext] Exception loading pages:', error);
      setPages([]);
    } finally {
      setLoading(false);
    }
  }, [currentWorkspace, user]);

  // Load blocks for a specific page
  const loadBlocks = useCallback(async (pageId: string): Promise<Block[]> => {
    console.log('[WorkspaceContext] Loading blocks for page:', pageId);

    try {
      const { data, error } = await supabase
        .from('blocks')
        .select('*')
        .eq('page_id', pageId)
        .order('position', { ascending: true });

      if (error) {
        console.error('[WorkspaceContext] Error loading blocks:', error);
        throw error;
      }

      console.log('[WorkspaceContext] Loaded blocks:', data?.length);

      return (data || []).map(b => ({
        id: b.id,
        type: b.type as any,
        content: b.content || '',
      }));
    } catch (error) {
      console.error('[WorkspaceContext] Exception loading blocks:', error);
      return [];
    }
  }, []);

  useEffect(() => {
    loadPages();
  }, [loadPages]);

  const createPage = useCallback(async (title: string, parentId: string | null = null): Promise<Page | null> => {
    if (!currentWorkspace || !user) {
      console.error('[WorkspaceContext] No workspace or user');
      return null;
    }

    console.log('[WorkspaceContext] Creating page:', { title, parentId, workspace_id: currentWorkspace.id });

    try {
      const { data, error } = await supabase
        .from('pages')
        .insert({
          workspace_id: currentWorkspace.id,
          parent_id: parentId,
          title: title || 'Без названия',
          created_by: user.id,
          is_favorite: false,
          is_archived: false,
          is_deleted: false,
        })
        .select()
        .single();

      if (error) {
        console.error('[WorkspaceContext] Error creating page:', error);
        throw error;
      }

      console.log('[WorkspaceContext] Page created:', data);

      const newPage: Page = {
        id: data.id,
        title: data.title,
        icon: data.icon || '📄',
        parentId: data.parent_id,
        blocks: [],
        isFavorite: data.is_favorite,
        isArchived: data.is_archived,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      setPages(prev => [...prev, newPage]);
      return newPage;
    } catch (error) {
      console.error('[WorkspaceContext] Exception creating page:', error);
      return null;
    }
  }, [currentWorkspace, user]);

  const updatePage = useCallback(async (id: string, updates: Partial<Page>) => {
    console.log('[WorkspaceContext] Updating page:', id, updates);

    try {
      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.icon !== undefined) dbUpdates.icon = updates.icon;
      if (updates.isFavorite !== undefined) dbUpdates.is_favorite = updates.isFavorite;
      if (updates.isArchived !== undefined) dbUpdates.is_archived = updates.isArchived;
      if (updates.parentId !== undefined) dbUpdates.parent_id = updates.parentId;

      const { error } = await supabase
        .from('pages')
        .update(dbUpdates)
        .eq('id', id);

      if (error) {
        console.error('[WorkspaceContext] Error updating page:', error);
        throw error;
      }

      setPages(prev => prev.map(page =>
        page.id === id ? { ...page, ...updates, updatedAt: new Date() } : page
      ));
    } catch (error) {
      console.error('[WorkspaceContext] Exception updating page:', error);
    }
  }, []);

  const deletePage = useCallback(async (id: string) => {
    console.log('[WorkspaceContext] Archiving page:', id);

    try {
      const { error } = await supabase
        .from('pages')
        .update({ is_archived: true })
        .eq('id', id);

      if (error) {
        console.error('[WorkspaceContext] Error archiving page:', error);
        throw error;
      }

      setPages(prev => prev.map(page =>
        page.id === id ? { ...page, isArchived: true } : page
      ));
    } catch (error) {
      console.error('[WorkspaceContext] Exception archiving page:', error);
    }
  }, []);

  const duplicatePage = useCallback(async (id: string): Promise<Page | null> => {
    const page = pages.find(p => p.id === id);
    if (!page || !currentWorkspace || !user) return null;

    console.log('[WorkspaceContext] Duplicating page:', id);

    try {
      const { data, error } = await supabase
        .from('pages')
        .insert({
          workspace_id: currentWorkspace.id,
          parent_id: page.parentId,
          title: `${page.title} (копия)`,
          icon: page.icon,
          created_by: user.id,
          is_favorite: false,
          is_archived: false,
          is_deleted: false,
        })
        .select()
        .single();

      if (error) {
        console.error('[WorkspaceContext] Error duplicating page:', error);
        throw error;
      }

      const newPage: Page = {
        id: data.id,
        title: data.title,
        icon: data.icon || '📄',
        parentId: data.parent_id,
        blocks: [],
        isFavorite: false,
        isArchived: false,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };

      setPages(prev => [...prev, newPage]);
      return newPage;
    } catch (error) {
      console.error('[WorkspaceContext] Exception duplicating page:', error);
      return null;
    }
  }, [pages, currentWorkspace, user]);

  const restorePage = useCallback(async (id: string) => {
    console.log('[WorkspaceContext] Restoring page:', id);

    try {
      const { error } = await supabase
        .from('pages')
        .update({ is_archived: false })
        .eq('id', id);

      if (error) {
        console.error('[WorkspaceContext] Error restoring page:', error);
        throw error;
      }

      setPages(prev => prev.map(page =>
        page.id === id ? { ...page, isArchived: false } : page
      ));
    } catch (error) {
      console.error('[WorkspaceContext] Exception restoring page:', error);
    }
  }, []);

  const permanentlyDeletePage = useCallback(async (id: string) => {
    console.log('[WorkspaceContext] Permanently deleting page:', id);

    try {
      const { error } = await supabase
        .from('pages')
        .update({ is_deleted: true })
        .eq('id', id);

      if (error) {
        console.error('[WorkspaceContext] Error deleting page:', error);
        throw error;
      }

      setPages(prev => prev.filter(page => page.id !== id));
    } catch (error) {
      console.error('[WorkspaceContext] Exception deleting page:', error);
    }
  }, []);

  const movePage = useCallback(async (id: string, newParentId: string | null) => {
    console.log('[WorkspaceContext] Moving page:', id, 'to parent:', newParentId);

    try {
      const { error } = await supabase
        .from('pages')
        .update({ parent_id: newParentId })
        .eq('id', id);

      if (error) {
        console.error('[WorkspaceContext] Error moving page:', error);
        throw error;
      }

      setPages(prev => prev.map(page =>
        page.id === id ? { ...page, parentId: newParentId, updatedAt: new Date() } : page
      ));
    } catch (error) {
      console.error('[WorkspaceContext] Exception moving page:', error);
    }
  }, []);

  const toggleFavorite = useCallback(async (id: string) => {
    const page = pages.find(p => p.id === id);
    if (!page) return;

    console.log('[WorkspaceContext] Toggling favorite:', id);

    try {
      const { error } = await supabase
        .from('pages')
        .update({ is_favorite: !page.isFavorite })
        .eq('id', id);

      if (error) {
        console.error('[WorkspaceContext] Error toggling favorite:', error);
        throw error;
      }

      setPages(prev => prev.map(p =>
        p.id === id ? { ...p, isFavorite: !p.isFavorite } : p
      ));
    } catch (error) {
      console.error('[WorkspaceContext] Exception toggling favorite:', error);
    }
  }, [pages]);

  const addBlock = useCallback(async (pageId: string, block: Omit<Block, 'id'>, afterBlockId?: string) => {
    console.log('[WorkspaceContext] Adding block to page:', pageId);

    try {
      // Get current blocks to calculate position
      const { data: existingBlocks } = await supabase
        .from('blocks')
        .select('position')
        .eq('page_id', pageId)
        .order('position', { ascending: false })
        .limit(1);

      const position = existingBlocks && existingBlocks.length > 0
        ? existingBlocks[0].position + 1
        : 0;

      const { data, error } = await supabase
        .from('blocks')
        .insert({
          page_id: pageId,
          type: block.type,
          content: block.content || '',
          position,
        })
        .select()
        .single();

      if (error) {
        console.error('[WorkspaceContext] Error adding block:', error);
        throw error;
      }

      console.log('[WorkspaceContext] Block added:', data);

      // Update local state
      setPages(prev => prev.map(page => {
        if (page.id !== pageId) return page;
        const newBlock: Block = {
          id: data.id,
          type: data.type as any,
          content: data.content || '',
        };
        return {
          ...page,
          blocks: [...page.blocks, newBlock],
          updatedAt: new Date(),
        };
      }));
    } catch (error) {
      console.error('[WorkspaceContext] Exception adding block:', error);
    }
  }, []);

  const updateBlock = useCallback(async (pageId: string, blockId: string, updates: Partial<Block>) => {
    console.log('[WorkspaceContext] Updating block:', blockId);

    try {
      const dbUpdates: any = {};
      if (updates.type !== undefined) dbUpdates.type = updates.type;
      if (updates.content !== undefined) dbUpdates.content = updates.content;

      const { error } = await supabase
        .from('blocks')
        .update(dbUpdates)
        .eq('id', blockId);

      if (error) {
        console.error('[WorkspaceContext] Error updating block:', error);
        throw error;
      }

      setPages(prev => prev.map(page => {
        if (page.id !== pageId) return page;
        return {
          ...page,
          blocks: page.blocks.map(block =>
            block.id === blockId ? { ...block, ...updates } : block
          ),
          updatedAt: new Date(),
        };
      }));
    } catch (error) {
      console.error('[WorkspaceContext] Exception updating block:', error);
    }
  }, []);

  const deleteBlock = useCallback(async (pageId: string, blockId: string) => {
    console.log('[WorkspaceContext] Deleting block:', blockId);

    try {
      const { error } = await supabase
        .from('blocks')
        .delete()
        .eq('id', blockId);

      if (error) {
        console.error('[WorkspaceContext] Error deleting block:', error);
        throw error;
      }

      setPages(prev => prev.map(page => {
        if (page.id !== pageId) return page;
        return {
          ...page,
          blocks: page.blocks.filter(block => block.id !== blockId),
          updatedAt: new Date(),
        };
      }));
    } catch (error) {
      console.error('[WorkspaceContext] Exception deleting block:', error);
    }
  }, []);

  const duplicateBlock = useCallback(async (pageId: string, blockId: string) => {
    const page = pages.find(p => p.id === pageId);
    if (!page) return;

    const block = page.blocks.find(b => b.id === blockId);
    if (!block) return;

    console.log('[WorkspaceContext] Duplicating block:', blockId);

    try {
      const { data: existingBlocks } = await supabase
        .from('blocks')
        .select('position')
        .eq('page_id', pageId)
        .order('position', { ascending: false })
        .limit(1);

      const position = existingBlocks && existingBlocks.length > 0
        ? existingBlocks[0].position + 1
        : 0;

      const { data, error } = await supabase
        .from('blocks')
        .insert({
          page_id: pageId,
          type: block.type,
          content: block.content,
          position,
        })
        .select()
        .single();

      if (error) {
        console.error('[WorkspaceContext] Error duplicating block:', error);
        throw error;
      }

      const newBlock: Block = {
        id: data.id,
        type: data.type as any,
        content: data.content || '',
      };

      setPages(prev => prev.map(p => {
        if (p.id !== pageId) return p;
        return {
          ...p,
          blocks: [...p.blocks, newBlock],
          updatedAt: new Date(),
        };
      }));
    } catch (error) {
      console.error('[WorkspaceContext] Exception duplicating block:', error);
    }
  }, [pages]);

  const moveBlock = useCallback(async (pageId: string, blockId: string, newIndex: number) => {
    console.log('[WorkspaceContext] Moving block:', blockId, 'to index:', newIndex);

    // Update local state immediately for responsiveness
    setPages(prev => prev.map(page => {
      if (page.id !== pageId) return page;
      const blocks = [...page.blocks];
      const oldIndex = blocks.findIndex(b => b.id === blockId);
      if (oldIndex === -1) return page;
      const [block] = blocks.splice(oldIndex, 1);
      blocks.splice(newIndex, 0, block);
      return { ...page, blocks, updatedAt: new Date() };
    }));

    // Update positions in database
    try {
      const page = pages.find(p => p.id === pageId);
      if (!page) return;

      const blocks = [...page.blocks];
      const oldIndex = blocks.findIndex(b => b.id === blockId);
      if (oldIndex === -1) return;
      const [block] = blocks.splice(oldIndex, 1);
      blocks.splice(newIndex, 0, block);

      // Update all block positions
      for (let i = 0; i < blocks.length; i++) {
        await supabase
          .from('blocks')
          .update({ position: i })
          .eq('id', blocks[i].id);
      }
    } catch (error) {
      console.error('[WorkspaceContext] Exception moving block:', error);
    }
  }, [pages]);

  const getPage = useCallback((id: string) => {
    return pages.find(page => page.id === id);
  }, [pages]);

  const getPagePath = useCallback((id: string): Page[] => {
    const path: Page[] = [];
    let currentPage = pages.find(p => p.id === id);
    while (currentPage) {
      path.unshift(currentPage);
      currentPage = currentPage.parentId ? pages.find(p => p.id === currentPage!.parentId) : undefined;
    }
    return path;
  }, [pages]);

  const getRootPages = useCallback(() => {
    return pages.filter(page => page.parentId === null && !page.isArchived);
  }, [pages]);

  const getChildPages = useCallback((parentId: string) => {
    return pages.filter(page => page.parentId === parentId && !page.isArchived);
  }, [pages]);

  const getFavoritePages = useCallback(() => {
    return pages.filter(page => page.isFavorite && !page.isArchived);
  }, [pages]);

  const getArchivedPages = useCallback(() => {
    return pages.filter(page => page.isArchived);
  }, [pages]);

  return (
    <WorkspaceContext.Provider value={{
      currentWorkspaceId: currentWorkspace?.id || null,
      currentPageId,
      pages,
      loading,
      setCurrentPageId,
      createPage,
      updatePage,
      deletePage,
      duplicatePage,
      restorePage,
      permanentlyDeletePage,
      movePage,
      toggleFavorite,
      addBlock,
      updateBlock,
      deleteBlock,
      duplicateBlock,
      moveBlock,
      getPage,
      getPagePath,
      getRootPages,
      getChildPages,
      getFavoritePages,
      getArchivedPages,
      loadPages,
      loadBlocks,
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
};
