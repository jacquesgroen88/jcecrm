import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Building2, Globe, Users, DollarSign, ArrowLeft, Mail, Phone, Edit2, 
  Plus, Save, X, ChevronRight, Calendar 
} from 'lucide-react';
import { useCompanyStore } from '../store/companyStore';
import { useContactStore } from '../store/contactStore';
import { useDealStore } from '../store/dealStore';
import { format } from 'date-fns';
import { Dialog } from '@headlessui/react';
import { CustomField } from '../types';

export default function CompanyDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const company = useCompanyStore((state) => state.companies.find((c) => c.id === id));
  const updateCompany = useCompanyStore((state) => state.updateCompany);
  const contacts = useContactStore((state) => state.contacts.filter((c) => company?.contacts.includes(c.id)));
  const deals = useDealStore((state) => state.deals.filter((d) => company?.deals.includes(d.id)));
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedCompany, setEditedCompany] = useState(company);
  const [isAddingField, setIsAddingField] = useState(false);
  const [newField, setNewField] = useState({ label: '', value: '' });
  const [customFields, setCustomFields] = useState<CustomField[]>(company?.customFields || []);

  if (!company) {
    return (
      <div className="min-h-screen bg-dark-900 pt-24 px-6">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white">Company not found</h2>
          <button
            onClick={() => navigate('/companies')}
            className="mt-4 btn btn-primary inline-flex items-center"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back to Companies
          </button>
        </div>
      </div>
    );
  }

  const totalDealValue = deals.reduce((sum, deal) => sum + deal.value, 0);

  const handleSave = () => {
    if (editedCompany) {
      updateCompany(company.id, {
        ...editedCompany,
        customFields
      });
      setIsEditing(false);
    }
  };

  const handleAddField = () => {
    if (newField.label && newField.value) {
      setCustomFields([...customFields, { ...newField, id: crypto.randomUUID() }]);
      setNewField({ label: '', value: '' });
      setIsAddingField(false);
    }
  };

  const handleRemoveField = (id: string) => {
    setCustomFields(customFields.filter(field => field.id !== id));
  };

  const handleInputChange = (field: string, value: string) => {
    if (editedCompany) {
      setEditedCompany({ ...editedCompany, [field]: value });
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 pt-24 px-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate('/companies')}
          className="mb-6 btn btn-secondary inline-flex items-center"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back to Companies
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedCompany?.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="text-2xl font-bold bg-dark-700 text-white px-3 py-1 rounded-lg border border-dark-600 focus:outline-none focus:border-accent-purple"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-white">{company.name}</h1>
                  )}
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedCompany?.industry}
                      onChange={(e) => handleInputChange('industry', e.target.value)}
                      className="mt-2 bg-dark-700 text-gray-400 px-3 py-1 rounded-lg border border-dark-600 focus:outline-none focus:border-accent-purple"
                    />
                  ) : (
                    <p className="text-gray-400">{company.industry}</p>
                  )}
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button onClick={handleSave} className="btn btn-primary">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </button>
                      <button 
                        onClick={() => {
                          setIsEditing(false);
                          setEditedCompany(company);
                        }} 
                        className="btn btn-secondary"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button onClick={() => setIsEditing(true)} className="btn btn-secondary">
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400">Website</label>
                    <div className="flex items-center mt-1">
                      <Globe className="w-4 h-4 text-gray-400 mr-2" />
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedCompany?.website}
                          onChange={(e) => handleInputChange('website', e.target.value)}
                          className="flex-1 bg-dark-700 text-white px-2 py-1 rounded border border-dark-600 focus:outline-none focus:border-accent-purple"
                        />
                      ) : (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-accent-purple hover:underline"
                        >
                          {company.website}
                        </a>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Company Size</label>
                    <div className="flex items-center mt-1">
                      <Users className="w-4 h-4 text-gray-400 mr-2" />
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedCompany?.size}
                          onChange={(e) => handleInputChange('size', e.target.value)}
                          className="flex-1 bg-dark-700 text-white px-2 py-1 rounded border border-dark-600 focus:outline-none focus:border-accent-purple"
                        />
                      ) : (
                        <span className="text-white">{company.size} employees</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-400">Total Deal Value</label>
                    <div className="flex items-center mt-1">
                      <DollarSign className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-white">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD'
                        }).format(totalDealValue)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400">Active Deals</label>
                    <div className="flex items-center mt-1">
                      <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-white">{deals.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-4">
                  <label className="text-sm text-gray-400">Custom Fields</label>
                  {isEditing && (
                    <button
                      onClick={() => setIsAddingField(true)}
                      className="btn btn-secondary btn-sm"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Field
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {customFields.map((field) => (
                    <div key={field.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <label className="text-sm text-gray-400">{field.label}</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={field.value}
                            onChange={(e) => {
                              const updatedFields = customFields.map(f =>
                                f.id === field.id ? { ...f, value: e.target.value } : f
                              );
                              setCustomFields(updatedFields);
                            }}
                            className="mt-1 w-full bg-dark-700 text-white px-2 py-1 rounded border border-dark-600 focus:outline-none focus:border-accent-purple"
                          />
                        ) : (
                          <p className="mt-1 text-white">{field.value}</p>
                        )}
                      </div>
                      {isEditing && (
                        <button
                          onClick={() => handleRemoveField(field.id)}
                          className="ml-2 text-gray-400 hover:text-red-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card">
              <div className="p-4 border-b border-dark-700">
                <h2 className="text-lg font-semibold text-white">Deals</h2>
              </div>
              <div className="divide-y divide-dark-700">
                {deals.map((deal) => (
                  <button
                    key={deal.id}
                    onClick={() => navigate(`/deals/${deal.id}`)}
                    className="w-full p-4 hover:bg-dark-700 text-left flex items-center justify-between group"
                  >
                    <div>
                      <h3 className="font-medium text-white">{deal.title}</h3>
                      <div className="flex items-center mt-1 text-sm text-gray-400">
                        <Calendar className="w-4 h-4 mr-1" />
                        {format(new Date(deal.expectedCloseDate), 'MMM d, yyyy')}
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="text-right mr-4">
                        <div className="text-white">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD'
                          }).format(deal.value)}
                        </div>
                        <span className="text-sm text-gray-400">{deal.stage}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="card">
              <div className="p-4 border-b border-dark-700 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">Contacts</h2>
                <span className="text-sm text-gray-400">{contacts.length} total</span>
              </div>
              <div className="divide-y divide-dark-700">
                {contacts.map((contact) => (
                  <div key={contact.id} className="p-4 hover:bg-dark-700">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-white">{contact.name}</h3>
                        <p className="text-sm text-gray-400">{contact.position}</p>
                      </div>
                    </div>
                    
                    <div className="mt-3 space-y-2">
                      <a
                        href={`mailto:${contact.email}`}
                        className="flex items-center text-gray-300 hover:text-accent-purple"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        {contact.email}
                      </a>
                      
                      <a
                        href={`tel:${contact.phone}`}
                        className="flex items-center text-gray-300 hover:text-accent-purple"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        {contact.phone}
                      </a>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {contact.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs rounded-full bg-dark-600 text-gray-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isAddingField} onClose={() => setIsAddingField(false)} className="relative z-50">
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
                    placeholder="e.g., LinkedIn URL"
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
    </div>
  );
}