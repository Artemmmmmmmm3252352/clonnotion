/*
  # Fix workspace creation - allow authenticated users to create workspaces
  
  1. Changes
    - Update INSERT policy for workspaces to work with auth tokens
    - Ensure trigger can add workspace_members properly
    
  2. Security
    - Users can only create workspaces where they are the owner
    - Trigger automatically adds creator as owner in workspace_members
*/

-- Drop existing INSERT policy
DROP POLICY IF EXISTS "Users can create workspaces" ON workspaces;

-- Create new INSERT policy that properly handles authenticated users
CREATE POLICY "Users can create workspaces"
  ON workspaces
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- User must be authenticated and must be the owner
    owner_id = auth.uid()
  );

-- Make sure the trigger function has proper permissions
DROP TRIGGER IF EXISTS on_workspace_created ON workspaces;

-- Recreate trigger
CREATE TRIGGER on_workspace_created
  AFTER INSERT ON workspaces
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_workspace();

-- Update workspace_members INSERT policy to allow trigger to work
DROP POLICY IF EXISTS "Workspace admins and owners can add members" ON workspace_members;

CREATE POLICY "Workspace admins and owners can add members"
  ON workspace_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    -- Allow if user is workspace owner (for new workspaces)
    EXISTS (
      SELECT 1 FROM workspaces
      WHERE workspaces.id = workspace_members.workspace_id
      AND workspaces.owner_id = auth.uid()
    )
    OR
    -- Allow if user is admin of existing workspace
    is_workspace_admin(workspace_id, auth.uid())
  );
