import React, { useState, useEffect } from 'react';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X, Mail, Trash2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, workspaceId }) => {
  const { getWorkspaceMembers, inviteMember, updateMemberRole, removeMember } = useWorkspaces();
  const [members, setMembers] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<string>('editor');
  const [loading, setLoading] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [inviteUrl, setInviteUrl] = useState('');

  useEffect(() => {
    if (isOpen && workspaceId) {
      loadMembers();
    }
  }, [isOpen, workspaceId]);

  const loadMembers = async () => {
    const data = await getWorkspaceMembers(workspaceId);
    setMembers(data);
  };

  const handleInvite = async () => {
    if (!email.trim()) return;

    setLoading(true);
    setInviteSuccess(false);
    setInviteUrl('');

    const { data, error } = await inviteMember(workspaceId, email, role);

    if (!error && data) {
      setInviteSuccess(true);
      setInviteUrl(data.invitation.invitationUrl);
      setEmail('');
      setTimeout(() => setInviteSuccess(false), 3000);
    }

    setLoading(false);
  };

  const handleRoleChange = async (memberId: string, newRole: string) => {
    await updateMemberRole(memberId, newRole);
    await loadMembers();
  };

  const handleRemoveMember = async (memberId: string) => {
    if (confirm('Are you sure you want to remove this member?')) {
      await removeMember(memberId);
      await loadMembers();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Share workspace</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(80vh-8rem)]">
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    className="pl-9"
                    onKeyDown={(e) => e.key === 'Enter' && handleInvite()}
                  />
                </div>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Owner</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="commenter">Commenter</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleInvite} disabled={loading || !email.trim()}>
                  Invite
                </Button>
              </div>

              {inviteSuccess && inviteUrl && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-2">
                  <p className="text-sm text-green-800 font-medium">
                    Invitation created! Share this link:
                  </p>
                  <div className="flex gap-2">
                    <Input
                      value={inviteUrl}
                      readOnly
                      className="text-sm"
                      onClick={(e) => e.currentTarget.select()}
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(inviteUrl);
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500">
                <div className="font-medium mb-1">Role permissions:</div>
                <ul className="space-y-1">
                  <li><strong>Owner:</strong> Full access, can manage members and delete workspace</li>
                  <li><strong>Editor:</strong> Can create and edit content</li>
                  <li><strong>Commenter:</strong> Can view and comment on content</li>
                  <li><strong>Viewer:</strong> Can only view content</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-medium text-sm text-gray-900 mb-3">
                Members ({members.length})
              </h3>
              <div className="space-y-2">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {member.profile?.full_name || 'Unknown'}
                      </div>
                      <div className="text-xs text-gray-500">{member.profile?.email}</div>
                    </div>
                    <Select
                      value={member.role}
                      onValueChange={(value) => handleRoleChange(member.id, value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="owner">Owner</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="commenter">Commenter</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                    {member.role !== 'owner' && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-2 hover:bg-red-50 rounded text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 flex justify-end">
            <Button onClick={onClose}>Done</Button>
          </div>
        </div>
      </div>
    </>
  );
};
