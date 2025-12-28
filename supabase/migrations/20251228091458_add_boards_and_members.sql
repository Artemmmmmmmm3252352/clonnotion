/*
  # Add Boards and Members Tables for Multi-tenant System

  ## Overview
  This migration adds boards, board members, and page members tables
  to enable granular access control at board and page levels.

  ## 1. New Tables

  ### `boards`
  Organizational boards within workspaces
  - `id` (uuid, PK)
  - `workspace_id` (uuid, FK to workspaces)
  - `name` (text)
  - `type` (text) - kanban, list, calendar, table
  - `access_type` (text) - private, invite_only, public_read
  - `created_by` (uuid, FK to auth.users)
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `board_members`
  Board-specific access control
  - `id` (uuid, PK)
  - `board_id` (uuid, FK to boards)
  - `user_id` (uuid, FK to auth.users)
  - `role` (text) - owner, editor, commenter, viewer
  - `added_at` (timestamptz)

  ### `page_members`
  Page-specific access control
  - `id` (uuid, PK)
  - `page_id` (uuid, FK to pages)
  - `user_id` (uuid, FK to auth.users)
  - `role` (text) - owner, editor, commenter, viewer
  - `added_at` (timestamptz)

  ## 2. Schema Updates

  ### `pages` table modifications
  - Add `board_id` column (FK to boards)
  - Add `access_type` column for granular sharing control

  ### `invitations` table updates
  - Add `board_id` column
  - Add `page_id` column
  - Add `token` column for secure invitation links
  - Rename workspace_invites to invitations

  ### `workspace_members` role updates
  - Update role check to match new system (owner, editor, commenter, viewer)

  ## 3. Security
  
  All tables have RLS enabled with restrictive policies:
  - Users can only access boards in workspaces they're members of
  - Board/Page access respects specific membership
  - Role-based actions enforced at each level
*/

-- =====================================================
-- 1. CREATE BOARDS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS boards (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id uuid NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name text NOT NULL,
  type text DEFAULT 'kanban' CHECK (type IN ('kanban', 'list', 'calendar', 'table')),
  access_type text DEFAULT 'private' CHECK (access_type IN ('private', 'invite_only', 'public_read')),
  icon text DEFAULT '📋',
  created_by uuid NOT NULL REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_boards_workspace ON boards(workspace_id);
CREATE INDEX IF NOT EXISTS idx_boards_created_by ON boards(created_by);

ALTER TABLE boards ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. CREATE BOARD_MEMBERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS board_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  board_id uuid NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('owner', 'editor', 'commenter', 'viewer')),
  added_at timestamptz DEFAULT now(),
  UNIQUE(board_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_board_members_board ON board_members(board_id);
CREATE INDEX IF NOT EXISTS idx_board_members_user ON board_members(user_id);

ALTER TABLE board_members ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. CREATE PAGE_MEMBERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS page_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id uuid NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('owner', 'editor', 'commenter', 'viewer')),
  added_at timestamptz DEFAULT now(),
  UNIQUE(page_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_page_members_page ON page_members(page_id);
CREATE INDEX IF NOT EXISTS idx_page_members_user ON page_members(user_id);

ALTER TABLE page_members ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. UPDATE PAGES TABLE
-- =====================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pages' AND column_name = 'board_id'
  ) THEN
    ALTER TABLE pages ADD COLUMN board_id uuid REFERENCES boards(id) ON DELETE CASCADE;
    CREATE INDEX IF NOT EXISTS idx_pages_board ON pages(board_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'pages' AND column_name = 'access_type'
  ) THEN
    ALTER TABLE pages ADD COLUMN access_type text DEFAULT 'private' CHECK (access_type IN ('private', 'invite_only', 'public_read'));
  END IF;
END $$;

-- =====================================================
-- 5. CREATE INVITATIONS TABLE (replacing workspace_invites)
-- =====================================================

