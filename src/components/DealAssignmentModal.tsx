import React from 'react';
import { Dialog } from '@headlessui/react';
import { useUserStore } from '../store/userStore';
import { useDealStore } from '../store/dealStore';
import { User } from '../types';
import { X, UserPlus } from 'lucide-react';

interface DealAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  dealId: string;
}

export default function DealAssignmentModal({ isOpen, onClose, dealId }: DealAssignmentModalProps) {
  const { users, currentUser } = useUserStore();
  const { deals, updateDeal } = useDealStore();
  const deal = deals.find(d => d.id === dealId);

  const handleAssign = (userId: string) => {
    if (!deal) return;

    updateDeal(dealId, {
      assignedTo: userId,
      customFields: [
        ...(deal.customFields || []).filter(f => f.label !== 'Assignment Change'),
        {
          id: crypto.randomUUID(),
          label: 'Assignment Change',
          value: `Assigned to ${users.find(u => u.id === userId)?.name} by ${currentUser?.name}`
        }
      ]
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md w-full bg-dark-800 rounded-xl shadow-lg border border-dark-700">
          <div className="flex items-center justify-between p-6 border-b border-dark-700">
            <Dialog.Title className="text-lg font-semibold text-white">
              Assign Deal
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="space-y-4">
              {users.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleAssign(user.id)}
                  className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors ${
                    deal?.assignedTo === user.id
                      ? 'bg-accent-purple/10 border border-accent-purple'
                      : 'bg-dark-700 border border-dark-600 hover:border-dark-500'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-dark-600 flex items-center justify-center">
                      <span className="text-lg font-medium text-white">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div className="text-left">
                      <h3 className="font-medium text-white">{user.name}</h3>
                      <p className="text-sm text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  {deal?.assignedTo === user.id && (
                    <span className="px-2 py-1 text-xs rounded-full bg-accent-purple/20 text-accent-purple">
                      Assigned
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}