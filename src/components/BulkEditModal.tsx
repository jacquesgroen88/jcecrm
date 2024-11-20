import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import Select from 'react-select';

interface BulkEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLeads: string[];
  onUpdate: (updates: any) => void;
}

export default function BulkEditModal({ isOpen, onClose, selectedLeads, onUpdate }: BulkEditModalProps) {
  const [updates, setUpdates] = useState({
    status: '',
    source: '',
    assignedTo: ''
  });

  const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'converted', label: 'Converted' }
  ];

  const sourceOptions = [
    { value: 'website', label: 'Website' },
    { value: 'referral', label: 'Referral' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'cold-outreach', label: 'Cold Outreach' },
    { value: 'event', label: 'Event' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== '')
    );
    onUpdate(cleanUpdates);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-md w-full bg-dark-800 rounded-xl shadow-lg border border-dark-700">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="text-lg font-semibold text-white">
                Edit {selectedLeads.length} Lead{selectedLeads.length !== 1 ? 's' : ''}
              </Dialog.Title>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Status
                </label>
                <Select
                  options={statusOptions}
                  onChange={(option) => setUpdates({ ...updates, status: option?.value || '' })}
                  isClearable
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Select status..."
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary: '#6E3AFA',
                      primary75: '#6E3AFA',
                      primary50: '#6E3AFA20',
                      primary25: '#6E3AFA10',
                      neutral0: '#151432',
                      neutral10: '#1C1B42',
                      neutral20: '#1C1B42',
                      neutral30: '#2A2952',
                      neutral40: '#9CA3AF',
                      neutral50: '#9CA3AF',
                      neutral60: '#9CA3AF',
                      neutral70: '#9CA3AF',
                      neutral80: '#FFFFFF',
                      neutral90: '#FFFFFF',
                    },
                  })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Source
                </label>
                <Select
                  options={sourceOptions}
                  onChange={(option) => setUpdates({ ...updates, source: option?.value || '' })}
                  isClearable
                  className="react-select-container"
                  classNamePrefix="react-select"
                  placeholder="Select source..."
                  theme={(theme) => ({
                    ...theme,
                    colors: {
                      ...theme.colors,
                      primary: '#6E3AFA',
                      primary75: '#6E3AFA',
                      primary50: '#6E3AFA20',
                      primary25: '#6E3AFA10',
                      neutral0: '#151432',
                      neutral10: '#1C1B42',
                      neutral20: '#1C1B42',
                      neutral30: '#2A2952',
                      neutral40: '#9CA3AF',
                      neutral50: '#9CA3AF',
                      neutral60: '#9CA3AF',
                      neutral70: '#9CA3AF',
                      neutral80: '#FFFFFF',
                      neutral90: '#FFFFFF',
                    },
                  })}
                />
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!Object.values(updates).some(value => value !== '')}
                >
                  Update Leads
                </button>
              </div>
            </form>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}