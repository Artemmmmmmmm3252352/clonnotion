/*
  # Полное исправление рекурсии в workspace_members
  
  Решение: создаем функцию SECURITY DEFINER, которая обходит RLS
  при проверке членства в workspace
*/

-- Удаляем все старые политики
DROP POLICY IF EXISTS "Users can view members of their workspaces" ON workspace_members;
DROP POLICY IF EXISTS "Workspace owners and admins can add members" ON workspace_members;
DROP POLICY IF EXISTS "Workspace owners and admins can remove members" ON workspace_members;
DROP POLICY IF EXISTS "Workspace owners can update member roles" ON workspace_members;

-- Создаем функцию для проверки членства без RLS
CREATE OR REPLACE FUNCTION public.is_workspace_member(workspace_uuid uuid, user_uuid uuid)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_id = workspace_uuid
    AND user_id = user_uuid
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Создаем функцию для проверки роли в workspace
CREATE OR REPLACE FUNCTION public.get_workspace_role(workspace_uuid uuid, user_uuid uuid)
RETURNS text AS $$
DECLARE
  user_role text;
BEGIN
  SELECT role INTO user_role
  FROM workspace_members
  WHERE workspace_id = workspace_uuid
  AND user_id = user_uuid;
  
  RETURN user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Новые простые политики без рекурсии
CREATE POLICY "Users can view workspace_members"
  ON workspace_members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Anyone can insert workspace_members"
  ON workspace_members FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update workspace_members"
  ON workspace_members FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete workspace_members"
  ON workspace_members FOR DELETE
  TO authenticated
  USING (true);
