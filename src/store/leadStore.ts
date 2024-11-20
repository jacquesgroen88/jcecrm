import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Lead } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface LeadStore {
  leads: Lead[];
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateLead: (id: string, lead: Partial<Lead>) => void;
  updateLeads: (ids: string[], updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  deleteLeads: (ids: string[]) => void;
  importLeads: (leads: any[]) => void;
  convertToOpportunity: (id: string) => void;
}

// Sample leads data
const sampleLeads: Lead[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    company: 'Tech Solutions Inc',
    position: 'CTO',
    status: 'new',
    source: 'website',
    notes: 'Interested in enterprise solution',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 987-6543',
    company: 'Digital Dynamics',
    position: 'Marketing Director',
    status: 'contacted',
    source: 'linkedin',
    notes: 'Follow up scheduled for next week',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'mchen@example.com',
    phone: '+1 (555) 456-7890',
    company: 'Innovate AI',
    position: 'CEO',
    status: 'qualified',
    source: 'referral',
    notes: 'High potential for AI integration project',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export const useLeadStore = create<LeadStore>()(
  persist(
    (set) => ({
      leads: sampleLeads,
      
      addLead: (lead) =>
        set((state) => ({
          leads: [
            ...state.leads,
            {
              ...lead,
              id: uuidv4(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          ],
        })),
      
      updateLead: (id, updatedLead) =>
        set((state) => ({
          leads: state.leads.map((lead) =>
            lead.id === id
              ? {
                  ...lead,
                  ...updatedLead,
                  updatedAt: new Date().toISOString(),
                }
              : lead
          ),
        })),

      updateLeads: (ids, updates) =>
        set((state) => ({
          leads: state.leads.map((lead) =>
            ids.includes(lead.id)
              ? {
                  ...lead,
                  ...updates,
                  updatedAt: new Date().toISOString(),
                }
              : lead
          ),
        })),
      
      deleteLead: (id) =>
        set((state) => ({
          leads: state.leads.filter((lead) => lead.id !== id),
        })),

      deleteLeads: (ids) =>
        set((state) => ({
          leads: state.leads.filter((lead) => !ids.includes(lead.id)),
        })),
      
      importLeads: (importedLeads) =>
        set((state) => ({
          leads: [
            ...state.leads,
            ...importedLeads.map((lead) => ({
              ...lead,
              id: uuidv4(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            })),
          ],
        })),
      
      convertToOpportunity: (id) =>
        set((state) => ({
          leads: state.leads.map((l) =>
            l.id === id
              ? { ...l, status: 'converted', updatedAt: new Date().toISOString() }
              : l
          ),
        })),
    }),
    {
      name: 'lead-store',
      version: 1,
    }
  )
);