# NoteZero - Notion Clone

## Overview
A Notion-like workspace application with project management, task tracking, and note-taking capabilities.

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
    Sidebar/         - Navigation sidebar
    ui/              - Reusable UI components (badge, button, card, checkbox, input, select)
  lib/               - Utility functions
  pages/
    Home/            - Home page with recent pages and favorites
    Projects/        - Project cards with progress tracking
    TasksDB/         - Tasks database table view
    NotesDB/         - Notes database with tags
    Archive/         - Archived items with restore/delete
  screens/           - Legacy Figma import (not in use)
public/              - Static assets (images, backgrounds)
```

## Pages
- **Home** (`/`) - Welcome page with recent pages and favorites
- **Projects** (`/projects`) - Project cards with progress bars
- **Tasks DB** (`/tasks`) - Task database with status, priority, and due dates
- **Notes DB** (`/notes`) - Notes with tags and authors
- **Archive** (`/archive`) - Archived items management

## Development
- Dev server: `npm run dev` (runs on port 5000)
- Build: `npm run build` (outputs to dist/)

## Deployment
Configured for static deployment with:
- Build command: `npm run build`
- Public directory: `dist`
