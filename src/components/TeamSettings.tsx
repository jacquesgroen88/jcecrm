import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useTeamStore } from '../store/teamStore';
import { UserPermissions } from '../types';
import {
  Users,
  Mail,
  Shield,
  Trash2,
  X,
  Plus,
  Check,
  AlertCircle
} from 'lucide-react';
import clsx from 'clsx';

export default function TeamSettings() {
  const {
    teamMembers,
    invitePending,
    updateMemberPermissions,
    removeTeamMember,
    inviteMember,
    cancelInvite
  } = useTeamStore();
  
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('user');
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  
  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    inviteMember(inviteEmail, inviteRole);
    setInviteEmail('');
    setInviteRole('user');
    setIsInviting(false);
  };

  const handleUpdatePermissions = (id: string, key: string, value: any) => {
    const member = teamMembers.find(m => m.id === id);
    if (!member) return;

    const [category, setting] = key.split('.');
    const newPermissions = {
      ...member.permissions,
      [category]: {
        ...member.permissions[category],
        [setting]: value
      }
    };

    updateMemberPermissions(id, newPermissions);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Team Members</h2>
        <button
          onClick={() => setIsInviting(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Invite Member
        </button>
      </div>

      <div className="space-y-4">
        {teamMembers.map((member) => (
          <div
            key={member.id}
            className="card p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-dark-700 rounded-lg">
                  <Users className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white">{member.name}</h3>
                  <p className="text-sm text-gray-400">{member.email}</p>
                </div>
                <span
                  className={clsx(
                    "px-2 py-1 text-xs rounded-full font-medium",
                    {
                      'bg-purple-500/10 text-purple-400': member.role === 'admin',
                      'bg-blue-500/10 text-blue-400': member.role === 'manager',
                      'bg-gray-500/10 text-gray-400': member.role === 'user'
                    }
                  )}
                >
                  {member.role}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingMemberId(member.id)}
                  className="btn btn-secondary"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Permissions
                </button>
                {member.role !== 'admin' && (
                  <button
                    onClick={() => removeTeamMember(member.id)}
                    className="btn btn-secondary text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {invitePending.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-medium text-white mb-4">Pending Invites</h3>
            <div className="space-y-4">
              {invitePending.map(({ email, role }) => (
                <div
                  key={email}
                  className="flex items-center justify-between p-4 bg-dark-700 rounded-lg border border-dark-600"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-white">{email}</p>
                      <p className="text-sm text-gray-400">Role: {role}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => cancelInvite(email)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Invite Member Modal */}
      <Dialog
        open={isInviting}
        onClose={() => setIsInviting(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md w-full bg-dark-800 rounded-xl shadow-lg border border-dark-700">
            <div className="p-6">
              <Dialog.Title className="text-xl font-semibold text-white mb-6">
                Invite Team Member
              </Dialog.Title>
              
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full input"
                    placeholder="colleague@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Role
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value)}
                    className="w-full input"
                  >
                    <option value="user">User</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setIsInviting(false)}
                    className="btn btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Send Invite
                  </button>
                </div>
              </form>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Permissions Modal */}
      <Dialog
        open={!!editingMemberId}
        onClose={() => setEditingMemberId(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-2xl w-full bg-dark-800 rounded-xl shadow-lg border border-dark-700">
            <div className="p-6">
              <Dialog.Title className="text-xl font-semibold text-white mb-6">
                Edit Permissions
              </Dialog.Title>

              {editingMemberId && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Deals</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          View
                        </label>
                        <select
                          value={teamMembers.find(m => m.id === editingMemberId)?.permissions.deals.view}
                          onChange={(e) => handleUpdatePermissions(editingMemberId, 'deals.view', e.target.value)}
                          className="w-full input"
                        >
                          <option value="own">Own Deals Only</option>
                          <option value="team">Team Deals</option>
                          <option value="all">All Deals</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Edit
                        </label>
                        <select
                          value={teamMembers.find(m => m.id === editingMemberId)?.permissions.deals.edit}
                          onChange={(e) => handleUpdatePermissions(editingMemberId, 'deals.edit', e.target.value)}
                          className="w-full input"
                        >
                          <option value="own">Own Deals Only</option>
                          <option value="team">Team Deals</option>
                          <option value="all">All Deals</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Contacts</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          View
                        </label>
                        <select
                          value={teamMembers.find(m => m.id === editingMemberId)?.permissions.contacts.view}
                          onChange={(e) => handleUpdatePermissions(editingMemberId, 'contacts.view', e.target.value)}
                          className="w-full input"
                        >
                          <option value="own">Own Contacts Only</option>
                          <option value="team">Team Contacts</option>
                          <option value="all">All Contacts</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">
                          Edit
                        </label>
                        <select
                          value={teamMembers.find(m => m.id === editingMemberId)?.permissions.contacts.edit}
                          onChange={(e) => handleUpdatePermissions(editingMemberId, 'contacts.edit', e.target.value)}
                          className="w-full input"
                        >
                          <option value="own">Own Contacts Only</option>
                          <option value="team">Team Contacts</option>
                          <option value="all">All Contacts</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Analytics</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        View
                      </label>
                      <select
                        value={teamMembers.find(m => m.id === editingMemberId)?.permissions.analytics.view}
                        onChange={(e) => handleUpdatePermissions(editingMemberId, 'analytics.view', e.target.value)}
                        className="w-full input"
                      >
                        <option value="own">Own Analytics Only</option>
                        <option value="team">Team Analytics</option>
                        <option value="all">All Analytics</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6">
                    <button
                      onClick={() => setEditingMemberId(null)}
                      className="btn btn-primary"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}