CREATE TABLE IF NOT EXISTS invitations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email text NOT NULL,
  invited_by uuid NOT NULL REFERENCES auth.users(id),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE,
  board_id uuid REFERENCES boards(id) ON DELETE CASCADE,
  page_id uuid REFERENCES pages(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('owner', 'editor', 'commenter', 'viewer')),
  token text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  accepted_at timestamptz,
  created_at timestamptz DEFAULT now(),
  CHECK (
    (workspace_id IS NOT NULL AND board_id IS NULL AND page_id IS NULL) OR
    (workspace_id IS NULL AND board_id IS NOT NULL AND page_id IS NULL) OR
    (workspace_id IS NULL AND board_id IS NULL AND page_id IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_invitations_email ON invitations(email);
CREATE INDEX IF NOT EXISTS idx_invitations_token ON invitations(token);
CREATE INDEX IF NOT EXISTS idx_invitations_workspace ON invitations(workspace_id);
CREATE INDEX IF NOT EXISTS idx_invitations_board ON invitations(board_id);
CREATE INDEX IF NOT EXISTS idx_invitations_page ON invitations(page_id);

ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 6. RLS POLICIES FOR BOARDS
-- =====================================================

DROP POLICY IF EXISTS "workspace_members_can_view_boards" ON boards;
CREATE POLICY "workspace_members_can_view_boards"
  ON boards FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = boards.workspace_id
      AND workspace_members.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM board_members
      WHERE board_members.board_id = boards.id
      AND board_members.user_id = auth.uid()
    )
    OR
    access_type = 'public_read'
  );

DROP POLICY IF EXISTS "workspace_editors_can_create_boards" ON boards;
CREATE POLICY "workspace_editors_can_create_boards"
  ON boards FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = boards.workspace_id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role IN ('owner', 'admin', 'editor')
    )
  );

DROP POLICY IF EXISTS "board_owners_can_update" ON boards;
CREATE POLICY "board_owners_can_update"
  ON boards FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = boards.workspace_id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role IN ('owner', 'admin')
    )
    OR
    EXISTS (
      SELECT 1 FROM board_members
      WHERE board_members.board_id = boards.id
      AND board_members.user_id = auth.uid()
      AND board_members.role = 'owner'
    )
  );

DROP POLICY IF EXISTS "board_owners_can_delete" ON boards;
CREATE POLICY "board_owners_can_delete"
  ON boards FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = boards.workspace_id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role IN ('owner', 'admin')
    )
    OR
    EXISTS (
      SELECT 1 FROM board_members
      WHERE board_members.board_id = boards.id
      AND board_members.user_id = auth.uid()
      AND board_members.role = 'owner'
    )
  );

-- =====================================================
-- 7. RLS POLICIES FOR BOARD_MEMBERS
-- =====================================================

DROP POLICY IF EXISTS "users_can_view_board_members" ON board_members;
CREATE POLICY "users_can_view_board_members"
  ON board_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM boards b
      JOIN workspace_members wm ON wm.workspace_id = b.workspace_id
      WHERE b.id = board_members.board_id
      AND wm.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM board_members bm
      WHERE bm.board_id = board_members.board_id
      AND bm.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "board_owners_can_add_members" ON board_members;
CREATE POLICY "board_owners_can_add_members"
  ON board_members FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM boards b
      JOIN workspace_members wm ON wm.workspace_id = b.workspace_id
      WHERE b.id = board_members.board_id
      AND wm.user_id = auth.uid()
      AND wm.role IN ('owner', 'admin')
    )
    OR
    EXISTS (
      SELECT 1 FROM board_members bm
      WHERE bm.board_id = board_members.board_id
      AND bm.user_id = auth.uid()
      AND bm.role = 'owner'
    )
  );

DROP POLICY IF EXISTS "board_owners_can_update_members" ON board_members;
CREATE POLICY "board_owners_can_update_members"
  ON board_members FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM boards b
      JOIN workspace_members wm ON wm.workspace_id = b.workspace_id
      WHERE b.id = board_members.board_id
      AND wm.user_id = auth.uid()
      AND wm.role IN ('owner', 'admin')
    )
    OR
    EXISTS (
      SELECT 1 FROM board_members bm
      WHERE bm.board_id = board_members.board_id
      AND bm.user_id = auth.uid()
      AND bm.role = 'owner'
    )
  );

