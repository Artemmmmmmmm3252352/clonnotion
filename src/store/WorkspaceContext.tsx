import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Workspace, Page, Block, Database, BlockType } from './types';

const generateId = () => Math.random().toString(36).substr(2, 9);

const defaultPages: Page[] = [
  {
    id: 'home',
    title: 'Home',
    icon: '🏠',
    parentId: null,
    blocks: [
      { id: '1', type: 'heading1', content: 'Welcome to NoteZero' },
      { id: '2', type: 'text', content: 'Start creating pages and organizing your workspace.' },
    ],
    isFavorite: true,
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: '🚀',
    parentId: null,
    blocks: [
      { id: '3', type: 'heading1', content: 'Getting Started' },
      { id: '4', type: 'text', content: 'This is your first page. Click anywhere to start typing.' },
      { id: '5', type: 'todo', content: 'Create your first page', checked: false },
      { id: '6', type: 'todo', content: 'Add some blocks', checked: false },
      { id: '7', type: 'todo', content: 'Explore the sidebar', checked: true },
    ],
    isFavorite: false,
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'q4-project',
    title: 'Q4 Project Plan',
    icon: '📋',
    parentId: null,
    blocks: [
      { id: '8', type: 'heading1', content: 'Q4 Project Plan' },
      { id: '9', type: 'text', content: 'Key milestones and strategy for the upcoming quarter.' },
      { id: '10', type: 'heading2', content: 'Goals' },
      { id: '11', type: 'bulleted_list', content: 'Complete user research' },
      { id: '12', type: 'bulleted_list', content: 'Launch MVP' },
      { id: '13', type: 'bulleted_list', content: 'Gather feedback' },
    ],
    isFavorite: true,
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const defaultDatabases: Database[] = [
  {
    id: 'tasks-db',
    name: 'Tasks',
    icon: '✅',
    properties: [
      { id: 'name', name: 'Name', type: 'text' },
      { 
        id: 'status', 
        name: 'Status', 
        type: 'select',
        options: [
          { id: 'todo', name: 'To Do', color: 'bg-[#efefec] text-[#65645f]' },
          { id: 'in-progress', name: 'In Progress', color: 'bg-[#dbeafe] text-[#1e40af]' },
          { id: 'done', name: 'Done', color: 'bg-[#d3f5e1] text-[#0d7d3d]' },
        ]
      },
      { 
        id: 'priority', 
        name: 'Priority', 
        type: 'select',
        options: [
          { id: 'low', name: 'Low', color: 'bg-[#dbeafe] text-[#1e40af]' },
          { id: 'medium', name: 'Medium', color: 'bg-[#fef3c7] text-[#b45309]' },
          { id: 'high', name: 'High', color: 'bg-[#ffd4d4] text-[#c41e1e]' },
        ]
      },
      { id: 'due-date', name: 'Due Date', type: 'date' },
    ],
    rows: [
      { id: 'task1', properties: { name: 'Research Competitors', status: 'in-progress', priority: 'high', 'due-date': '2024-10-15' }, pageId: '' },
      { id: 'task2', properties: { name: 'Draft Roadmap', status: 'todo', priority: 'medium', 'due-date': '2024-11-01' }, pageId: '' },
      { id: 'task3', properties: { name: 'UI Design', status: 'done', priority: 'low', 'due-date': '2024-09-30' }, pageId: '' },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const initialWorkspace: Workspace = {
  id: 'default',
  name: 'Personal Workspace',
  pages: defaultPages,
  databases: defaultDatabases,
};

interface WorkspaceContextType {
  workspace: Workspace;
  currentPageId: string | null;
  setCurrentPageId: (id: string | null) => void;
  createPage: (title: string, parentId?: string | null) => Page;
  updatePage: (id: string, updates: Partial<Page>) => void;
  deletePage: (id: string) => void;
  toggleFavorite: (id: string) => void;
  addBlock: (pageId: string, block: Omit<Block, 'id'>, afterBlockId?: string) => void;
  updateBlock: (pageId: string, blockId: string, updates: Partial<Block>) => void;
  deleteBlock: (pageId: string, blockId: string) => void;
  getPage: (id: string) => Page | undefined;
  getRootPages: () => Page[];
  getChildPages: (parentId: string) => Page[];
  getFavoritePages: () => Page[];
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
  const [workspace, setWorkspace] = useState<Workspace>(initialWorkspace);
  const [currentPageId, setCurrentPageId] = useState<string | null>('home');

  const createPage = useCallback((title: string, parentId: string | null = null): Page => {
    const newPage: Page = {
      id: generateId(),
      title: title || 'Untitled',
      parentId,
      blocks: [{ id: generateId(), type: 'text', content: '' }],
      isFavorite: false,
      isArchived: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setWorkspace(prev => ({
      ...prev,
      pages: [...prev.pages, newPage],
    }));
    return newPage;
  }, []);

  const updatePage = useCallback((id: string, updates: Partial<Page>) => {
    setWorkspace(prev => ({
      ...prev,
      pages: prev.pages.map(page =>
        page.id === id ? { ...page, ...updates, updatedAt: new Date() } : page
      ),
    }));
  }, []);

  const deletePage = useCallback((id: string) => {
    setWorkspace(prev => ({
      ...prev,
      pages: prev.pages.map(page =>
        page.id === id ? { ...page, isArchived: true } : page
      ),
    }));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setWorkspace(prev => ({
      ...prev,
      pages: prev.pages.map(page =>
        page.id === id ? { ...page, isFavorite: !page.isFavorite } : page
      ),
    }));
  }, []);

  const addBlock = useCallback((pageId: string, block: Omit<Block, 'id'>, afterBlockId?: string) => {
    const newBlock: Block = { ...block, id: generateId() };
    setWorkspace(prev => ({
      ...prev,
      pages: prev.pages.map(page => {
        if (page.id !== pageId) return page;
        const blocks = [...page.blocks];
        if (afterBlockId) {
          const index = blocks.findIndex(b => b.id === afterBlockId);
          blocks.splice(index + 1, 0, newBlock);
        } else {
          blocks.push(newBlock);
        }
        return { ...page, blocks, updatedAt: new Date() };
      }),
    }));
  }, []);

  const updateBlock = useCallback((pageId: string, blockId: string, updates: Partial<Block>) => {
    setWorkspace(prev => ({
      ...prev,
      pages: prev.pages.map(page => {
        if (page.id !== pageId) return page;
        return {
          ...page,
          blocks: page.blocks.map(block =>
            block.id === blockId ? { ...block, ...updates } : block
          ),
          updatedAt: new Date(),
        };
      }),
    }));
  }, []);

  const deleteBlock = useCallback((pageId: string, blockId: string) => {
    setWorkspace(prev => ({
      ...prev,
      pages: prev.pages.map(page => {
        if (page.id !== pageId) return page;
        return {
          ...page,
          blocks: page.blocks.filter(block => block.id !== blockId),
          updatedAt: new Date(),
        };
      }),
    }));
  }, []);

  const getPage = useCallback((id: string) => {
    return workspace.pages.find(page => page.id === id);
  }, [workspace.pages]);

  const getRootPages = useCallback(() => {
    return workspace.pages.filter(page => page.parentId === null && !page.isArchived);
  }, [workspace.pages]);

  const getChildPages = useCallback((parentId: string) => {
    return workspace.pages.filter(page => page.parentId === parentId && !page.isArchived);
  }, [workspace.pages]);

  const getFavoritePages = useCallback(() => {
    return workspace.pages.filter(page => page.isFavorite && !page.isArchived);
  }, [workspace.pages]);

  return (
    <WorkspaceContext.Provider value={{
      workspace,
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
      getRootPages,
      getChildPages,
      getFavoritePages,
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
};
