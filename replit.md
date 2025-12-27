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
    Layout/          - Main layout with collapsible sidebar
    Sidebar/         - Dynamic navigation with page tree
    Editor/          - Block-based content editor
    RecordModal/     - Database record detail modal
    ui/              - Reusable UI components
  lib/               - Utility functions
  store/             - WorkspaceContext for state management
    types.ts         - Type definitions (Page, Block, Database, etc.)
    WorkspaceContext - Context provider with CRUD operations
  pages/
    Home/            - Home page with recent pages and favorites
    PageEditor/      - Block-based page editor with slash commands
    Database/        - Database view with clickable rows
    Search/          - Global search across pages and databases
public/              - Static assets
```

## Core Features
- **Block Editor**: 13 block types (text, h1-h3, lists, todo, quote, divider, code, callout, toggle, image) with color options
- **Slash Commands**: Type "/" to open block type menu
- **Block Menu**: Hover to access Duplicate, Turn into, Color, Delete actions
- **Drag-and-Drop**: Reorder blocks with grip handle
- **Page Covers**: 10 gradient presets and 8 solid color options
- **Page Icons**: 20+ emoji options for page customization
- **Breadcrumbs**: Full page hierarchy path navigation
- **Page Tree**: Hierarchical pages with expand/collapse
- **Page Context Menu**: Rename, Duplicate, Add to favorites, Delete pages
- **Favorites**: Star pages to pin in sidebar
- **Collapsible Sidebar**: Toggle button to collapse/expand sidebar with smooth animation
- **Databases**: Multiple views - Table, Board (Kanban), Calendar, List
- **Record Modal**: Click any database row to open record details as a modal overlay
- **Filter & Sort**: Dynamic filtering and sorting for database views
- **Trash**: Restore or permanently delete archived pages
- **Global Search**: Search pages, blocks, and database records

## Routes
- `/` - Home with quick access cards
- `/page/:pageId` - Block-based page editor with covers and breadcrumbs
- `/database/:databaseId` - Database view with Table/Board/Calendar/List and record modal
- `/search` - Global search page
- `/trash` - Archived pages with restore/delete options

## Recent Changes (December 2024)
- Added page cover images (gradients and solid colors)
- Expanded emoji picker for page icons
- Added breadcrumb navigation
- Extended block types: Code, Callout, Toggle, Image
- Created RecordModal for database record details
- Implemented collapsible sidebar with state preservation
- Restructured sidebar with Notion-style sections (Search, Home, Meetings, NoteZero AI, Inbox, Private, Shared, etc.)
- Created Welcome to NoteZero! onboarding page with checklist
- Added To Do List database with onboarding tasks
- Implemented Share panel with invite and copy link functionality
- Added global search modal (Ctrl+K shortcut)
- Created floating AI chat widget with message history
- Built Template Gallery modal for page creation
- Added Settings, Marketplace, Inbox, Meetings, and AI pages

## Development
- Dev server: `npm run dev` (port 5000)
- Build: `npm run build` (outputs to dist/)

## Deployment
Static deployment with build command and dist/ directory
