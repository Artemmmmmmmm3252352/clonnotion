/*
  # Безопасные политики для workspace_members без рекурсии
  
  Используем функции SECURITY DEFINER для обхода RLS при проверках
*/

-- Удаляем небезопасные политики
DROP POLICY IF EXISTS "Users can view workspace_members" ON workspace_members;
DROP POLICY IF EXISTS "Anyone can insert workspace_members" ON workspace_members;
DROP POLICY IF EXISTS "Users can update workspace_members" ON workspace_members;
DROP POLICY IF EXISTS "Users can delete workspace_members" ON workspace_members;

-- Функция для проверки членства (уже создана в предыдущей миграции)
-- Пересоздаем для уверенности
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

-- Функция для проверки, является ли пользователь owner или admin
CREATE OR REPLACE FUNCTION public.is_workspace_admin(workspace_uuid uuid, user_uuid uuid)
RETURNS boolean AS $$
DECLARE
  user_role text;
BEGIN
  -- Проверяем через owner_id в workspaces
  IF EXISTS (SELECT 1 FROM workspaces WHERE id = workspace_uuid AND owner_id = user_uuid) THEN
    RETURN true;
  END IF;
  
  -- Проверяем роль в workspace_members
  SELECT role INTO user_role
  FROM workspace_members
  WHERE workspace_id = workspace_uuid
  AND user_id = user_uuid;
  
  RETURN user_role IN ('owner', 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Политики с использованием функций
CREATE POLICY "Users can view members of their workspaces"
  ON workspace_members FOR SELECT
  TO authenticated
  USING (
    is_workspace_member(workspace_id, auth.uid())
  );

CREATE POLICY "Workspace admins can add members"
  ON workspace_members FOR INSERT
  TO authenticated
  WITH CHECK (
    is_workspace_admin(workspace_id, auth.uid())
  );

CREATE POLICY "Workspace admins can update members"
  ON workspace_members FOR UPDATE
  TO authenticated
  USING (
    is_workspace_admin(workspace_id, auth.uid())
  )
  WITH CHECK (
    is_workspace_admin(workspace_id, auth.uid())
  );

CREATE POLICY "Workspace admins can remove members"
  ON workspace_members FOR DELETE
  TO authenticated
  USING (
    is_workspace_admin(workspace_id, auth.uid())
  );