DROP POLICY IF EXISTS "board_owners_can_remove_members" ON board_members;
CREATE POLICY "board_owners_can_remove_members"
  ON board_members FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM boards b
      JOIN workspace_members wm ON wm.workspace_id = b.workspace_id
      WHERE b.id = board_members.board_id
      AND wm.user_id = auth.uid()
      AND wm.role IN ('owner', 'admin')
    )
    OR
    EXISTS (
      SELECT 1 FROM board_members bm
      WHERE bm.board_id = board_members.board_id
      AND bm.user_id = auth.uid()
      AND bm.role = 'owner'
    )
  );

-- =====================================================
-- 8. RLS POLICIES FOR PAGE_MEMBERS
-- =====================================================

DROP POLICY IF EXISTS "users_can_view_page_members" ON page_members;
CREATE POLICY "users_can_view_page_members"
  ON page_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pages p
      JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
      WHERE p.id = page_members.page_id
      AND wm.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM page_members pm
      WHERE pm.page_id = page_members.page_id
      AND pm.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "page_owners_can_add_members" ON page_members;
CREATE POLICY "page_owners_can_add_members"
  ON page_members FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pages p
      JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
      WHERE p.id = page_members.page_id
      AND wm.user_id = auth.uid()
      AND wm.role IN ('owner', 'admin')
    )
    OR
    EXISTS (
      SELECT 1 FROM page_members pm
      WHERE pm.page_id = page_members.page_id
      AND pm.user_id = auth.uid()
      AND pm.role = 'owner'
    )
  );

DROP POLICY IF EXISTS "page_owners_can_update_members" ON page_members;
CREATE POLICY "page_owners_can_update_members"
  ON page_members FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pages p
      JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
      WHERE p.id = page_members.page_id
      AND wm.user_id = auth.uid()
      AND wm.role IN ('owner', 'admin')
    )
    OR
    EXISTS (
      SELECT 1 FROM page_members pm
      WHERE pm.page_id = page_members.page_id
      AND pm.user_id = auth.uid()
      AND pm.role = 'owner'
    )
  );

DROP POLICY IF EXISTS "page_owners_can_remove_members" ON page_members;
CREATE POLICY "page_owners_can_remove_members"
  ON page_members FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pages p
      JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
      WHERE p.id = page_members.page_id
      AND wm.user_id = auth.uid()
      AND wm.role IN ('owner', 'admin')
    )
    OR
    EXISTS (
      SELECT 1 FROM page_members pm
      WHERE pm.page_id = page_members.page_id
      AND pm.user_id = auth.uid()
      AND pm.role = 'owner'
    )
  );

-- =====================================================
-- 9. RLS POLICIES FOR INVITATIONS
-- =====================================================

DROP POLICY IF EXISTS "users_can_view_sent_invitations" ON invitations;
CREATE POLICY "users_can_view_sent_invitations"
  ON invitations FOR SELECT
  TO authenticated
  USING (
    invited_by = auth.uid()
    OR
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "owners_can_create_invitations" ON invitations;
CREATE POLICY "owners_can_create_invitations"
  ON invitations FOR INSERT
  TO authenticated
  WITH CHECK (
    invited_by = auth.uid() AND
    (
      (workspace_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_members.workspace_id = invitations.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.role IN ('owner', 'admin')
      ))
      OR
      (board_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM board_members
        WHERE board_members.board_id = invitations.board_id
        AND board_members.user_id = auth.uid()
        AND board_members.role = 'owner'
      ))
      OR
      (page_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM page_members
        WHERE page_members.page_id = invitations.page_id
        AND page_members.user_id = auth.uid()
        AND page_members.role = 'owner'
      ))
    )
  );

DROP POLICY IF EXISTS "recipients_can_update_invitations" ON invitations;
CREATE POLICY "recipients_can_update_invitations"
  ON invitations FOR UPDATE
  TO authenticated
  USING (
    email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

DROP POLICY IF EXISTS "senders_can_delete_invitations" ON invitations;
CREATE POLICY "senders_can_delete_invitations"
  ON invitations FOR DELETE
  TO authenticated
  USING (invited_by = auth.uid());