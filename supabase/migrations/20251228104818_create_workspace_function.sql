/*
  # Create workspace function to bypass RLS issues
  
  1. New Function
    - `create_workspace_for_user` - Creates workspace and adds user as owner
    - Uses SECURITY DEFINER to bypass RLS
    - Returns the created workspace
  
  2. Security
    - Function checks that user is authenticated
    - User becomes owner of their workspace
    - Trigger still adds user to workspace_members
*/

-- Create function to create workspace
CREATE OR REPLACE FUNCTION create_workspace_for_user(
  workspace_name text,
  workspace_slug text,
  user_id uuid
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_workspace workspaces;
BEGIN
  -- Verify the user is calling this function for themselves
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  IF auth.uid() != user_id THEN
    RAISE EXCEPTION 'Cannot create workspace for another user';
  END IF;
  
  -- Insert workspace
  INSERT INTO workspaces (name, slug, owner_id, is_personal)
  VALUES (workspace_name, workspace_slug, user_id, false)
  RETURNING * INTO new_workspace;
  
  -- Return the workspace as JSON
  RETURN row_to_json(new_workspace);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION create_workspace_for_user TO authenticated;
