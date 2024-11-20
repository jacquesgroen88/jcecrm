import React, { useState } from 'react';
import { Mail, Phone, Building2, Calendar, Edit2, Trash2, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { Contact } from '../types';
import EditContactModal from './EditContactModal';
import { useContactStore } from '../store/contactStore';

interface ContactCardProps {
  contact: Contact;
  showActions?: boolean;
}

export default function ContactCard({ contact, showActions = true }: ContactCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { deleteContact } = useContactStore();
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      deleteContact(contact.id);
    }
  };

  return (
    <>
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white">{contact.name}</h3>
            <p className="text-sm text-gray-400">{contact.position}</p>
          </div>
          {showActions && (
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                title="Edit"
              >
                <Edit2 className="w-4 h-4 text-gray-400 hover:text-white" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                title="Delete"
              >
                <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-400" />
              </button>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-gray-300">
            <Building2 className="w-4 h-4 mr-2 text-gray-400" />
            {contact.company}
          </div>
          
          <div className="flex items-center text-gray-300">
            <Mail className="w-4 h-4 mr-2 text-gray-400" />
            <a href={`mailto:${contact.email}`} className="hover:text-accent-purple">
              {contact.email}
            </a>
          </div>
          
          <div className="flex items-center text-gray-300">
            <Phone className="w-4 h-4 mr-2 text-gray-400" />
            <a href={`tel:${contact.phone}`} className="hover:text-accent-purple">
              {contact.phone}
            </a>
          </div>

          <div className="flex items-center text-gray-300">
            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
            Last Contact: {format(new Date(contact.lastContact), 'MMM d, yyyy')}
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Tag className="w-4 h-4 text-gray-400" />
            <div className="flex flex-wrap gap-2">
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
        </div>
      </div>

      <EditContactModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        contact={contact}
      />
    </>
  );
}