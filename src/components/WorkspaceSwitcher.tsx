import React, { useState } from 'react';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Check, ChevronDown, Plus } from 'lucide-react';

export const WorkspaceSwitcher: React.FC = () => {
  const { workspaces, currentWorkspace, switchWorkspace, createWorkspace } = useWorkspaces();
  const [isOpen, setIsOpen] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [creating, setCreating] = useState(false);

  const handleCreateWorkspace = async () => {
    if (!newWorkspaceName.trim()) return;

    setCreating(true);
    const slug = newWorkspaceName.toLowerCase().replace(/\s+/g, '-');
    const { error } = await createWorkspace(newWorkspaceName, slug);

    if (!error) {
      setNewWorkspaceName('');
      setShowCreateForm(false);
      setIsOpen(false);
    }

    setCreating(false);
  };

  if (!currentWorkspace) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors w-full"
      >
        <div className="flex-1 text-left">
          <div className="font-medium text-sm">{currentWorkspace.name}</div>
          <div className="text-xs text-gray-500">
            {currentWorkspace.is_personal ? 'Personal' : 'Team'}
          </div>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => {
              setIsOpen(false);
              setShowCreateForm(false);
            }}
          />
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-20 max-h-96 overflow-auto">
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 px-2 py-1 mb-1">
                Your workspaces
              </div>
              {workspaces.map((workspace) => (
                <button
                  key={workspace.id}
                  onClick={() => {
                    switchWorkspace(workspace);
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-left"
                >
                  <div className="flex-1">
                    <div className="font-medium text-sm">{workspace.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{workspace.role}</div>
                  </div>
                  {workspace.id === currentWorkspace.id && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </button>
              ))}
            </div>

            <div className="border-t border-gray-200 p-2">
              {!showCreateForm ? (
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 text-left text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Create new workspace
                </button>
              ) : (
                <div className="p-2 space-y-2">
                  <Input
                    value={newWorkspaceName}
                    onChange={(e) => setNewWorkspaceName(e.target.value)}
                    placeholder="Workspace name"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCreateWorkspace();
                      if (e.key === 'Escape') setShowCreateForm(false);
                    }}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleCreateWorkspace}
                      disabled={creating || !newWorkspaceName.trim()}
                      className="flex-1"
                    >
                      Create
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowCreateForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
