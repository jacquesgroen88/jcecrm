import React, { useState } from 'react';
import { useContactStore } from '../store/contactStore';
import { useNavigate } from 'react-router-dom';
import { Phone, Mail, Building2, Tag, Plus, Settings } from 'lucide-react';
import ViewToggle from './shared/ViewToggle';
import SearchBar from './SearchBar';
import NewContactModal from './NewContactModal';
import ColumnCustomizer from './ColumnCustomizer';
import ContactCard from './ContactCard';

export default function ContactsPage() {
  const { contacts, viewMode, setViewMode, columns, updateColumns } = useContactStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [isCustomizingColumns, setIsCustomizingColumns] = useState(false);
  const navigate = useNavigate();

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 bg-dark-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Contacts</h1>
            <p className="text-gray-400">Manage your contacts and relationships</p>
          </div>
          <div className="flex items-center gap-4">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search contacts..."
            />
            <ViewToggle viewMode={viewMode} onChange={setViewMode} />
            <button
              onClick={() => setIsCustomizingColumns(true)}
              className="btn btn-secondary"
            >
              <Settings className="w-4 h-4 mr-2" />
              Columns
            </button>
            <button 
              onClick={() => setIsAddingContact(true)}
              className="btn btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} />
          ))}

          {filteredContacts.length === 0 && (
            <div className="col-span-3 text-center py-12 text-gray-400">
              No contacts found
            </div>
          )}
        </div>
      </div>

      <NewContactModal
        isOpen={isAddingContact}
        onClose={() => setIsAddingContact(false)}
      />

      <ColumnCustomizer
        isOpen={isCustomizingColumns}
        onClose={() => setIsCustomizingColumns(false)}
        columns={columns}
        onUpdateColumns={updateColumns}
      />
    </div>
  );
}