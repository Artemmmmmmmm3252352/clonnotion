/*
  # Update RLS Policies for Pages and Blocks

  ## Overview
  This migration updates RLS policies for pages and blocks tables
  to support board-level access control and page-specific permissions.

  ## Changes

  ### Pages Table
  - Update SELECT policy to check board_members and page_members
  - Update INSERT policy to allow board editors to create pages
  - Update UPDATE policy to respect page_members roles
  - Update DELETE policy to restrict to owners only

  ### Blocks Table
  - Update SELECT policy to check board/page access through boards
  - Update INSERT policy for board/page editors
  - Update UPDATE policy for board/page editors
  - Update DELETE policy for board/page editors

  ## Security Notes
  - All policies check multiple levels: workspace → board → page
  - Viewers can only read
  - Commenters can read and comment (handled at app level)
  - Editors can read and modify content
  - Owners can manage permissions and delete
*/

-- =====================================================
-- 1. UPDATE PAGES RLS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Users can view pages in their workspaces" ON pages;
CREATE POLICY "Users can view pages in their workspaces"
  ON pages FOR SELECT
  TO authenticated
  USING (
    -- Workspace member
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = pages.workspace_id
      AND workspace_members.user_id = auth.uid()
    )
    OR
    -- Board member (if page has board_id)
    (pages.board_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM board_members
      WHERE board_members.board_id = pages.board_id
      AND board_members.user_id = auth.uid()
    ))
    OR
    -- Page-specific member
    EXISTS (
      SELECT 1 FROM page_members
      WHERE page_members.page_id = pages.id
      AND page_members.user_id = auth.uid()
    )
    OR
    -- Public access
    pages.access_type = 'public_read'
  );

DROP POLICY IF EXISTS "Users can create pages in their workspaces" ON pages;
CREATE POLICY "Users can create pages in their workspaces"
  ON pages FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = created_by AND
    (
      -- Workspace editor
      EXISTS (
        SELECT 1 FROM workspace_members
        WHERE workspace_members.workspace_id = pages.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.role IN ('owner', 'admin', 'editor')
      )
      OR
      -- Board editor (if page has board_id)
      (pages.board_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM board_members
        WHERE board_members.board_id = pages.board_id
        AND board_members.user_id = auth.uid()
        AND board_members.role IN ('owner', 'editor')
      ))
    )
  );

DROP POLICY IF EXISTS "Users can update pages they have access to" ON pages;
CREATE POLICY "Users can update pages they have access to"
  ON pages FOR UPDATE
  TO authenticated
  USING (
    -- Workspace owner/admin
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = pages.workspace_id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role IN ('owner', 'admin')
    )
    OR
    -- Workspace editor (for content updates)
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = pages.workspace_id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role = 'editor'
    )
    OR
    -- Board owner/editor (if page has board_id)
    (pages.board_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM board_members
      WHERE board_members.board_id = pages.board_id
      AND board_members.user_id = auth.uid()
      AND board_members.role IN ('owner', 'editor')
    ))
    OR
    -- Page editor/owner
    EXISTS (
      SELECT 1 FROM page_members
      WHERE page_members.page_id = pages.id
      AND page_members.user_id = auth.uid()
      AND page_members.role IN ('owner', 'editor')
    )
  );

DROP POLICY IF EXISTS "Users can delete their own pages" ON pages;
CREATE POLICY "Users can delete their own pages"
  ON pages FOR DELETE
  TO authenticated
  USING (
    -- Workspace owner/admin
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = pages.workspace_id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role IN ('owner', 'admin')
    )
    OR
    -- Board owner (if page has board_id)
    (pages.board_id IS NOT NULL AND EXISTS (
      SELECT 1 FROM board_members
      WHERE board_members.board_id = pages.board_id
      AND board_members.user_id = auth.uid()
      AND board_members.role = 'owner'
    ))
    OR
    -- Page owner
    EXISTS (
      SELECT 1 FROM page_members
      WHERE page_members.page_id = pages.id
      AND page_members.user_id = auth.uid()
      AND page_members.role = 'owner'
    )
  );

-- =====================================================
-- 2. UPDATE BLOCKS RLS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "Users can view blocks in pages they have access to" ON blocks;
CREATE POLICY "Users can view blocks in pages they have access to"
  ON blocks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pages p
      JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
      WHERE p.id = blocks.page_id
      AND wm.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM pages p
      LEFT JOIN board_members bm ON bm.board_id = p.board_id
      WHERE p.id = blocks.page_id
      AND p.board_id IS NOT NULL
      AND bm.user_id = auth.uid()
    )
    OR
    EXISTS (
      SELECT 1 FROM page_members pm
      WHERE pm.page_id = blocks.page_id
      AND pm.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can create blocks in pages they can edit" ON blocks;
CREATE POLICY "Users can create blocks in pages they can edit"
  ON blocks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM pages p
      JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
      WHERE p.id = blocks.page_id
      AND wm.user_id = auth.uid()
      AND wm.role IN ('owner', 'admin', 'editor')
    )
    OR
    EXISTS (
      SELECT 1 FROM pages p
      LEFT JOIN board_members bm ON bm.board_id = p.board_id
      WHERE p.id = blocks.page_id
      AND p.board_id IS NOT NULL
      AND bm.user_id = auth.uid()
      AND bm.role IN ('owner', 'editor')
    )
    OR
    EXISTS (
      SELECT 1 FROM page_members pm
      WHERE pm.page_id = blocks.page_id
      AND pm.user_id = auth.uid()
      AND pm.role IN ('owner', 'editor')
    )
  );

DROP POLICY IF EXISTS "Users can update blocks in pages they can edit" ON blocks;
CREATE POLICY "Users can update blocks in pages they can edit"
  ON blocks FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pages p
      JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
      WHERE p.id = blocks.page_id
      AND wm.user_id = auth.uid()
      AND wm.role IN ('owner', 'admin', 'editor')
    )
    OR
    EXISTS (
      SELECT 1 FROM pages p
      LEFT JOIN board_members bm ON bm.board_id = p.board_id
      WHERE p.id = blocks.page_id
      AND p.board_id IS NOT NULL
      AND bm.user_id = auth.uid()
      AND bm.role IN ('owner', 'editor')
    )
    OR
    EXISTS (
      SELECT 1 FROM page_members pm
      WHERE pm.page_id = blocks.page_id
      AND pm.user_id = auth.uid()
      AND pm.role IN ('owner', 'editor')
    )
  );

DROP POLICY IF EXISTS "Users can delete blocks in pages they can edit" ON blocks;
CREATE POLICY "Users can delete blocks in pages they can edit"
  ON blocks FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM pages p
      JOIN workspace_members wm ON wm.workspace_id = p.workspace_id
      WHERE p.id = blocks.page_id
      AND wm.user_id = auth.uid()
      AND wm.role IN ('owner', 'admin', 'editor')
    )
    OR
    EXISTS (
      SELECT 1 FROM pages p
      LEFT JOIN board_members bm ON bm.board_id = p.board_id
      WHERE p.id = blocks.page_id
      AND p.board_id IS NOT NULL
      AND bm.user_id = auth.uid()
      AND bm.role IN ('owner', 'editor')
    )
    OR
    EXISTS (
      SELECT 1 FROM page_members pm
      WHERE pm.page_id = blocks.page_id
      AND pm.user_id = auth.uid()
      AND pm.role IN ('owner', 'editor')
    )
  );