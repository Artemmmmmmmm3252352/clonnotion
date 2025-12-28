# Multi-Tenant Workspace System

This document describes the complete multi-tenant SaaS architecture implementation with workspaces, boards, pages, role-based access control, and collaboration features.

## Features Implemented

### 1. Authentication System

- **Email/Password Registration**: Users can register with email, password, and full name
- **Login**: Secure authentication with Supabase Auth
- **Password Reset**: Users can reset their password via email link
- **Session Management**: Automatic session refresh and persistence
- **Protected Routes**: All application routes are protected and require authentication

#### Files:
- `src/contexts/AuthContext.tsx` - Authentication context provider
- `src/pages/Auth/LoginPage.tsx` - Login page
- `src/pages/Auth/RegisterPage.tsx` - Registration page
- `src/pages/Auth/ForgotPasswordPage.tsx` - Password reset page
- `src/components/ProtectedRoute.tsx` - Route protection wrapper

### 2. Database Schema

#### Tables:

**profiles**
- Extended user information (full_name, avatar_url, etc.)
- Automatically created on user signup

**workspaces**
- Isolated workspaces for users or teams
- Each user gets a personal workspace by default
- Support for team workspaces

**workspace_members**
- Membership and roles: owner, editor, commenter, viewer
- Controls who has access to a workspace

**boards**
- Organizational boards within workspaces
- Types: kanban, list, calendar, table
- Access control: private, invite_only, public_read

**board_members**
- Board-specific access control
- Allows granular permissions at board level

**pages**
- Content pages within boards or workspaces
- Hierarchical structure with parent/child relationships
- Individual access control settings

**page_members**
- Page-specific access control
- Finest level of permission granularity

**blocks**
- Content blocks within pages
- Types: text, task, checklist, heading, image, code, quote
- JSONB content for flexible data storage

**invitations**
- Pending invitations to workspaces, boards, or pages
- Token-based secure invitation system
- 7-day expiration by default

### 3. Role-Based Access Control (RBAC)

#### Roles:

1. **Owner**
   - Full access to workspace/board/page
   - Can manage members and permissions
   - Can delete resources

2. **Editor**
   - Can create and edit content
   - Cannot manage members or delete workspace

3. **Commenter**
   - Can view content and add comments
   - Cannot edit content

4. **Viewer**
   - Read-only access
   - Cannot make any changes

### 4. Row Level Security (RLS)

All tables have comprehensive RLS policies:

- **Workspace Isolation**: Users can only access workspaces they're members of
- **Hierarchical Access**: Access flows from workspace → board → page
- **Role Enforcement**: Actions are restricted based on user roles
- **Public Access**: Public resources can be viewed by anyone (when configured)

### 5. Edge Functions

#### send-invitation
- Creates invitation records
- Generates secure invitation tokens
- Returns invitation URL to share with recipients

**Endpoint**: `{SUPABASE_URL}/functions/v1/send-invitation`

**Request Body**:
```json
{
  "email": "user@example.com",
  "role": "editor",
  "workspaceId": "uuid" // or boardId or pageId
}
```

#### accept-invitation
- Validates invitation tokens
- Adds user to appropriate member table
- Marks invitation as accepted

**Endpoint**: `{SUPABASE_URL}/functions/v1/accept-invitation`

**Request Body**:
```json
{
  "token": "invitation-token"
}
```

### 6. Frontend Components

#### Workspace Management
- `useWorkspaces` hook - Manages workspace state and operations
- `WorkspaceSwitcher` - UI for switching between workspaces
- Automatic personal workspace creation on signup

#### Sharing & Collaboration
- `ShareModal` - Invite members and manage permissions
- Role selection dropdown
- Member list with role management
- Remove member functionality
- Copy invitation link

#### Authentication UI
- Clean, modern design with Tailwind CSS
- Form validation and error handling
- Loading states
- Responsive layout

### 7. Integration Points

#### Sidebar Updates
- Workspace switcher at the top
- Share workspace button
- User profile with sign out option
- All existing features preserved

#### Routing
- Public routes: `/login`, `/register`, `/forgot-password`
- Protected routes: All application pages
- Automatic redirect to login when not authenticated

## How to Use

### For Users

1. **Sign Up**
   - Navigate to `/register`
   - Enter full name, email, and password
   - A personal workspace is automatically created

2. **Create Team Workspace**
   - Click on workspace switcher
   - Select "Create new workspace"
   - Enter workspace name

3. **Invite Team Members**
   - Click "Share workspace" button in sidebar
   - Enter team member's email
   - Select their role
   - Share the invitation link

4. **Accept Invitation**
   - Receive invitation link
   - Click the link and sign in
   - Invitation is automatically accepted

5. **Manage Permissions**
   - Open share modal
   - See list of all members
   - Change roles or remove members
   - Only owners can manage permissions

### For Developers

#### Database Migrations
All migrations are in Supabase and can be viewed with:
```bash
supabase migrations list
```

#### Environment Variables
Required in `.env`:
```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

#### Key Hooks

**useAuth**
```typescript
const { user, profile, signIn, signUp, signOut, resetPassword } = useAuth();
```

**useWorkspaces**
```typescript
const {
  workspaces,
  currentWorkspace,
  createWorkspace,
  switchWorkspace,
  inviteMember,
  getWorkspaceMembers
} = useWorkspaces();
```

## Security Considerations

1. **RLS Policies**: All data access is controlled by Row Level Security
2. **Token-Based Invitations**: Secure, time-limited invitation tokens
3. **JWT Authentication**: Supabase handles all authentication securely
4. **No Client-Side Security Bypass**: All permissions checked server-side

## Future Enhancements

Potential areas for expansion:

1. **Real-time Collaboration**
   - Presence indicators
   - Live cursors
   - Instant updates using Supabase Realtime

2. **Comments System**
   - Add comments to pages and blocks
   - Mention other users
   - Comment threads

3. **Activity Feed**
   - Track all changes in workspace
   - User activity history
   - Audit log

4. **Email Notifications**
   - Invitation emails
   - Activity notifications
   - Digest emails

5. **Advanced Permissions**
   - Custom roles
   - Per-field permissions
   - Time-limited access

6. **Workspace Templates**
   - Pre-configured workspace setups
   - Industry-specific templates
   - Team onboarding templates

## Architecture Notes

- **Multi-tenant by Design**: Complete data isolation between workspaces
- **Hierarchical Permissions**: Workspace → Board → Page access inheritance
- **Flexible Sharing**: Fine-grained control at each level
- **Scalable**: Built on Supabase with PostgreSQL backend
- **Type-Safe**: TypeScript throughout the application
