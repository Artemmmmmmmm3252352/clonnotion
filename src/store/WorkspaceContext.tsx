import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Workspace, Page, Block, Database } from './types';

const generateId = () => Math.random().toString(36).substr(2, 9);

const defaultPages: Page[] = [
  {
    id: 'welcome',
    title: 'Добро пожаловать в NoteZero!',
    icon: '👋',
    parentId: null,
    blocks: [
      { id: 'w1', type: 'heading1', content: 'Добро пожаловать в NoteZero!' },
      { id: 'w2', type: 'todo', content: 'Создайте аккаунт в NoteZero', checked: true },
      { id: 'w3', type: 'todo', content: 'Скачайте десктопное приложение для работы офлайн и используйте NoteZero где угодно', checked: true },
      { id: 'w4', type: 'todo', content: 'Нажмите в любом месте ниже и введите / чтобы увидеть что можно создать — заголовки, таблицы, задачи и т.д.', checked: true },
      { id: 'w5', type: 'todo', content: 'Введите /page чтобы добавить новую страницу и вкладывать что угодно куда угодно', checked: false },
      { id: 'w6', type: 'todo', content: 'Находите, организуйте и добавляйте новые страницы через боковую панель слева ⭐', checked: false },
      { id: 'w7', type: 'todo', content: 'Посмотрите Список задач, который мы добавили для вас с дополнительными советами', checked: false },
      { id: 'w8', type: 'todo', content: 'Создайте новую страницу и введите /meet: для записи заметок встреч', checked: false },
      { id: 'w9', type: 'todo', content: 'Нажмите на 🤖 NoteZero AI в правом нижнем углу экрана чтобы узнать возможности Агента', checked: false },
      { id: 'w10', type: 'toggle', content: 'Это блок-переключатель. Нажмите на треугольник чтобы увидеть ещё несколько полезных советов!' },
    ],
    isFavorite: false,
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'todo-list',
    title: 'Список задач',
    icon: '✅',
    parentId: null,
    blocks: [
      { id: 't1', type: 'heading1', content: 'Список задач' },
      { id: 't2', type: 'text', content: 'Ваши задачи и дела организованы в одном месте.' },
    ],
    isFavorite: false,
    isArchived: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'q4-project',
    title: 'План на Q4',
    icon: '📋',
    parentId: null,
    blocks: [
      { id: '8', type: 'heading1', content: 'План на Q4' },
      { id: '9', type: 'text', content: 'Ключевые этапы и стратегия на предстоящий квартал.' },
      { id: '10', type: 'heading2', content: 'Цели' },
      { id: '11', type: 'bulleted_list', content: 'Завершить исследование пользователей' },
      { id: '12', type: 'bulleted_list', content: 'Запустить MVP' },
      { id: '13', type: 'bulleted_list', content: 'Собрать обратную связь' },
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
    name: 'Список задач',
    icon: '✅',
    properties: [
      { id: 'name', name: 'Название', type: 'text' },
      { 
        id: 'status', 
        name: 'Статус', 
        type: 'select',
        options: [
          { id: 'todo', name: 'К выполнению', color: 'bg-[#efefec] text-[#65645f]' },
          { id: 'done', name: 'Готово', color: 'bg-[#d3f5e1] text-[#0d7d3d]' },
        ]
      },
      { id: 'due-date', name: 'Срок', type: 'date' },
    ],
    rows: [
      { id: 'task1', properties: { name: 'Отметьте галочку чтобы отметить задачу выполненной', status: 'done', 'due-date': 'Сегодня' }, pageId: '' },
      { id: 'task2', properties: { name: 'Нажмите на срок чтобы изменить его', status: 'todo', 'due-date': 'Сегодня' }, pageId: '' },
      { id: 'task3', properties: { name: 'Нажмите на меня чтобы увидеть больше деталей', status: 'todo', 'due-date': 'Сегодня' }, pageId: '' },
      { id: 'task4', properties: { name: 'Нажмите синюю кнопку Создать для добавления задачи', status: 'todo', 'due-date': 'Сегодня' }, pageId: '' },
      { id: 'task5', properties: { name: 'Нажмите на меня чтобы узнать как скрыть выполненные задачи', status: 'todo', 'due-date': 'Сегодня' }, pageId: '' },
      { id: 'task6', properties: { name: 'Смотрите выполненные задачи в представлении «Готово»', status: 'todo', 'due-date': 'Сегодня' }, pageId: '' },
      { id: 'task7', properties: { name: 'Нажмите на меня чтобы узнать как просматривать контент по-своему', status: 'todo', 'due-date': 'Завтра' }, pageId: '' },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const initialWorkspace: Workspace = {
  id: 'default',
  name: 'Личное пространство',
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
      title: title || 'Без названия',
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
      title: `${page.title} (копия)`,
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
      name: name || 'Без названия',
      icon: '📋',
      properties: [
        { id: 'name', name: 'Название', type: 'text' },
        { 
          id: 'status', 
          name: 'Статус', 
          type: 'select',
          options: [
            { id: 'todo', name: 'К выполнению', color: 'bg-[#efefec] text-[#65645f]' },
            { id: 'in-progress', name: 'В процессе', color: 'bg-[#dbeafe] text-[#1e40af]' },
            { id: 'done', name: 'Готово', color: 'bg-[#d3f5e1] text-[#0d7d3d]' },
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
