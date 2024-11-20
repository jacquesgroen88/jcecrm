import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { UserPlus, Mail, Phone, Tag, X } from 'lucide-react';
import { useContactStore } from '../store/contactStore';
import { useDealStore } from '../store/dealStore';
import Select from 'react-select';

interface ContactAssignmentPanelProps {
  dealId: string;
}

export default function ContactAssignmentPanel({ dealId }: ContactAssignmentPanelProps) {
  const { contacts } = useContactStore();
  const { updateDeal } = useDealStore();
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [isSelectingContact, setIsSelectingContact] = useState(false);

  const contactOptions = contacts.map(contact => ({
    value: contact.id,
    label: `${contact.name} (${contact.company})`
  }));

  const handleSelectContact = (option: any) => {
    const contact = contacts.find(c => c.id === option.value);
    if (contact) {
      updateDeal(dealId, {
        contactId: contact.id,
        contact: contact.name
      });
    }
    setIsSelectingContact(false);
  };

  return (
    <div className="card p-6">
      <div className="text-center py-8">
        <UserPlus className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-white mb-2">No Contact Assigned</h3>
        <p className="text-gray-400 mb-6">
          Assign a contact to this deal to better track your communications
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => setIsSelectingContact(true)}
            className="btn btn-primary"
          >
            Select Existing
          </button>
          <button
            onClick={() => setIsAddingContact(true)}
            className="btn btn-secondary"
          >
            Create New
          </button>
        </div>
      </div>

      {/* Select Contact Dialog */}
      <Dialog
        open={isSelectingContact}
        onClose={() => setIsSelectingContact(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md w-full bg-dark-800 rounded-xl shadow-lg border border-dark-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Select Contact</h3>
                <button
                  onClick={() => setIsSelectingContact(false)}
                  className="text-gray-400 hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <Select
                options={contactOptions}
                onChange={handleSelectContact}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Search contacts..."
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
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Create Contact Dialog */}
      <Dialog
        open={isAddingContact}
        onClose={() => setIsAddingContact(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-md w-full bg-dark-800 rounded-xl shadow-lg border border-dark-700">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Create New Contact</h3>
                <button
                  onClick={() => setIsAddingContact(false)}
                  className="text-gray-400 hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Contact form will be added here */}
              <p className="text-gray-400">Contact creation form coming soon...</p>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsAddingContact(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button className="btn btn-primary">
                  Create Contact
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}