/*
  # Исправление политик RLS для workspace_members
  
  Проблема: бесконечная рекурсия в политиках для workspace_members
  
  Решение:
  - Удаляем старые политики с рекурсией
  - Создаем новые политики, которые проверяют напрямую через user_id
  - Добавляем проверку через workspaces.owner_id для операций модификации
*/

-- Удаляем старые политики с рекурсией
DROP POLICY IF EXISTS "Users can view members of their workspaces" ON workspace_members;
DROP POLICY IF EXISTS "Workspace owners and admins can add members" ON workspace_members;
DROP POLICY IF EXISTS "Workspace owners and admins can remove members" ON workspace_members;

-- Новая политика для SELECT: пользователи видят участников тех workspace, где они сами являются участниками
CREATE POLICY "Users can view members of their workspaces"
  ON workspace_members FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid()
    OR workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    )
  );

-- Новая политика для INSERT: владельцы и админы могут добавлять участников
-- Используем проверку через workspaces таблицу напрямую
CREATE POLICY "Workspace owners and admins can add members"
  ON workspace_members FOR INSERT
  TO authenticated
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
    OR workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid() AND role IN ('admin')
    )
  );

-- Новая политика для DELETE: владельцы и админы могут удалять участников
CREATE POLICY "Workspace owners and admins can remove members"
  ON workspace_members FOR DELETE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
    OR workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid() AND role IN ('admin')
    )
  );

-- Добавляем политику для UPDATE на случай изменения роли
CREATE POLICY "Workspace owners can update member roles"
  ON workspace_members FOR UPDATE
  TO authenticated
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  )
  WITH CHECK (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );
