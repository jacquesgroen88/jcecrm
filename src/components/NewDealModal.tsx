import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { useDealStore } from '../store/dealStore';
import { useContactStore } from '../store/contactStore';
import { Contact, CustomField } from '../types';
import Select from 'react-select';

interface NewDealModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NewDealModal({ isOpen, onClose }: NewDealModalProps) {
  const addDeal = useDealStore((state) => state.addDeal);
  const { contacts, addContact } = useContactStore();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    value: '',
    probability: '50',
    expectedCloseDate: '',
  });

  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isCreatingContact, setIsCreatingContact] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    company: '',
    tags: [] as string[],
  });

  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [newField, setNewField] = useState({ label: '', value: '' });
  const [isAddingField, setIsAddingField] = useState(false);

  const contactOptions = contacts.map(contact => ({
    value: contact,
    label: `${contact.name} (${contact.company})`
  }));

  const tagOptions = [
    { value: 'Decision Maker', label: 'Decision Maker' },
    { value: 'Technical', label: 'Technical' },
    { value: 'Budget Holder', label: 'Budget Holder' },
    { value: 'Influencer', label: 'Influencer' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedContact && !isCreatingContact) {
      setIsCreatingContact(true);
      return;
    }

    let contactToUse = selectedContact;

    if (isCreatingContact) {
      // Create new contact first
      const newContactId = uuidv4();
      const contact = {
        id: newContactId,
        ...newContact,
        lastContact: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addContact(contact);
      contactToUse = contact;
    }

    const deal = {
      id: uuidv4(),
      ...formData,
      contact: contactToUse?.name || '',
      contactId: contactToUse?.id || '',
      value: parseFloat(formData.value) || 0,
      probability: parseInt(formData.probability) || 50,
      stage: 'lead',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customFields: customFields.length > 0 ? customFields : undefined,
    };

    addDeal(deal);
    onClose();
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      company: '',
      value: '',
      probability: '50',
      expectedCloseDate: '',
    });
    setSelectedContact(null);
    setIsCreatingContact(false);
    setNewContact({
      name: '',
      email: '',
      phone: '',
      position: '',
      company: '',
      tags: [],
    });
    setCustomFields([]);
  };

  const handleAddField = () => {
    if (newField.label && newField.value) {
      setCustomFields([...customFields, { ...newField, id: uuidv4() }]);
      setNewField({ label: '', value: '' });
      setIsAddingField(false);
    }
  };

  const handleRemoveField = (id: string) => {
    setCustomFields(customFields.filter(field => field.id !== id));
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg w-full bg-dark-800 rounded-xl shadow-lg border border-dark-700 max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-6 border-b border-dark-700">
            <Dialog.Title className="text-lg font-semibold text-white">
              Create New Deal
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="overflow-y-auto flex-1">
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Deal Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full input"
                />
              </div>

              {!isCreatingContact ? (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Contact Person
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Select
                        options={contactOptions}
                        value={selectedContact ? {
                          value: selectedContact,
                          label: `${selectedContact.name} (${selectedContact.company})`
                        } : null}
                        onChange={(option) => {
                          setSelectedContact(option?.value || null);
                          if (option?.value) {
                            setFormData(prev => ({
                              ...prev,
                              company: option.value.company
                            }));
                          }
                        }}
                        className="react-select-container"
                        classNamePrefix="react-select"
                        placeholder="Search or select contact..."
                        isClearable
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
                    <button
                      type="button"
                      onClick={() => setIsCreatingContact(true)}
                      className="btn btn-secondary whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      New Contact
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 border border-dark-600 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium text-white">New Contact</h3>
                    <button
                      type="button"
                      onClick={() => setIsCreatingContact(false)}
                      className="text-sm text-gray-400 hover:text-white"
                    >
                      Or select existing
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        required
                        value={newContact.name}
                        onChange={(e) =>
                          setNewContact({ ...newContact, name: e.target.value })
                        }
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
                        value={newContact.email}
                        onChange={(e) =>
                          setNewContact({ ...newContact, email: e.target.value })
                        }
                        className="w-full input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={newContact.phone}
                        onChange={(e) =>
                          setNewContact({ ...newContact, phone: e.target.value })
                        }
                        className="w-full input"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        Position
                      </label>
                      <input
                        type="text"
                        value={newContact.position}
                        onChange={(e) =>
                          setNewContact({ ...newContact, position: e.target.value })
                        }
                        className="w-full input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Tags
                    </label>
                    <Select
                      isMulti
                      options={tagOptions}
                      value={tagOptions.filter(option => 
                        newContact.tags.includes(option.value)
                      )}
                      onChange={(selected) => 
                        setNewContact({
                          ...newContact,
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
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Company
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                  className="w-full input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Deal Value ($)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value })
                  }
                  className="w-full input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Probability (%)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={formData.probability}
                  onChange={(e) =>
                    setFormData({ ...formData, probability: e.target.value })
                  }
                  className="w-full input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Expected Close Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.expectedCloseDate}
                  onChange={(e) =>
                    setFormData({ ...formData, expectedCloseDate: e.target.value })
                  }
                  className="w-full input"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm font-medium text-gray-300">
                    Custom Fields
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsAddingField(true)}
                    className="btn btn-secondary btn-sm"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Field
                  </button>
                </div>

                <div className="space-y-3">
                  {customFields.map((field) => (
                    <div key={field.id} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="text-sm text-gray-400">{field.label}</div>
                        <div className="text-white">{field.value}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveField(field.id)}
                        className="text-gray-400 hover:text-red-400"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-dark-700">
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
                {isCreatingContact ? 'Create Contact & Deal' : 'Create Deal'}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>

      {/* Add Custom Field Dialog */}
      <Dialog
        open={isAddingField}
        onClose={() => setIsAddingField(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-sm w-full bg-dark-800 rounded-xl shadow-lg border border-dark-700">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Add Custom Field</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Field Label
                  </label>
                  <input
                    type="text"
                    value={newField.label}
                    onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                    className="w-full input"
                    placeholder="e.g., Source"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Field Value
                  </label>
                  <input
                    type="text"
                    value={newField.value}
                    onChange={(e) => setNewField({ ...newField, value: e.target.value })}
                    className="w-full input"
                    placeholder="Enter value"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setIsAddingField(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddField}
                  className="btn btn-primary"
                  disabled={!newField.label || !newField.value}
                >
                  Add Field
                </button>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Dialog>
  );
}