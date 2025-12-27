# NoteZero - Notion Clone

## Overview
A Notion-like workspace application with block-based page editing, hierarchical page navigation, databases, and global search.

## Tech Stack
- React 18
- Vite 6
- TypeScript
- Tailwind CSS
- Shadcn UI components (Radix UI primitives)
- React Router DOM v6

## Project Structure
```
src/
  components/
    Layout/          - Main layout with sidebar
    Sidebar/         - Dynamic navigation with page tree
    Editor/          - Block-based content editor
    ui/              - Reusable UI components
  lib/               - Utility functions
  store/             - WorkspaceContext for state management
    types.ts         - Type definitions (Page, Block, Database, etc.)
    WorkspaceContext - Context provider with CRUD operations
  pages/
    Home/            - Home page with recent pages and favorites
    PageEditor/      - Block-based page editor with slash commands
    Search/          - Global search across pages and databases
public/              - Static assets
```

## Core Features
- **Block Editor**: 9 block types (text, h1-h3, lists, todo, quote, divider) with color options
- **Slash Commands**: Type "/" to open block type menu
- **Block Menu**: Hover to access Duplicate, Turn into, Color, Delete actions
- **Drag-and-Drop**: Reorder blocks with grip handle
- **Page Tree**: Hierarchical pages with expand/collapse
- **Page Context Menu**: Rename, Duplicate, Add to favorites, Delete pages
- **Favorites**: Star pages to pin in sidebar
- **Databases**: Multiple views - Table, Board (Kanban), Calendar, List
- **Filter & Sort**: Dynamic filtering and sorting for database views
- **Trash**: Restore or permanently delete archived pages
- **Global Search**: Search pages, blocks, and database records

## Routes
- `/` - Home with quick access cards
- `/page/:pageId` - Block-based page editor
- `/database/:databaseId` - Database view with Table/Board/Calendar/List
- `/search` - Global search page
- `/trash` - Archived pages with restore/delete options

## Development
- Dev server: `npm run dev` (port 5000)
- Build: `npm run build` (outputs to dist/)

## Deployment
Static deployment with build command and dist/ directory
