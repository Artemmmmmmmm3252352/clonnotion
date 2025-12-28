import React, { useState, useEffect } from 'react';
import { X, UserPlus, Mail } from 'lucide-react';
import { useWorkspace } from '../../store/WorkspaceContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../ui/select';

interface InviteMembersModalProps {
  onClose: () => void;
}

export const InviteMembersModal: React.FC<InviteMembersModalProps> = ({ onClose }) => {
  const { inviteMember, getWorkspaceMembers, currentWorkspace } = useWorkspace();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'member' | 'viewer'>('member');
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    const data = await getWorkspaceMembers();
    setMembers(data);
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    await inviteMember(email, role);
    setLoading(false);
    setSuccess(true);
    setEmail('');
    setTimeout(() => setSuccess(false), 3000);
  };

  const getRoleBadge = (role: string) => {
    const colors = {
      owner: 'bg-purple-100 text-purple-700',
      admin: 'bg-blue-100 text-blue-700',
      member: 'bg-green-100 text-green-700',
      viewer: 'bg-gray-100 text-gray-700'
    };
    return colors[role as keyof typeof colors] || colors.viewer;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-[#e6e4df] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <UserPlus className="w-6 h-6 text-[#2383e2]" />
            <div>
              <h2 className="text-xl font-bold text-[#37352f]">Пригласить участников</h2>
              <p className="text-sm text-[#9b9a97]">{currentWorkspace?.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#9b9a97] hover:bg-[#efefec] rounded-lg p-2 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleInvite} className="mb-8">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#37352f] mb-2">
                  Email адрес
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9b9a97]" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#37352f] mb-2">
                  Роль
                </label>
                <Select value={role} onValueChange={(value: any) => setRole(value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Администратор</SelectItem>
                    <SelectItem value="member">Участник</SelectItem>
                    <SelectItem value="viewer">Наблюдатель</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-[#9b9a97] mt-2">
                  {role === 'admin' && 'Может управлять участниками и настройками'}
                  {role === 'member' && 'Может создавать и редактировать страницы'}
                  {role === 'viewer' && 'Может только просматривать содержимое'}
                </p>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2383e2] hover:bg-[#1a6ec7] text-white"
              >
                {loading ? 'Отправка...' : 'Отправить приглашение'}
              </Button>

              {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  Приглашение успешно отправлено!
                </div>
              )}
            </div>
          </form>

          <div>
            <h3 className="text-sm font-semibold text-[#37352f] mb-4">
              Участники ({members.length})
            </h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-[#f7f6f3] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2383e2] to-[#1a6ec7] flex items-center justify-center text-white font-semibold">
                      {member.profiles?.full_name?.[0] || member.profiles?.email?.[0] || '?'}
                    </div>
                    <div>
                      <div className="font-medium text-[#37352f]">
                        {member.profiles?.full_name || 'Без имени'}
                      </div>
                      <div className="text-sm text-[#9b9a97]">{member.profiles?.email}</div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(member.role)}`}>
                    {member.role === 'owner' && 'Владелец'}
                    {member.role === 'admin' && 'Администратор'}
                    {member.role === 'member' && 'Участник'}
                    {member.role === 'viewer' && 'Наблюдатель'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
