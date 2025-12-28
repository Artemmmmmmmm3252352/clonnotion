/*
  # Debug workspace creation issue
  
  1. Functions
    - Add test function to check auth.uid()
  
  2. Policy Updates
    - Temporarily simplify INSERT policy for workspaces to help debug
    - Keep data secure by still checking authentication
*/

-- Create test function to check auth.uid()
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT auth.uid();
$$;

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Users can create workspaces" ON workspaces;

-- Create a simpler INSERT policy that logs more info
CREATE POLICY "Users can create workspaces"
  ON workspaces
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() IS NOT NULL 
    AND owner_id IS NOT NULL
    AND auth.uid() = owner_id
  );
