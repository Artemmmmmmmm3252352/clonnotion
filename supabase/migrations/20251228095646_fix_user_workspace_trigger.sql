/*
  # Fix User Workspace Initialization Trigger

  ## Problem
  The trigger was failing because it tried to create workspace_members
  before creating the profile, but workspace_members has a foreign key
  to profiles(id).

  ## Solution
  Reorder operations to create profile FIRST, then workspace, then workspace_members.
*/

CREATE OR REPLACE FUNCTION initialize_user_workspace()
RETURNS TRIGGER AS $$
DECLARE
  workspace_id uuid;
  workspace_name text;
BEGIN
  -- Get user name or use default
  workspace_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'My Workspace');

  -- 1. FIRST: Create profile (required for foreign key in workspace_members)
  INSERT INTO profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, profiles.avatar_url);

  -- 2. SECOND: Create personal workspace
  INSERT INTO workspaces (owner_id, name, slug, is_personal)
  VALUES (
    NEW.id,
    workspace_name,
    'personal-' || NEW.id,
    true
  )
  RETURNING id INTO workspace_id;

  -- 3. THIRD: Add user as workspace owner (now profile exists)
  INSERT INTO workspace_members (workspace_id, user_id, role)
  VALUES (workspace_id, NEW.id, 'owner');

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE LOG 'Error in initialize_user_workspace: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure trigger is active
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION initialize_user_workspace();
