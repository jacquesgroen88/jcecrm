import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Contact, TableColumn } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ContactStore {
  contacts: Contact[];
  viewMode: 'grid' | 'list';
  columns: TableColumn[];
  setViewMode: (mode: 'grid' | 'list') => void;
  addContact: (contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateContact: (id: string, contact: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  updateColumns: (columns: TableColumn[]) => void;
}

const defaultColumns: TableColumn[] = [
  { id: 'name', label: 'Name', accessor: 'name', isVisible: true },
  { id: 'company', label: 'Company', accessor: 'company', isVisible: true },
  { id: 'position', label: 'Position', accessor: 'position', isVisible: true },
  { id: 'email', label: 'Email', accessor: 'email', isVisible: true },
  { id: 'phone', label: 'Phone', accessor: 'phone', isVisible: true },
  { id: 'lastContact', label: 'Last Contact', accessor: 'lastContact', isVisible: true },
  { id: 'tags', label: 'Tags', accessor: 'tags', isVisible: true },
];

const sampleContacts: Contact[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@acme.com',
    phone: '+1 (555) 123-4567',
    company: 'Acme Corp',
    position: 'Chief Technology Officer',
    lastContact: '2024-03-15',
    tags: ['Decision Maker', 'Technical'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  // ... other sample contacts
];

export const useContactStore = create<ContactStore>()(
  persist(
    (set) => ({
      contacts: sampleContacts,
      viewMode: 'grid',
      columns: defaultColumns,
      
      setViewMode: (mode) => set({ viewMode: mode }),
      
      addContact: (contact) =>
        set((state) => ({
          contacts: [
            ...state.contacts,
            {
              ...contact,
              id: uuidv4(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),
      
      updateContact: (id, updatedContact) =>
        set((state) => ({
          contacts: state.contacts.map((contact) =>
            contact.id === id
              ? {
                  ...contact,
                  ...updatedContact,
                  updatedAt: new Date().toISOString(),
                }
              : contact
          ),
        })),
      
      deleteContact: (id) =>
        set((state) => ({
          contacts: state.contacts.filter((contact) => contact.id !== id),
        })),

      updateColumns: (columns) => set({ columns }),
    }),
    {
      name: 'contact-store',
      version: 1,
    }
  )
);