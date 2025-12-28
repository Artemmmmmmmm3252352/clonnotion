/*
  # Fix Workspace Creation RLS Policy

  ## Problem
  When creating a new workspace, the user cannot add themselves as a member
  because the RLS policy requires them to already be an admin of the workspace.
  This is a chicken-and-egg problem.

  ## Solution
  Update the INSERT policy for workspace_members to allow:
  1. Workspace admins to add members (existing behavior)
  2. Workspace owners to add themselves when creating a new workspace
*/

-- Drop the old policy
DROP POLICY IF EXISTS "Workspace admins can add members" ON workspace_members;

-- Create new policy that allows workspace owners to add themselves
CREATE POLICY "Workspace admins and owners can add members"
  ON workspace_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Allow if user is already an admin of the workspace
    is_workspace_admin(workspace_id, auth.uid())
    OR
    -- Allow if user is the owner of the workspace (for initial member creation)
    EXISTS (
      SELECT 1 FROM workspaces 
      WHERE workspaces.id = workspace_members.workspace_id 
      AND workspaces.owner_id = auth.uid()
    )
  );
