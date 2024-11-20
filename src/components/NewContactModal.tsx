import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { useContactStore } from '../store/contactStore';
import Select from 'react-select';

const tagOptions = [
  { value: 'Decision Maker', label: 'Decision Maker' },
  { value: 'Technical', label: 'Technical' },
  { value: 'Budget Holder', label: 'Budget Holder' },
  { value: 'Influencer', label: 'Influencer' },
  { value: 'Executive', label: 'Executive' },
  { value: 'Marketing', label: 'Marketing' },
  { value: 'Sales', label: 'Sales' },
  { value: 'Support', label: 'Support' },
];

interface NewContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewContactModal({ isOpen, onClose }: NewContactModalProps) {
  const { addContact } = useContactStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    lastContact: new Date().toISOString().split('T')[0],
    tags: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addContact(formData);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      position: '',
      lastContact: new Date().toISOString().split('T')[0],
      tags: [],
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
              Add New Contact
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Phone
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Company
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Position
              </label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Last Contact
              </label>
              <input
                type="date"
                required
                value={formData.lastContact}
                onChange={(e) => setFormData({ ...formData, lastContact: e.target.value })}
                className="w-full input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Tags
              </label>
              <Select
                isMulti
                options={tagOptions}
                value={tagOptions.filter(option => 
                  formData.tags.includes(option.value)
                )}
                onChange={(selected) => 
                  setFormData({
                    ...formData,
                    tags: selected.map(option => option.value)
                  })
                }
                className="react-select-container"
                classNamePrefix="react-select"
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
              >
                Add Contact
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}