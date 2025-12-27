export type BlockType = 
  | 'text'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'bulleted_list'
  | 'numbered_list'
  | 'todo'
  | 'quote'
  | 'divider'
  | 'page';

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  checked?: boolean;
  children?: string[];
}

export interface Page {
  id: string;
  title: string;
  icon?: string;
  parentId: string | null;
  blocks: Block[];
  isFavorite: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type PropertyType = 
  | 'text'
  | 'number'
  | 'select'
  | 'multi_select'
  | 'date'
  | 'checkbox'
  | 'url';

export interface SelectOption {
  id: string;
  name: string;
  color: string;
}

export interface Property {
  id: string;
  name: string;
  type: PropertyType;
  options?: SelectOption[];
}

export interface DatabaseRow {
  id: string;
  properties: Record<string, any>;
  pageId: string;
}

export interface Database {
  id: string;
  name: string;
  icon?: string;
  properties: Property[];
  rows: DatabaseRow[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Workspace {
  id: string;
  name: string;
  pages: Page[];
  databases: Database[];
}
