import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Workspace, Page, Block, Database, BlockType } from './types';

const generateId = () => Math.random().toString(36).substr(2, 9);

const defaultPages: Page[] = [
  {
    id: 'welcome',
    title: 'Welcome to NoteZero!',
    icon: '👋',
    parentId: null,
    blocks: [
      { id: 'w1', type: 'heading1', content: 'Welcome to NoteZero!' },
      { id: 'w2', type: 'todo', content: 'Create an account with NoteZero', checked: true },
      { id: 'w3', type: 'todo', content: 'Download the desktop app to unlock offline mode and take NoteZero with you wherever you go', checked: true },
      { id: 'w4', type: 'todo', content: 'Click anywhere below and type / to see what you can create — headers, tables, to-do\'s, etc.', checked: true },
      { id: 'w5', type: 'todo', content: 'Type /page to add a new page and nest anything, anywhere', checked: false },
      { id: 'w6', type: 'todo', content: 'Find, organize, and add new pages using the sidebar to the left ⭐', checked: false },
      { id: 'w7', type: 'todo', content: 'Check out the To Do List we added for you with more tips and tricks to best use NoteZero', checked: false },
      { id: 'w8', type: 'todo', content: 'Make a new page and type /meet: to capture meeting notes and thoughts effortlessly', checked: false },
      { id: 'w9', type: 'todo', content: 'Click on the 🤖 NoteZero AI face in the bottom right of your screen to see what Agent can do', checked: false },
      { id: 'w10', type: 'toggle', content: 'This is a toggle block. Click the little triangle to see a few more useful tips!' },
    ],
    isFavorite: false,
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'todo-list',
    title: 'To Do List',
    icon: '✅',
    parentId: null,
    blocks: [
      { id: 't1', type: 'heading1', content: 'To Do List' },
      { id: 't2', type: 'text', content: 'Your tasks and action items organized in one place.' },
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
    id: 'todo-db',
    name: 'To Do List',
    icon: '✅',
    properties: [
      { id: 'name', name: 'Name', type: 'text' },
      { 
        id: 'status', 
        name: 'Status', 
        type: 'select',
        options: [
          { id: 'todo', name: 'To Do', color: 'bg-[#efefec] text-[#65645f]' },
          { id: 'done', name: 'Done', color: 'bg-[#d3f5e1] text-[#0d7d3d]' },
        ]
      },
      { id: 'due-date', name: 'Due Date', type: 'date' },
    ],
    rows: [
      { id: 'task1', properties: { name: 'Check the box to mark items as done', status: 'done', 'due-date': 'Today' }, pageId: '' },
      { id: 'task2', properties: { name: 'Click the due date to change it', status: 'todo', 'due-date': 'Today' }, pageId: '' },
      { id: 'task3', properties: { name: 'Click me to see even more detail', status: 'todo', 'due-date': 'Today' }, pageId: '' },
      { id: 'task4', properties: { name: 'Click the blue New button to add a task', status: 'todo', 'due-date': 'Today' }, pageId: '' },
      { id: 'task5', properties: { name: 'Click me to learn how to hide checked items', status: 'todo', 'due-date': 'Today' }, pageId: '' },
      { id: 'task6', properties: { name: 'See finished items in the "Done" view', status: 'todo', 'due-date': 'Today' }, pageId: '' },
      { id: 'task7', properties: { name: 'Click me to learn how to see your content your way', status: 'todo', 'due-date': 'Tomorrow' }, pageId: '' },
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
  duplicatePage: (id: string) => Page | null;
  restorePage: (id: string) => void;
  permanentlyDeletePage: (id: string) => void;
  movePage: (id: string, newParentId: string | null) => void;
  toggleFavorite: (id: string) => void;
  addBlock: (pageId: string, block: Omit<Block, 'id'>, afterBlockId?: string) => void;
  updateBlock: (pageId: string, blockId: string, updates: Partial<Block>) => void;
  deleteBlock: (pageId: string, blockId: string) => void;
  duplicateBlock: (pageId: string, blockId: string) => void;
  moveBlock: (pageId: string, blockId: string, newIndex: number) => void;
  getPage: (id: string) => Page | undefined;
  getPagePath: (id: string) => Page[];
  getRootPages: () => Page[];
  getChildPages: (parentId: string) => Page[];
  getFavoritePages: () => Page[];
  getArchivedPages: () => Page[];
  createDatabase: (name: string) => Database;
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

  const duplicatePage = useCallback((id: string): Page | null => {
    const page = workspace.pages.find(p => p.id === id);
    if (!page) return null;
    
    const newPage: Page = {
      ...page,
      id: generateId(),
      title: `${page.title} (copy)`,
      blocks: page.blocks.map(block => ({ ...block, id: generateId() })),
      isFavorite: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setWorkspace(prev => ({
      ...prev,
      pages: [...prev.pages, newPage],
    }));
    return newPage;
  }, [workspace.pages]);

  const restorePage = useCallback((id: string) => {
    setWorkspace(prev => ({
      ...prev,
      pages: prev.pages.map(page =>
        page.id === id ? { ...page, isArchived: false } : page
      ),
    }));
  }, []);

  const permanentlyDeletePage = useCallback((id: string) => {
    setWorkspace(prev => ({
      ...prev,
      pages: prev.pages.filter(page => page.id !== id),
    }));
  }, []);

  const movePage = useCallback((id: string, newParentId: string | null) => {
    setWorkspace(prev => ({
      ...prev,
      pages: prev.pages.map(page =>
        page.id === id ? { ...page, parentId: newParentId, updatedAt: new Date() } : page
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

  const duplicateBlock = useCallback((pageId: string, blockId: string) => {
    setWorkspace(prev => ({
      ...prev,
      pages: prev.pages.map(page => {
        if (page.id !== pageId) return page;
        const index = page.blocks.findIndex(b => b.id === blockId);
        if (index === -1) return page;
        const block = page.blocks[index];
        const newBlock = { ...block, id: generateId() };
        const blocks = [...page.blocks];
        blocks.splice(index + 1, 0, newBlock);
        return { ...page, blocks, updatedAt: new Date() };
      }),
    }));
  }, []);

  const moveBlock = useCallback((pageId: string, blockId: string, newIndex: number) => {
    setWorkspace(prev => ({
      ...prev,
      pages: prev.pages.map(page => {
        if (page.id !== pageId) return page;
        const blocks = [...page.blocks];
        const oldIndex = blocks.findIndex(b => b.id === blockId);
        if (oldIndex === -1) return page;
        const [block] = blocks.splice(oldIndex, 1);
        blocks.splice(newIndex, 0, block);
        return { ...page, blocks, updatedAt: new Date() };
      }),
    }));
  }, []);

  const getPage = useCallback((id: string) => {
    return workspace.pages.find(page => page.id === id);
  }, [workspace.pages]);

  const getPagePath = useCallback((id: string): Page[] => {
    const path: Page[] = [];
    let currentPage = workspace.pages.find(p => p.id === id);
    while (currentPage) {
      path.unshift(currentPage);
      currentPage = currentPage.parentId ? workspace.pages.find(p => p.id === currentPage!.parentId) : undefined;
    }
    return path;
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

  const getArchivedPages = useCallback(() => {
    return workspace.pages.filter(page => page.isArchived);
  }, [workspace.pages]);

  const createDatabase = useCallback((name: string): Database => {
    const newDatabase: Database = {
      id: generateId(),
      name: name || 'Untitled Database',
      icon: '📋',
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
      ],
      rows: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setWorkspace(prev => ({
      ...prev,
      databases: [...prev.databases, newDatabase],
    }));
    return newDatabase;
  }, []);

  return (
    <WorkspaceContext.Provider value={{
      workspace,
      currentPageId,
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
      createDatabase,
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
};
